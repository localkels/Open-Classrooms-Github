// if (giftType === 'sm') {
//   gift1.x = player1.x;
//   gift1.y = player1.y;
//   gift1.hidden = false;
//
// } else if (giftType === 'md') {
//   gift2.x = player1.x;
//   gift2.y = player1.y;
//   gift2.hidden = false;
// } else if (giftType === 'lg') {
//   gift3.x = player1.x;
//   gift3.y = player1.y;
//   gift3.hidden = false;
//
// } else if (giftType === 'xl') {
//   gift4.x = player1.x;
//   gift4.y = player1.y;
//   gift4.hidden = false;
// } else {
//
// }

// if (giftType === 'sm') {
//   gift1.x = player2.x;
//   gift1.y = player2.y;
//   gift1.hidden = false;
//
// } else if (giftType === 'md') {
//   gift2.x = player2.x;
//   gift2.y = player2.y;
//   gift2.hidden = false;
// } else if (giftType === 'lg') {
//   gift3.x = player2.x;
//   gift3.y = player2.y;
//   gift3.hidden = false;
//
// } else if (giftType === 'xl') {
//   gift4.x = player2.x;
//   gift4.y = player2.y;
//   gift4.hidden = false;
// }





// function getRandomIndex(isX, otherAxis, max, type) { // Add a "type" parameter that checks: Is this a gift, player or obstacle?
//   // This is an example of how you can check for possible moves colliding with other player or obstacles
//   var randomIndex = Math.floor(Math.random() * (max - 1));
//   console.log(randomIndex);
//
//   if (isX) {
//     if (type === 'gift') {
//
//       if (true === playerCollisionCheck(randomIndex, otherAxis)) {
//         console.log('player has collided');
//
//       }
//       obstacleCollisionCheck(randomIndex, otherAxis);
//
//     } else if (type === 'player') {
//       obstacleCollisionCheck(randomIndex, otherAxis);
//       giftCollisionCheck(randomIndex, otherAxis);
//
//     } else if (type === 'obstacle') {
//       playerCollisionCheck(randomIndex, otherAxis);
//       giftCollisionCheck(randomIndex, otherAxis);
//     } else {
//       console.log('!IMPORTANT: "type" is incorrect. See constructor functions.');
//     }
//
//     // giftCollisionCheck();
//     // playerCollisionCheck();
//     // obstacleCollisionCheck();
//
//   }
//   return randomIndex
// }

// function giftCollisionCheck(randomIndex, otherAxis){
//   // console.log('giftCollisionCheck');
//
//   // Check for collision with gifts
//   while (
//     (randomIndex === gift1.x && otherAxis === gift1.y) ||
//     (randomIndex === gift2.x && otherAxis === gift2.y) ||
//     (randomIndex === gift3.x && otherAxis === gift3.y) ||
//     (randomIndex === gift4.x && otherAxis === gift4.y)
//   ) {
//     randomIndex = Math.floor(Math.random() * (max - 1));
//     return randomIndex;
//     // break;
//   }
//
// }
//
// function playerCollisionCheck(randomIndex, otherAxis){
//   // console.log('playerCollisionCheck');
//
//   // Check for collision with players
//   while ((randomIndex === player1.x && otherAxis === player1.y) || (randomIndex === player2.x && otherAxis === player2.y)) {
//     randomIndex = Math.floor(Math.random() * (max - 1));
//     return randomIndex;
//     // break;
//   }
//
// }
//
// function obstacleCollisionCheck(randomIndex, otherAxis){
//   // console.log('obstacleCollisionCheck');
//
//   // Check for collision with obstacles
//   for (var i = 0; i < obstaclesArray.length; i++) {
//     if (randomIndex === obstaclesArray[i].x && otherAxis === obstaclesArray[i].y) {
//       randomIndex = Math.floor(Math.random() * (max - 1));
//       return randomIndex;
//
//     }
//   }
//
// }


// function swapGifts(giftType) {
//   console.log('swapGifts()');
//   console.log('giftType= '+giftType);
//
//   // When this is called, it seems activePlayer has already been sure.
//   if (activePlayer === player1) {
//     if (activePlayer.giftType === 'sm') {
//
//       gift1.x = player1.x;
//       gift1.y = player1.y;
//
//       console.log('gift1 hidden = false');
//       gift1.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player's next move.
//
//     } else if (activePlayer.giftType === 'md') {
//       gift2.x = player1.x;
//       gift2.y = player1.y;
//
//       console.log('gift2 hidden = false');
//       gift2.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player's next move.
//     } else if (activePlayer.giftType === 'lg') {
//       gift3.x = player1.x;
//       gift3.y = player1.y;
//
//       console.log('gift3 hidden = false');
//       gift3.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player's next move.
//
//     } else if (activePlayer.giftType === 'xl') {
//       gift4.x = player1.x;
//       gift4.y = player1.y;
//
//       console.log('gift4 hidden = false');
//       gift4.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player's next move.
//     } else {
//
//     }
//
//     player1.giftType = giftType;
//     // gift4.activeTile.style.backgroundColor = p1Background;
//
//   } else {
//     if (activePlayer.giftType === 'sm') {
//       gift1.x = player2.x;
//       gift1.y = player2.y;
//       gift1.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player's next move.
//
//     } else if (activePlayer.giftType === 'md') {
//       gift2.x = player2.x;
//       gift2.y = player2.y;
//       gift2.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player next move.
//     } else if (activePlayer.giftType === 'lg') {
//       gift3.x = player2.x;
//       gift3.y = player2.y;
//       gift3.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player next move.
//
//     } else if (activePlayer.giftType === 'xl') {
//       gift4.x = player2.x;
//       gift4.y = player2.y;
//       gift4.hidden = false; // This needs to be happening at a later time. Maybe save the toBeDropped gift in a variable and drop that gift on player next move.
//     } else {
//
//     }
//
//     player2.giftType = giftType;
//   }
//
// }
