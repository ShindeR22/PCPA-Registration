export function createEntryCode() {
  const randomValue = new Uint16Array(1);
  crypto.getRandomValues(randomValue);
  const suffix = String(randomValue[0] % 10000).padStart(4, "0");
  return suffix;
}
