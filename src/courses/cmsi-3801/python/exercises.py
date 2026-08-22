from dataclasses import dataclass
from collections.abc import Callable

# Calculates the smallest number of U.S. coins (quarters, dimes, nickels, pennies) for a given amount.
def change(amount: int) -> dict[int, int]:
    if not isinstance(amount, int):
        raise TypeError('Amount must be an integer')
    if amount < 0:
        raise ValueError('Amount cannot be negative')

    counts, remaining = {}, amount
    for denomination in (25, 10, 5, 1):  # Process denominations in descending order.
        counts[denomination], remaining = divmod(remaining, denomination)
    return counts

# Finds the first string in a list that satisfies a predicate and returns it in lowercase.
def first_then_lower_case(strings: list[str], predicate: Callable[[str], bool]) -> str | None:
    for string in strings:
        if predicate(string):
            return string.lower()
    return None  # Return None if no match is found.

# Generates successive powers of a base up to a given limit.
def powers_generator(*, base: int, limit: int):
    current = 1
    while current <= limit:
        yield current
        current *= base

# Builds a chainable sentence. Each call adds a word to the sentence, and a call with no arguments returns the sentence.
def say(word: str | None = None, /):
    if word is None:
        return ''  # Return an empty string if no word is given.
    return lambda next=None: word if next is None else say(f'{word} {next}')

# Counts the number of meaningful lines in a file (non-empty, non-comment lines).
def meaningful_line_count(filename: str) -> int:
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return sum(
                1
                for line in file
                if (stripped_line := line.strip()) and not stripped_line.startswith('#')
            )
    except FileNotFoundError:
        raise FileNotFoundError('No such file')

# Represents a quaternion with real and imaginary components, and supports addition, multiplication, and string representation.
@dataclass(frozen=True)
class Quaternion:
    a: float  # Real component
    b: float  # Coefficient for i
    c: float  # Coefficient for j
    d: float  # Coefficient for k

    # Adds two quaternions component-wise
    def __add__(self, q: 'Quaternion') -> 'Quaternion':
        return Quaternion(
            self.a + q.a,  # Add real components
            self.b + q.b,  # Add i components
            self.c + q.c,  # Add j components
            self.d + q.d   # Add k components
        )

    # Multiplies two quaternions following quaternion multiplication rules
    def __mul__(self, q: 'Quaternion') -> 'Quaternion':
        return Quaternion(
            # Real part
            q.a * self.a - q.b * self.b - q.c * self.c - q.d * self.d,
            # i component
            q.a * self.b + q.b * self.a - q.c * self.d + q.d * self.c,
            # j component
            q.a * self.c + q.b * self.d + q.c * self.a - q.d * self.b,
            # k component
            q.a * self.d - q.b * self.c + q.c * self.b + q.d * self.a
        )

    # Returns the coefficients of the quaternion as a tuple (a, b, c, d)
    @property
    def coefficients(self) -> tuple[float, float, float, float]:
        return (self.a, self.b, self.c, self.d)

    # Returns the conjugate of the quaternion by negating the imaginary components
    @property
    def conjugate(self) -> 'Quaternion':
        return Quaternion(self.a, -self.b, -self.c, -self.d)

    # Builds a string representation of the quaternion (e.g., "1+2i-3j+4k")
    def __repr__(self) -> str:
        s = ""

        # Process each component and append to the string if non-zero
        for c, unit in zip(self.coefficients, ["", "i", "j", "k"]):
            if c == 0:
                continue  # Skip zero coefficients
            # Add sign and value
            s += '-' if c < 0 else '' if s == '' else '+'
            # Add magnitude (omit '1' for imaginary units like "i")
            s += '' if abs(c) == 1 and unit != "" else str(abs(c))
            # Add unit (i, j, k)
            s += unit

        # Return "0" if all coefficients are zero, else return the built string
        return '0' if s == '' else s