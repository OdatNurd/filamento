/******************************************************************************/

/**
 * Loads data from localStorage based on the provided key. The returned value
 * is the value that was loaded, unless the key does not exist or an error
 * occurs, in which case the default value given is returned  instead.
 */
export const loadState = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error(`error loading state for key "${key}":`, err);
    return defaultValue;
  }
};

/******************************************************************************/

/**
 * Saves data to localStorage at the given key.
 */
export const saveState = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error(`error saving state for key "${key}":`, err);
  }
};

/******************************************************************************/
