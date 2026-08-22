import { open } from "node:fs/promises"

export function change(amount: bigint): Map<bigint, bigint> {
  if (amount < 0) {
    throw new RangeError("Amount cannot be negative")
  }
  let counts: Map<bigint, bigint> = new Map()
  let remaining = amount
  for (const denomination of [25n, 10n, 5n, 1n]) {
    counts.set(denomination, remaining / denomination)
    remaining %= denomination
  }
  return counts
}

export function firstThenApply<T, U>(
  arr: T[],
  predicate: (item: T) => boolean,
  func: (item: T) => U
): U | undefined {
  const found = arr.find(predicate); // Find the first element matching the predicate.
  return found !== undefined ? func(found) : undefined; // Apply the function if found.
}

export function* powersGenerator(base: bigint): Generator<bigint> {
  let current = 1n; // Start with base^0.
  while (true) {
    yield current;
    current *= base; // Generate the next power.
  }
}

export async function meaningfulLineCount(filePath: string): Promise<number> {
  const file = await open(filePath, "r");
  let count = 0;

  // Count lines that are non-empty and not comments.
  for await (const line of file.readLines()) {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 0 && !trimmedLine.startsWith("#")) {
      count++;
    }
  }

  return count;
}

type Box = { kind: "Box"; width: number; length: number; depth: number };
type Sphere = { kind: "Sphere"; radius: number };
export type Shape = Box | Sphere;

export function volume(shape: Shape): number {
  if (shape.kind === "Sphere") {
    return (4 / 3) * Math.PI * Math.pow(shape.radius, 3); // Volume of a sphere.
  } else {
    return shape.width * shape.length * shape.depth; // Volume of a box.
  }
}

export function surfaceArea(shape: Shape): number {
  if (shape.kind === "Sphere") {
    return 4 * Math.PI * Math.pow(shape.radius, 2); // Surface area of a sphere.
  } else {
    // Surface area of a box.
    return 2 * (
      shape.width * shape.length +
      shape.width * shape.depth +
      shape.length * shape.depth
    );
  }
}

export interface BinarySearchTree<T> {
  size(): number; // Returns the number of nodes in the tree.
  insert(value: T): BinarySearchTree<T>; // Inserts a value and returns a new tree.
  contains(value: T): boolean; // Checks if the value exists in the tree.
  inorder(): Iterable<T>; // Produces elements in sorted order.
  toString(): string; // Returns a string representation of the tree.
}

export class Empty<T> implements BinarySearchTree<T> {
  size(): number {
    return 0; // An empty tree has no elements.
  }

  insert(value: T): BinarySearchTree<T> {
    return new Node(value, new Empty<T>(), new Empty<T>()); // Creates a new node.
  }

  contains(value: T): boolean {
    return false; // Empty trees contain no values.
  }

  *inorder(): Iterable<T> {
    // No elements to traverse.
  }

  toString(): string {
    return "()"; // Represents an empty tree.
  }
}

class Node<T> implements BinarySearchTree<T> {
  private readonly value: T; // The value stored in the node.
  private readonly left: BinarySearchTree<T>; // The left subtree.
  private readonly right: BinarySearchTree<T>; // The right subtree.

  constructor(value: T, left: BinarySearchTree<T>, right: BinarySearchTree<T>) {
    this.value = value;
    this.left = left;
    this.right = right;
  }

  size(): number {
    return 1 + this.left.size() + this.right.size(); // Count the node and its subtrees.
  }

  insert(value: T): BinarySearchTree<T> {
    if (value < this.value) {
      return new Node(this.value, this.left.insert(value), this.right); // Insert in the left subtree.
    } else if (value > this.value) {
      return new Node(this.value, this.left, this.right.insert(value)); // Insert in the right subtree.
    }
    return this; // Ignore duplicates.
  }

  contains(value: T): boolean {
    if (value === this.value) {
      return true; // Found the value.
    } else if (value < this.value) {
      return this.left.contains(value); // Search in the left subtree.
    } else {
      return this.right.contains(value); // Search in the right subtree.
    }
  }

  *inorder(): Iterable<T> {
    yield* this.left.inorder(); // Traverse the left subtree.
    yield this.value; // Yield the current node's value.
    yield* this.right.inorder(); // Traverse the right subtree.
  }

  toString(): string {
    const leftTree = this.left instanceof Empty ? "" : this.left.toString();
    const rightTree = this.right instanceof Empty ? "" : this.right.toString();
    return `(${leftTree}${this.value}${rightTree})`; // Format as "(left value right)".
  }
}