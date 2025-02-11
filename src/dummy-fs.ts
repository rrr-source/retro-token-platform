export function readFileSync() {
  console.warn('readFileSync() called in browser – returning empty string.');
  return '';
}
export function writeFileSync() {
  console.warn('writeFileSync() called in browser – ignoring.');
}