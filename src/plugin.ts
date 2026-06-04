import { spawn } from "node:child_process";
import { streamDeck } from "@elgato/streamdeck";
import { CaffeineManager } from "./caffeine-manager.js";
import { ToggleAction } from "./actions/toggle-action.js";

const manager = new CaffeineManager(spawn);

streamDeck.actions.registerAction(new ToggleAction(manager));

await streamDeck.connect();
