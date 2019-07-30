// [Feature 2] Choose between two different types of quotes. Accordingly, you'll need two different sets of sentences. Example: Wisdom Quotes and Love Quotes.

// ERROR - When user enters wrong number on first question, when they re-enter the amounts are wrong.

// --------------------------------//
// INITIALIZATION
// --------------------------------------- //


// Consider creating an object to store sentence parts as properties.
var loveQuotes = {
  begins: ["Love ", "A loving mother ", "A loving friend "],

  mids: ["is patient ", "is kind ", "does not seek her own ", "is not proud ", "does not look out for herself ", "loves ", "sees no evil ", "helps others ", "works "],

  ends: ["all the time.", "whenever possible.", "wherever she is.", "despite of difficulties.", "regardless of the behaviour of others.", "every day.", "in everyday life."]
}

var wiseQuotes = {
  begins: ["Wisdom ", "A wise friend ", "The wise counsellor ", "A wise teacher "],

  mids: ["is better than ", "is as important as ", "can be compared to ", "is to be cherished as ", "should be sought after as for "],

  ends: ["weapons of war.", "diamonds.", "nuggets of gold.", "the greatest treasure.", "precious jewels."]
}

var userEntry;

var quoteBeg;
var quoteMid;
var quoteEnd;
var fullQuote;
var quotesHTML = "";

var quotes = [];

var amount = 0;


// --------------------------------//
// FUNCTIONS
// --------------------------------------- //

function generateQuote(quoteType){
  // Generate a quote sentence.
  var random = Math.floor(Math.random() * quoteType.begins.length);
  // console.log("1st random number = " + random);
  quoteBeg = quoteType.begins[random];
  // console.log("Beginning = " + quoteBeg);

  random = Math.floor(Math.random() * quoteType.mids.length);
  // console.log("2nd random number = " + random);
  quoteMid = quoteType.mids[random];
  // console.log("Middle = " + quoteMid);

  random = Math.floor(Math.random() * quoteType.ends.length);
  // console.log("3rd random number = " + random);
  quoteEnd = quoteType.ends[random];
  //console.log("End = " + quoteEnd);

  fullQuote = quoteBeg + quoteMid + quoteEnd;
  console.log("Random Quote = " + fullQuote);

  quotes.push(fullQuote);

  console.log(quotes);
  return fullQuote;
}
// ------------------------------- //

function makeHTML(){
  // CONTINUE HERE:
  // if user entered "love", do "loveQuotes" as parameter, otherwise do "wiseQuotes" as parameter

  if (userEntry == 1) {
    // save user entry and use it in this for-loop
    for (var i = 0; i < amount; i++) {
      generateQuote(loveQuotes);

    }

  } else if (userEntry == 2) {
    // save user entry and use it in this for-loop
    for (var i = 0; i < amount; i++) {
      generateQuote(wiseQuotes);

    }

  } else {
    // ERROR!!!
    // Get this whole if condition to repeat if the user does not enter the correct answer.
    // Idea: Put the alert as the first option in the if statement
    alert('You entered an invalid answer to the first question. Please try again and follow the instructions in the question.');
    userEntry = 0;
    amount = 0;
    run();

  }


  // Loop through the quotes
  for (var i = 0; i < quotes.length; i++) {
    // quotes[i] = "<li>" + quotes[i] + "</li>";
    // console.log(quotes[i]);
    quotesHTML = quotesHTML + "<li>" + quotes[i] + "</li> ";
  }
}
// ------------------------------- //

function howMany(){
  // Ask how many quotes to do.
  amount = prompt("How many quotes should I generate for you? | Please enter a number between 1 and 5.");

  // Validate user input
  if ( amount < 1 | amount > 5 ) {
    alert("Error! Please enter a number between 1 and 5.")
    howMany();
  } else {
    console.log(amount);

    return amount;
  }

}
// ------------------------------- //


function printQuotes(){
  for (var i = 0; i < quotes.length; i++) {
    document.getElementById("quotes").innerHTML = quotesHTML;
  }
}
// ------------------------------- //


// ----------------------------- //
// READY TO RUMBLE!
// ---------------------------------- //

function run(){
  // Reset all variables
  quoteBeg = "";
  quoteMid = "";
  quoteEnd = "";
  fullQuote = "";
  quotesHTML = "";

  quotes = [];

  amount = 0;
  userEntry = 0;

  userEntry = prompt("What type of quotes would you like to have generated? | 1 = Love Quotes | 2 = Wisdom Quotes");
  console.log("user entry: " + userEntry);

  // Ask user how many quotes should be generated.
  howMany();

  // Generate specified amount of quotes, adding each quote to the "quotes" array.

  makeHTML();

  printQuotes();
}

run();

// Ask user what type of quote should be generated.
