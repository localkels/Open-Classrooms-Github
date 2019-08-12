/*
// --- Focus on this --- //

* End screen
giving mode pop-up (with Round: 1!)
* correct obstacle check!

* If time allows, add gift image to top of opening screen and ending screen

// --- For Further Study -- //

* Look up "Git in Atom"
* Also look up template literals
* Look into altering the css with -> .css and .addClass, .removeClass

// ------- Possible Updates ------- //

* opening screen, giving mode screen (with Round: 1!) and end screen (Work on begin and end gamestates!!!)

* Make a list of ways to optimize and of bugs, then prioritize and fix most important ones.
  * Put styles directly into css and activate using jQuery .css, .addClass and .removeClass
  * Rearrange functions in a logical order (if you can't put code blocks in different files)

// ------ Bug Reports ------ //

Priority: How serious is it? How likely is it to happen?

* Urgent: Original gifts (1-4) are only being pushed to giftsX[] and giftsY[] once. Those need to be updated whenever a gift's position (x or y) changes.

* When player picks up "X" update UI!

This may cause problems otherwise with checking for possible moves and such.

* It is possible for both players to spawn on the same tile, or on adjacent tiles!
* If two gifts are on adjacent tiles, it is possible for player to click on one gift and pick up the other, because of didPlayerPassGift();

*/