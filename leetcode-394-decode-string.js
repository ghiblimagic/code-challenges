function decodeString(s) {
  const stack = [];

  for (const char of s) {
    if (char !== "]") {
      // We push digits, '[', and letters all onto the stack as raw characters.
      // We don't act on them yet — we're just collecting until we see a ']'
      stack.push(char);
    } else {
      // We hit a ']', so it's time to resolve the innermost bracket group.

      // 1. Pop letters until we find the '[' that opened this group.
      //    We prepend each popped char (instead of appending) so the string
      //    stays in the correct order — stack pops in reverse.
      //    e.g. stack has [..., '[', 'a', 'b', 'c'] → segment becomes "abc"
      let segment = "";
      while (stack[stack.length - 1] !== "[") {
        segment = stack.pop() + segment;
      }
      stack.pop(); // discard the '[' itself, we don't need it anymore

      // 2. Pop the digits that sit just below the '['.
      //    Same prepend trick to preserve order for multi-digit numbers.
      //    e.g. stack has [..., '1', '2'] → digits becomes "12", k = 12
      let digits = "";
      while (stack.length && !isNaN(stack[stack.length - 1])) {
        digits = stack.pop() + digits;
      }
      const k = parseInt(digits);

      // 3. Repeat the segment k times and push the result back as a single
      //    string. This is key for nesting — the repeated string now sits on
      //    the stack just like a regular string, so an outer bracket group
      //    will naturally pick it up when it resolves later.
      //    e.g. segment = "acc", k = 3 → push "accaccacc"
      stack.push(segment.repeat(k));
    }
  }

  // Whatever is left on the stack are plain string pieces (no more brackets).
  // Join them together for the final result.
  // e.g. "2[abc]3[cd]ef" → stack ends as ["abcabc", "cdcdcd", "e", "f"]
  return stack.join("");
}
