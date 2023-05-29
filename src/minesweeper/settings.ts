import { Setting, SettingChangedEvent } from "./setting";
import { isCustomEvent } from "./util";

export interface Settings {
  showTimer: boolean;
  autoRestart: boolean;
}

const defaults: Settings = {
  showTimer: false,
  autoRestart: false,
};

export class SettingsManager {
  LOCALSTORAGE_KEY = "player-settings";
  settings: Settings;

  settingChangedHandler = this.handleSettingChanged.bind(this);

  constructor() {
    const settingsContainerElem = document.getElementById("settingsContainer");
    if (settingsContainerElem == null)
      throw new Error("settingsContainer not found");

    settingsContainerElem.addEventListener(
      "settingChanged",
      this.settingChangedHandler
    );

    this.settings = this.load();

    new Setting("showTimer", this.settings.showTimer);
    new Setting("autoRestart", this.settings.autoRestart);
  }

  save() {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(this.settings));
  }

  load() {
    const settings = localStorage.getItem(this.LOCALSTORAGE_KEY);
    if (settings == null) return defaults;

    return JSON.parse(settings) as Settings;
  }

  handleSettingChanged(e: Event) {
    if (!isCustomEvent<SettingChangedEvent>(e, "settingId"))
      throw new Error("Event is not a custom event");
    this.settings[e.detail.settingId] = e.detail.value;
    this.save();
  }
}
