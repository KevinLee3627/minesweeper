export interface Settings {
  showTimer: boolean;
}

const defaults: Settings = {
  showTimer: false,
};

export class SettingsManager {
  LOCALSTORAGE_KEY = "player-settings";
  settings: Settings;

  showTimerToggle;

  constructor() {
    this.settings = this.load();

    const showTimerToggle = <HTMLInputElement>(
      document.getElementById("showTimerToggle")
    );
    if (showTimerToggle == null) throw new Error("showTimerToggle not found.");
    this.showTimerToggle = showTimerToggle;
    this.showTimerToggle.checked = this.settings.showTimer;
    this.showTimerToggle.addEventListener("click", e => {
      this.settings.showTimer = this.showTimerToggle.checked;
      this.save();
    });
  }

  save() {
    localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(this.settings));
  }

  load() {
    const settings = localStorage.getItem(this.LOCALSTORAGE_KEY);
    if (settings == null) return defaults;

    return JSON.parse(settings) as Settings;
  }
}
