#include "string_stack.h"
#include <stdlib.h>
#include <string.h>

// Represents a dynamically resizable stack of strings.
struct _Stack {
    char** data;       // Array of pointers to stack elements.
    int capacity;      // Maximum number of elements the stack can hold.
    int count;         // Current number of elements in the stack.
};

// Creates a new stack with an initial capacity.
stack_response create() {
    stack_response response;

    // Allocate memory for the stack structure.
    stack my_stack = (stack)malloc(sizeof(struct _Stack));
    if (!my_stack) { // Check if memory allocation failed.
        response.code = out_of_memory;
        response.stack = NULL;
        return response;
    }

    my_stack->capacity = 16; // Initialize with default capacity.
    my_stack->count = 0;     // Initialize element count to zero.

    // Allocate memory for the array of string pointers.
    my_stack->data = (char**)malloc(my_stack->capacity * sizeof(char*));
    if (!my_stack->data) { // Check if allocation for data failed.
        free(my_stack); // Clean up already allocated memory.
        response.code = out_of_memory;
        response.stack = NULL;
        return response;
    }

    response.code = success;
    response.stack = my_stack;
    return response;
}

// Destroys the stack and releases all allocated memory.
void destroy(stack* s) {
    if (!s || !*s) return; // Do nothing if the stack is already NULL.

    // Free each string in the stack.
    for (int i = 0; i < (*s)->count; i++) {
        free((*s)->data[i]);
    }

    // Free the array of string pointers and the stack structure.
    free((*s)->data);
    free(*s);
    *s = NULL; // Nullify the pointer to avoid dangling references.
}

// Returns the current number of elements in the stack.
int size(const stack s) {
    return s->count;
}

// Checks if the stack is empty.
bool is_empty(const stack s) {
    return s->count == 0;
}

// Checks if the stack is full (reached maximum allowable capacity).
bool is_full(const stack s) {
    return s->capacity == MAX_CAPACITY && s->count == s->capacity;
}

// Pushes a new string onto the stack, resizing if necessary.
response_code push(stack s, char* item) {
    if (!s || strlen(item) >= MAX_ELEMENT_BYTE_SIZE) {
        return stack_element_too_large; // Reject items that exceed size limits.
    }

    // Resize the stack if it is at full capacity.
    if (s->count == s->capacity) {
        if (s->capacity >= MAX_CAPACITY) {
            return stack_full; // Prevent resizing beyond the maximum capacity.
        }

        int new_capacity = s->capacity * 2; // Double the current capacity.
        if (new_capacity > MAX_CAPACITY) {
            new_capacity = MAX_CAPACITY; // Cap at the maximum capacity.
        }

        // Attempt to reallocate memory for the expanded array.
        char** new_data = (char**)realloc(s->data, new_capacity * sizeof(char*));
        if (!new_data) {
            return out_of_memory; // Handle memory allocation failure.
        }

        s->data = new_data;    // Update the pointer to the new array.
        s->capacity = new_capacity; // Update the stack's capacity.
    }

    // Duplicate the input string and add it to the stack.
    s->data[s->count] = strdup(item);
    if (!s->data[s->count]) {
        return out_of_memory; // Handle memory allocation failure for the string.
    }

    s->count++; // Increment the stack count.
    return success;
}

// Removes and returns the top string from the stack.
string_response pop(stack s) {
    string_response response;
    if (!s || s->count == 0) { // Check if the stack is empty.
        response.code = stack_empty;
        response.string = NULL;
        return response;
    }

    response.code = success;
    response.string = s->data[--s->count]; // Retrieve the top string.

    // Shrink the stack's capacity if less than 25% is utilized, with a minimum size of 16.
    if (s->count < s->capacity / 4 && s->capacity > 16) {
        int new_capacity = s->capacity / 2;
        if (new_capacity < 16) {
            new_capacity = 16; // Enforce the minimum capacity.
        }

        // Attempt to reallocate memory for the reduced array size.
        char** new_data = (char**)realloc(s->data, new_capacity * sizeof(char*));
        if (new_data) { // Only update if reallocation succeeds.
            s->data = new_data;
            s->capacity = new_capacity;
        }
    }

    return response; // Return the popped string and status code.
}