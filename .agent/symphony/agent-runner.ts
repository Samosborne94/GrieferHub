import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import {
  AgentRunner,
  AgentRuntimeHandle,
  PersistedAgentSession
} from './types';

export interface CommandAgentRunnerOptions {
  command: string;
  args: string[];
  extraEnv?: Record<string, string>;
}

function splitArguments(rawArgs: string): string[] {
  const matches = rawArgs.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  return matches.map(part => part.replace(/^"(.*)"$/, '$1'));
}

function defaultOptions(): CommandAgentRunnerOptions {
  return {
    command: process.env.SYMPHONY_AGENT_COMMAND?.trim() || 'codex',
    args: process.env.SYMPHONY_AGENT_ARGS?.trim()
      ? splitArguments(process.env.SYMPHONY_AGENT_ARGS)
      : ['app-server']
  };
}

export class CommandAgentRunner implements AgentRunner {
  private readonly options: CommandAgentRunnerOptions;

  constructor(options: Partial<CommandAgentRunnerOptions> = {}) {
    this.options = {
      ...defaultOptions(),
      ...options
    };
  }

  async start(
    session: PersistedAgentSession,
    prompt: string
  ): Promise<AgentRuntimeHandle> {
    const logDir = path.join(session.workspacePath, '.symphony');
    const logPath = path.join(logDir, 'agent.log');

    await fsp.mkdir(logDir, { recursive: true });

    const child = spawn(this.options.command, this.options.args, {
      cwd: session.workspacePath,
      env: {
        ...process.env,
        ...this.options.extraEnv,
        SYMPHONY_ISSUE_ID: session.issue.id,
        SYMPHONY_ISSUE_IDENTIFIER: session.issue.identifier,
        SYMPHONY_WORKSPACE: session.workspacePath
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const logStream = fs.createWriteStream(logPath, { flags: 'a' });

    child.stdout?.pipe(logStream);
    child.stderr?.pipe(logStream);
    child.stdin?.write(prompt);
    child.stdin?.end();

    const onExit = new Promise<{ exitCode: number | null; signal: NodeJS.Signals | null }>(
      resolve => {
        child.once('exit', (exitCode, signal) => {
          logStream.end();
          resolve({ exitCode, signal });
        });
      }
    );

    return {
      pid: child.pid,
      onExit,
      stop: async (signal = 'SIGTERM') => {
        if (!child.killed) {
          child.kill(signal);
        }

        await onExit;
      }
    };
  }
}
