import { action, SingletonAction, streamDeck } from "@elgato/streamdeck";
import type { KeyDownEvent } from "@elgato/streamdeck";
import type { CaffeineManager } from "../caffeine-manager.js";

const IMAGES = {
  active: "assets/active",
  inactive: "assets/inactive",
} as const;

@action({ UUID: "com.klein2ms.caffeine.toggle" })
export class ToggleAction extends SingletonAction {
  readonly #manager: CaffeineManager;

  constructor(manager: CaffeineManager) {
    super();
    this.#manager = manager;

    // Sync all visible button instances whenever state changes globally
    manager.onStateChange((state) => {
      for (const action of this.actions) {
        void action.setImage(IMAGES[state]);
      }
    });

    // Surface spawn errors on the triggering button and log them
    manager.onError((err) => {
      streamDeck.logger.error("CaffeineManager spawn error:", err);
    });
  }

  async onKeyDown(ev: KeyDownEvent): Promise<void> {
    const current = this.#manager.getState();

    if (current === "inactive") {
      await this.#manager.activate();
      if (this.#manager.getState() === "inactive") {
        // activate failed — show alert on this button
        await ev.action.showAlert();
        return;
      }
    } else {
      this.#manager.deactivate();
    }

    await ev.action.setImage(IMAGES[this.#manager.getState()]);
  }
}
