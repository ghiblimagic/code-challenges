// https://neetcode.io/problems/string-encode-and-decode/question

class Solution {
  /**
   * @param {string[]} strs
   * @returns {string}
   *
   */
  encode(strs) {
    return strs.map((s) => s.length + "#" + s).join("");
    // "Hello" becomes "5#Hello"
  }

  /**
   * @param {string} str
   * @returns {string[]}
   */
  decode(str) {
    let res = [];
    let i = 0; //  is our main pointer
    //it tracks where we currently are in the string
    // always pointing at the start of a length number
    while (i < str.length) {
      // keep looping as long as there's still string left to process
      // the number could be 10, 100 ect so we need to find where the number ends by looking for the #
      // this is what indexOfSeperator is, we're trying to figure out where the number ends, so indexOfSeperator will store the index of the #
      let indexOfSeperator = i;
      // indexOfSeperator starts at the same spot as i
      // then crawls forward one character at a time until it finds the #
      // when the inner loop stops, indexOfSeperator is sitting right on the #
      while (str[indexOfSeperator] !== "#") {
        indexOfSeperator++;
      }
      //  grabs everything between i and indexOfSeperator — which is just the number
      let length = parseInt(str.slice(i, indexOfSeperator));
      let indexAfterSeperator = indexOfSeperator + 1;
      let indexAfterWordEnd = indexOfSeperator + 1 + length;
      // slice will stop at the element before the end index rather than including it

      // so if the delimiter (#) appears within the string it doesn't matter, because its skipping over the amount of elements === length,
      // aka its not looking for the delimiter in the current code
      res.push(str.slice(indexAfterSeperator, indexAfterWordEnd));
      //indexOfSeperator + 1 skips past the #
      // indexOfSeperator + 1 + length is exactly where the word ends
      i = indexAfterWordEnd;
      // moves i forward to where the next length number begins,
      // so the whole process repeats for the next word
    }
    return res;
    // once the loop finishes, return the fully decoded array
  }
}
