$(document).ready(function () {

  var myConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  }

  //   // Initialize Firebase
  firebase.initializeApp(myConfig);
  var database = firebase.database();
  //db ref
  var playersRef = database.ref('players'); // Reference entire players folder 
  var player1Ref = playersRef.child('/player1'); // Reference entire P1 folder
  var player2Ref = playersRef.child('/player2'); // Reference entire P2 folder
  var winsRef = database.ref('win');    // Reference both player losses
  var losesRef = database.ref('loses');    // Reference both player wins
  var turnRef = database.ref('turn'); // to track the turns
  var connectionsRef = database.ref("connections"); // Folder to store each connection
  var connectedRef = database.ref(".info/connected");// Firebase's default Ref to track connections (boolean)
  var messageRef = database.ref('chat'); // Reference chat
 
  // Variables
  var player2Name = '';
  var player1Name = '';
  var player1Wins = 0;
  var player1Loses = 0;
  var player1Choice = '';
  var player2Wins = 0;
  var player2Loses = 0;
  var player2Choice = '';
  var playerTurn = '';
  var activePnum = 0;
  var results = '';

  //dom
  var $player1Name = $("player-one-label");
  var $player2Name = $("player-two-label");
  var $player1Choice = $("player-one-choice");
  var $player2Choice = $("player-two-choice");
  var $nameInput = $("#name-input");
  var $messageHistory = $("#comment-display")
  var $messageInput = $("#comment-input");
  var $submit = $("add-message");
  var $player2Wins_span = $("#player-two-wins");
  var $player1Wins_span = $("#player-one-wins");
  var $player2Loses_span = $("#player-two-loss");
  var $player1Loses_span = $("#player-one-loss");
  var $result_p = $(".result > p");
  var $oneRock_div = $("#one-r");
  var $onePaper_div = $("#one-p");
  var $oneScissors_div = $("#one-s");
  var $twoRock_div = $("#two-r");
  var $twoPaper_div = $("#two-p");
  var $twoScissors_div = $("#two-s");
  var $playerWait = $("#waiting-player");
  var $player1Turn = $("#player-turn-one");
  var $player2Turn = $("#player-turn-two");


  //functions

  var playerName = function () {
    connectedRef.on('value', function (snapshot) { // is player connected/disconnected
      if (snapshot.val()) { // if connected
        connectionsRef.push(true);
        connectionsRef.onDisconnect().remove(); // remove player from the connection when they disconnect
      }
    });
    connectionsRef.on('value', function (snapshot) { // If I just moved someone to my connection folder
      console.log(`Number of players online ${snapshot.numChildren()}`);
      activePnum = snapshot.numChildren();    // get the number of connections 
      playerName = $nameInput.val().trim(); // get playername
      // $playerName.text(` ${playerName}`); // current player
  
      if (activePnum == 1 ) { // if 1st player
        messageRef.set({}); // if only one player, clear the chat history in the db
        $messageHistory.empty(); // clear the text

        player1Name = playerName;   // store name in variable 
        // create the object
        var player1 = {
          choice: '',
          name:  player1Name,
        };
        var turns = { turn: playerTurn };

        // sync object
        console.log(player1)
        player1Ref.set(player1);
        turnRef.set(turns);

        // wait for player 2
        $playerWait.text('Waiting for player 2');
        console.log('Waiting for player 2');

        playerTurn = 'player2turn';
        turnRef.set({ turn: playerTurn }); // set the turn 

        if(activePnum == 2){
          $playerWait.text('Start the game!');
        }
      }
      else if (activePnum == 2) {  // if you 2nd player
        player2Name = playerName;   // Store the current name into a different variable to keep track
        // Create the object
        var player2 = {
          choice: '',
          name: player2Name
        };
        var wins = {
          player1: player1Wins,
          player2: player2Wins
        }
        var loses = {
          player1: player1Loses,
          player2: player2Loses
        }
        // sync object
        player2Ref.set(player2);
        winsRef.set(wins);
        losesRef.set(loses);

        // Inform player
        $playerWait.text('Start the game!');
        console.log('start');
        playerTurn = 'player1turn';
        turnRef.set({ turn: playerTurn });
      }
    

    });
  }

  //click start button
  //send name to database
  //get name and display in text
  //if 2 players display player 1 start game

  $("#start-button").on("click", function (event) {
    event.preventDefault();
    
    $nameInput = $("#name-input").val().trim();

    var num=activePnum
    playersRef.child('/player'+ num).set({ //creating 2players
      nameInput: $nameInput,
    });

    if(activePnum === 1){
      $player1Name = $nameInput;
      $player1Choice = $nameInput;
    }
    if(activePnum === 2){
      $player2Name = $nameInput;
      $player2Choice = $nameInput;
    }
  });

  //player 1 chooses rps
  //if player 1 chooses then player 2 chooses
  //if both players choose then evaluate winner
  //if win display win 
  //if lose display lose
    // Capture Button Click
    $(".choice").on("click", function(event) {
      event.preventDefault();
      
      turnRef.child('turn').set({
        turn: playerTurn,
      
          // dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  });
  turnRef.on('child_changed', function (snapshot) { // listen for turn changes
    var playerTurn = snapshot.val();
    console.log(`It's ${playerTurn}`);
    if (playerTurn == 'player1turn' && activePnum == 2) {  // player1 turn if 2 players online
      $player1Choice.on('click', getPlayerChoice(playerTurn)); // listen for player1 click events on the choice btns
    }
    else if (playerTurn == 'p2turn' && activePnum == 2) { // player2 turn and 2 players online
      $player2Choice.on('click', getPlayerChoice(playerTurn)); // player2 click events
    }
  });

  playersRef.on('value', function (snapshot) {   // player 2 makes a choice
    if (playerTurn == 'player2turn' && activePnum == 2) {   // compute results when player 2's turn and 2 people connected
      var player1Name = snapshot.val().player1.name;
      var player2Name = snapshot.val().player2.name;
      var player1Choice = snapshot.val().player1.choice;
      var player2Choice = snapshot.val().player2.choice;

      if (player1Choice == 'rock' && player2Choice == 'rock') {
        results = 'Tie';
        $playerWait.text(results);
      }
      else if (player1Choice == 'rock' && player2Choice == 'paper') {
        results = `Player 2:<br>${player2Name}<br>Won`;
        player1Loses++;
        player2Wins++;
        winsRef.set({ player1: player1Wins, player2: player2Wins });
        losesRef.set({ player1: player1Loses, player2: player2Loses });
        $player1Loses_span.text(player1Loses);
        $player2Win_span.text(player2Wins);
        $playerWait.text(results);
      }
      else if (player1Choice == 'rock' && player2Choice == 'scissors') {
        results = `Player 1:<br>${player1Name}<br>Won`;
        player2Loses++;
        player1Wins++;
        winsRef.set({ player1: player1Wins, player2: player2Wins });
        losesRef.set({ player1: player1Loses, player2: player2Loses });
        $player1Wins_span.text(player1Wins);
        $player2Loses_span.text(player2Loses);
        $playerWait.text(results);
      }
      else if (player1Choice == 'paper' && player2CHoice == 'paper') {
        results = 'Tie';
        $playerWait.text(results);
      }
      else if (player1Choice == 'paper' && player2Choice == 'rock') {
        results = `Player 1:<br>${player1Name}<br>Won`;
        player2Loses++;
        player1Wins++;
        winsRef.set({ player1: player1Wins, player2: player2Wins });
        losesRef.set({ player1: player1Loses, player2: player2Loses });
        $player1Wins_span.text(player1Wins);
        $player2Loses_span.text(player2Loses);
        $playerWait.text(results);
      }
      else if (player1Choice == 'paper' && player2CHoice == 'scissors') {
        results = `Player 2:<br>${player2Name}<br>Won`;
        player1Loses++;
        player2Wins++;
        winsRef.set({ player1: player1Wins, player2: player2Wins });
        losesRef.set({ player1: player1Loses, player2: player2Loses });
        $player1Lose_span.text(player1Loses);
        $player2Win_span.text(player2Wins);
        $playerWait.text(results);
      }
      else if (player1Choice == 'scissors' && player2Choice == 'scissors') {
        results = 'Tie';
        $playerWait.text(results);
      }
      else if (player1Choice == 'scissors' && player2Choice == 'rock') {
        results = `Player 2:<br>${player2Name}<br>Won`;
        player1Loses++;
        player2Wins++;
        winsRef.set({ player1: player1Wins, player2: player2Wins });
        losesRef.set({ player1: player1Loses, player2: player2Loses });
        $player1Loses_span.text(player1Loses);
        $player2Wins_span.text(player2Wins);
        $playerWait.text(results);
      }
      else if (player1Choice == 'scissors' && player2Choice == 'paper') {
        results = `Player 1:<br>${player1Name}<br>Won`;
        player2Loses++;
        player1Wins++;
        winsRef.set({ player1: player1Wins, player2: player2Wins });
        losesRef.set({ player1: player1Loses, player2: player2Loses });
        $player1Wins_span.text(player1Wins);
        $player2Loses_span.text(player2Loses);
        $playerWait.text(results);
      }
    }
  });

  var getPlayerChoice = function (playerTurn) {  // save player choice to db
    return function(e) {
      var target = $(e.target);
      var playerChoice = target.attr('data-playerChoice');    // get player choice attr from the clicked button
      target.closest('div.card').find('img').attr('src', `./assets/images/${playerChoice}.png`); // change the image to match the player's choice
      if (playerTurn == 'player1turn') {
        player1Choice = playerChoice; // store the data-playerChoice attr value in a variable
        player1Ref.set({ choice: player1Choice }); //set the database with the player choice
        turn = 'player2turn';    // change turn and store the value in a variable
        turnRef.set({ playerturn: turn });    // set the turn in database
        $player1Choice.off('click'); // removes the event listener 
      }
      else {
        player2Choice = playerChoice;
        player2Ref.set({ choice: player2Choice }); //set the player choice
        turn = 'player1turn';
        turnRef.set({ playerturn: turn });
        $player1Turn.text('Your turn!');
        $player2Turn.text('Your turn!');
        $player2Choice.off('click');
      }
    }
  }

  //display message if player submits message
  //submit 
  $("#add-message").on("click", function (event) {
    event.preventDefault();
    message = $("#comment-input").val().trim();
    var message = `${snaphot.val().message}`;  // create a string with the msg
    $messageHistory.prepend(msg); 
    messageRef.child(message).set({ //creating 2players
    // });.push({
      message: message,

    });
    $messageInput.val('');

  });

  // var message = function () {
  //   var msg = $messageInput.val();   // get the msg from the chat input
  //   messageRef.push({  // push message
  //     msg: msg
  //   });
  //   $messageInput.val(''); // clear input
  // }

  // messageRef.on('child_added', function (snaphot) {   // listen for changes in the chat Reference in the db
  //   var msg = `${snaphot.val().msg}`;  // create a string with the msg
  //   $messageHistory.prepend(msg);    // prepend the msg 
  // });

  



});



// function translateToWord(varter){
//   if(varter === "r1" || varter === "r2") return "Rock";
//   if(varter === "p1" || varter === "p2") return "Paper";
//   if(varter === "s1" || varter === "s2") return "Scissors";
// }

// function win(playerChoice, playerTwoChoice){
//  playerOneWins++;
//  playerTwoLoses++;
//  playerOneWins_span.text(playerOneWins)
//  playerTwoLoses_span.text(playerTwoLoses)
//  result_p.text(`${translateToWord(playerChoice)} beats ${translateToWord(playerTwoChoice)}. You Win!`);
// }

// function lose(playerChoice, playerTwoChoice){
//   playerTwoWins++;
//   playerOneLoses++;
//  playerOneLoses_span.text(playerOneLoses)
//  playerTwoWins_span.text(playerTwoWins)
//  result_p.text(`${translateToWord(playerChoice)} loses to ${translateToWord(playerTwoChoice)}. You Lose!`);
// }


// function tie(playerChoice, playerTwoChoice){
//   result_p.text(`${translateToWord(playerChoice)} ties with ${translateToWord(playerTwoChoice)}. It's a tie!`);

// }
// function getplayerTwoChoices(){
//   // var choices = ["r2", "p2", "s2"]
//   // var randomNumber = Math.floor(Math.random() * 3);
//   // return choices[""];
//   twoRock_div.on("click", function(){
//     game("r2");
//   })

//   twoPaper_div.on("click", function(){
//     game("p2");
//   })

//   twoScissors_div.on("click", function(){
//     game("s2");
//   })
// }
// getplayerTwoChoices();
// // console.log(getplayerTwoChoices()); 

// // var playerChoice = getplayerOneChoices();

// function game(playerChoice){
//   var playerTwoChoice = getplayerTwoChoices();
//   // playerChoice = getplayerOneChoices();

//   switch(playerChoice + playerTwoChoice){
//     case "r1s2":
//     case "p1r2":
//     case "s1p2":
//       console.log("player1 wins");
//       win(playerChoice, playerTwoChoice);
//       break;
//     case "s1r2":
//     case "r1p2":
//     case "p1s2":
//       console.log("player1 loses")
//       lose(playerChoice, playerTwoChoice);
//       break;
//     case "r1r2":
//     case "p1p2":
//     case "s1s2":
//       console.log("tie")
//       tie(playerChoice, playerTwoChoice);
//       break;
//   }
// }


// // function getplayerOneChoices(){

// function main(){

// oneRock_div.on("click", function(){
//   game("r1");
// })

// onePaper_div.on("click", function(){
//   game("p1");
// })

// oneScissors_div.on("click", function(){
//   game("s1");
// })

// // twoRock_div.on("click", function(){
// //   game("r2");
// // })

// // twoPaper_div.on("click", function(){
// //   game("p2");
// // })

// // twoScissors_div.on("click", function(){
// //   game("s2");
// // })
// }
// // var playerChoice = getplayerOneChoices();
// main();



// function resetGame() {
//   //resetgame if tie or player losses
//  if(playerTwoWins === 3 || playerOneWins === 3){
//   $("#player-one-wins").text("0");
//   $("#player-two-wins").text("0");
//   $("#player-one-loses").text("0");
//   $("#player-two-loses").text("0");
//  }
//   console.log(" game is reset");
// } 



  // Firebase Reference collections
  //   database.ref().on("child_a/dded", function(snapshot){
  //     nameInput = snapshot.val().nameInput,
  //     message = snapshot.val().message,
  //     playerOneChoice = snapshot.val().playerOneChoice,
  //     playerTwoChoice = snapshot.val().playerTwoChoice,
  //     playerOneWins = snapshot.val().playerOneWins;
  //     playerTwoWins = snapshot.val().playerTwoWins;
  //     playerOneLosses = snapshot.val().playerOneLosses;
  //     playerTwoLosses = snapshot.val().playerTwoLosses;
  //     $("#player-one-label").append(`
  //     <div>${nameInput}</div>`)
  //     $("#player-two-label").append(`
  //     <div >${nameInput}</div>`)
  //     $("#player-one-choice").append(`
  //         <div>${nameInput}</div>`)
  //     $("#player-two-choice").append(`
  //         <div>${nameInput}</div>`)
  //     // $("#player-one-wins").append(`
  //     //     <div>${playerOneWins}</div>`)  
  //     // $("#player-two-wins").append(`
  //     //     <div>${playerTwoWins}</div>`) 
  //     // $("#player-one-losses").append(`
  //     //     <div>${playerOneLosses}</div>`)  
  //     // $("#player-two-losses").append(`
  //     //     <div>${playerTwoLosses}</div>`)
  //     $("#comment-display").append(`${message}`)    
  // }, function(errorObject) {
  //     console.log("Errors handled: " + errorObject.code);
  // }) 

  // resetGame();