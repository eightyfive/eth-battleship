export function _splice(arr, start, deleteCount, ...items) {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
}

export function _pop(arr) {
  return arr.slice(0, -1);
}

export function _push(arr, newEntry) {
  return [...arr, newEntry];
}

export function _unshift(arr, newEntry) {
  return [newEntry, ...arr];
}

//

export function _replaceAt(arr, index, value) {
  return _splice(arr, index, 1, value);
}
