import Foundation

// Error for handling negative amounts in the `change` function.
struct NegativeAmountError: Error {}

// Error for handling nonexistent files in the `meaningfulLineCount` function.
struct NoSuchFileError: Error {}

// Converts an amount into the minimum number of coins.
func change(_ amount: Int) -> Result<[Int: Int], NegativeAmountError> {
    guard amount >= 0 else {
        return .failure(NegativeAmountError())
    }
    var remaining = amount
    var coinCounts = [Int: Int]()
    for coin in [25, 10, 5, 1] {
        let (count, remainder) = remaining.quotientAndRemainder(dividingBy: coin)
        coinCounts[coin] = count
        remaining = remainder
    }
    return .success(coinCounts)
}

// Finds the first string that satisfies the predicate, then returns it lowercased.
func firstThenLowerCase(
    of strings: [String], satisfying predicate: (String) -> Bool
) -> String? {
    strings.first(where: predicate)?.lowercased()
}

// Represents a chainable sentence builder.
struct Sayer {
    let phrase: String
    
    // Appends a word to the current phrase.
    func and(_ word: String) -> Sayer {
        Sayer(phrase: "\(phrase) \(word)")
    }
}

// Creates a Sayer with an optional starting word.
func say(_ word: String = "") -> Sayer {
    Sayer(phrase: word)
}

// Counts the number of meaningful lines in a file asynchronously.
func meaningfulLineCount(_ filename: String) async -> Result<Int, Error> {
    do {
        var count = 0
        let fileURL = URL(fileURLWithPath: filename)
        for try await line in fileURL.lines {
            let trimmed = line.trimmingCharacters(in: .whitespaces)
            if !trimmed.isEmpty && !trimmed.hasPrefix("#") {
                count += 1
            }
        }
        return .success(count)
    } catch {
        return .failure(NoSuchFileError())
    }
}

// Represents an immutable quaternion with coefficients (a, b, c, d).
struct Quaternion: CustomStringConvertible, Equatable {
    let a: Double
    let b: Double
    let c: Double
    let d: Double

    // Predefined constants for common quaternions.
    static let ZERO = Quaternion()
    static let I = Quaternion(b: 1)
    static let J = Quaternion(c: 1)
    static let K = Quaternion(d: 1)

    // Default initializer.
    init(a: Double = 0, b: Double = 0, c: Double = 0, d: Double = 0) {
        self.a = a
        self.b = b
        self.c = c
        self.d = d
    }

    // Returns the quaternion's coefficients as an array.
    var coefficients: [Double] {
        [a, b, c, d]
    }

    // Returns the conjugate of the quaternion.
    var conjugate: Quaternion {
        Quaternion(a: a, b: -b, c: -c, d: -d)
    }

    // Adds two quaternions.
    static func +(lhs: Quaternion, rhs: Quaternion) -> Quaternion {
        Quaternion(
            a: lhs.a + rhs.a,
            b: lhs.b + rhs.b,
            c: lhs.c + rhs.c,
            d: lhs.d + rhs.d
        )
    }

    // Multiplies two quaternions.
    static func *(lhs: Quaternion, rhs: Quaternion) -> Quaternion {
        Quaternion(
            a: lhs.a * rhs.a - lhs.b * rhs.b - lhs.c * rhs.c - lhs.d * rhs.d,
            b: lhs.a * rhs.b + lhs.b * rhs.a + lhs.c * rhs.d - lhs.d * rhs.c,
            c: lhs.a * rhs.c - lhs.b * rhs.d + lhs.c * rhs.a + lhs.d * rhs.b,
            d: lhs.a * rhs.d + lhs.b * rhs.c - lhs.c * rhs.b + lhs.d * rhs.a
        )
    }

    // Custom string representation of the quaternion.
    var description: String {
        var result = ""
        let components = zip(coefficients, ["", "i", "j", "k"])
        for (value, unit) in components where value != 0 {
            if !result.isEmpty && value > 0 {
                result.append("+")
            }
            if abs(value) != 1 || unit.isEmpty {
                result.append("\(value)")
            }
            if abs(value) == 1 && !unit.isEmpty {
                result.append(value < 0 ? "-" : "")
            }
            result.append(unit)
        }
        return result.isEmpty ? "0" : result
    }
}

// Represents a binary search tree.
enum BinarySearchTree: CustomStringConvertible {
    case empty
    indirect case node(String, BinarySearchTree, BinarySearchTree)

    // Calculates the size of the tree.
    var size: Int {
        switch self {
        case .empty:
            return 0
        case let .node(_, left, right):
            return left.size + right.size + 1
        }
    }

    // Inserts a new value into the tree.
    func insert(_ data: String) -> BinarySearchTree {
        switch self {
        case .empty:
            return .node(data, .empty, .empty)
        case let .node(value, left, right):
            if data < value {
                return .node(value, left.insert(data), right)
            } else if data > value {
                return .node(value, left, right.insert(data))
            }
            return self
        }
    }

    // Checks if the tree contains a value.
    func contains(_ data: String) -> Bool {
        switch self {
        case .empty:
            return false
        case let .node(value, left, right):
            if data < value {
                return left.contains(data)
            } else if data > value {
                return right.contains(data)
            }
            return true
        }
    }

    // Custom string representation of the tree.
    var description: String {
        switch self {
        case .empty:
            return "()"
        case let .node(data, left, right):
            return "(\(left)\(data)\(right))".replacingOccurrences(of: "()", with: "")
        }
    }
}