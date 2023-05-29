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
