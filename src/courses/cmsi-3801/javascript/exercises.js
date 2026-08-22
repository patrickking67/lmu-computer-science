import { open, readFile } from 'node:fs/promises';

export function change(amount) {
  if (!Number.isInteger(amount)) {
    throw new TypeError("Amount must be an integer"); // Ensure amount is an integer.
  }
  if (amount < 0) {
    throw new RangeError("Amount cannot be negative"); // Handle negative amounts.
  }

  const counts = {};
  let remaining = amount;

  // Calculate the number of coins for each denomination.
  for (const denomination of [25, 10, 5, 1]) {
    counts[denomination] = Math.floor(remaining / denomination);
    remaining %= denomination;
  }

  return counts; // Return the counts of each coin denomination.
}

export function firstThenLowerCase(array, predicate) {
  // Find the first string matching the predicate and return it in lowercase.
  for (const item of array) {
    if (predicate(item)) {
      return item.toLowerCase();
    }
  }
  return undefined; // Return undefined if no match is found.
}

export function* powersGenerator({ ofBase, upTo }) {
  // Generate powers of a base up to a given limit.
  for (let power = 1; power <= upTo; power *= ofBase) {
    yield power;
  }
}

export function say(first) {
  // Base case: Return an empty string if no word is provided.
  if (first === undefined) {
    return "";
  }

  // Recursive case: Append the next word to the sentence.
  return (second) => {
    if (second === undefined) {
      return first; // Return the constructed sentence when no next word is provided.
    }
    return say(`${first} ${second}`); // Recursively build the sentence.
  };
}

export async function meaningfulLineCount(filename) {
  // Read file content and count non-empty, non-comment lines.
  const content = await readFile(filename, "utf-8");
  const lines = content.split("\n");

  return lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed !== "" && !trimmed.startsWith("#"); // Exclude empty lines and comments.
  }).length;
}

export class Quaternion {
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    Object.freeze(this); // Make the instance immutable.
  }

  get coefficients() {
    return [this.a, this.b, this.c, this.d]; // Return all components of the quaternion.
  }

  get conjugate() {
    // Return the conjugate of the quaternion (negate imaginary parts).
    return new Quaternion(this.a, -this.b, -this.c, -this.d);
  }

  plus(q) {
    // Add two quaternions component-wise.
    return new Quaternion(
      this.a + q.a,
      this.b + q.b,
      this.c + q.c,
      this.d + q.d
    );
  }

  times(q) {
    // Multiply two quaternions using quaternion multiplication rules.
    return new Quaternion(
      this.a * q.a - this.b * q.b - this.c * q.c - this.d * q.d,
      this.a * q.b + this.b * q.a + this.c * q.d - this.d * q.c,
      this.a * q.c - this.b * q.d + this.c * q.a + this.d * q.b,
      this.a * q.d + this.b * q.c - this.c * q.b + this.d * q.a
    );
  }

  equals(q) {
    // Check if two quaternions are equal.
    return this.a === q.a && this.b === q.b && this.c === q.c && this.d === q.d;
  }

  toString() {
    const parts = [];

    // Append real and imaginary components to the string.
    if (this.a !== 0) parts.push(`${this.a}`);
    if (this.b !== 0) parts.push(`${this.b > 0 && parts.length ? "+" : ""}${Math.abs(this.b) === 1 ? (this.b > 0 ? "i" : "-i") : `${this.b}i`}`);
    if (this.c !== 0) parts.push(`${this.c > 0 && parts.length ? "+" : ""}${Math.abs(this.c) === 1 ? (this.c > 0 ? "j" : "-j") : `${this.c}j`}`);
    if (this.d !== 0) parts.push(`${this.d > 0 && parts.length ? "+" : ""}${Math.abs(this.d) === 1 ? (this.d > 0 ? "k" : "-k") : `${this.d}k`}`);

    return parts.length ? parts.join("") : "0"; // Return "0" if all components are zero.
  }
}
