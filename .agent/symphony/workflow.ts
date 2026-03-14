import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { WorkflowConfig, WorkflowDefinition } from './types';

const workflowConfigSchema = z.object({
  tracker: z.literal('linear'),
  project_slug: z.string().trim().min(1),
  start_state: z.string().trim().min(1),
  done_states: z.array(z.string().trim().min(1)).min(1),
  after_create: z.array(z.string().trim().min(1)).default([]),
  before_remove: z.array(z.string().trim().min(1)).default([]),
  poll_interval_seconds: z.coerce.number().int().positive().default(30),
  codex_max_turns: z.coerce.number().int().positive().default(10)
});

function parseScalar(rawValue: string): string | number | boolean | string[] {
  const trimmed = rawValue.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) {
      return [];
    }

    return inner
      .split(',')
      .map(value => parseScalar(value) as string)
      .filter(Boolean);
  }

  if (/^(true|false)$/i.test(trimmed)) {
    return trimmed.toLowerCase() === 'true';
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed;
}

function parseFrontMatter(frontMatter: string): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};
  let currentListKey: string | null = null;

  for (const rawLine of frontMatter.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const listMatch = trimmed.match(/^-\s+(.*)$/);
    if (listMatch) {
      if (!currentListKey || !Array.isArray(parsed[currentListKey])) {
        throw new Error(`Unexpected list item in workflow front matter: ${trimmed}`);
      }

      (parsed[currentListKey] as unknown[]).push(parseScalar(listMatch[1]));
      continue;
    }

    const keyValueMatch = line.match(/^([a-zA-Z0-9_]+):(.*)$/);
    if (!keyValueMatch) {
      throw new Error(`Invalid workflow front matter line: ${line}`);
    }

    const [, key, rawValue] = keyValueMatch;
    const value = rawValue.trim();

    if (!value) {
      parsed[key] = [];
      currentListKey = key;
      continue;
    }

    parsed[key] = parseScalar(value);
    currentListKey = null;
  }

  return parsed;
}

export function parseWorkflowDocument(
  fileContents: string,
  sourcePath = 'WORKFLOW.md'
): WorkflowDefinition {
  const lines = fileContents.split(/\r?\n/);

  if (lines[0]?.trim() !== '---') {
    throw new Error(
      `${sourcePath} must start with YAML front matter delimited by ---`
    );
  }

  let closingIndex = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index]?.trim() === '---') {
      closingIndex = index;
      break;
    }
  }

  if (closingIndex === -1) {
    throw new Error(`${sourcePath} is missing the closing front matter delimiter`);
  }

  const configBlock = lines.slice(1, closingIndex).join('\n');
  const promptTemplate = lines.slice(closingIndex + 1).join('\n').trim();

  if (!promptTemplate) {
    throw new Error(`${sourcePath} must contain a non-empty workflow prompt`);
  }

  const parsedConfig = parseFrontMatter(configBlock);
  const config = workflowConfigSchema.parse(parsedConfig) as WorkflowConfig;

  return {
    config,
    promptTemplate,
    sourcePath,
    loadedAt: new Date().toISOString()
  };
}

export async function loadWorkflowDefinition(
  workflowPath: string
): Promise<WorkflowDefinition> {
  const resolvedPath = path.resolve(workflowPath);
  const contents = await fs.readFile(resolvedPath, 'utf-8');
  return parseWorkflowDocument(contents, resolvedPath);
}
