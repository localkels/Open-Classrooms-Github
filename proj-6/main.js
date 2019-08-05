/*

// ------- STORY ------- //
* You and your friend are out in the forest. Neither of you have had a good day today. You are both feeling a bit down. See what you can find to give to your friend. Perhaps you can cheer him up. After all, it might even help you feel better yourself.

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


// ---------------- Initializing jQuery ---------------- //

$(function() {

  // import Player from "player.js";
  // console.log( "jQuery ready to go!" );

  /////////////// SETTING UP THE GRID ///////////////

  const body = $('body')[0];
  const grid = $('.grid')[0]; // Why can't this work in jQuery?

  // Q: When I put the $ sign, the const saves an array with the button in it, not the button itself. Why is that?
  // Learned about jQuary objects
  const giveButtonP1 = $('#p1-give-btn')[0];
  const complainButtonP1 = $('#p1-complain-btn')[0];

  const giveButtonP2 = $('#p2-give-btn')[0];
  const complainButtonP2 = $('#p2-complain-btn')[0];


  let newDiv;
  let newSpan;

  // Improve: Make these consts
  let gridSize = 10; // Change gridSize to increase the amount of tiles
  let globalScale = 1.6; // global scale should be dependant on html.clientWidth or something
  let tileSize = 20 * globalScale;
  let gridWidth = (gridSize * tileSize) + (4 * gridSize);

  let activePlayer;

  let possibleMoves = [];
  let gridRows = []; // Stores all rows

  const NUM_OBSTACLES = 20;
  const NUM_MOVES = 3;

  // Enumeration data structure
  // Improve: Group them all into one Object
  const BEGIN = 1;
  const EXPLORE = 2;
  const GIVING = 3;
  const END = 4;
  // const RESTART = 5;
  let activeGameState = BEGIN; // Set current state here.

  // Even better enumeration!
  const PlayerFightState = Object.freeze({
      "EMPTY":1,
      "GIVING":2,
      "COMPLAINING":3
    });

  const GiftStrengthAmount = Object.freeze({
        "XS": 40,
        "SM": 42,
        "MD": 44,
        "LG": 46,
        "XL": 48
      });

  // Create global variables for objects.
  let giftPlayer1;
  let giftPlayer2;
  let gift1;
  let gift2;
  let gift3;
  let gift4;

  let player1;
  let player2;

  // Add this to givingModeInfo object
  let isFirstGivingRound = true;


  //////// Arrays for obstacles gifts and players ////////

  // Put objects into arrays and eliminate obstaclesY, giftsX, etc.
  let obstaclesArray = [];
  let obstaclesX = [];
  let obstaclesY = [];

  let giftsX = [];
  let giftsY = [];

  let playersX = [];
  let playersY = [];


  ////////////////   COLORS  ////////////////

  let defaultBackground = 'springgreen';
  let defaultBorder = 'mediumseagreen';
  let obstacleBackground = 'gray';
  let obstacleBorder = '#707B7C';
  let p1Background = '#5DADE2';
  let p1Border = '#2E86C1';
  let p2Background = '#F4D03F';
  let p2Border = '#D4AC0D';

  let highlightedBackground = '#ADFFCD';
  let possibleMovesBackground = '#7cfebc';

  ////////////////   STYLES  ////////////////

  // put these into classes or css

  let defaultStyles = 'background: ' + defaultBackground + '; border: solid ' + defaultBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let possibleMovesStyles = 'background: ' + possibleMovesBackground + '; border: solid ' + defaultBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let player1Styles = 'background: ' + p1Background + '; border: solid' + p1Border + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let player2Styles = 'background: ' + p2Background + '; border: solid ' + p2Border + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let obstacleStyles = 'background: ' + obstacleBackground + '; border: solid ' + obstacleBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  ////////////////   GIFT STYLES  ////////////////

  // put these into classes or css

  let xsGiftStyles = 'background-image: url("/assets/cross.png"); background-color: springgreen; background-size: 30px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let smGiftStyles = 'background-image: url("/assets/sm.png"); background-color: springgreen; background-size: 30px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let mdGiftStyles = 'background-image: url("/assets/md.png"); background-color: springgreen; background-size: 17px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let lgGiftStyles = 'background-image: url("/assets/lg.png"); background-color: springgreen; background-size: 22px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let xlGiftStyles = 'background-image: url("/assets/xl.png"); background-color: springgreen; background-size: 27px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';


  let activeTile; // need to remove but do it later, when you have time, just in case.


//================================== SETTING UP OBJECTS =====================================//
// This is where you can put some explanations about classes / functions.

  class Player {
    constructor(nr, x, y, sadPoints, giftType, giftStrength) {
      this.nr = nr; // positions (x and y)
      this.x = x; // getRandomIndex(true, -1, gridSize, 'player'); // positions (x and y)
      this.y = y; // getRandomIndex(false, this.x, gridSize, 'player');
      this.activeTile = gridRows[this.y].children[this.x];
      this.sadPoints = sadPoints;
      this.giftType = giftType;
      this.giftStrength = giftStrength; // better gifts take away more sadPoints
      this.prevGiftType = 'xs-p1';
      this.prevX = x;
      this.prevY = y;
      this.fightState = PlayerFightState.EMPTY;
      this.drop = function() {
        if (this.prevGiftType === "xs-p1") {
          console.log("dropping giftPlayer1");
          giftPlayer1.stylize();
          // giftPlayer1 = new Gift('sm', GiftStrengthAmount.SM, giftsX[0], giftsY[0]);
          giftPlayer1.x = this.x;
          giftPlayer1.y = this.y;

          // console.log('gift1 hidden = false');
          giftPlayer1.hidden = false;


        } else if (this.prevGiftType === "xs-p2") {
          console.log("dropping giftPlayer2");
          giftPlayer2.stylize();
          // giftPlayer1 = new Gift('sm', GiftStrengthAmount.SM, giftsX[0], giftsY[0]);
          giftPlayer2.x = this.x;
          giftPlayer2.y = this.y;

          // console.log('gift1 hidden = false');
          giftPlayer2.hidden = false;


        } else if (this.prevGiftType === "sm") {
          gift1.x = this.x;
          gift1.y = this.y;

          // console.log('gift1 hidden = false');
          gift1.hidden = false;

        } else if (this.prevGiftType === "md") {
          gift2.x = this.x;
          gift2.y = this.y;

          // console.log('gift2 hidden = false');
          gift2.hidden = false;

        } else if (this.prevGiftType === "lg") {
          gift3.x = this.x;
          gift3.y = this.y;

          // console.log('gift3 hidden = false');
          gift3.hidden = false;

        } else if (this.prevGiftType === "xl") {
          gift4.x = this.x;
          gift4.y = this.y;

          // console.log('gift4 hidden = false');
          gift4.hidden = false;

        }

      };


      this.give = function() {
        this.fightState = PlayerFightState.GIVING;
        // console.log('Player' + this.nr + ' chose to give.');

        checkForRoundChange();

      }

      this.complain = function() {

        this.fightState = PlayerFightState.COMPLAINING;
        // console.log('Player' + this.nr + ' chose to complain.');

        checkForRoundChange();

      }

      this.stylize = function() {

        this.activeTile = gridRows[this.y].children[this.x];
        if (this.nr === 1) {
          this.activeTile.style = player1Styles;

          if (this.giftType === 'xs-1') {

            // Find how to do these background properties all on one line!!!!!!!!!!! (CSS tag 'background')
            // this.activeTile.style.background = 'url("/assets/sm.png") center 30px no-repeat';

            this.activeTile.style.backgroundImage = 'url("/assets/cross.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '30px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';


          } else if (this.giftType === 'sm') {

            // Find how to do these background properties all on one line!!!!!!!!!!! (CSS tag 'background')
            // this.activeTile.style.background = 'url("/assets/sm.png") center 30px no-repeat';

            this.activeTile.style.backgroundImage = 'url("/assets/sm.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '30px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';


          } else if (this.giftType === 'md') {

            this.activeTile.style.backgroundImage = 'url("/assets/md.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '15px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          } else if (this.giftType === 'lg') {

            this.activeTile.style.backgroundImage = 'url("/assets/lg.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '20px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          } else if (this.giftType === 'xl') {

            this.activeTile.style.backgroundImage = 'url("/assets/xl.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '25px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          }

        } else {
          this.activeTile.style = player2Styles;

          if (this.giftType === 'xs-2') {

            // Find how to do these background properties all on one line!!!!!!!!!!! (CSS tag 'background')
            // this.activeTile.style.background = 'url("/assets/sm.png") center 30px no-repeat';

            this.activeTile.style.backgroundImage = 'url("/assets/cross.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '30px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';


          } else if (this.giftType === 'sm') {

            this.activeTile.style.backgroundImage = 'url("/assets/sm.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '30px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          } else if (this.giftType === 'md') {

            this.activeTile.style.backgroundImage = 'url("/assets/md.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '15px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          } else if (this.giftType === 'lg') {

            this.activeTile.style.backgroundImage = 'url("/assets/lg.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '20px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          } else if (this.giftType === 'xl') {

            this.activeTile.style.backgroundImage = 'url("/assets/xl.png")';
            this.activeTile.style.backgroundPosition = 'center';
            this.activeTile.style.backgroundSize = '25px';
            this.activeTile.style.backgroundRepeat = 'no-repeat';

          }
        }
      };
    }
  }


  class Gift {
    constructor(giftType, giftStrength, x, y) {
      this.giftType = giftType; // positions (x and y)
      this.giftStrength = giftStrength;
      this.hidden = false;
      this.x = x; // getRandomIndex(true, -1, gridSize, 'gift'); // positions (x and y)
      this.y = y; // getRandomIndex(false, this.x, gridSize, 'gift');
      // Fix gift array thingy by adding to gift class...
      this.tileX;
      this.activeTile = gridRows[this.y].children[this.x];
      this.stylize = function() {
        if (this.hidden === false) {
          this.activeTile = gridRows[this.y].children[this.x];

          if (this.giftType === 'xs-p1') {
            this.activeTile.style = xsGiftStyles;
            // console.log("About to check if xs-p1 is on a possible move.");
            if (isGiftOnPossibleMove(this.giftType)) {
              giftPlayer1.activeTile.style.backgroundColor = possibleMovesBackground;


            }
          } else if (this.giftType === 'xs-p2') {
            this.activeTile.style = xsGiftStyles;
            console.log("About to check if xs-p2 is on a possible move.");
            if (isGiftOnPossibleMove(this.giftType)) {
              giftPlayer2.activeTile.style.backgroundColor = possibleMovesBackground;


            }
          } else if (this.giftType === 'sm') {
            this.activeTile.style = smGiftStyles;
            if (isGiftOnPossibleMove(this.giftType)) {
              gift1.activeTile.style.backgroundColor = possibleMovesBackground;


            }
          } else if (this.giftType === 'md') {
            this.activeTile.style = mdGiftStyles;
            if (isGiftOnPossibleMove(this.giftType)) {
              gift2.activeTile.style.backgroundColor = possibleMovesBackground;

            }
          } else if (this.giftType === 'lg') {
            this.activeTile.style = lgGiftStyles;
            if (isGiftOnPossibleMove(this.giftType)) {
              gift3.activeTile.style.backgroundColor = possibleMovesBackground;

            }
          } else if (this.giftType === 'xl') {
            this.activeTile.style = xlGiftStyles;
            if (isGiftOnPossibleMove(this.giftType)) {
              gift4.activeTile.style.backgroundColor = possibleMovesBackground;

            }
          }
        }
      }
    }
  }

  // For adding Obstacles with hard-coded positions (for testing purposes only)
  function Obstacle(x, y) {
    this.x = x; // positions (x and y)
    this.y = y;
    this.activeTile = gridRows[this.y].children[this.x];
    this.stylize = function() {
      this.activeTile.style = obstacleStyles;

    }
  }


  let gameInfo = {
    isFirstGameRun: true,
    givingRound: 0
  };



  /////////////////// READY, SET, GO! ///////////////////

  // Change: addGiftToPlayer triggers when player passes through gift

  checkForStateChange(); // add 'newState' parameter



  ////////////////////////////// FUNCTIONS //////////////////////////////

  function didPlayerPassGift(activePlayer) {
    // console.log("Run didPlayerPassGift()");
    // console.log("activePlayer's X: " + activePlayer.x);

    // console.log("checking if player has same X");
    for (var i = 0; i < giftsX.length; i++) {
      if (activePlayer.x === giftsX[i] && activePlayer.prevX === giftsX[i]) {

        //Find out if player did pass over gift
        if ((activePlayer.prevY > giftsY[i] && activePlayer.y < giftsY[i]) || (activePlayer.prevY < giftsY[i] && activePlayer.y > giftsY[i])) {
          // console.log("Player" + activePlayer.nr + " has same X as gift" + (i + 1) + " and has passed over it.");

          // Identify and add correct gift to player.
          if (i + 1 === 1) {
            // giftWithSameX = gift1;
            addGiftToPlayer('sm');
            activePlayer.drop();
            // activePlayer.giftType = 'sm';
          } else if (i + 1 === 2) {
            // giftWithSameX = gift2;
            addGiftToPlayer('md');
            activePlayer.drop();
          } else if (i + 1 === 3) {
            addGiftToPlayer('lg');
            activePlayer.drop();
            // giftWithSameX = gift3;
          } else if (i + 1 === 4) {
            addGiftToPlayer('xl');
            activePlayer.drop();
            // giftWithSameX = gift4;

          }
        }
      }
    }


    for (var i = 0; i < giftsY.length; i++) {
      // console.log("checking if player has same Y");
      if (activePlayer.y === giftsY[i] && activePlayer.prevY === giftsY[i]) {
        // console.log("Player has remained at the same Y!!!!!!");


        //Find out if player did pass over gift
        if ((activePlayer.prevX > giftsX[i] && activePlayer.x < giftsX[i]) || (activePlayer.prevX < giftsX[i] && activePlayer.x > giftsX[i])) {
          // console.log("Player" + activePlayer.nr + " has same Y as gift" + (i + 1) + " and has passed over it.");

          // Identify and add to player the correct gift.
          if (i + 1 === 1) {
            // giftWithSameX = gift1;
            addGiftToPlayer('sm');
            activePlayer.drop();
            // activePlayer.giftType = 'sm';
          } else if (i + 1 === 2) {
            // giftWithSameX = gift2;
            addGiftToPlayer('md');
            activePlayer.drop();
          } else if (i + 1 === 3) {
            addGiftToPlayer('lg');
            activePlayer.drop();
            // giftWithSameX = gift3;
          } else if (i + 1 === 4) {
            addGiftToPlayer('xl');
            activePlayer.drop();
            // giftWithSameX = gift4;

          }
        }
      }
    }




  }
  // player1.x === player2.x || player1.y === player2.y

  // ==================================== FIGHT FUNCTIONS ====================================== //

    function isGiftOnPossibleMove(giftType) {

      if (giftType === 'xs-p1') {
        for (let i = 0; i < possibleMoves.length; i++) {
          let possibleMoveX = possibleMoves[i].getBoundingClientRect().x;
          let possibleMoveY = possibleMoves[i].getBoundingClientRect().y;

          if (giftsX[0] === xCalc(possibleMoveX) && giftsY[0] === yCalc(possibleMoveY)) {

            console.log("xs-p1 is on a possible move.");
            return true;

          }
        }
      } else if (giftType === 'xs-p2') {
        for (let i = 0; i < possibleMoves.length; i++) {
          let possibleMoveX = possibleMoves[i].getBoundingClientRect().x;
          let possibleMoveY = possibleMoves[i].getBoundingClientRect().y;

          if (giftsX[0] === xCalc(possibleMoveX) && giftsY[0] === yCalc(possibleMoveY)) {
            console.log("xs-p2 is on a possible move.");

            return true;

          }
        }
      } else if (giftType === 'sm') {
        for (let i = 0; i < possibleMoves.length; i++) {
          let possibleMoveX = possibleMoves[i].getBoundingClientRect().x;
          let possibleMoveY = possibleMoves[i].getBoundingClientRect().y;

          if (giftsX[0] === xCalc(possibleMoveX) && giftsY[0] === yCalc(possibleMoveY)) {

            return true;

          }
        }
      } else if (giftType === 'md') {
        for (let i = 0; i < possibleMoves.length; i++) {
          let possibleMoveX = possibleMoves[i].getBoundingClientRect().x;
          let possibleMoveY = possibleMoves[i].getBoundingClientRect().y;

          if (giftsX[1] === xCalc(possibleMoveX) && giftsY[1] === yCalc(possibleMoveY)) {

            return true;

          }
        }

      }else if (giftType === 'lg') {
        for (let i = 0; i < possibleMoves.length; i++) {
          let possibleMoveX = possibleMoves[i].getBoundingClientRect().x;
          let possibleMoveY = possibleMoves[i].getBoundingClientRect().y;

          if (giftsX[2] === xCalc(possibleMoveX) && giftsY[2] === yCalc(possibleMoveY)) {

            return true;

          }
        }

      }else if (giftType === 'xl') {
        for (let i = 0; i < possibleMoves.length; i++) {
          let possibleMoveX = possibleMoves[i].getBoundingClientRect().x;
          let possibleMoveY = possibleMoves[i].getBoundingClientRect().y;

          if (giftsX[3] === xCalc(possibleMoveX) && giftsY[3] === yCalc(possibleMoveY)) {

            return true;

          }
        }

      } else {
        return false;
      }


    }

    // function isClickOnPossibleMoves(event) {
    //   for (let i = 0; i < possibleMoves.length; i++) {
    //     if (event.target === possibleMoves[i]) {
    //       return true;
    //     }
    //   }
    //   return false;
    // }

    function checkForRoundChange() {
      // check if both players have a .fightState other than (i.e. greater than) "EMPTY"/1
      // console.log("Checking for round change.");
      // console.log("Player1.fightState:" + player1.fightState);
      // console.log("Player2.fightState:" + player2.fightState);
      if (player1.fightState > 1 && player2.fightState > 1) {
        // console.log("Both players have chosen!");
        roundChange();

        // return true;

      } else {
        // console.log("not running roundChange()");
      }

    }

    function roundChange() {
      // console.log("Running roundChange()");
        gameInfo.givingRound += 1;
        console.log("Round " + gameInfo.givingRound);

        // Based on each player's choice (fightState), run function that subtracts from each player's sadPoints.
        subtractSadPoints();



        player1.fightState = PlayerFightState.EMPTY;
        player2.fightState = PlayerFightState.EMPTY;
        // console.log("Player1's FightState:" + player1.fightState);
        // console.log("Player2's FightState:" + player2.fightState);

        checkForGameEnd()


    }

    function subtractSadPoints() {

      // if player1 chose give
      // then, player2.sadPoints -= player1.giftStrength


      if (player1.fightState === 2 && player2.fightState === 2) {
        // if both chose give
        // console.log("Both chose to give!");

        player1.sadPoints -= player2.giftStrength;
        player2.sadPoints -= player1.giftStrength;

      } else if (player1.fightState === 2 && player2.fightState === 3) {
        // if player1 choses give, but player 2 choses complain
        // console.log("P1 chose give, but P2 chose complain.");
        // console.log("50% of " + player1.giftStrength + " is " + (player1.giftStrength / 2));

        player2.sadPoints -= (player1.giftStrength / 2);


      } else if (player1.fightState === 3 && player2.fightState === 2) {
        // if player2 choses give, but player1 choses complain
        // console.log("P2 chose give, but P1 chose complain.");
        // console.log("50% of " + player2.giftStrength + " is " + (player2.giftStrength / 2));

        player1.sadPoints -= (player2.giftStrength / 2);

      } else if (player1.fightState === 3 && player2.fightState === 3) {
        // console.log("Both chose complain!");

      }

    }

    function checkForGameEnd() {

      if (player1.sadPoints <= 0){

        console.log("GAME OVER! Player 2 wins!");
        activeGameState = END;
        checkForStateChange();

      } else if (player2.sadPoints <= 0) {

        console.log("GAME OVER! Player 1 wins!");
        activeGameState = END;
        checkForStateChange();

      }
    }

  function isFirstGameRun() {

  }


  function checkForStateChange() {
    if (activeGameState === BEGIN) {
      // if (gameInfo.isFirstGameRun) {
      //   console.log("isFirstGameRun: " + gameInfo.isFirstGameRun + " Now running Begin State.");
      //   runBeginState();
      // } else {
      //   console.log("isFirstGameRun: " + gameInfo.isFirstGameRun + " Now running restartGame.");
      //   restartGame();
      // }
      runBeginState();

    } else if (activeGameState === EXPLORE) {
      runExploreState();

    } else if (activeGameState === GIVING) {
      isFirstGivingRound = true;
      runGivingState();

    } else if (activeGameState === END) {
      runEndState();

    } else {
      console.log('ERROR: activeGameState is invalid.');
    }
  }

  function toggleTurns() {
    if (activePlayer == player1) {
      activePlayer = player2;

    } else {
      activePlayer = player1;
    }
  }


  // ========================================================================================= //
  // ===================================== STATE FUNCTIONS =================================== //
  // ========================================================================================= //

  function printOpeningScreen() {
    let openingTextWrapper = document.createElement('div');
    openingTextWrapper.className = 'openingTextWrapper';
    let openingText = document.createElement('p');
    openingText.className = 'openingText';

    openingText.innerHTML = 'You and your friend are out in the forest. Neither of you have had a good day today. You are both feeling a bit down. See what you can find to give to your friend. Perhaps you can cheer him up. After all, it might even help you feel better yourself.';
    let openingButton = document.createElement('button');
    openingButton.innerHTML = "Click to Start!";
    openingButton.className = "openingButton";
    $(openingButton).on("click", runExploreState);

    // openingText.style =
    // newSpan.style = "width:" + tileSize + "px; height:" + tileSize + "px;";
    openingTextWrapper.append(openingText);
    openingTextWrapper.append(openingButton);
    grid.appendChild(openingTextWrapper);

  }
  function restartGame() {
    location.reload();

    // checkForStateChange();
    // runBeginState();

  }


  function runBeginState() {
    console.log('Running Begin State');
    printOpeningScreen();

    console.log('Ending Begin State');


  }

  function runExploreState() {
    console.log('Running Explore State');
    // ===================================== RUN EXPLORE STATE ===================================== //
    // .empty deletes all child elements, .detach could be used to retain them.
    $('.grid').empty();

    $('.grid').addClass('no-line-height');
    // There's some kind of scope conflict that is happening.
    // See if you can create the vars for gifts and players in root scope first, though leave them with no value.



    getObstaclePositions();
    drawGrid();
    getGiftPositions();


    giftPlayer1 = new Gift('xs-p1', GiftStrengthAmount.XS, 0, 0);
    giftPlayer1.hidden = true;
    giftPlayer1.stylize();

    giftPlayer2 = new Gift('xs-p2', GiftStrengthAmount.XS, 0, 0);
    giftPlayer2.hidden = true;
    // giftPlayer2.prevGiftType = 'xs-p2';
    giftPlayer2.stylize();
    // Gifts being created

    gift1 = new Gift('sm', GiftStrengthAmount.SM, giftsX[0], giftsY[0]);
    gift1.stylize();
    gift2 = new Gift('md', GiftStrengthAmount.MD, giftsX[1], giftsY[1]);
    gift2.stylize();
    gift3 = new Gift('lg', GiftStrengthAmount.LG, giftsX[2], giftsY[2]);
    gift3.stylize();
    gift4 = new Gift('xl', GiftStrengthAmount.XL, giftsX[3], giftsY[3]);
    gift4.stylize();

    getPlayerPositions();

    // Object params: Player(x, y, sadPoints, giftType, giftStrength)
    player1 = new Player(1, playersX[0], playersY[0], 100, 'xs-p1', GiftStrengthAmount.XS);
    player1.stylize();
    player2 = new Player(2, playersX[1], playersY[1], 100, 'xs-p2', GiftStrengthAmount.XS);
    player2.prevGiftType = 'xs-p2';
    player2.stylize();

    // jQuery => .on()
    grid.addEventListener('click', targetCheck);
    grid.addEventListener('click', checkForPlayerAdjacent);
    // grid.addEventListener('click', checkForStateChange); // Check for state change after changing state.

    activePlayer = player1;

    calcPossibleMoves();
    refreshGrid();

    updateUi();

    // runExploreState();
    // console.log('Ending Explore State');
  }

  function runGivingState() {
    console.log('Running Giving State');
    refreshGivingGrid();

    // Enables "give" and "complain" buttons
    enableUiButtons(activePlayer);

    console.log("Round " + gameInfo.givingRound);

    // Giving/Complaining needs to take place here.

    isFirstGivingRound = false;
    // console.log('Ending Giving State');
  }


  function runEndState() {
    console.log('Running End State');

    $('.grid').removeClass('no-line-height');
    // add grid.empty
    $('.grid').empty();


    // Now that game has been run once, change isFirstGameRun to false
    // if (gameInfo.isFirstGameRun) {
    //   gameInfo.isFirstGameRun = false;
    //
    // }

    printClosingScreen();

    // Intended to congratulate 'winning' user and encourage them with an inspirational thought.

    console.log('Ending End State');

  }

  // IMPROVE: Merge printOpeningScreen() and printClosingScreen() into one function with a param that determins whether opening or closing screen is printed.
  function printClosingScreen() {
    let closingTextWrapper = document.createElement('div');
    closingTextWrapper.className = 'closingTextWrapper';
    let closingText = document.createElement('p');
    closingText.className = 'closingText';

    closingText.innerHTML = 'You lose!';
    let closingButton = document.createElement('button');
    closingButton.innerHTML = "Click to Restart!";
    closingButton.className = "closingButton";
    $(closingButton).on("click", restartGame);

    // closingText.style =
    // newSpan.style = "width:" + tileSize + "px; height:" + tileSize + "px;";
    closingTextWrapper.append(closingText);
    closingTextWrapper.append(closingButton);
    grid.appendChild(closingTextWrapper);

  }


  // ================================================================================================== //
  // ==================================== CHECKING PLAYER CLICK ====================================== //
  // =================================================================================================== //

  function targetCheck(event) {

    if (xCalc(event.clientX) > gridSize | yCalc(event.clientY) > gridSize) {

    } else if (isClickOnPossibleMoves(event)) {

      activePlayer.prevX = activePlayer.x;
      activePlayer.prevY = activePlayer.y;

      activePlayer.x = xCalc(event.clientX);
      activePlayer.y = yCalc(event.clientY);

      // store clicked tile as "activeTile"
      activePlayer.activeTile = event.target;

      for (let i = 0; i < possibleMoves.length; i++) {
        possibleMoves[i].removeEventListener('mouseover', highlight);
        possibleMoves[i].removeEventListener('mouseleave', dehighlight);
        // Add css changes to keep possible moves highlighted for entire turn. jQuery .addClass() and .removeClass() // javascript element.classList.add("cssClassNameGoesHere") and element.classList.remove("cssClassNameGoesHere")
      }
      possibleMoves = [];
      activePlayer.activeTile.addEventListener('mouseleave', refreshGrid);
      // Add css changes to keep possible moves highlighted for entire turn.

      // checkForPlayerAdjacent();




      // ================================== CHECKING FOR CLICKED GIFT ===================================== //
      // MAKE THIS A SEPARATE FUNCTION!!!

      let clickedGiftType = getGiftAtClick(event, true);

      if (clickedGiftType) {
        // console.log('you checked for a click on a gift');

        // Do something here to have player drop his original gift
        // if (activePlayer.giftType === 'xs-p1') {
        //   addGiftToPlayer(clickedGiftType);
        //   activePlayer.drop();
        //
        // } else {
        //   // swapGifts(clickedGiftType);
        //   addGiftToPlayer(clickedGiftType);
        //   activePlayer.drop();
        // }

        addGiftToPlayer(clickedGiftType);
        activePlayer.drop();


        if (activePlayer === player1) {
          event.target.style.backgroundColor = p2Background;

        } else {
          event.target.style.backgroundColor = p1Background;

        }
      }

      didPlayerPassGift(activePlayer);



      toggleTurns();

      refreshGrid();



    }
  }

  function checkForPlayerAdjacent() {
    // Make helper function to identify whether players are on adjacent tiles. (Players have same x or y + difference between them is 1)

    let playerXDistance = player1.x - player2.x;
    let playerYDistance = player1.y - player2.y;

    // Check if players are on adjacent squares.
    if (
      (playerXDistance === 1 || playerYDistance === 1 || playerXDistance === -1 || playerYDistance === -1) &&
      (player1.x === player2.x || player1.y === player2.y)
    ) {
      activeGameState = GIVING;
      checkForStateChange();

    }
  }

  function getGiftAtClick(event, hideGift) {

    if (false === giftPlayer1.hidden && xCalc(event.clientX) === giftPlayer1.x && yCalc(event.clientY) === giftPlayer1.y) {

      if (true === hideGift) {
        giftPlayer1.hidden = true;

      }
      return giftPlayer1.giftType;

    } else if (false === giftPlayer2.hidden && xCalc(event.clientX) === giftPlayer2.x && yCalc(event.clientY) === giftPlayer2.y) {

      if (true === hideGift) {
        giftPlayer2.hidden = true;

      }
      return giftPlayer2.giftType;

    } else if (false === gift1.hidden && xCalc(event.clientX) === gift1.x && yCalc(event.clientY) === gift1.y) {

      if (true === hideGift) {
        gift1.hidden = true;

      }
      return gift1.giftType;

    } else if (false === gift2.hidden && xCalc(event.clientX) === gift2.x && yCalc(event.clientY) === gift2.y) {
      if (true === hideGift) {
        gift2.hidden = true;

      }

      return gift2.giftType;

    } else if (false === gift3.hidden && xCalc(event.clientX) === gift3.x && yCalc(event.clientY) === gift3.y) {

      if (true === hideGift) {
        gift3.hidden = true;

      }

      return gift3.giftType;

    } else if (false === gift4.hidden && xCalc(event.clientX) === gift4.x && yCalc(event.clientY) === gift4.y) {

      // console.log('you clicked on gift4');

      // console.log('activePlayer: '+ activePlayer + ' | giftType: ' + activePlayer.giftType);

      if (true === hideGift) {
        gift4.hidden = true;

      }

      return gift4.giftType;
    }

    return false;

  }

  function addGiftToPlayer(giftType) {
    // console.log('addGiftToPlayer()');
    // console.log('giftType= ' + giftType);

    // When this is called, it seems activePlayer has already been sure.
    if (activePlayer === player1) {
      player1.prevGiftType = player1.giftType;

      // New giftType added
      player1.giftType = giftType;
      // Adjust player's giftStrength accordingly.
      if (giftType === 'xs-p1') {
        // console.log("You picked up a sm gift");
        player1.giftStrength = GiftStrengthAmount.XS;
        giftPlayer1.hidden = true;

      } else if (giftType === 'sm') {
        // console.log("You picked up a sm gift");
        player1.giftStrength = GiftStrengthAmount.SM;
        gift1.hidden = true;

      } else if (giftType === 'md') {
        // console.log("You picked up an md gift");
        player1.giftStrength = GiftStrengthAmount.MD;
        gift2.hidden = true;

      } else if (giftType === 'lg') {
        // console.log("You picked up a lg gift");
        player1.giftStrength = GiftStrengthAmount.LG;
        gift3.hidden = true;

      } else if (giftType === 'xl') {
        // console.log("You picked up an xl gift");
        player1.giftStrength = GiftStrengthAmount.XL;
        gift4.hidden = true;

      }

    } else {
      player2.prevGiftType = player2.giftType;

      // New giftType added
      player2.giftType = giftType;
      if (giftType === 'xs-p2') {
        // console.log("You picked up a sm gift");
        player2.giftStrength = GiftStrengthAmount.XS;
        giftPlayer2.hidden = true;

      } else if (giftType === 'sm') {
        // console.log("You picked up a sm gift");
        player2.giftStrength = GiftStrengthAmount.SM;
        gift1.hidden = true;

      } else if (giftType === 'md') {
        // console.log("You picked up an md gift");
        player2.giftStrength = GiftStrengthAmount.MD;
        gift2.hidden = true;

      } else if (giftType === 'lg') {
        // console.log("You picked up a lg gift");
        player2.giftStrength = GiftStrengthAmount.LG;
        gift3.hidden = true;

      } else if (giftType === 'xl') {
        // console.log("You picked up an xl gift");
        player2.giftStrength = GiftStrengthAmount.XL;
        gift4.hidden = true;

      }
    }
    // console.log(activePlayer.giftStrength);
  }


  // ======================================================================================================= //
  // ======================================== PLAYER MOVEMENT CALC ========================================= //
  // ======================================================================================================= //

  function calcPossibleMoves() {

    // LEFT MOVES
    for (let i = 1; i <= NUM_MOVES; i++) {
      if (activePlayer.x - i >= 0 && !isPositionBlocked(activePlayer.x - i, activePlayer.y)) {
        possibleMoves.push(gridRows[(activePlayer.y)].children[activePlayer.x - i]);
      } else {
        break;
      }
    }

    // RIGHT MOVES
    for (let i = 1; i <= NUM_MOVES; i++) {
      if (activePlayer.x + i < gridSize && !isPositionBlocked(activePlayer.x + i, activePlayer.y)) {
        possibleMoves.push(gridRows[(activePlayer.y)].children[activePlayer.x + i]);
      } else {
        break;
      }
    }

    // UP MOVES
    for (let i = 1; i <= NUM_MOVES; i++) {
      if (activePlayer.y - i >= 0 && !isPositionBlocked(activePlayer.x, activePlayer.y - i)) {
        possibleMoves.push(gridRows[(activePlayer.y - i)].children[activePlayer.x]);
      } else {
        break;
      }
    }

    // DOWN MOVES
    for (let i = 1; i <= NUM_MOVES; i++) {
      if (activePlayer.y + i < gridSize && !isPositionBlocked(activePlayer.x, activePlayer.y + i)) {
        possibleMoves.push(gridRows[(activePlayer.y + i)].children[activePlayer.x]);
      } else {
        break;
      }
    }

    for (let i = 0; i < possibleMoves.length; i++) {
      possibleMoves[i].addEventListener('mouseover', highlight);
      possibleMoves[i].addEventListener('mouseleave', dehighlight);
    }
  }

  function isClickOnPossibleMoves(event) {
    for (let i = 0; i < possibleMoves.length; i++) {
      if (event.target === possibleMoves[i]) {
        return true;
      }
    }
    return false;
  }


  function isInactivePlayer(xIndex, yIndex) {
    if (activePlayer === player1) {
      if (xIndex === player2.x &&
        yIndex === player2.y) {
        return true;
      }
    } else {
      if (xIndex === player1.x &&
        yIndex === player1.y) {
        return true;

      }
    }
    return false;
  }


  function isPositionBlocked(xIndex, yIndex) {
    if (isInactivePlayer(xIndex, yIndex)) {
      return true;
    }

    for (let i = 0; i < obstaclesArray.length; i++) {

      if (xIndex === obstaclesArray[i].x && (yIndex === obstaclesArray[i].y)) {
        return true;
      }
    }

    return false;
  }


  function xCalc(clickX) {

    clickX = clickX - grid.getBoundingClientRect().left;

    let rowIndex = Math.floor((clickX / gridWidth) * gridSize);

    return rowIndex;
  }

  function yCalc(clickY) {

    clickY = clickY - grid.getBoundingClientRect().top;

    let gridWidth = (gridSize * tileSize) + (4 * gridSize);

    let childIndex = Math.floor((clickY / gridWidth) * gridSize);

    return childIndex;
  }


  // ======================================================================================================= //
  // ========================================= HIGHLIGHTING & UI =========================================== //
  // ======================================================================================================= //

  function generateTooltipText(isHoverOnGive) {
    // console.log('running generateTooltipText()');

    // See if you can put what will happen to their sadPoints if they choose the particular button.
    // See if I can apply css styles to tooltip to align text left.

    let tooltipText;

    // Implement template literals on all of these!
    // Try optimizing this area with local variables => replace giftStrength and variable names with variables.
    // Try never to repeat code.

    if (activePlayer === player1 && isHoverOnGive) {

      tooltipText = `<strong><em>- ${player1.giftStrength} SP</em></strong> for Player2 (or  -${player1.giftStrength / 2} SP if they complain).`

    } else if (activePlayer === player1 && !isHoverOnGive) {

      tooltipText = "If Player2 gives, you will only lose <strong><em>" + (player2.giftStrength / 2) + " SP</em></strong> (not " + player2.giftStrength + ")."

    } else if (activePlayer === player2 && isHoverOnGive) {

      tooltipText = "<strong><em>-" + player2.giftStrength + " SP</em></strong> for Player1."

    } else if (activePlayer === player2 && !isHoverOnGive) {

      tooltipText = "If Player1 gives, you will only lose <strong><em>" + (player1.giftStrength / 2) + " SP</em></strong> (not " + player1.giftStrength + ")."

    }

    // console.log(tooltipText);
    return tooltipText;


  }

  function updateTooltips(activePlayer) {
    // console.log("Run updateTooltips()");




  }

  function enableUiButtons(activePlayer) {
    // --------- Adding tooltips with tippy.js ------- //


    tippy.setDefaults({
      placement: "bottom-start",
      size: "small",
      maxWidth: 105,
      arrow: true,
      animation: 'fade',
      duration: 100,
      interactiveBorder: 1,
      showOnInit: true,
      theme: "light",

    })


    if (activePlayer === player1) {
      tippy('#p1-give-btn', {
        content: generateTooltipText(true)
      });

      tippy('#p1-complain-btn', {
        content: generateTooltipText(false)
      });

    } else {
      tippy('#p2-give-btn', {
        content: generateTooltipText(true)
      });
      tippy('#p2-complain-btn', {
        content: generateTooltipText(false)
      });

    }


    // updateTooltips(activePlayer);



    // ====================== ENABLING BUTTONS ===================== //

    if (activePlayer === player1) {
      giveButtonP1.disabled = false;
      complainButtonP1.disabled = false;

      giveButtonP2.disabled = true;
      complainButtonP2.disabled = true;



      if (false === isFirstGivingRound) {
        giveButtonP2.removeEventListener('click', playerGive);
        complainButtonP2.removeEventListener('click', playerComplain);
      }

      giveButtonP1.addEventListener('click', playerGive);
      complainButtonP1.addEventListener('click', playerComplain);

      // addEventListener('mouseover', highlight);

    } else {
      giveButtonP2.disabled = false;
      complainButtonP2.disabled = false;

      giveButtonP1.disabled = true;
      complainButtonP1.disabled = true;

      if (false === isFirstGivingRound) {
      giveButtonP1.removeEventListener('click', playerGive);
      complainButtonP1.removeEventListener('click', playerComplain);
    }

      giveButtonP2.addEventListener('click', playerGive);
      complainButtonP2.addEventListener('click', playerComplain);
    }

  }

  function givingToggleAndUpdateUi() {

    toggleTurns();
    enableUiButtons(activePlayer);
    updateUi();

  }

  function playerGive() {
    activePlayer.give();

    givingToggleAndUpdateUi();

  }

  function playerComplain() {
    activePlayer.complain();

    givingToggleAndUpdateUi();

  }


  function highlight(event) {
    event.target.style.backgroundColor = highlightedBackground;
  }


  function dehighlight(event) {
    event.target.style.backgroundColor = possibleMovesBackground;
  }

  // ===================================================================================================== //
  // ============================================ POSITIONING ============================================ //
  // ===================================================================================================== //

  function getObstaclePositions() {

    // Check past obstacle positions to prevent obstacles being drawn on top of each other. See player position checks.

    for (let i = 0; i < NUM_OBSTACLES; i++) {
      obstaclesX.push(getRandomX())
      obstaclesY.push(getRandomY())
    }

  }

  function updateUi() {

    // SAD POINTS
    $("#hp-p1").html(`${player1.sadPoints} <sup> sad points</sup>`);
    $("#hp-p2").html(`${player2.sadPoints} <sup> sad points</sup>`);
    //
    // // GIFT TYPE
    // document.getElementById("gift-type-p1").innerHTML = player1.giftType + " gift";
    // document.getElementById("gift-type-p2").innerHTML = player2.giftType + " gift";


    if (player1.giftType === 'xs-p1') {
      // GIFT TYPE
      $("#gift-type-p1").html("Extra small<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p1").html('<img src="/assets/cross.png">');

    } else if (player1.giftType === 'sm') {
      // GIFT TYPE
      $("#gift-type-p1").html("Small<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p1").html('<img src="/assets/sm.png">');

    } else if (player1.giftType === 'md') {
      // GIFT TYPE
      $("#gift-type-p1").html("Medium<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p1").html('<img src="/assets/md.png">');

    } else if (player1.giftType === 'lg') {
      // GIFT TYPE
      $("#gift-type-p1").html("Large<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p1").html('<img src="/assets/lg.png">');

    } else if (player1.giftType === 'xl') {
      // GIFT TYPE
      $("#gift-type-p1").html("Extra large<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p1").html('<img src="/assets/xl.png">');

    }


    if (player2.giftType === 'xs-p2') {
      // GIFT TYPE
      $("#gift-type-p2").html("Extra small<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p2").html('<img src="/assets/cross.png">');

    } else if (player2.giftType === 'sm') {
      // GIFT TYPE
      $("#gift-type-p2").html("Small<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p2").html('<img src="/assets/sm.png">');

    } else if (player2.giftType === 'md') {
      // GIFT TYPE
      $("#gift-type-p2").html("Medium<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p2").html('<img src="/assets/md.png">');

    } else if (player2.giftType === 'lg') {
      // GIFT TYPE
      $("#gift-type-p2").html("Large<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p2").html('<img src="/assets/lg.png">');

    } else if (player2.giftType === 'xl') {
      // GIFT TYPE
      $("#gift-type-p2").html("Extra large<sup> gift</sup>");

      // GIFT IMAGE
      $("#gift-img-p2").html('<img src="/assets/xl.png">');

    }


    // LOOK FOR WAYS TO DO THIS ON ONE LINE ('css background')
    // to make this to jQuery, I'll have to replace the .style method with .css or .addClass or .removeClass
    if (activePlayer === player1) {
      $("#p2-box").css("borderTop", "4px solid rgba(0,0,0,0.3)");
      $("#p2-box").css("borderBottom", "4px solid rgba(0,0,0,0.3)");
      $("#p2-box").css("borderRight", "4px solid rgba(0,0,0,0.3)");

      $("#p1-box").css("borderTop", "4px solid dodgerblue");
      $("#p1-box").css("borderBottom", "4px solid dodgerblue");
      $("#p1-box").css("borderLeft", "4px solid dodgerblue");


    } else {
      $("#p1-box").css("borderTop", "4px solid rgba(0,0,0,0.3)");
      $("#p1-box").css("borderBottom", "4px solid rgba(0,0,0,0.3)");
      $("#p1-box").css("borderLeft", "4px solid rgba(0,0,0,0.3)");

      $("#p2-box").css("borderTop", "4px solid gold");
      $("#p2-box").css("borderBottom", "4px solid gold");
      $("#p2-box").css("borderRight", "4px solid gold");

    }
  }



  function getGiftPositions() {

    // for (let i = 0; i < obstaclesX.length; i++) {
    //   obstaclesArray.push(new Obstacle(obstaclesX[i],obstaclesY[i]));
    //   obstaclesArray[i].stylize();
    // }
    let randomGiftX;
    let randomGiftY;

    for (let i = 0; i < 4; i++) {

      randomGiftX = getRandomX();
      randomGiftY = getRandomY();

      for (let j = 0; j < obstaclesX.length; j++) {
        if (randomGiftX === obstaclesX[j] && randomGiftY === obstaclesY[j]) {
          // randomGiftX = getRandomX();
          // randomGiftY = getRandomY();
          getGiftPositions();
          return;
        }
      }
      // Add these to the Gift class!!!
      giftsX.push(randomGiftX);
      giftsY.push(randomGiftY);

    }

  }

  function getPlayerPositions() {

    // for (let i = 0; i < obstaclesX.length; i++) {
    //   obstaclesArray.push(new Obstacle(obstaclesX[i],obstaclesY[i]));
    //   obstaclesArray[i].stylize();
    // }
    let randomPlayerX = getRandomX();
    let randomPlayerY = getRandomY();

    for (let i = 0; i < 2; i++) {

      randomPlayerX = getRandomX();
      // console.log('randomPlayerX: '+randomPlayerX);
      randomPlayerY = getRandomY();
      // console.log('randomPlayerY: '+randomPlayerY);

      for (let j = 0; j < obstaclesX.length; j++) {
        if (randomPlayerX === obstaclesX[j] && randomPlayerY === obstaclesY[j]) {
          getPlayerPositions();
          return;
        }
      }

      if (randomPlayerX === giftPlayer1.x && randomPlayerY === giftPlayer1.y) {
        getPlayerPositions();
        return;

      }

      if (randomPlayerX === giftPlayer2.x && randomPlayerY === giftPlayer2.y) {
        getPlayerPositions();
        return;

      }

      if (randomPlayerX === gift1.x && randomPlayerY === gift1.y) {
        getPlayerPositions();
        return;

      }

      if (randomPlayerX === gift2.x && randomPlayerY === gift2.y) {
        getPlayerPositions();
        return;

      }

      if (randomPlayerX === gift3.x && randomPlayerY === gift3.y) {
        getPlayerPositions();
        return;

      }

      if (randomPlayerX === gift4.x && randomPlayerY === gift4.y) {
        getPlayerPositions();
        return;

      }

      playersX.push(randomPlayerX);
      playersY.push(randomPlayerY);

    }

  }

  function getRandomX() {

    let randomIndex = Math.floor(Math.random() * gridSize);
    return randomIndex;

  }

  function getRandomY() {

    let randomIndex = Math.floor(Math.random() * gridSize);
    return randomIndex;

  }

  // ======================================================================================================= //
  // ========================================== GRID GENERATION ============================================ //
  // ======================================================================================================= //

  function drawGrid() {


    // Create gridsize amount of gridRows
    for (let i = 0; i < gridSize; i++) {
      newDiv = document.createElement('div');
      newDiv.className = 'row';
      gridRows.push(newDiv); // Add each new div to array or object of the Grid
      grid.appendChild(newDiv);
    }
    // Create gridSize amount of spans inside of each of the gridRow divs
    for (let i = 0; i < gridRows.length; i++) {
      for (let t = 0; t < gridRows.length; t++) {
        newSpan = document.createElement('span');
        newSpan.className = 'tile';
        // newSpan.css("width", tileSize + "px");
        // newSpan.css("heigth", tileSize + "px");
        newSpan.style = "width:" + tileSize + "px; height:" + tileSize + "px;";
        gridRows[t].appendChild(newSpan);
      }
    }

    // Draw obstacles
    for (let i = 0; i < obstaclesX.length; i++) {
      obstaclesArray.push(new Obstacle(obstaclesX[i], obstaclesY[i]));
      obstaclesArray[i].stylize();
    }
  }

  function refreshGrid() {

    eraseGrid();

    drawGrid();

    calcPossibleMoves();

    for (let i = 0; i < possibleMoves.length; i++) {
      possibleMoves[i].style = possibleMovesStyles;
    }

    // Add gift, player and obstacle styles
    giftPlayer1.stylize();
    giftPlayer2.stylize();
    gift1.stylize();
    gift2.stylize();
    gift3.stylize();
    gift4.stylize();

    player1.stylize();
    player2.stylize();

    for (let i = 0; i < obstaclesArray.length; i++) {
      obstaclesArray[i].activeTile = gridRows[obstaclesArray[i].y].children[obstaclesArray[i].x];
      obstaclesArray[i].activeTile.style = obstacleStyles;
    }

    updateUi();

  }

  function refreshGivingGrid() {

    eraseGrid();

    drawGrid();

    // Add gift, player and obstacle styles
    giftPlayer1.stylize();
    giftPlayer2.stylize();
    gift1.stylize();
    gift2.stylize();
    gift3.stylize();
    gift4.stylize();


    // Change styling of ALL other tiles, except for players
    for (let i = 0; i < gridRows.length; i++) {

      for (let j = 0; j < gridRows[i].children.length; j++) {
        gridRows[i].children[j].style = obstacleStyles;
      }
      // gridRows[i].remove();

    }

    player1.stylize();
    player2.stylize();

    for (let i = 0; i < obstaclesArray.length; i++) {
      obstaclesArray[i].activeTile = gridRows[obstaclesArray[i].y].children[obstaclesArray[i].x];
      obstaclesArray[i].activeTile.style = obstacleStyles;
    }

    updateUi();

  }

  function eraseGrid() {

    activePlayer.activeTile.removeEventListener('mouseleave', refreshGrid);

    // Consider replacing for loop with ES6 for...of loop
    for (let i = 0; i < gridRows.length; i++) {

      for (let j = 0; j < gridRows[i].children.length; j++) {
        gridRows[i].children[j].remove();
      }
      gridRows[i].remove();

    }
    gridRows = [];
  }

});
