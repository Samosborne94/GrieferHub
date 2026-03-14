import { TaskTracker, TrackerIssue, TrackerSnapshot, WorkflowDefinition } from './types';

interface LinearProjectIssuesResponse {
  data?: {
    projectV2?: {
      id: string;
      name: string;
      slugId: string;
      issues?: {
        nodes?: Array<{
          id: string;
          identifier: string;
          title: string;
          description?: string | null;
          url?: string | null;
          branchName?: string | null;
          updatedAt?: string | null;
          state?: {
            name?: string | null;
            type?: string | null;
          } | null;
        }>;
      } | null;
    } | null;
  };
  errors?: Array<{ message: string }>;
}

const PROJECT_ISSUES_QUERY = `
  query SymphonyProjectIssues($projectSlug: String!) {
    projectV2(slugId: $projectSlug) {
      id
      name
      slugId
      issues(first: 250) {
        nodes {
          id
          identifier
          title
          description
          url
          branchName
          updatedAt
          state {
            name
            type
          }
        }
      }
    }
  }
`;

export interface LinearTrackerOptions {
  apiKeyEnvVar?: string;
  endpoint?: string;
}

export class LinearTaskTracker implements TaskTracker {
  private readonly apiKeyEnvVar: string;
  private readonly endpoint: string;

  constructor(options: LinearTrackerOptions = {}) {
    this.apiKeyEnvVar = options.apiKeyEnvVar || 'LINEAR_API_KEY';
    this.endpoint = options.endpoint || 'https://api.linear.app/graphql';
  }

  async getSnapshot(workflow: WorkflowDefinition): Promise<TrackerSnapshot> {
    const apiKey = process.env[this.apiKeyEnvVar];
    if (!apiKey) {
      throw new Error(
        `Missing Linear API key. Set the ${this.apiKeyEnvVar} environment variable.`
      );
    }

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query: PROJECT_ISSUES_QUERY,
        variables: {
          projectSlug: workflow.config.project_slug
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Linear API request failed with ${response.status}`);
    }

    const payload = (await response.json()) as LinearProjectIssuesResponse;
    if (payload.errors?.length) {
      throw new Error(
        `Linear API error: ${payload.errors.map(error => error.message).join('; ')}`
      );
    }

    const project = payload.data?.projectV2;
    if (!project) {
      throw new Error(
        `Linear project '${workflow.config.project_slug}' was not found`
      );
    }

    const issues: TrackerIssue[] = (project.issues?.nodes ?? []).map(issue => ({
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      description: issue.description ?? '',
      url: issue.url ?? '',
      state: issue.state?.name ?? 'Unknown',
      stateType: issue.state?.type ?? undefined,
      projectSlug: project.slugId,
      branchName: issue.branchName ?? undefined,
      updatedAt: issue.updatedAt ?? undefined
    }));

    return {
      fetchedAt: new Date().toISOString(),
      issues
    };
  }
}
