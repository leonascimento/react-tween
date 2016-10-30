export default function mergeDiff(keys, nextKeys) {
  // Create lookup tables from key to index
  const extractOrder = keys => (
    keys.reduce((result, k, i) => {
      result[k] = i;
      return result;
    }, {})
  );
  const order = extractOrder(keys);
  const nextOrder = extractOrder(nextKeys);

  // Create the set of all keys
  const mergedKeys = [].concat(keys, nextKeys).reduce((result, k) => {
    result[k] = true;
    return result;
  }, {});

  // Sort the set of all keys
  // If k1 and k2 are in the same style array, use their relative order.
  // If k1 and k2 are in different style arrays, order them based on a pivot key that is in both style arrays.
  // If there isn't a pivot key, put the next style after the current style. (This is an arbitrary convention.)
  const mergedKeyArray = Object.keys(mergedKeys);
  mergedKeyArray.sort((k1, k2) => {
    if (nextOrder.hasOwnProperty(k1) && nextOrder.hasOwnProperty(k2)) {
      // k1 and k2 are both in next styles
      return nextOrder[k1] - nextOrder[k2];
    }

    if (order.hasOwnProperty(k1) && order.hasOwnProperty(k2)) {
      // k1 and k2 are both in current styles
      return order[k1] - order[k2];
    }

    // k1 and k2 are in different style arrays
    if (order.hasOwnProperty(k1)) {
      // k1 is in current styles and k2 is in next styles
      
      for (let i = 0; i < nextKeys.length; i++) {
        const k = nextKeys[i];
        
        if (order.hasOwnProperty(k)) {
          if (order[k] > order[k1] && nextOrder[k] < nextOrder[k2]) {
            return 1;
          } else if (order[k] < order[k1] && nextOrder[k] > nextOrder[k2]) {
            return -1;
          }
        }
      }
      
      return 1;
    } else {
      // k1 is in next styles and k2 is in current styles

      for (let i = 0; i < nextKeys.length; i++) {
        const k = nextKeys[i];

        if (order.hasOwnProperty(k)) {
          if (nextOrder[k] > nextOrder[k1] && order[k] < order[k2]) {
            return 1;
          } else if (nextOrder[k] < nextOrder[k1] && order[k] > order[k2]) {
            return -1;
          }
        }
      }

      return -1;
    }
  });
  return mergedKeyArray;
}
