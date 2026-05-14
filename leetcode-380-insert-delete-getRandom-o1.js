//
// parameters: 2 arrays,

// 1. array of strings,
// 2. array of subarrays which either are empty or contain an integer, they work with the first array to provide integers for operations such as insert

// return array filled with either null, booleans, integers

// example ["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
// [[], [1], [2], [2], [], [1], [2], []]
// result [null, true, false, true, 2, true, false, 2]

// ################## SECOND VERSION, OPTIMIZED #########################

/**
 * PROBLEM: Insert Delete GetRandom O(1)
 *
 * We need a data structure that supports three operations, each in O(1) average time:
 *   - insert(val)    → add a number if not already present
 *   - remove(val)    → delete a number if it exists
 *   - getRandom()    → return any element with equal probability
 *
 * WHY TWO DATA STRUCTURES?
 * No single structure handles all three well:
 *   - An array alone gives O(1) getRandom, but O(n) remove (you have to scan for the value).
 *   - A Map/Set alone gives O(1) insert and remove, but O(n) getRandom (you'd have to
 *     iterate keys to pick one, or do messy index math).
 *
 * The trick is to combine them:
 *   - this.numbers  → a plain array that lets us do O(1) random access by index.
 *   - this.building → a Map where the key is the value we stored, and the Map's value is
 *                     that number's current index in this.numbers. This lets us jump
 *                     straight to any element's position without scanning.
 *
 * Together they give us O(1) for all three operations.
 */

var RandomizedSet = function () {
  // MAP: key = the stored integer, value = its index in this.nums
  // Example after insert(10), insert(20), insert(30):
  //   this.valueToIndex = Map { 10 → 0, 20 → 1, 30 → 2 }
  //   this.nums         = [10, 20, 30]
  this.valueToIndex = new Map();

  // ARRAY: the actual list of integers we're tracking.
  // We need this for getRandom — Math.random() gives a decimal in [0, 1),
  // so we multiply by the array length and floor it to pick a valid index.
  this.nums = [];
};

/**
 * SEARCH — check if a value already exists in our set.
 *
 * Map.has() is O(1) because a Map uses a hash table under the hood.
 * That means it computes a hash of the key and checks a "bucket" directly,
 * rather than looping through every entry like an array indexOf would.
 *
 * @param  {number}  val
 * @return {boolean} true if val is present
 */
RandomizedSet.prototype.search = function (val) {
  return this.valueToIndex.has(val);
};

/**
 * INSERT — add val to the set. Return false if it's already there, true otherwise.
 *
 * We reject duplicates with an early return so the set never holds the same
 * value twice (which would break getRandom's equal-probability guarantee).
 *
 * @param  {number}  val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function (val) {
  if (this.search(val)) {
    // val is already in the set — do nothing and signal failure.
    return false;
  }

  // Before we push, this.nums.length equals the index the new element
  // WILL occupy after the push. For example, if the array currently holds
  // [10, 20] (length 2), the new element will land at index 2.
  // We capture that now, before push() changes the length.
  const lastIndex = this.nums.length;

  // Record val → its future index in the lookup map.
  this.valueToIndex.set(val, lastIndex);

  // Actually append val to the array. After this line, this.nums[lastIndex] === val.
  this.nums.push(val);

  return true;
};

/**
 * REMOVE — delete val from the set. Return false if not found, true otherwise.
 *
 * Naïve removal from an array is O(n) because you'd need to:
 *   1. Find the element (scan → O(n)).
 *   2. Splice it out and shift every element after it left (shift → O(n)).
 *
 * TRICK: instead of shifting, we overwrite the deleted slot with the LAST
 * element, then pop() the now-duplicate tail. pop() is O(1) because it just
 * decrements the length — no shifting. The only extra work is updating the
 * moved element's index in the map, which is also O(1).
 *
 * Visual example — removing 20 from [10, 20, 30, 40]:
 *
 *   Before:  [10, 20, 30, 40]   valueToIndex: {10→0, 20→1, 30→2, 40→3}
 *
 *   Step 1 — copy last element (40) into the deleted slot (index 1):
 *            [10, 40, 30, 40]   (two copies of 40 temporarily)
 *
 *   Step 2 — pop the duplicate tail:
 *            [10, 40, 30]
 *
 *   Step 3 — update 40's index in the map from 3 → 1:
 *            valueToIndex: {10→0, 40→1, 30→2}
 *
 *   Step 4 — delete 20 from the map entirely:
 *            valueToIndex: {10→0, 40→1, 30→2}   ✓
 *
 * EDGE CASE: what if we're removing the last element itself?
 * Say the array is [10, 20, 30] and we remove 30 (index 2).
 * tailValue is 30, which equals val. If we tried to do
 *   this.valueToIndex.set(tailValue, index)   // set(30, 2) — but 30 is being deleted!
 * we'd overwrite the entry we're about to delete with a stale index, causing bugs.
 * The `if (tailValue !== val)` guard skips that update when we're removing the tail.
 *
 * @param  {number}  val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function (val) {
  if (!this.search(val)) {
    // val isn't in the set — nothing to do.
    return false;
  }

  // O(1) lookup: where in this.nums does val currently live?
  const indexToOverwrite = this.valueToIndex.get(val);

  // What integer currently sits at the very end of the array?
  // This is the element we'll teleport into the deleted slot.
  const tailValue = this.nums[this.nums.length - 1];

  // ############# Update this.nums #################################################################

  // Overwrite val's slot with the tail element.
  // (For the edge case where val IS the tail element, this writes the same
  // value back into the same slot — harmless, and pop() cleans it up next.)
  this.nums[indexToOverwrite] = tailValue;

  // Remove the now-duplicate tail element. pop() is O(1).
  this.nums.pop();

  // ############# Update this.valueToIndex (the lookup map) #######################################

  if (tailValue !== val) {
    // tailValue moved from (this.nums.length) to indexToOverwrite.
    // Update its record so future lookups find it at its new position.
    this.valueToIndex.set(tailValue, indexToOverwrite);
  }
  // If tailValue === val, we were removing the last element in the array.
  // There's nothing to "move", so we skip the set() call above.
  // Either way, we always delete val's entry from the map.

  // Map.delete() returns true if the key existed (it always does here),
  // so returning it satisfies LeetCode's "return bool" requirement.
  return this.valueToIndex.delete(val);
};

/**
 * GET RANDOM — return any element from the set with equal probability.
 *
 * Math.random() returns a float in [0, 1).
 * Multiplying by the array length scales that to [0, length).
 * Math.floor() truncates the decimal, giving a whole-number index in [0, length-1].
 *
 * Because every element has a valid index in this.nums, and we're picking
 * uniformly across all indices, each element is equally likely to be returned.
 *
 * We wrap the length in Number() — technically unnecessary for a JS array,
 * but a defensive habit if the length were ever a BigInt or came from another type.
 *
 * @return {number} a random element from the set
 */
RandomizedSet.prototype.getRandom = function () {
  const randomIndex = Math.floor(Math.random() * Number(this.nums.length));
  return this.nums[randomIndex];
};

/**
 * Usage:
 *   var obj = new RandomizedSet()
 *   obj.insert(1)    // true  → set: {1}
 *   obj.insert(2)    // true  → set: {1, 2}
 *   obj.insert(2)    // false → already present, no change
 *   obj.remove(1)    // true  → set: {2}
 *   obj.getRandom()  // always 2, since it's the only element
 */

// ################ FIRST VERSION, not optimized ############################

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
