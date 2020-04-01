$(document).ready(function () {

  var myConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  };

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
  var $player1RPS = $("#player-one-choices");
  var $player2RPS = $("#player-two-choices");
  var $nameInput = $("#name-input");
  var $messageHistory = $("#comment-display")
  var $messageInput = $("#comment-input");
  var $submit = $("#add-message");
  var $player2Wins_span = $("#player-two-wins");
  var $player1Wins_span = $("#player-one-wins");
  var $player2Loses_span = $("#player-two-loss");
  var $player1Loses_span = $("#player-one-loss");
  var $playerWait = $("#waiting-player");
  var $player1Turn = $("#player-turn-one");
  var $player2Turn = $("#player-turn-two");
  var $start = $("#start-button")
  var $playerName = $("#game-description")

  //functions
  $start.on("click", function (event) {
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
      playerName = $nameInput.val();// get playername
    
    
      // current player
      //check for player1 input matches value in html
      // function setPlayer1(){
      if (activePnum === 1) { // if 1st player
        messageRef.set({}); // if only one player, clear the chat history in the db
        // $messageHistory.empty();
        // playerName = $nameInput.val(); // clear the text
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
        database.ref().on("value", function (snapshot) {
          if (activePnum === 1 && player1 !== null) {
            // playerName = snapshot.val().name
            console.log("name", snapshot.val().players.player1.name)
            $player1Name.text(snapshot.val().players.player1.name)
            $player1Choice.text(snapshot.val().players.player1.name)
            // $nameInput.text("")
            // $player2RPS.hide();
            // $playerName.hide();
          }
        });
        // $player2RPS.hide();
        $playerName.hide();
        console.log('Waiting for player 2');


        turn = 'player2turn';
        turnRef.set({
          turn: turn
        }); // set the turn

        if (activePnum === 2) {
          $playerWait.text('Waiting for player 2');
        }
        
      }
    // }
      else if (activePnum == 2) {
        // function setPlayer2(){
        // if (activePnum === 2 ) {
       // if you 2nd player

       playerName = $nameInput.val();
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
        // sync object
        // console.log(player1)
        // Inform player
        $playerWait.text('Start the game!');
        database.ref().on("value", function (snapshot) {
          if (activePnum == 2 && player2 !== null) {
            console.log("name", snapshot.val().players.player2.name)
            $player2Name.text(snapshot.val().players.player2.name)
            $player2Choice.text(snapshot.val().players.player2.name)
            $player1Name.text(snapshot.val().players.player1.name)
            $player1Choice.text(snapshot.val().players.player1.name)
            // $nameInput.text("")
            // $player1RPS.hide()
            // $playerName.hide();
          }
        });
        // $player1RPS.hide()
        $playerName.hide();
        console.log('start');
        turn = 'player1turn';
        turnRef.set({
          turn: turn
        });

      }
    // }

    });

    var num = activePnum
    playersRef.child('/player' + num).set({ //creating 2players
      nameInput: $nameInput,
    });
  });

 


  turnRef.on('child_changed', function (snapshot) { // listen for turn changes
    var playerTurn = snapshot.val();
    console.log(`It's ${playerTurn}`);
    if (playerTurn === 'player1turn' && activePnum === 2) {  // player1 turn if 2 players online
      // listen for player1 click events on the choice btns
      getPlayer1Choice(playerTurn);
    }
    else if (playerTurn === 'player2turn' && activePnum === 2) { // player2 turn and 2 players online
      // player2 click events
      getPlayer2Choice(playerTurn);
    }
  });

  playersRef.on('value', function (snapshot) {   // player 2 makes a choice
    // if (turn === 'player1turn') {   // compute results when player 1's turn and 2 people connected
    var player1Name = snapshot.val().player1.name;
    var player2Name = snapshot.val().player2.name;
    var player1Choice = snapshot.val().player1.choice;
    var player2Choice = snapshot.val().player2.choice;
    if (player1Choice !== null && player2Choice !== null) {

      if (player1Choice == 'rock' && player2Choice == 'rock' ||
        player1Choice == 'scissors' && player2Choice == 'scissors' ||
        player1Choice == 'paper' && player2Choice == 'paper') {
        results = `It is a tie`;
        $playerWait.text(results);
      }
      if (player1Choice == 'rock' && player2Choice == 'paper' ||
        player1Choice == 'scissors' && player2Choice == 'rock' ||
        player1Choice == 'paper' && player2Choice == 'scissors') {
        results = `${player2Name} Won!`;
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
      if (player1Choice == 'rock' && player2Choice == 'scissors' ||
        player1Choice == 'paper' && player2Choice == 'rock' ||
        player1Choice == 'scissors' && player2Choice == 'paper') {
        results = `${player1Name} Won!`;
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
  function getPlayer1Choice(playerTurn) {
    return $player1RPS.on("click", function (e) {
      var target = $(e.target);
      var playerChoice = target.attr('data-choice');  // save player choice to db 
      // get player choice attr from the clicked img
      if (playerTurn === 'player1turn') {
        $player1Turn.text('Your turn!');
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
        $player1RPS.off("click");// removes the event listener
        $player1Turn.text("");
        // $player2Turn.text('Your turn!');
      }
    });
  }
  // function checkPlayerChoice(){
  //    var playerChoice = false;

  //    if(choice === "" && activePnum === 2){
  //      playerChoice;
  //    }else{
  //      playerChoice = true;
  //    }
  // }
  function getPlayer2Choice(playerTurn) {
    return $player2RPS.on("click", function (e) {
      var target = $(e.target);
      var playerChoice = target.attr('data-choice');  // save player choice to db 
      // get player choice attr from the clicked img
      if (playerTurn === 'player2turn') {
        $player2Turn.text('Your turn!');
        player2Choice = playerChoice;
        player2Ref.update({
          choice: player2Choice,
        }); //set the player choice
        turn = 'player1turn';
        turnRef.update({
          turn: turn
        });
        // $player2RPS.off();
        player1Choice = ""
        player1Ref.update({
          choice: player1Choice,
        });
        player2Choice = ""
        player2Ref.update({
          choice: player2Choice,
        });
        // $player1Turn.text('Your turn!');
        $player2Turn.text("");
        // $player2Turn.text('Your turn!');
      }
      // }
    });
  }

  //display message if player submits message
  //submit 
  $submit.on("click", function (event) {
    event.preventDefault();
    message = $("#comment-input").val().trim();

      messageRef.push({ //adding messages to db
          message: message,
    });
    $messageInput.val('');


  });
   
messageRef.endAt().limitToLast(1).on('child_added', function (snapshot) {
  // create a string with the msg
   var chat = `<li id="playerMessage" >${snapshot.val().message}
   `;
   $messageHistory.prepend(chat);
 });
});