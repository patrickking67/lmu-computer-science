import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.function.Predicate;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Exercises {
    // Returns the smallest number of coins for a given amount in cents.
    static Map<Integer, Long> change(long amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        var counts = new HashMap<Integer, Long>();
        for (var denomination : List.of(25, 10, 5, 1)) { // Iterate through coin denominations.
            counts.put(denomination, amount / denomination); // Count coins for each denomination.
            amount %= denomination; // Update the remaining amount.
        }
        return counts;
    }

    // Finds the first string satisfying the predicate and returns it lowercased.
    public static Optional<String> firstThenLowerCase(List<String> list, Predicate<String> predicate) {
        return list.stream()
                   .filter(predicate) // Filter by predicate.
                   .findFirst() // Get the first match.
                   .map(String::toLowerCase); // Convert to lowercase.
    }

    // Represents a chainable string builder.
    static record Sayer(String phrase) {
        Sayer and(String word) {
            return new Sayer(phrase + ' ' + word); // Append word with a space.
        }
    }

    // Creates a Sayer instance with an empty phrase.
    static Sayer say() {
        return new Sayer("");
    }

    // Creates a Sayer instance initialized with the given phrase.
    static Sayer say(String word) {
        return new Sayer(word);
    }

    // Counts non-empty, non-comment lines in a file.
    static long meaningfulLineCount(String filename) throws IOException {
        try (var reader = new BufferedReader(new FileReader(filename))) {
            return reader.lines()
                         .map(String::trim) // Remove leading and trailing whitespace.
                         .filter(line -> !line.isBlank() && !line.startsWith("#")) // Exclude empty and comment lines.
                         .count();
        }
    }
}

// Represents an immutable quaternion with coefficients
record Quaternion(double a, double b, double c, double d) {
    // Predefined constants for common quaternions.
    public static final Quaternion ZERO = new Quaternion(0, 0, 0, 0);
    public static final Quaternion I = new Quaternion(0, 1, 0, 0);
    public static final Quaternion J = new Quaternion(0, 0, 1, 0);
    public static final Quaternion K = new Quaternion(0, 0, 0, 1);

    // Constructor ensures coefficients are valid (no NaN values).
    public Quaternion {
        if (Double.isNaN(a) || Double.isNaN(b) || Double.isNaN(c) || Double.isNaN(d)) {
            throw new IllegalArgumentException("Coefficients cannot be NaN");
        }
    }

    // Adds this quaternion to another.
    public Quaternion plus(Quaternion q) {
        return new Quaternion(a + q.a, b + q.b, c + q.c, d + q.d);
    }

    // Multiplies this quaternion by another using quaternion multiplication rules.
    public Quaternion times(Quaternion q) {
        return new Quaternion(
            a * q.a - b * q.b - c * q.c - d * q.d, // Real part
            a * q.b + b * q.a + c * q.d - d * q.c, // i coefficient
            a * q.c - b * q.d + c * q.a + d * q.b, // j coefficient
            a * q.d + b * q.c - c * q.b + d * q.a  // k coefficient
        );
    }

    // Returns the conjugate of this quaternion (negates imaginary parts).
    public Quaternion conjugate() {
        return new Quaternion(a, -b, -c, -d);
    }

    // Returns the list of coefficients as doubles: [a, b, c, d].
    public List<Double> coefficients() {
        return List.of(a, b, c, d);
    }

    // Returns a string representation of this quaternion.
    @Override
    public String toString() {
        var builder = new StringBuilder();
        var units = new String[]{"", "i", "j", "k"}; // Units correspond to a, b, c, d.
        for (int i = 0; i < units.length; i++) {
            double coefficient = coefficients().get(i);
            if (coefficient == 0) continue; // Skip terms with zero coefficients.
            if (builder.length() > 0 && coefficient > 0) builder.append('+'); // Add '+' for positive terms.
            if (Math.abs(coefficient) != 1 || units[i].isEmpty()) builder.append(coefficient); // Include magnitude.
            if (Math.abs(coefficient) == 1 && !units[i].isEmpty()) builder.append(coefficient < 0 ? "-" : "");
            builder.append(units[i]); // Append unit (e.g., i, j, k).
        }
        return builder.isEmpty() ? "0" : builder.toString(); // Default to "0" if no terms exist.
    }
}

// Represents a binary search tree with immutability.
sealed interface BinarySearchTree permits Empty, Node {
    int size();
    BinarySearchTree insert(String data);
    boolean contains(String data);
}

// Represents an empty binary search tree.
final record Empty() implements BinarySearchTree {
    @Override
    public int size() {
        return 0; // No elements in an empty tree.
    }

    @Override
    public BinarySearchTree insert(String data) {
        return new Node(data, this, this); // Create a new node with the given data.
    }

    @Override
    public boolean contains(String data) {
        return false; // Empty tree does not contain any data.
    }

    @Override
    public String toString() {
        return "()"; // Represent empty tree as "()".
    }
}

// Represents a binary search tree node with data and child nodes.
final record Node(String data, BinarySearchTree left, BinarySearchTree right) implements BinarySearchTree {
    @Override
    public int size() {
        return left.size() + right.size() + 1; // Total size is the sum of sizes of left and right subtrees plus one.
    }

    @Override
    public BinarySearchTree insert(String data) {
        if (data.compareTo(this.data) < 0) {
            return new Node(this.data, left.insert(data), right); // Insert into left subtree.
        } else if (data.compareTo(this.data) > 0) {
            return new Node(this.data, left, right.insert(data)); // Insert into right subtree.
        } else {
            return this; // No duplicates; return the same node.
        }
    }

    @Override
    public boolean contains(String data) {
        if (data.compareTo(this.data) < 0) {
            return left.contains(data); // Search in left subtree.
        } else if (data.compareTo(this.data) > 0) {
            return right.contains(data); // Search in right subtree.
        } else {
            return true; // Found the data.
        }
    }

    @Override
    public String toString() {
        return ("(" + left + data + right + ")").replace("()", ""); // Omit empty nodes in representation.
    }
}