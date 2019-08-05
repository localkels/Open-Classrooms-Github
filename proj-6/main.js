
// ---------------- Initializing jQuery ---------------- //

$(function() {

  /////////////// SETTING UP THE GRID ///////////////

  const body = $('body')[0];
  const grid = $('.grid')[0]; // Why can't this work in jQuery?

  // Q: When I put the $ sign, the const saves an array with the button in it, not the button itself. Why is that?
  // FIXED IT! and learned about jQuery objects
  const giveButtonP1 = $('#p1-give-btn')[0];
  const complainButtonP1 = $('#p1-complain-btn')[0];

  const giveButtonP2 = $('#p2-give-btn')[0];
  const complainButtonP2 = $('#p2-complain-btn')[0];

  let newDiv;
  let newSpan;

  // IMPROVE: Make these consts
  let gridSize = 10; // Change gridSize to increase the amount of tiles
  let globalScale = 1.6; // IMPROVE: global scale should be dependant on html.clientWidth or something
  let tileSize = 20 * globalScale;
  let gridWidth = (gridSize * tileSize) + (4 * gridSize);

  let activePlayer;

  let possibleMoves = [];
  let gridRows = [];

  const NUM_OBSTACLES = 18;
  const NUM_MOVES = 3;

  // Enumeration data structures
  // IMPROVE: Group them all in one object!
  const BEGIN = 1;
  const EXPLORE = 2;
  const GIVING = 3;
  const END = 4;
  let activeGameState = BEGIN; // Set current state here.

  // Even better enumeration!
  const PlayerFightState = Object.freeze({
      "EMPTY":1,
      "GIVING":2,
      "COMPLAINING":3
    });

  const GiftStrengthAmount = Object.freeze({
        "XS": 10,
        "SM": 15,
        "MD": 20,
        "LG": 25,
        "XL": 30
      });

  let gameInfo = {
    isFirstGameRun: true,
    givingRound: 0
  };

  // IMPROVE: Add this to gameInfo object
  let isFirstGivingRound = true;

  // Global variables for objects.
  let giftPlayer1;
  let giftPlayer2;
  let gift1;
  let gift2;
  let gift3;
  let gift4;

  let player1;
  let player2;


  ///////////// Arrays for obstacles gifts and players /////////////

  // IMPROVE: Put objects into arrays and eliminate obstaclesY, giftsX, etc.
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

  ////////////////   PLAYER & GRID STYLES  ////////////////

  // IMPROVE: Put these into css classes or group in object (or both)!

  let defaultStyles = 'background: ' + defaultBackground + '; border: solid ' + defaultBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let possibleMovesStyles = 'background: ' + possibleMovesBackground + '; border: solid ' + defaultBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let player1Styles = 'background: ' + p1Background + '; border: solid' + p1Border + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let player2Styles = 'background: ' + p2Background + '; border: solid ' + p2Border + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let obstacleStyles = 'background: ' + obstacleBackground + '; border: solid ' + obstacleBorder + ' 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  ////////////////   GIFT STYLES  ////////////////

  // IMPROVE: Put these into css classes or group in object (or both)!

  let xsGiftStyles = 'background-image: url("/assets/cross.png"); background-color: springgreen; background-size: 30px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let smGiftStyles = 'background-image: url("/assets/sm.png"); background-color: springgreen; background-size: 30px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let mdGiftStyles = 'background-image: url("/assets/md.png"); background-color: springgreen; background-size: 17px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let lgGiftStyles = 'background-image: url("/assets/lg.png"); background-color: springgreen; background-size: 22px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';

  let xlGiftStyles = 'background-image: url("/assets/xl.png"); background-color: springgreen; background-size: 27px; background-repeat: no-repeat; background-position: center;  border: solid mediumseagreen 2px; width:' + tileSize + 'px; height:' + tileSize + 'px;';


// ------------------------- SETTING UP CLASSES ------------------------ //

  class Player {
    constructor(nr, x, y, sadPoints, giftType, giftStrength) {
      this.nr = nr;
      this.x = x;
      this.y = y;
      this.activeTile = gridRows[this.y].children[this.x];
      this.sadPoints = sadPoints;
      this.giftType = giftType;
      this.giftStrength = giftStrength; // better gifts take away more sadPoints
      this.prevGiftType = 'xs-p1';
      this.prevX = x;
      this.prevY = y;
      this.fightState = PlayerFightState.EMPTY;

      // When a player already has a gift, .drop causes him to drop it on his previous position when he moves.
      this.drop = function() {
        if (this.prevGiftType === "xs-p1") {
          console.log("dropping giftPlayer1");
          giftPlayer1.stylize();

          giftPlayer1.x = this.x;
          giftPlayer1.y = this.y;

          giftPlayer1.hidden = false;

        } else if (this.prevGiftType === "xs-p2") {
          console.log("dropping giftPlayer2");
          giftPlayer2.stylize();

          giftPlayer2.x = this.x;
          giftPlayer2.y = this.y;

          giftPlayer2.hidden = false;


        } else if (this.prevGiftType === "sm") {
          gift1.x = this.x;
          gift1.y = this.y;

          gift1.hidden = false;

        } else if (this.prevGiftType === "md") {
          gift2.x = this.x;
          gift2.y = this.y;

          gift2.hidden = false;

        } else if (this.prevGiftType === "lg") {
          gift3.x = this.x;
          gift3.y = this.y;

          gift3.hidden = false;

        } else if (this.prevGiftType === "xl") {
          gift4.x = this.x;
          gift4.y = this.y;

          gift4.hidden = false;
        }
      };

      this.give = function() {
        this.fightState = PlayerFightState.GIVING;
        checkForRoundChange();
      }

      this.complain = function() {
        this.fightState = PlayerFightState.COMPLAINING;
        checkForRoundChange();
      }

      // .stylize() changes the styling of that instance of the class.
      this.stylize = function() {

        this.activeTile = gridRows[this.y].children[this.x];
        if (this.nr === 1) {
          this.activeTile.style = player1Styles;

          if (this.giftType === 'xs-1') {

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

        } else {
          this.activeTile.style = player2Styles;

          if (this.giftType === 'xs-2') {

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
      }
    }
  }


  class Gift {
    constructor(giftType, giftStrength, x, y) {
      this.giftType = giftType;
      this.giftStrength = giftStrength;
      this.hidden = false;
      this.x = x;
      this.y = y;
      // IMPROVE: Add gift array to the gift class adding to gift class...
      this.tileX;
      this.activeTile = gridRows[this.y].children[this.x];
      this.stylize = function() {
        if (this.hidden === false) {
          this.activeTile = gridRows[this.y].children[this.x];

          if (this.giftType === 'xs-p1') {
            this.activeTile.style = xsGiftStyles;

            if (isGiftOnPossibleMove(this.giftType)) {
              giftPlayer1.activeTile.style.backgroundColor = possibleMovesBackground;
            }

          } else if (this.giftType === 'xs-p2') {

            this.activeTile.style = xsGiftStyles;

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

  function Obstacle(x, y) {
    this.x = x; // positions (x and y)
    this.y = y;
    this.activeTile = gridRows[this.y].children[this.x];
    this.stylize = function() {
      this.activeTile.style = obstacleStyles;
    }
  }


  // ========================================== READY, SET, GO! ========================================== //
  // The first function that runs (besides jQuery, of course):

  runBeginState();


  ////////////////////////////////////// FUNCTIONS ///////////////////////////////////////////


  // ========================================================================================= //
  // ===================================== FIGHT FUNCTIONS =================================== //
  // ========================================================================================= //

    function checkForRoundChange() {
      // check if both players have a .fightState other than (i.e. greater than) "EMPTY"/1

      if (player1.fightState > 1 && player2.fightState > 1) {
        roundChange();

      }
    }

    function roundChange() {

        gameInfo.givingRound += 1;
        console.log("Round " + gameInfo.givingRound);

        // Based on each player's choice (fightState), run function that subtracts from each player's sadPoints.
        subtractSadPoints();

        player1.fightState = PlayerFightState.EMPTY;
        player2.fightState = PlayerFightState.EMPTY;

        checkForGameEnd();

    }

    function subtractSadPoints() {


      if (player1.fightState === 2 && player2.fightState === 2) {
        // if both chose give
        player1.sadPoints -= player2.giftStrength;
        player2.sadPoints -= player1.giftStrength;

      } else if (player1.fightState === 2 && player2.fightState === 3) {
        // if player1 choses give, but player 2 choses complain
        player2.sadPoints -= (player1.giftStrength / 2);


      } else if (player1.fightState === 3 && player2.fightState === 2) {
        // if player2 choses give, but player1 choses complain
        player1.sadPoints -= (player2.giftStrength / 2);

      } else if (player1.fightState === 3 && player2.fightState === 3) {
        // If both choose complain, nothing happens.

      }
    }

    function checkForGameEnd() {

      if (player1.sadPoints <= 0 && player1.sadPoints < player2.sadPoints){

        console.log("GAME OVER! Player 2 wins!");
        gameInfo.winner = player2;
        activeGameState = END;
        checkForStateChange();

      } else if (player2.sadPoints <= 0 && player2.sadPoints < player1.sadPoints) {

        console.log("GAME OVER! Player 1 wins!");
        activeGameState = END;
        gameInfo.winner = player1;
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
    console.log('Running Begin State');
    printOpeningScreen();

    console.log('Ending Begin State');

  }

  function runExploreState() {
    console.log('Running Explore State');

    // NOTE: .empty deletes all child elements, .detach could be used to retain them.
    $('.grid').empty();

    $('.grid').addClass('no-line-height');

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

    // IMPROVE: Replace event listeners with jQuery .on()
    grid.addEventListener('click', targetCheck);
    grid.addEventListener('click', checkForPlayerAdjacent);

    activePlayer = player1;

    calcPossibleMoves();
    refreshGrid();

    updateUi();

    // runExploreState();
  }

  function runGivingState() {
    console.log('Running Giving State');
    refreshGivingGrid();

    // Enables "give" and "complain" buttons
    enableUiButtons(activePlayer);

    console.log("Round " + gameInfo.givingRound);

    isFirstGivingRound = false;
  }


  function runEndState() {
    console.log('Running End State');
    // Intended to congratulate 'winning' user and encourage them with an inspirational thought.

    $('.grid').removeClass('no-line-height');
    // add grid.empty
    $('.grid').empty();
    grid.removeEventListener('click', targetCheck);
    grid.removeEventListener('click', checkForPlayerAdjacent);

    printClosingScreen();

    console.log('Ending End State');

  }

  function restartGame() {
    location.reload();
  }

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

    openingTextWrapper.append(openingText);
    openingTextWrapper.append(openingButton);
    grid.appendChild(openingTextWrapper);

  }

  // IMPROVE: Merge printOpeningScreen() and printClosingScreen() into one function with a param that determins whether opening or closing screen is printed.
  function printClosingScreen() {
    let closingMessage = generateClosingMessage(gameInfo.winner.nr);

    console.log("Winner: Player" + gameInfo.winner.nr);

    let closingTextWrapper = document.createElement('div');
    closingTextWrapper.className = 'closingTextWrapper';

    let closingText = document.createElement('p');
    closingText.className = 'closingText';
    closingText.innerHTML = closingMessage;

    let closingButton = document.createElement('button');
    closingButton.innerHTML = "Click to Restart!";
    closingButton.className = "closingButton";

    $(closingButton).on("click", restartGame);

    closingTextWrapper.append(closingText);
    closingTextWrapper.append(closingButton);
    grid.appendChild(closingTextWrapper);

  }

  function generateClosingMessage(winnerNumber) {
    let closingMessage = 'Great job, Player' + winnerNumber + '!<br> You cheered up your friend!<br><br>Always remember: <br> "We make a living by what we get. We make a life by what we give."<br> – Winston Churchill <br>';

    return closingMessage;

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
    // Helper function that identifies whether players are on adjacent tiles.
    // i.e. (Players have same x or y + difference between them is 1)

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
    // Which gift was clicked on by who?

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

      if (true === hideGift) {
        gift4.hidden = true;

      }

      return gift4.giftType;
    }

    return false;

  }

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

  function addGiftToPlayer(giftType) {

    if (activePlayer === player1) {
      player1.prevGiftType = player1.giftType;

      // Add new giftType
      player1.giftType = giftType;
      // Adjust player's giftStrength accordingly.
      if (giftType === 'xs-p1') {

        player1.giftStrength = GiftStrengthAmount.XS;
        giftPlayer1.hidden = true;

      } else if (giftType === 'sm') {

        player1.giftStrength = GiftStrengthAmount.SM;
        gift1.hidden = true;

      } else if (giftType === 'md') {

        player1.giftStrength = GiftStrengthAmount.MD;
        gift2.hidden = true;

      } else if (giftType === 'lg') {

        player1.giftStrength = GiftStrengthAmount.LG;
        gift3.hidden = true;

      } else if (giftType === 'xl') {

        player1.giftStrength = GiftStrengthAmount.XL;
        gift4.hidden = true;

      }

    } else {
      player2.prevGiftType = player2.giftType;

      // Add new giftType
      player2.giftType = giftType;
      if (giftType === 'xs-p2') {

        player2.giftStrength = GiftStrengthAmount.XS;
        giftPlayer2.hidden = true;

      } else if (giftType === 'sm') {

        player2.giftStrength = GiftStrengthAmount.SM;
        gift1.hidden = true;

      } else if (giftType === 'md') {

        player2.giftStrength = GiftStrengthAmount.MD;
        gift2.hidden = true;

      } else if (giftType === 'lg') {

        player2.giftStrength = GiftStrengthAmount.LG;
        gift3.hidden = true;

      } else if (giftType === 'xl') {

        player2.giftStrength = GiftStrengthAmount.XL;
        gift4.hidden = true;

      }
    }
  }


  // =================================================================================================== //
  // ==================================== PLAYER MOVEMENT FUNCTIONS ==================================== //
  // =================================================================================================== //

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

  function didPlayerPassGift(activePlayer) {
    // IMPROVE: This function is doing more than just checking. Split it up!
    // IMPROVE: Use For...in and for...of loops to make things more readable.

    for (var i = 0; i < giftsX.length; i++) {
      if (activePlayer.x === giftsX[i] && activePlayer.prevX === giftsX[i]) {

        //Find out if player did pass over gift
        if ((activePlayer.prevY > giftsY[i] && activePlayer.y < giftsY[i]) || (activePlayer.prevY < giftsY[i] && activePlayer.y > giftsY[i])) {

          // Identify and add correct gift to player.
          if (i + 1 === 1) {
            addGiftToPlayer('sm');
            activePlayer.drop();

          } else if (i + 1 === 2) {
            addGiftToPlayer('md');
            activePlayer.drop();

          } else if (i + 1 === 3) {
            addGiftToPlayer('lg');
            activePlayer.drop();

          } else if (i + 1 === 4) {
            addGiftToPlayer('xl');
            activePlayer.drop();

          }
        }
      }
    }


    for (var i = 0; i < giftsY.length; i++) {

      if (activePlayer.y === giftsY[i] && activePlayer.prevY === giftsY[i]) {

        //Find out if player did pass over gift
        if ((activePlayer.prevX > giftsX[i] && activePlayer.x < giftsX[i]) || (activePlayer.prevX < giftsX[i] && activePlayer.x > giftsX[i])) {

          // Identify and add to player the correct gift.
          if (i + 1 === 1) {
            addGiftToPlayer('sm');
            activePlayer.drop();

          } else if (i + 1 === 2) {
            addGiftToPlayer('md');
            activePlayer.drop();

          } else if (i + 1 === 3) {
            addGiftToPlayer('lg');
            activePlayer.drop();

          } else if (i + 1 === 4) {
            addGiftToPlayer('xl');
            activePlayer.drop();

          }
        }
      }
    }
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

    let tooltipText;

    // IMPROVE: Implement template literals on all of these!
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
    return tooltipText;

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
    // experimenting with Template literals in JS
    $("#hp-p1").html(`${player1.sadPoints} <sup> sad points</sup>`);
    $("#hp-p2").html(`${player2.sadPoints} <sup> sad points</sup>`);

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


    // IMPROVE: LOOK FOR WAYS TO DO THIS ON ONE LINE ('css background'), maybe using "addClass"
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

    let randomGiftX;
    let randomGiftY;

    for (let i = 0; i < 4; i++) {

      randomGiftX = getRandomX();
      randomGiftY = getRandomY();

      for (let j = 0; j < obstaclesX.length; j++) {
        if (randomGiftX === obstaclesX[j] && randomGiftY === obstaclesY[j]) {
          getGiftPositions();
          return;
        }
      }

      // IMPROVE: Add these to the Gift class!!!
      giftsX.push(randomGiftX);
      giftsY.push(randomGiftY);

    }

  }

  function getPlayerPositions() {

    let randomPlayerX = getRandomX();
    let randomPlayerY = getRandomY();

    for (let i = 0; i < 2; i++) {

      randomPlayerX = getRandomX();
      randomPlayerY = getRandomY();

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

  // Generates a randomX within the grid.
  function getRandomX() {

    let randomIndex = Math.floor(Math.random() * gridSize);
    return randomIndex;

  }

  // Generates a randomY within the grid.
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
