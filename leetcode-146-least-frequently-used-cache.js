/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  //parameters, array of strings
  // which will be called with an array of numbers (sometimes key value pairs)

  // return the results of each operation not the actual cache

  this.cache = new Map();
  // for fast lookup
  this.capacity = capacity;
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  // does key exist?
  if (this.cache.has(key)) {
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
    // yes ==> return it
  } else {
    return -1;
  }

  // no ===> return -1
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  // put will always return null, since its not returning anything

  // does the key exist?
  if (this.cache.has(key)) {
    //yes ===> update the keys value
    this.cache.delete(key);
    this.cache.set(key, value);
  } else {
    // no ===>
    // does the number of keys exceed the capacity?

    if (this.cache.size === this.capacity) {
      // yes ==> evict least recently USED key, then add key value pair to cache
      const [leastUsedKey] = this.cache.keys();
      this.cache.delete(leastUsedKey);
      this.cache.set(key, value);
    } else {
      // no ===> add key value pair to cache
      this.cache.set(key, value);
    }
  }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
