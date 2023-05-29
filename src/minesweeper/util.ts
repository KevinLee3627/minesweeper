export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function _isCustomEvent(event: Event): event is CustomEvent {
  return "detail" in event;
}

export function isCustomEvent<T>(
  event: Event,
  key: keyof T
): event is CustomEvent<T> {
  if (!_isCustomEvent(event)) return false;
  return key in event.detail;
}

export function msToTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${secondsStr}`;
}
