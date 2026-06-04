import type { ChildProcess } from "node:child_process";

export type CaffeineState = "active" | "inactive";
export type SpawnFn = (cmd: string, args: string[]) => ChildProcess;

export class CaffeineManager {
  private state: CaffeineState = "inactive";
  private process: ChildProcess | null = null;
  private readonly spawnFn: SpawnFn;
  private stateListeners: Array<(state: CaffeineState) => void> = [];
  private errorListeners: Array<(err: Error) => void> = [];

  constructor(spawnFn: SpawnFn) {
    this.spawnFn = spawnFn;
  }

  activate(): Promise<void> {
    return new Promise<void>((resolve) => {
      const proc = this.spawnFn("caffeinate", ["-d", "-i"]);
      let settled = false;

      proc.once("error", (err: Error) => {
        settled = true;
        this.errorListeners.forEach((l) => l(err));
        resolve();
      });

      setImmediate(() => {
        if (settled) return;
        this.process = proc;
        this.state = "active";
        this.stateListeners.forEach((l) => l("active"));
        resolve();
      });
    });
  }

  deactivate(): void {
    this.process?.kill();
    this.process = null;
    this.state = "inactive";
    this.stateListeners.forEach((l) => l("inactive"));
  }

  getState(): CaffeineState {
    return this.state;
  }

  onStateChange(listener: (state: CaffeineState) => void): void {
    this.stateListeners.push(listener);
  }

  onError(listener: (err: Error) => void): void {
    this.errorListeners.push(listener);
  }
}
