# Homework Assignment 3

## Problem 7.1 (Stephens, Page 169)

### Corrected Code:
```csharp
// Use Euclid's algorithm to calculate the GCD.
private long GCD(long a, long b)
{
    // Repeat until we're done
    while (true)
    {
        // Set remainder to the remainder of a / b
        long remainder = a % b;
        // If remainder is 0, we're done. Return b.
        if (remainder == 0) return b;
        // Set a = b and b = remainder.
        a = b;
        b = remainder;
    }
}
```

## Problem 7.2 (Stephens, Page 170)

### Two conditions that might result in bad comments:
1. **Outdated Comments** - The developer did not update the comments after modifying the code.
2. **Incorrect Understanding** - The comments were written without fully understanding the code’s logic, leading to incorrect explanations.

## Problem 7.4 (Stephens, Page 170)

### Applying Offensive Programming:
- **Assertions** to check that inputs are non-negative.
- **Preconditions and Postconditions** to ensure proper function behavior.
- **Exception Handling** to catch unexpected inputs.

## Problem 7.5 (Stephens, Page 170)

### Should error handling be added?
Yes. Error handling ensures that edge cases (e.g., dividing by zero or negative inputs) are properly managed. Adding error handling makes the function more robust and reliable, preventing unintended crashes or incorrect results.

## Problem 7.7 (Stephens, Page 170)

### High-level instructions for driving to the nearest supermarket:
1. Start the car.
2. Check fuel and ensure readiness to drive.
3. Exit your parking spot safely.
4. Follow the main road toward the commercial district.
5. Look for the nearest supermarket sign.
6. Enter the parking lot and park safely.
7. Turn off the car and exit.

**Assumptions:**
- The driver knows how to operate a vehicle.
- The route to the supermarket is familiar.
- Traffic laws are followed.

## Problem 8.1 (Stephens, Page 199)

### Code Implementation:
```python
def is_relatively_prime(a, b):
    def gcd(x, y):
        while y:
            x, y = y, x % y
        return abs(x)
    
    return gcd(a, b) == 1

# Test Cases
test_cases = [
    (15, 28),   # Relatively prime
    (21, 35),   # Not relatively prime
    (8, 9),     # Relatively prime
    (-1, 100),  # Relatively prime
    (0, 1),     # Relatively prime
]

for a, b in test_cases:
    print(f"{a} and {b} are relatively prime: {is_relatively_prime(a, b)}")
```

## Problem 8.3 (Stephens, Page 199)

### Testing Techniques Used:
- **Black-box testing:** Tested inputs without knowing the internal structure.
- **White-box testing:** Verified algorithm logic using step-by-step tracing.
- **Gray-box testing:** Combined elements of both to ensure correctness.

## Problem 8.5 (Stephens, Page 199-200)

### C# Implementation:
```csharp
// Return true if a and b are relatively prime.
private bool AreRelativelyPrime(int a, int b)
{
    if (a == 0) return (b == 1) || (b == -1);
    if (b == 0) return (a == 1) || (a == -1);

    return GCD(a, b) == 1;
}

// Euclidean Algorithm
private int GCD(int a, int b)
{
    a = Math.Abs(a);
    b = Math.Abs(b);

    while (b != 0)
    {
        int remainder = a % b;
        a = b;
        b = remainder;
    }
    return a;
}
```

**Bugs Found:** None. The method works as expected.

**Benefit from Testing:** Confirmed correct implementation and handling of edge cases.

## Problem 8.9 (Stephens, Page 200)

### Exhaustive Testing:
Exhaustive testing falls under **white-box testing** because it systematically tests all possible code paths. Since exhaustive testing involves executing every possible input combination, it aligns with white-box testing principles.

## Problem 8.11 (Stephens, Page 200)

### Lincoln Index Estimation:
- **Bugs found by Alice:** {1, 2, 3, 4, 5}
- **Bugs found by Bob:** {2, 5, 6, 7}
- **Bugs found by Carmen:** {1, 2, 8, 9, 10}

**Overlap:**
- **Alice and Bob:** {2, 5}
- **Alice and Carmen:** {1, 2}
- **Bob and Carmen:** {2}

Using the Lincoln Index formula:
```
N = (n1 * n2) / m
```
Where:
- n1 = number of bugs found by Alice (5)
- n2 = number of bugs found by Bob (4)
- m = number of bugs found in common (2)

```
N = (5 * 4) / 2 = 10 (estimated total bugs)
```
**Bugs still at large:** None, since the estimate matches the total found.

## Problem 8.12 (Stephens, Page 200)

### Effect of No Common Bugs:
- If two testers do not find any bugs in common, the Lincoln Index formula overestimates bugs.
- This suggests the testers are working in completely separate areas of the code.

### Lower Bound Estimate:
- The minimum number of bugs is the union of all found bugs.
- If there is no overlap, the lowest estimate is simply the total unique bugs found.

**Conclusion:** Testers should collaborate to ensure more accurate bug tracking.
