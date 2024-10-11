const isLocalStorageAvailable = () => {
  const test = 'test';
  try {
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export default isLocalStorageAvailable;
