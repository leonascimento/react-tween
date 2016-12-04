export default function toObject(array, keyGetter = item => item, valueGetter = item => item) {
  return array.reduce((result, item) => {
    result[keyGetter(item)] = valueGetter(item); // eslint-disable-line no-param-reassign
    return result;
  }, {});
}
