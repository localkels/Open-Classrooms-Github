##[Notes] Scope & Closures

* #####You should always declare local variables, not global variables.
  This is because there is a chance of naming collisions, where two or more variables are named the same.

* In JavaScript, there are two kinds of local scope:

  * function scope 
  * block scope

* Functions, when declared with a function declaration, are always hoisted to the top of the current scope. 

  * When declared with a function expression, functions are not hoisted to the top of the current scope.
  * Always declare your functions before you use them.

* Functions do not have access to each other's scopes when you define them separately, even though one function may be used in another.

* ##### Lexical Scoping

  When a function is defined in another function, the inner function has access to the outer function's variables. This behavior is called **lexical scoping**.

* To visualize how scopes work, imagine one-way glass. **You can see the outside, but people from the outside cannot see you**.

* Whenever you create a function within another function, you have created a closure. The inner function is the closure. This closure is usually returned so you can use the outer function's variables at a later time.

* Closure: **A function that is within another function.**

* Closures are usually used for two things:

  1. To control side effects
  2. To create private variables