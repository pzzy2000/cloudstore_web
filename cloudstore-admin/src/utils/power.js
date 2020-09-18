export function powershow(key) {
  let userCount = localStorage.getItem('userAccont');
  if (userCount == 1440000001) {
  // || userCount == 13714641024 || userCount == 13714641019 || userCount == 13714640980 || userCount == 13714640974 || userCount == 13714640993
    return true;
  } else {
    if (key == 1) {
      return true;
    } else {
      return false;
    }
  }
}
