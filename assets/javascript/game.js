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
  var playersRef = database.ref('players'); // players folder 
  var player1Ref = playersRef.child('/player1'); // P1 folder
  var player2Ref = playersRef.child('/player2'); // P2 folder
  var winsRef = database.ref('win');    // both player losses
  var losesRef = database.ref('loses');    // both player wins
  var turnRef = database.ref('turn'); // to track the turns
  var connectionsRef = database.ref("connections"); // store each connection
  var connectedRef = database.ref(".info/connected");// default Ref to track connections (boolean)
  var messageRef = database.ref('chat'); // chat

  // Variables
  var player2Name = '';
  var player1Name = '';
  var player1Wins = 0;
  var player1Loses = 0;
  var player1Choice = '';
  var player2Wins = 0;
  var player2Loses = 0;
  var player2Choice = '';
  var turn = '';
  var activePnum = 0;
  var results = '';

  //dom
  var $player1Name = $("#player-one-label");
  var $player2Name = $("#player-two-label");
  var $player1Choice = $("#player-one-choice");
  var $player2Choice = $("#player-two-choice");
  var $nameInput = $("#name-input");
  var $messageHistory = $("#comment-display")
  var $messageInput = $("#comment-input");
  var $submit = $("add-message");
  var $player2Wins_span = $("#player-two-wins");
  var $player1Wins_span = $("#player-one-wins");
  var $player2Loses_span = $("#player-two-loss");
  var $player1Loses_span = $("#player-one-loss");
  var $playerWait = $("#waiting-player");
  var $player1Turn = $("#player-turn-one");
  var $player2Turn = $("#player-turn-two");


  //functions

  $("#start-button").on("click", function (event) {
    event.preventDefault();

    connectedRef.on('value', function (snapshot) { // is player connected/disconnected
      if (snapshot.val()) { // if connected
        connectionsRef.push(true);
        connectionsRef.onDisconnect().remove(); // remove player from the connection when they disconnect
      }
      });
      connectionsRef.on('value', function (snapshot) { // moved player to connection folder
        console.log(`Number of players online ${snapshot.numChildren()}`);
        activePnum = snapshot.numChildren();    // get the number of connections 
        playerName = $nameInput.val(); // get playername
        
         // current player
        //check for player1 input matches value in html
        if (activePnum == 1) { // if 1st player
          messageRef.set({}); // if only one player, clear the chat history in the db
          $messageHistory.empty(); // clear the text

          player1Name = playerName;   // store name in variable 
          // create the object
          var player1 = {
            choice: '',
            name: player1Name,
          };
          var turns = { 
            turn: turn 
          };

          // sync object
          console.log(player1)
          player1Ref.set(player1);
          turnRef.set(turns);

          // wait for player 2
          $playerWait.text('Waiting for player 2');
          $player1Name.text(player1Name)
          $player1Choice.text(player1Name)
          console.log('Waiting for player 2');

          
          turn = 'player2turn';
          turnRef.set({
             turn: turn 
            }); // set the turn 

          if (activePnum == 2) {
            $playerWait.text('Waiting for player 2');
            
          }
        }
        else if  (activePnum == 2)  {
          $playerWait.text('Waiting for player 2'); // if you 2nd player
          // $player1Name.text(player1Ref.name)
          // $player1Choice.text(player1Ref.name)
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
          // if(playerName === player2Name && playerName === player2Name){
          $playerWait.text('Start the game!');
          $player2Name.text(player2Name)
          $player2Choice.text(player2Name)
          // $player1Name.text(player1Ref.name)
          // $player1Choice.text(player1Ref.name)
          console.log('start');
          // }
          turn = 'player1turn';
          turnRef.set({
             turn: turn 
            });
       
        }
        // });


      // });

      var num = activePnum
      playersRef.child('/player' + num).set({ //creating 2players
        nameInput: $nameInput,
      });
    });
  });

  //player 1 chooses rps
  //if player 1 chooses then player 2 chooses
  //if both players choose then evaluate winner
  //if win display win 
  //if lose display lose
  // Capture Button Click
  $(".choice").on("click", function (event) {
    event.preventDefault();
    alert("choice click")
    choice = $(this).attr("data-choice")
    console.log($(this).attr("data-choice"))
    getPlayerChoice(choice);
  });
    turnRef.on('child_changed', function (snapshot) { // listen for turn changes
      var turn = snapshot.val();
      console.log(`It's ${turn}`);
      if (turn == 'player1turn' && activePnum == 2) {  // player1 turn if 2 players online
        $player1Choice.on('click', getPlayerChoice(choice)); // listen for player1 click events on the choice btns
      }
      else if (turn == 'p2turn' && activePnum == 2) { // player2 turn and 2 players online
        $player2Choice.on('click', getPlayerChoice(choice)); // player2 click events
      }
    });
  
    playersRef.on('value', function (snapshot) {   // player 2 makes a choice
      if (turn == 'player2turn' && activePnum == 2) {   // compute results when player 2's turn and 2 people connected
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
          winsRef.set({ 
            player1: player1Wins, 
            player2: player2Wins 
          });
          losesRef.set({ 
            player1: player1Loses, 
            player2: player2Loses 
          });
          $player1Loses_span.text(player1Loses);
          $player2Win_span.text(player2Wins);
          $playerWait.text(results);
        }
        else if (player1Choice == 'rock' && player2Choice == 'scissors') {
          results = `Player 1:<br>${player1Name}<br>Won`;
          player2Loses++;
          player1Wins++;
          winsRef.set({ 
            player1: player1Wins, 
            player2: player2Wins 
          });
          losesRef.set({ 
            player1: player1Loses, 
            player2: player2Loses 
          });
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
          winsRef.set({ 
            player1: player1Wins, 
            player2: player2Wins 
          });
          losesRef.set({ 
            player1: player1Loses, 
            player2: player2Loses 
          });
          $player1Wins_span.text(player1Wins);
          $player2Loses_span.text(player2Loses);
          $playerWait.text(results);
        }
        else if (player1Choice == 'paper' && player2Choice == 'scissors') {
          results = `Player 2:<br>${player2Name}<br>Won`;
          player1Loses++;
          player2Wins++;
          winsRef.set({ 
            player1: player1Wins, 
            player2: player2Wins 
          });
          losesRef.set({ 
            player1: player1Loses, 
            player2: player2Loses 
          });
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
          winsRef.set({ 
            player1: player1Wins, 
            player2: player2Wins 
          });
          losesRef.set({ 
            player1: player1Loses, 
            player2: player2Loses 
          });
          $player1Loses_span.text(player1Loses);
          $player2Wins_span.text(player2Wins);
          $playerWait.text(results);
        }
        else if (player1Choice == 'scissors' && player2Choice == 'paper') {
          results = `Player 1:<br>${player1Name}<br>Won`;
          player2Loses++;
          player1Wins++;
          winsRef.set({ 
            player1: player1Wins, 
            player2: player2Wins 
          });
          losesRef.set({ 
            player1: player1Loses, 
            player2: player2Loses 
          });
          $player1Wins_span.text(player1Wins);
          $player2Loses_span.text(player2Loses);
          $playerWait.text(results);
        }
      }
    });
  // });
  function getPlayerChoice(choice) {  // save player choice to db
    return function (e) {
      var target = $(e.target);
      var playerChoice = target.attr('data-choice');    // get player choice attr from the clicked img
      if (turn == 'player1turn') {
        player1Choice = playerChoice; // store the data-choice attr value in a variable
        // 
        player1Ref.update({ 
          choice: player1Choice, 
        });
        //set the database with the player choice
      turn = 'player2turn'
            // change turn and store the value in a variable
        turnRef.update({ 
          turn: turn 
        });
          // set the turn in database
        // playerChoice.off('click'); // removes the event listener 
      }
      else {
        player2Choice = playerChoice;
        player2Ref.update({ 
          choice: player2Choice 
        }); //set the player choice
        turn = 'player1turn';
        turnRef.update({ 
          turn: turn 
        });
        $player1Turn.text('Your turn!');
        $player2Turn.text('Your turn!');
        // playerChoice.off('click');
      }
    }
  }
// });
 
  //display message if player submits message
  //submit 
  $("#add-message").on("click", function (event) {
    event.preventDefault();
    message = $("#comment-input").val().trim();

    messageRef.child(message).set({ //adding messages to db
      message: message,

    });
    $messageInput.val('');

    messageRef.on('child_added', function (snapshot) {
      var message = `${snapshot.val().message}`;  // create a string with the msg
      $messageHistory.append(message);
    }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
  });

});
