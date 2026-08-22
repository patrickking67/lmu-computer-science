# **CMSI 3801: Homework Repository**  
### **By Patrick King**  
### **Fall 2024 – Languages and Automata I**  

---

## **Welcome!**

This repository contains my homework submissions for CMSI 3801, a course focused on programming language concepts, paradigms, and automata. Each assignment highlights different programming paradigms and demonstrates concepts across various languages. Below is an overview of the assignments, languages used, and their respective learning objectives.

---

## **Homework Overview**

### **Homework 1: Scripting**  
- **Languages:** Lua, Python, JavaScript  
- **Status:** ✅ Completed  
- **Highlights:**  
  - Implemented sequence filters with predicates and generators/coroutines.  
  - Created chainable functions to model functional idioms.  
  - Counted meaningful lines in files, ignoring comments and whitespace.  
  - Modeled Quaternions with operations like addition, multiplication, and conjugation.  
  - Focused on closures, asynchronous behavior, and functional paradigms.

---

### **Homework 2: Enterprise Programming**  
- **Languages:** Java, Kotlin, Swift  
- **Status:** ✅ Completed  
- **Highlights:**  
  - Explored object-oriented principles: encapsulation, inheritance, and abstraction.  
  - Developed chainable object interfaces and immutable binary search trees.  
  - Built file parsers and implemented operations on Quaternions as immutable objects.  
  - Compared design philosophies across enterprise-oriented languages.

---

### **Homework 3: Functional Programming**  
- **Languages:** TypeScript, OCaml, Haskell  
- **Status:** ✅ Completed  
- **Highlights:**  
  - Implemented polymorphic functions and infinite sequences of powers.  
  - Built persistent binary search trees using algebraic data types.  
  - Applied type inference, recursion, and functional paradigms.  
  - Demonstrated immutability and type safety in strongly typed functional languages.

---

### **Homework 4: Systems Programming**  
- **Languages:** C, C++, Rust  
- **Status:** ✅ Completed  
- **Highlights:**  
  - Implemented stack data structures with resizable arrays and efficient memory management.  
  - Practiced manual memory management in C and C++.  
  - Leveraged Rust’s ownership model for safety and concurrency.  
  - Focused on low-level systems programming concepts.

---

### **Homework 5: Concurrency**  
- **Languages:** Go  
- **Status:** ✅ Completed  
- **Highlights:**  
  - Created a restaurant simulation using Go’s concurrency model.  
  - Simulated customer and cook interactions with goroutines and channels.  
  - Managed synchronization, timeouts, and state in a lightweight concurrency environment.  

---

## **Running Test Suites**

Each homework includes comprehensive test suites to validate correctness. Below are the commands to run tests in different languages:

### Lua

```
lua exercises_test.lua
```

### Python

```
python3 exercises_test.py
```

### JavaScript

```
npm test
```

### Java

```
javac *.java && java ExercisesTest
```

### Kotlin

```
kotlinc *.kt -include-runtime -d test.jar && java -jar test.jar
```

### Swift

```
swiftc -o main exercises.swift main.swift && ./main
```

### TypeScript

```
npm test
```

### OCaml

```
ocamlc exercises.ml exercises_test.ml && ./a.out
```

### Haskell

```
ghc ExercisesTest.hs && ./ExercisesTest
```

### C

```
gcc string_stack.c string_stack_test.c && ./a.out
```

### C++

```
g++ -std=c++20 stack_test.cpp && ./a.out
```

### Rust

```
cargo test
```

### Go

```
go run restaurant.go
```
