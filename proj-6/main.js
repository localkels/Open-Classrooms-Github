// ------- STORY ------- //
// Two friends are out in the field one day. Neither of them had a good day today. They're both feeling a bit down. See what you can find to cheer your friend up. After all, it might even help you feel better yourself.

// --- Focus on this --- //

// Have possible moves remain highlighted for activePlayer.
// BUG: pos. moves with gift blocks not highlighting

// --- For Further Study -- //

// Look up "Git in Atom"
// Also look up template literals
// Look into altering the css with -> .css and .addClass, .removeClass

// ------- Possible Updates ------- //

// Do a simple check to see if players are in the top half, or bottom... or left or right. Then put explanation box where they are not.
//DO :hover !!! when user hovers over give or complain - explain what the button will do. ex. "-10 sad points to player1 (aka other player)")
// If time allows, implement an actual default weapon that is dropped when they pick up their first weapon.
// Have all possible moves be obvious even before hover.
// Make code modular (in other .js files) -> see line 30

// ------ Bug Reports ------ //
// It is possible for both players to spawn on the same exact tile!


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

  const NUM_OBSTACLES = 0;
  const NUM_MOVES = 3;

  // Enumeration data structure
  // Improve: Group them all into one Object
  const BEGIN = 1;
  const EXPLORE = 2;
  const GIVING = 3;
  const END = 4;
  let activeGameState = EXPLORE; // Set current state here.


  const PlayerFightState = Object.freeze({
      "EMPTY":1,
      "GIVING":2,
      "COMPLAINING":3
    });

    const GiftStrengthAmount = Object.freeze({
        "XS": 20,
        "SM": 22,
        "MD": 24,
        "LG": 26,
        "XL": 28
      });

  // Create global variables for objects.
  let gift1;
  let gift2;
  let gift3;
  let gift4;

  let player1;
  let player2;

  let isFirstGivingRound = true;


  //////// Arrays for obstacles gifts and players ////////

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

  let defaultStyles = 'background: ' + defaultBackground + '; border: solid ' + defaultBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let possibleMovesStyles = 'background: ' + possibleMovesBackground + '; border: solid ' + defaultBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let player1Styles = 'background: ' + p1Background + '; border: solid' + p1Border + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let player2Styles = 'background: ' + p2Background + '; border: solid ' + p2Border + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let obstacleStyles = 'background: ' + obstacleBackground + '; border: solid ' + obstacleBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  ////////////////   GIFT STYLES  ////////////////

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
      this.prevGiftType = 'xs';
      this.prevX = x;
      this.prevY = y;
      this.fightState = PlayerFightState.EMPTY;
      this.drop = function() {
        if (this.prevGiftType === "xs") {

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

      // Note: Both players must choose move before points are subtracted.
      // Store each player's state (whether they are giving or complaining)
      // After both have chosen a state (clears after each round)
      // Check states after each turn. Once both players have a state (other than clear), subtract points and move to next round.
      // Make state object that has 3 different "options"

      // Rebeccah's code sample (Enumeration Data Type (look into it)!!!):
      // const PlayerFightState = Object.freeze({"EMPTY":1, "GIVING":2, "COMPLAINING":3});
      // Consider Enum-ing game states as well.


      this.give = function() {
        this.fightState = PlayerFightState.GIVING;
        // console.log('Player' + this.nr + ' chose to give.');

        checkForRoundChange();




        // Subtract sadPoints to other player and this player.

      }

      this.complain = function() {

        this.fightState = PlayerFightState.COMPLAINING;
        // console.log('Player' + this.nr + ' chose to complain.');

        checkForRoundChange();

      }

      this.receiveGift = function(toBeSubtracted) {
        this.sadPoints -= toBeSubtracted;

      }

      this.stylize = function() {

        this.activeTile = gridRows[this.y].children[this.x];
        if (this.nr === 1) {
          this.activeTile.style = player1Styles;

          if (this.giftType === 'sm') {

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

          if (this.giftType === 'sm') {

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
      this.activeTile = gridRows[this.y].children[this.x];
      this.stylize = function() {
        if (this.hidden === false) {
          this.activeTile = gridRows[this.y].children[this.x];
          if (this.giftType === 'sm') {
            this.activeTile.style = smGiftStyles;
          } else if (this.giftType === 'md') {
            this.activeTile.style = mdGiftStyles;
          } else if (this.giftType === 'lg') {
            this.activeTile.style = lgGiftStyles;
          } else if (this.giftType === 'xl') {
            this.activeTile.style = xlGiftStyles;
          }
        }
      }
    }
  }

  // For adding Obstacles with hard-coded positions (for testing purposes)
  function Obstacle(x, y) {
    this.x = x; // positions (x and y)
    this.y = y;
    this.activeTile = gridRows[this.y].children[this.x];
    this.stylize = function() {
      this.activeTile.style = obstacleStyles;

    }
  }


  let givingMode = {
    // turn: 0,
    round: 0
  };



  /////////////////// READY, SET, GO! ///////////////////

  // Change: addGiftToPlayer triggers when player passes through gift

  checkForStateChange(); // add 'newState' parameter



  ////////////////////////////// FUNCTIONS //////////////////////////////

  // ==================================== FIGHT FUNCTIONS ====================================== //

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
      // console.log("Running roungChange()");
        givingMode.round += 1;
        console.log("Round " + givingMode.round);

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


  function checkForStateChange() {
    if (activeGameState === BEGIN) {
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

  function runBeginState() {
    // console.log('Running Begin State');
    // Begin state is intended to...
    // Give background info on context of game and short explanation of how game works.

    // console.log('Ending Begin State');

  }

  function runExploreState() {
    console.log('Running Explore State');
    // There's some kind of scope conflict that is happening.
    // See if you can create the vars for gifts and players in root scope first, though leave them with no value.

    // ===================================== RUN EXPLORE STATE ===================================== //

    getObstaclePositions();
    drawGrid();
    getGiftPositions();


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
    player1 = new Player(1, playersX[0], playersY[0], 100, 'xs', GiftStrengthAmount.XS);
    player1.stylize();
    player2 = new Player(2, playersX[1], playersY[1], 100, 'xs', GiftStrengthAmount.XS);
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

    console.log("Round " + givingMode.round);

    // Giving/Complaining needs to take place here.

    isFirstGivingRound = false;
    // console.log('Ending Giving State');
  }


  function runEndState() {
    console.log('Running End State');

    // Intended to congratulate 'winning' user and encourage them with an inspirational thought.

    console.log('Ending End State');

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

      let clickedGiftType = getGiftAtClick(event, true);

      if (clickedGiftType) {
        // console.log('you checked for a click on a gift');

        // Do something here to have player drop his original gift
        if (activePlayer.giftType === 'xs') {
          addGiftToPlayer(clickedGiftType);
          activePlayer.drop();

        } else {
          // swapGifts(clickedGiftType);
          addGiftToPlayer(clickedGiftType);
          activePlayer.drop();
        }


        if (activePlayer === player1) {
          event.target.style.backgroundColor = p2Background;

        } else {
          event.target.style.backgroundColor = p1Background;

        }
      }

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

    if (false === gift1.hidden && xCalc(event.clientX) === gift1.x && yCalc(event.clientY) === gift1.y) {

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
    console.log('giftType= ' + giftType);

    // When this is called, it seems activePlayer has already been sure.
    if (activePlayer === player1) {
      player1.prevGiftType = player1.giftType;

      // New giftType added
      player1.giftType = giftType;
      // Adjust player's giftStrength accordingly.
      if (giftType === 'sm') {
        console.log("You picked up a sm gift");
        player1.giftStrength = GiftStrengthAmount.SM;

      } else if (giftType === 'md') {
        console.log("You picked up an md gift");
        player1.giftStrength = GiftStrengthAmount.MD;

      } else if (giftType === 'lg') {
        console.log("You picked up a lg gift");
        player1.giftStrength = GiftStrengthAmount.LG;

      } else if (giftType === 'xl') {
        console.log("You picked up an xl gift");
        player1.giftStrength = GiftStrengthAmount.XL;

      }

    } else {
      player2.prevGiftType = player2.giftType;

      // New giftType added
      player2.giftType = giftType;
      if (giftType === 'sm') {
        console.log("You picked up a sm gift");
        player2.giftStrength = GiftStrengthAmount.SM;

      } else if (giftType === 'md') {
        console.log("You picked up an md gift");
        player2.giftStrength = GiftStrengthAmount.MD;

      } else if (giftType === 'lg') {
        console.log("You picked up a lg gift");
        player2.giftStrength = GiftStrengthAmount.LG;

      } else if (giftType === 'xl') {
        console.log("You picked up an xl gift");
        player2.giftStrength = GiftStrengthAmount.XL;

      }
    }
    console.log(activePlayer.giftStrength);
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

  function updateUi() {

    // SAD POINTS
    $("#hp-p1").html(`${player1.sadPoints} <sup> sad points</sup>`);
    $("#hp-p2").html(`${player2.sadPoints} <sup> sad points</sup>`);
    //
    // // GIFT TYPE
    // document.getElementById("gift-type-p1").innerHTML = player1.giftType + " gift";
    // document.getElementById("gift-type-p2").innerHTML = player2.giftType + " gift";


    if (player1.giftType === 'xs') {
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


    if (player2.giftType === 'xs') {
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

  function enableUiButtons(activePlayer) {

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

    for (let i = 0; i < NUM_OBSTACLES; i++) {
      obstaclesX.push(getRandomX())
      obstaclesY.push(getRandomY())
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
