import { describe, it, expect, vi } from "vitest";
import { EventEmitter } from "node:events";
import { CaffeineManager } from "../src/caffeine-manager.js";

function makeFakeProcess() {
  const proc = new EventEmitter() as NodeJS.EventEmitter & { pid: number; kill: ReturnType<typeof vi.fn> };
  proc.pid = 12345;
  proc.kill = vi.fn();
  return proc;
}

describe("CaffeineManager", () => {
  it("activate transitions Caffeine to active", async () => {
    const fakeProc = makeFakeProcess();
    const manager = new CaffeineManager(vi.fn().mockReturnValue(fakeProc));

    await manager.activate();

    expect(manager.getState()).toBe("active");
  });

  it("activate fires onStateChange with 'active'", async () => {
    const fakeProc = makeFakeProcess();
    const manager = new CaffeineManager(vi.fn().mockReturnValue(fakeProc));
    const listener = vi.fn();

    manager.onStateChange(listener);
    await manager.activate();

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith("active");
  });

  it("deactivate transitions Caffeine to inactive", async () => {
    const fakeProc = makeFakeProcess();
    const manager = new CaffeineManager(vi.fn().mockReturnValue(fakeProc));
    await manager.activate();

    manager.deactivate();

    expect(manager.getState()).toBe("inactive");
  });

  it("deactivate fires onStateChange with 'inactive'", async () => {
    const fakeProc = makeFakeProcess();
    const manager = new CaffeineManager(vi.fn().mockReturnValue(fakeProc));
    await manager.activate();
    const listener = vi.fn();
    manager.onStateChange(listener);

    manager.deactivate();

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith("inactive");
  });

  it("spawn failure keeps Caffeine inactive and fires onError", async () => {
    const fakeProc = makeFakeProcess();
    const manager = new CaffeineManager(vi.fn().mockReturnValue(fakeProc));
    const errorListener = vi.fn();
    manager.onError(errorListener);

    // Emit the error synchronously before activate's setImmediate fires
    const spawnError = new Error("spawn caffeinate ENOENT");
    const activatePromise = manager.activate();
    fakeProc.emit("error", spawnError);
    await activatePromise;

    expect(manager.getState()).toBe("inactive");
    expect(errorListener).toHaveBeenCalledOnce();
    expect(errorListener).toHaveBeenCalledWith(spawnError);
  });
});
