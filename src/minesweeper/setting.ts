import { Settings } from "./settings";

export interface SettingChangedEvent {
  settingId: keyof Settings;
  value: boolean;
}

export class Setting {
  element: HTMLInputElement;
  value: boolean;

  constructor(settingId: keyof Settings, defaultValue: boolean) {
    const element = document.getElementById(settingId) as HTMLInputElement;
    if (element == null)
      throw new Error(`Could not find setting element w/ id ${settingId}`);
    this.element = element;
    this.value = defaultValue;
    this.element.addEventListener("click", () => {
      this.value = this.element.checked;
      const settingsChangedEvent = new CustomEvent("settingChanged", {
        bubbles: true,
        detail: {
          settingId,
          value: this.value,
        },
      });
      this.element.dispatchEvent(settingsChangedEvent);
    });
  }
}
