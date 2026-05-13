"use strict";

const fs = require("fs");

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";

// This is the cursor it tracks which line we're currently on
// It starts at 0 (the first line) and only ever moves forward
let currentLine = 0;

// As data streams in from stdin, keep appending it to inputString
process.stdin.on("data", function (inputStdin) {
  inputString += inputStdin;
});

// Once ALL the input has arrived, split it into an array of lines
// e.g. "8\n1 5\n1 6" becomes ["8", "1 5", "1 6", ...]
// Then kick off main()

process.stdin.on("end", function () {
  inputString = inputString.split("\n");

  main();
});

function readLine() {
  return inputString[currentLine++];
}

// Complete the freqQuery function below.

// Why don't we worry about the first line of the input?
// "Input Format
// The first line contains of an integer , the number of queries."

// Answer: Because we look at main and see
// const q = parseInt(readLine().trim(), 10);  // consumes the first line (q)
// for (let i = 0; i < q; i++) {
//    queries[i] = readLine()...  // consumes only the actual query lines
// }

//The general rule: when a competitive programming problem gives you boilerplate main() code, read it carefully before writing your solution function it often handles the input format so you don't have to.

//special note: the first index is the number of queries
function freqQuery(queries) {
  const answer = []; // collects a 1 or 0 for every type-3 query, in order

  // Map 1: "how many times have I seen this integer so far?"
  // e.g. { 5 -> 3 } means the integer 5 has appeared 3 times
  const integersfrequency = new Map();

  // Map 2: "how many distinct integers currently have this frequency?"
  // e.g. { 3 -> 2 } means 2 different integers each appear exactly 3 times
  // This lets op 3 answer "does any integer appear exactly z times?" in O(1)
  const frequencyToInteger = new Map();

  // iterate through array
  for (const key of queries) {
    const operation = Number(key[0]); // 1 = add, 2 = remove, 3 = query
    const integerOrFreq = key[1]; // the integer to add/remove, OR the frequency to check

    if (operation === 1) {
      // does the integersfrequency map have that integer yet?
      if (!integersfrequency.has(integerOrFreq)) {
        // if not set its count to 1
        integersfrequency.set(integerOrFreq, 1);

        // for the second map for frequency of 1,
        // update the count of integers with that frequency by 1
        frequencyToInteger.set(1, (frequencyToInteger.get(1) || 0) + 1);
      } else {
        // We've seen this integer before so grab its current count
        const currentFrequency = integersfrequency.get(integerOrFreq);

        // Move it up by 1 in map 1
        integersfrequency.set(integerOrFreq, currentFrequency + 1);

        // #####  Frequency Map #########
        // In map 2, one fewer integer now has the OLD frequency
        // we know what frequency the integer was at before from currentFrequency
        const currentFreqCount = frequencyToInteger.get(currentFrequency);
        // remove it from the old frequency
        frequencyToInteger.set(currentFrequency, currentFreqCount - 1);
        // add to the new frequency map
        // go to the new frequency list (old+1), up the count by 1
        const newFreqCount = frequencyToInteger.get(currentFrequency + 1) || 0;
        frequencyToInteger.set(currentFrequency + 1, newFreqCount + 1);
      }
    } // end of part 1
    else if (operation === 2) {
      // Only act if the integer exists AND still has occurrences left to remove
      // not the key term "IF PRESENT" in the problem
      // Without the > 0 check, repeated deletions send counts negative and corrupt both maps

      if (
        integersfrequency.has(integerOrFreq) &&
        integersfrequency.get(integerOrFreq) > 0
      ) {
        const currentFrequency = integersfrequency.get(integerOrFreq);

        // minus the integersfrequency count by 1
        integersfrequency.set(
          integerOrFreq,
          integersfrequency.get(integerOrFreq) - 1,
        );

        // #####  Frequency Map #########
        // update frequency map, we know what frequency it was at before from currentFrequency
        const currentFreqCount = frequencyToInteger.get(currentFrequency);
        // one fewer integer at old frequency
        frequencyToInteger.set(currentFrequency, currentFreqCount - 1);

        // and up count of new frequency list
        const newFreqCount = frequencyToInteger.get(currentFrequency - 1) || 0;
        frequencyToInteger.set(currentFrequency - 1, newFreqCount + 1);
      }
    } // operation 2 end
    else {
      // Op 3: check if ANY integer currently appears exactly integerOrFreq times
      // (in the problem "if any integer is present" and see how the output always === z
      // hints that we're NOT sending 1 per each matching integer, we're sending 1 if theres ANY match)

      // We look up integerOrFreq as a KEY in map 2 if its value is > 0,
      // at least one integer has that frequency right now
      // The || 0 handles the case where the key doesn't exist yet (treat as 0)

      (frequencyToInteger.get(integerOrFreq) || 0) > 0
        ? answer.push(1)
        : answer.push(0);
    }
  } //end of for loop
  return answer;
} // end of freqQuery func

function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const q = parseInt(readLine().trim(), 10);
  // FIRST readLine() call reads line 0 which is "8" (the number of queries)
  // After this, the cursor is now sitting on line 1
  // parseInt converts the string "8" to the number 8 so we can use it as a loop limit

  let queries = Array(q);

  for (let i = 0; i < q; i++) {
    // The loop starts with the cursor already on line 1 (the first real query)
    // because the line 0 was already consumed above, so its as if it was skipped
    // Each readLine() here reads one query line and advances the cursor

    // e.g. "1 5  " -> trim whitespace -> "1 5" -> split -> ["1","5"] -> parse -> [1, 5]
    queries[i] = readLine()
      .replace(/\s+$/g, "")
      .split(" ")
      .map((queriesTemp) => parseInt(queriesTemp, 10));
  }

  // By now queries looks like:
  // [ [1,5], [1,6], [3,2], [1,10], [1,10], [1,6], [2,5], [3,2] ]
  // Notice: the "8" from line 0 is nowhere in here it was consumed before the loop

  const ans = freqQuery(queries);

  ws.write(ans.join("\n") + "\n");

  ws.end();
}
