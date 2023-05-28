import { SettingChangedEvent } from "./setting";

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function isCustomEvent(event: Event): event is CustomEvent {
  return "detail" in event;
}

export function isSettingChangedEvent(
  event: Event
): event is CustomEvent<SettingChangedEvent> {
  if (!isCustomEvent(event)) return false;
  return "settingId" in event.detail;
}
