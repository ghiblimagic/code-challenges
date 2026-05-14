// FIRST VERSION, not optimized
//
// parameters: 2 arrays,

// 1. array of strings,
// 2. array of subarrays which either are empty or contain an integer, they work with the first array to provide integers for operations such as insert

// return array filled with either null, booleans, integers

// example ["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
// [[], [1], [2], [2], [], [1], [2], []]
// result [null, true, false, true, 2, true, false, 2]

var RandomizedSet = function () {
  // map to keep track of what we're building
  // use map for faster lookups
  this.building = new Map();
  // don't need an array to track history, leetcode has that built in, just says to return
};

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function (val) {
  if (this.building.has(val)) {
    // no duplicates
    return false;
  } else {
    this.building.set(val, val);
    // returns true as 1 was inserted successfully.
    return true;
  }
};

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function (val) {
  if (this.building.has(val)) {
    // returns true or false based on if it was deleted or not
    return this.building.delete(val);
  } else {
    // item did not exist
    return false;
  }
};

/**
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function () {
  // get a random integer from the building map
  // convert to array since you can't iterate with index keys with map
  const valuesAvailable = [...this.building.keys()];

  const random = Math.floor(Math.random() * Number(valuesAvailable.length));

  return valuesAvailable[random];
};

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
