#include <stdexcept>
#include <string>
#include <memory>
using namespace std;

#define MAX_CAPACITY 32768
#define INITIAL_CAPACITY 16

template <typename T>
class Stack {
  // Prohibit copying and assignment
  Stack(const Stack&) = delete;
  Stack& operator=(const Stack&) = delete;

public:
  Stack() : capacity(INITIAL_CAPACITY), top(0) {
    elements = std::unique_ptr<T[]>(new T[capacity]); // initialize storage
  }

  int size() const {
    return top; // number of elements currently in stack
  }

  bool is_empty() const {
    return top == 0; // stack is empty if no elements were added
  }

  bool is_full() const {
    return capacity == MAX_CAPACITY && top == capacity;
  }

  void push(const T& item) {
    if (is_full()) {
      throw std::overflow_error("Stack has reached maximum capacity");
    }
    if (top == capacity) {
      reallocate(capacity * 2); // expand capacity
    }
    elements[top++] = item; // add item to top and move index up
  }

  T pop() {
    if (is_empty()) {
      throw std::underflow_error("cannot pop from empty stack");
    }
    T item = elements[--top]; // retrieve top item and reduce count

    // shrink array if usage falls below 25%, but not below minimum
    if (top < capacity / 4 && capacity > INITIAL_CAPACITY) {
      reallocate(capacity / 2);
    }

    return item;
  }

private:
  std::unique_ptr<T[]> elements; // dynamic array for stack storage
  int capacity;                  // current maximum capacity of stack
  int top;                       // index of next free slot

  // reallocates stack to a new capacity
  void reallocate(int new_capacity) {
    if (new_capacity > MAX_CAPACITY || new_capacity < INITIAL_CAPACITY) {
      return; // prevent reallocating outside acceptable bounds
    }
    std::unique_ptr<T[]> new_elements(new T[new_capacity]); // new array
    std::copy(elements.get(), elements.get() + top, new_elements.get()); // copy old data
    elements = std::move(new_elements); // transfer ownership
    capacity = new_capacity; // update the stack's capacity
  }
};