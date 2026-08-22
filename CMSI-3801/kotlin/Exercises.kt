import java.io.BufferedReader
import java.io.FileReader
import java.io.IOException

// Calculate the fewest coins to represent a given amount.
fun change(amount: Long): Map<Int, Long> {
    require(amount >= 0) { "Amount cannot be negative" } // Validation for non-negative amounts.
    
    val counts = mutableMapOf<Int, Long>()
    var remaining = amount

    // Iterate through denominations and compute coin counts.
    for (denomination in listOf(25, 10, 5, 1)) {
        counts[denomination] = remaining / denomination
        remaining %= denomination
    }
    return counts
}

// Find the first string in the list that satisfies the predicate and return it lowercased.
fun firstThenLowerCase(strings: List<String>, predicate: (String) -> Boolean): String? {
    return strings.firstOrNull(predicate)?.lowercase()
}

// Represents a builder for creating concatenated phrases.
data class Sayer(val phrase: String) {
    // Add a word to the current phrase and return a new Sayer.
    fun and(word: String): Sayer = Sayer("$phrase $word")
}

// Initialize a Sayer with an optional starting word.
fun say(word: String = ""): Sayer = Sayer(word)

// Count non-blank, non-comment lines in a file.
@Throws(IOException::class)
fun meaningfulLineCount(filename: String): Long {
    BufferedReader(FileReader(filename)).useLines { lines ->
        return lines.map(String::trim) // Remove leading/trailing spaces.
            .filter { it.isNotBlank() && !it.startsWith("#") } // Exclude empty and comment lines.
            .count()
            .toLong()
    }
}

// Immutable representation of a quaternion.
data class Quaternion(val a: Double, val b: Double, val c: Double, val d: Double) {

    companion object {
        // Common quaternion constants.
        val ZERO = Quaternion(0.0, 0.0, 0.0, 0.0)
        val I = Quaternion(0.0, 1.0, 0.0, 0.0)
        val J = Quaternion(0.0, 0.0, 1.0, 0.0)
        val K = Quaternion(0.0, 0.0, 0.0, 1.0)
    }

    init {
        require(!(a.isNaN() || b.isNaN() || c.isNaN() || d.isNaN())) {
            "Coefficients cannot be NaN"
        }
    }

    // Add two quaternions.
    operator fun plus(q: Quaternion) = Quaternion(a + q.a, b + q.b, c + q.c, d + q.d)

    // Multiply two quaternions.
    operator fun times(q: Quaternion) = Quaternion(
        a * q.a - b * q.b - c * q.c - d * q.d,
        a * q.b + b * q.a + c * q.d - d * q.c,
        a * q.c - b * q.d + c * q.a + d * q.b,
        a * q.d + b * q.c - c * q.b + d * q.a
    )

    // Compute the conjugate of the quaternion.
    fun conjugate() = Quaternion(a, -b, -c, -d)

    // Return the quaternion coefficients as a list.
    fun coefficients() = listOf(a, b, c, d)

    // Generate a string representation of the quaternion.
    override fun toString(): String {
        val units = listOf("", "i", "j", "k")
        return coefficients().zip(units).fold(StringBuilder()) { sb, (c, unit) ->
            if (c != 0.0) {
                sb.append(if (c < 0) "-" else if (sb.isNotEmpty()) "+" else "")
                if (Math.abs(c) != 1.0 || unit.isEmpty()) sb.append(Math.abs(c))
                sb.append(unit)
            }
            sb
        }.toString().ifEmpty { "0" }
    }
}

// Sealed interface representing a binary search tree.
sealed interface BinarySearchTree {
    fun size(): Int
    fun insert(data: String): BinarySearchTree
    fun contains(data: String): Boolean

    // Represents an empty tree.
    object Empty : BinarySearchTree {
        override fun size() = 0
        override fun insert(data: String) = Node(data, this, this)
        override fun contains(data: String) = false
        override fun toString() = "()"
    }

    // Represents a tree node with data and child nodes.
    data class Node(
        private val data: String,
        private val left: BinarySearchTree,
        private val right: BinarySearchTree
    ) : BinarySearchTree {
        override fun size() = 1 + left.size() + right.size()

        // Insert data while maintaining tree order.
        override fun insert(data: String): BinarySearchTree {
            return when {
                data < this.data -> Node(this.data, left.insert(data), right)
                data > this.data -> Node(this.data, left, right.insert(data))
                else -> this // No duplicates.
            }
        }

        // Check if the tree contains the specified data.
        override fun contains(data: String): Boolean {
            return when {
                data < this.data -> left.contains(data)
                data > this.data -> right.contains(data)
                else -> true
            }
        }

        // Generate a string representation of the tree.
        override fun toString(): String {
            return ("($left$data$right)").replace("()", "")
        }
    }
}
