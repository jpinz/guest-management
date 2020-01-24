function getSortKey(name) {
  let sortKeyArr = name.toUpperCase().split(' ');
  return sortKeyArr.splice(1).join('') + sortKeyArr[0];
}

export default getSortKey
