function decodeString(s) {
  const stack = [];

  for (const char of s) {
    if (char !== "]") {
      // Push everything onto the stack as-is until we hit a closing bracket
      stack.push(char);
    } else {
      // 1. Pop characters until we find the matching '['
      let segment = "";
      while (stack.at(-1) !== "[") {
        segment = stack.pop() + segment;
      }
      stack.pop(); // remove the '['

      // 2. Pop digits to get the repeat count (could be multi-digit)
      let digits = "";
      while (stack.length && !isNaN(stack.at(-1))) {
        digits = stack.pop() + digits;
      }
      const k = parseInt(digits);

      // 3. Build the repeated string and push it back
      stack.push(segment.repeat(k));
    }
  }

  return stack.join("");
}
