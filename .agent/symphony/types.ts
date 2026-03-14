export interface WorkflowConfig {
  tracker: 'linear';
  project_slug: string;
  start_state: string;
  done_states: string[];
  after_create: string[];
  before_remove: string[];
  poll_interval_seconds: number;
  codex_max_turns: number;
}

export interface WorkflowDefinition {
  config: WorkflowConfig;
  promptTemplate: string;
  sourcePath: string;
  loadedAt: string;
}

export interface TrackerIssue {
  id: string;
  identifier: string;
  title: string;
  description: string;
  url: string;
  state: string;
  stateType?: string;
  projectSlug: string;
  branchName?: string;
  updatedAt?: string;
}

export interface TrackerSnapshot {
  fetchedAt: string;
  issues: TrackerIssue[];
}

export interface PersistedAgentSession {
  issueId: string;
  issue: TrackerIssue;
  workspacePath: string;
  branchName: string;
  attemptCount: number;
  status: 'idle' | 'running' | 'stopped';
  createdAt: string;
  lastStartedAt?: string;
  lastExitedAt?: string;
  lastExitCode?: number | null;
  lastExitSignal?: NodeJS.Signals | null;
  lastPrompt?: string;
}

export interface AgentExitResult {
  exitCode: number | null;
  signal: NodeJS.Signals | null;
}

export interface AgentRuntimeHandle {
  pid?: number;
  onExit: Promise<AgentExitResult>;
  stop(signal?: NodeJS.Signals): Promise<void>;
}

export interface WorkspaceProvisionResult {
  workspacePath: string;
  branchName: string;
  created: boolean;
}

export interface TaskTracker {
  getSnapshot(workflow: WorkflowDefinition): Promise<TrackerSnapshot>;
}

export interface WorkspaceManager {
  ensureWorkspace(
    issue: TrackerIssue,
    workflow: WorkflowDefinition
  ): Promise<WorkspaceProvisionResult>;
  updateWorkpad(
    workspacePath: string,
    issue: TrackerIssue,
    session: PersistedAgentSession
  ): Promise<void>;
  removeWorkspace(
    workspacePath: string,
    issue: TrackerIssue,
    workflow: WorkflowDefinition
  ): Promise<void>;
}

export interface AgentRunner {
  start(
    session: PersistedAgentSession,
    prompt: string
  ): Promise<AgentRuntimeHandle>;
}

export interface SessionStateStore {
  load(): Promise<PersistedAgentSession[]>;
  save(sessions: PersistedAgentSession[]): Promise<void>;
}

export interface Logger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
}
