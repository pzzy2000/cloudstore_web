export function powershow(key) {
  if (localStorage.getItem('userAccont') == 1440000001) {
    return true;
  } else {
    if (key == 1) {
      return true;
    } else {
      return false;
    }
  }
}
