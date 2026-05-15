/**
 * @param {number[]} data
 * @return {boolean}
 */

// parameter: array of integers
// return: boolean, if its a valid utf-8
// example
//  Input: data = [197,130,1]
// Output: true
// Explanation: data represents the octet sequence: 11000101 10000010 00000001.
// It is a valid utf-8 encoding for a 2-bytes character followed by a 1-byte character.

// psuedocode
function validUtf8(data) {
  let i = 0;
  // data[0] = 197 → "11000101"
  // starts with '110' → numBytes = 2

  while (i < data.length) {
    // goes through each number in the array one loop at a time
    // however if its a 2 byte, 3 byte or 4 byte, it will also use elements after i too
    // if so at the very end it will update i, so the while loop knows to skip those elements

    // Convert the number to its binary string representation toString(2)
    // padStart(8, '0') ensures it's always 8 characters long (e.g. 1 becomes "00000001")
    const bits = data[i].toString(2).padStart(8, "0");

    let numBytes;

    // now we check the converted binary to see if they are valid utf8 characters (within 1 to 4 bytes only)

    if (bits.startsWith("0")) {
      numBytes = 1;
      //  it's a 1-byte character, no continuation bytes needed
    } else if (bits.startsWith("110")) {
      //  it's a 2-byte character, so 1 continuation byte should follow
      numBytes = 2;
    } else if (bits.startsWith("1110")) {
      //  it's a 3-byte character, so 2 continuation bytes should follow
      numBytes = 3;
    } else if (bits.startsWith("11110")) {
      // it's a 4-byte character, so 3 continuation bytes should follow
      numBytes = 4;
    } else {
      // it doesn't match any valid pattern, so immediately return false
      return false;
    }

    // Now the for loop runs to check 1 continuation byte since 197 was a 2 byte binary character

    // Check that the following (numBytes - 1) bytes are valid continuation bytes
    for (let j = 1; j < numBytes; j++) {
      // we don't want it to run if its 1 bytes or less
      // for loop because each byte means another 10xxxxxx added on
      // we start at 1 since we we're not using indexes
      // and we want 1 < 1 bytes to jump out of the loop since it has no continuation bytes
      if (i + j >= data.length) return false;
      // if

      const continuationBits = data[i + j].toString(2).padStart(8, "0");
      // data[0 + 1] = data[1] = 130 → "10000010"
      //             starts with '10' ✓
      // j is no longer < 2 so for loop exits

      if (!continuationBits.startsWith("10")) return false;
    }
    // telling i, hey I did a 2 byte one, so change 0 to += 2 = 2, since the first 2 have been accounted for
    i += numBytes;
  }

  return true;
}
