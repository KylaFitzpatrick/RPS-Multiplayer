$(document).ready(function() {

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
    var playersRef = db.ref('players'); // Reference entire players folder 
    var player1Ref = playersRef.child('p1'); // Reference entire P1 folder
    var player2Ref = playersRef.child('p2'); // Reference entire P2 folder
    var winsRef = db.ref('win');    // Reference both player losses
    var losesRef = db.ref('loses');    // Reference both player wins
    var turnRef = db.ref('turn'); // to track the turns
    var connectionsRef = db.ref("connections"); // Folder to store each connection
    var connectedRef = db.ref(".info/connected");// Firebase's default Ref to track connections (boolean)
    var messageRef = db.ref('chat'); // Reference chat
  // Firebase Reference collections
//   database.ref().on("child_added", function(snapshot){
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

  // Variables
  var player2Name = '';
  var player1Name = '';
  var playerOneWins = 0;
  var playerOneLoses = 0;
  var player1Choice = '';
  var playerTwoWins = 0;
  var playerTwoLoses = 0;
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
  var $playerTwoLoses_span = $("#player-two-loss");
  var $playerOneLoses_span = $("#player-one-loss");
  var $result_p = $(".result > p");
  var $oneRock_div = $("#one-r");
  var $onePaper_div = $("#one-p");
  var $oneScissors_div = $("#one-s");
  var $twoRock_div = $("#two-r");
  var $twoPaper_div = $("#two-p");
  var $twoScissors_div = $("#two-s"); 
  var $playerName = $('#name');
  var $playerWait = $("#waiting-player");


  //functions

  var playerName = function(){
    connectedRef.on('value', function(snapshot) { // is player connected/disconnected
      if(snaphot.val()){ // if connected
          connectionsRef.push(true);
          connectionsRef.onDisconnect().remove(); // remove player from the connection when they disconnect
      }
  });
  connectionsRef.on('value', function(snapshot){ // If I just moved someone to my connection folder
    console.log(`Number of players online ${snapshot.numChildren()}`); 
    activePnum = snapshot.numChildren();    // get the number of connections 
    playerNameVal = $playerName.val(); // get playername
    $playerName.html(` ${playerNameVal}`); // current player

    if(activePnum == 1) { // if 1st player
        chatRef.set({}); // if only one player, clear the chat history in the db
        $messageHistory.empty(); // clear the HTML
        
        player1NameVal = playerNameVal;   // store name in variable 
        // create the object
        var player1 = {
            choice: '',
            name: player1NameVal, 
        };
        var turns = { playerturn: turn };

        // sync object
        player1Ref.set(player1);
        turnRef.set(turns);

        // wait for player 2
        $playerWait.html('Waiting for player 2');
        console.log('Waiting for player 2');

        turn = 'p2turn';
        turnRef.update({ playerturn: turn }); // update the turn 

    }
    else if(activePnum == 2) {  // if you 2nd player
        player2NameVal = playerNameVal;   // Store the current name into a different variable to keep track
        // Create the object
        var player2 = {
            choice: '',
            name: player2NameVal
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
        $playerWait.html('Start the game!');
        console.log('start');
        turn = 'player1turn';
        turnRef.update({ playerturn: turn });
    }
});
}

turnRef.on('child_changed', function(snapshot){ // listen for turn changes
var playerTurn = snaphot.val();
console.log(`It's ${playerTurn}`);
if(playerTurn == 'player1turn' && activePnum == 2) {  // player1 turn if 2 players online
    $player1Choice.on('click', getPlayerChoice(playerTurn)); // listen for player1 click events on the choice btns
}
else if(playerTurn == 'p2turn' && activePnum == 2) { // player2 turn and 2 players online
    $player2Choice.on('click', getPlayerChoice(playerTurn)); // player2 click events
}
});

playersRef.on('value', function(snaphot){   // When P2 makes a choice
if(turn == 'player2turn' && activePnum == 2) {   // Only compute results when is player 2's turn and there are 2 people connected
    var player1Name = snaphot.val().player1.name;
    var player2Name = snapshot.val().player2.name;
    var player1Choice = snapshot.val().player1.choice;
    var player2Choice = snapshot.val().player2.choice;

    if( player1Choice == 'rock' && player2Choice == 'rock'){
        results = 'Tie';
        $playerWait.html(results);
    }
    else if( player1Choice == 'rock' && player2Choice == 'paper'){
        results = `Player 2:<br>${player2Name}<br>Won`;
        player1Loses++;
        player2Wins++;
        winsRef.update({ player1: player1Wins, player2: player2Wins});
        losesRef.update({ player1: player1Loses, player2: player2Loses });
        $player1Loses_span.html(player1Loses);
        $player2Win_span.html(player2Wins);
        $playerWait.html(results);
    }
    else if( player1Choice == 'rock' && player2Choice == 'scissors'){
        results = `Player 1:<br>${player1Name}<br>Won`;
        player2Loses++;
        player1Wins++;
        winsRef.update({ player1: player1Wins, player2: player2Wins});
        losesRef.update({ player1: player1Loses, player2: player2Loses });
        $player1Wins_span.html(player1Wins);
        $player2Loses_span.html(player2Loses);
        $playerWait.html(results);
    }
    else if( player1Choice == 'paper' && player2CHoice == 'paper'){
        results = 'Tie';
        $playerWait.html(results);
    }
    else if( player1Choice == 'paper' && player2Choice == 'rock'){
        results = `Player 1:<br>${player1Name}<br>Won`;
        player2Loses++;
        player1Wins++;
        winsRef.update({ player1: player1Wins, player2: player2Wins });
        losesRef.update({ player1: player1Loses, player2: player2Loses });
        $player1Wins_span.html(player1Wins);
        $player2Loses_span.html(player2Loses);
        $playerWait.html(results);
    }
    else if( player1Choice == 'paper' && player2CHoice == 'scissors'){
        results = `Player 2:<br>${player2Name}<br>Won`;
        player1Loses++;
        player2Wins++;
        winsRef.update({ player1: player1Wins, player2: player2Wins });
        losesRef.update({ player1: player1Loses, player2: player2Loses });
        $player1Lose_span.html(player1Loses);
        $player2Win_span.html(player2Wins);
        $playerWait.html(results);
    }
    else if( player1Choice == 'scissors' && player2Choice == 'scissors'){
        results = 'Tie';
        $playerWait.html(results);
    }
    else if( player1Choice == 'scissors' && player2Choice == 'rock'){
        results = `Player 2:<br>${player2Name}<br>Won`;
        player1Loses++;
        player2Wins++;
        winsRef.update({ player1: player1Wins, player2: player2Wins });
        losesRef.update({ player1: player1Loses, player2: player2Loses });
        $player1Loses_span.html(player1Loses);
        $player2Wins_span.html(player2Wins);
        $playerWait.html(results);
    }
    else if( player1Choice == 'scissors' && player2Choice == 'paper'){
        results = `Player 1:<br>${player1Name}<br>Won`;
        player2Loses++;
        player1Wins++;
        winsRef.update({ player1: player1Wins, player2: player2Wins });
        losesRef.update({ player1: player1Loses, player2: player2Loses });
        $player1Wins_span.html(player1Wins);
        $player2Loses_span.html(player2Loses);
        $playerWait.html(results);
    }
}
});

var getPlayerChoice = function(playerTurn){  // save player choice to db
return e => {
    var target = $(e.target);
    var playerChoice = target.attr('data-playerChoice');    // get player choice attr from the clicked button
    target.closest('div.card').find('img').attr('src', `./assets/images/${playerChoice}.png`); // change the image to match the player's choice
    if (playerTurn == 'player1turn'){
        player1Choice = playerChoice; // store the data-playerChoice attr value in a variable
        player1Ref.update({ choice: player1Choice }); //update the database with the player choice
        turn = 'player2turn';    // change turn and store the value in a variable
        turnRef.update({ playerturn: turn });    // update the turn in database
        // $p1Badge.toggleClass('yourturn');
        // $p2Badge.toggleClass('yourturn');
        $player1Choice.off('click'); // removes the event listener 
    }
    else {
        player2Choice = playerChoice;
        player2Ref.update({ choice: player2Choice }); //Update the player choice
        turn = 'player1turn';
        turnRef.update({ playerturn: turn });
        $player1Badge.toggleClass('yourturn');
        $player2Badge.toggleClass('yourturn');
        $player2Choice.off('click');
    }
}
}
$("#add-message").on("click", function(event) {
  event.preventDefault();
  message = $("#comment-input").val().trim();

  database.ref().push({
    message: message,
  
});
});
var message = function(){
var msg = $messageInput.val();   // get the msg from the chat input
messageRef.push({  // push message
    msg: msg
});
$messageInput.val(''); // clear input
}

messageRef.on('child_added', function(snaphot){   // listen for changes in the chat Reference in the db
var msg = `${snaphot.val().msg}`;  // create a string with the msg
$messageHistory.prepend(msg);    // prepend the msg 
});

// Event Binders
$nameInput.on('click', playerName);
$submit.on('click', message);



});

  //   $("#start-button").on("click", function() {
  //     //send to database
  
  //    //send to player1
  //         if(nameInput !== "" && currentPlayer == player1){
  //           // nameInput.push("");
  //           player1Name.text(nameInput)
  //           player1Choice.text(nameInput);
  //         }
  //         else if(nameInput !== "" && player1Name !== "" && currentPlayer == player2){
  //           $("#waiting-player").text("Waiting for Player 2 to join...")
  //           // nameInput.push(name);
  //           player2Name.text(nameInput);
  //           player2Choice.text(nameInput);
  //           // player1Name.val()
  //           // player1Input.clear()
  //         }else if(nameInput !== "" && player1Name !== "" && player2Name !== ""){
  //           $("#waiting-player").text("Start game! Ro Sham Bo...")
  //         }
  
  //         setTurn();
  
  //         changePlayer();
  //     });
    
  //     $("#add-message").on("click", function(event) {
  //       event.preventDefault();
  //       message = $("#comment-input").val().trim();
  
  //       database.ref().push({
  //         message: message,
        
  //     });
  //   });
  //     $("#start-button").on("click", function(event) {
  //       event.preventDefault();
  //       nameInput = $("#name-input").val().trim();
  
  //     database.ref().push({
  //         nameInput: nameInput,
  //         // player2Input: player2Input,
  //   });
  // });
      
  //   // Initial Values
  //   var playerOneChoice = "";
  //   var playerTwoChoice = "";
  //   var playerOneWins = "";
  //   var playerTwoWins = "";
  //   var playerOneLosses = "";
  //   var playerTwoLosses = "";
  //   console.log("is this working");
  //   // Capture Button Click
    // $(".choice").on("click", function(event) {
    //     event.preventDefault();
    //     playerOneChoice = $("#player-one-choice").val().trim();
    //     playerTwoChoice = $("#player-two-choice").val().trim();
        // playerOneWins = $("#player-one-wins").val().trim();
        // playerTwoWins = $("#player-two-wins").val().trim();
        // playerOneLosses = $("#player-one-losses").val().trim();
        // playerTwoLosses = $("#player-two-losses").val().trim();
        // database.ref().push({
            
        //     playerOneChoice: playerOneChoice,
        //     playerTwoChoice: playerTwoChoice,
            // playerOneWins: playerOneWins,
            // playerTwoWins: playerTwoWins,
            // playerOneLoses: playerOneLoses,
            // playerTwoLoses: playerTwoLoses,
    //         dateAdded: firebase.database.ServerValue.TIMESTAMP
    //     });
    // });
  
//   function changePlayer(){
//       if( currentPlayer  == player1 ){
//         currentPlayer = player2;

//         // nameInput.push(name);
//         player2Name.text(nameInput)
//         player2Choice.text(nameInput);
//       }else{
//           currentPlayer = player1;
//           // nameInput.push(name);
//           player1Name.text(nameInput);
//           player1Choice.text(nameInput);
//       }
//   }

// function translateToWord(varter){
//   if(varter === "r1" || varter === "r2") return "Rock";
//   if(varter === "p1" || varter === "p2") return "Paper";
//   if(varter === "s1" || varter === "s2") return "Scissors";
// }

// function win(playerChoice, playerTwoChoice){
//  playerOneWins++;
//  playerTwoLoses++;
//  playerOneWins_span.html(playerOneWins)
//  playerTwoLoses_span.html(playerTwoLoses)
//  result_p.html(`${translateToWord(playerChoice)} beats ${translateToWord(playerTwoChoice)}. You Win!`);
// }

// function lose(playerChoice, playerTwoChoice){
//   playerTwoWins++;
//   playerOneLoses++;
//  playerOneLoses_span.html(playerOneLoses)
//  playerTwoWins_span.html(playerTwoWins)
//  result_p.html(`${translateToWord(playerChoice)} loses to ${translateToWord(playerTwoChoice)}. You Lose!`);
// }


// function tie(playerChoice, playerTwoChoice){
//   result_p.html(`${translateToWord(playerChoice)} ties with ${translateToWord(playerTwoChoice)}. It's a tie!`);

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

// // var playerTwoChoice = "r2"; "p2"; "s2"
// // var playerChoice = "r1"; "p1"; "s1"

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


// function playerOne(){
// // Create 3 number options 
// for (var i = 0; i < 3; i++) {

//   // Add number options to img tag
//   var imageRPS = $("<img>");

//   // Each rps will be given the class ".rps-image".
//   imageRPS.addClass("rps-image");
//   // imageRPS.attr("id", "player-one");

//  // Each imageRPS will be given a src link to the rps image
//  if(i === 0){ 
// $("#one-r").append(imageRPS.attr("src", "assets/images/rock.png"));
//  } else if(i === 1){
// $("#one-p").append(imageRPS.attr("src", "assets/images/paper.png"));
// }else if (i === 2) {
//   $("#one-s").append(imageRPS.attr("src", "assets/images/scissors.png"));
// }

// } 
// } 
// playerOne();

// function playerTwo(){
  
// for (var i = 0; i < 3; i++) {
  
//     // Add number options to img tag
//     var imageRPS = $("<img>");
  
//     // Each rps will be given the class ".crps-image".
//     imageRPS.addClass("rps-image");
//     // imageRPS.attr("id", "player-two");
  
//    // Each imageRPS will be given a src link to the rps image
//    if(i === 0){ 
//     $("#two-r").append(imageRPS.attr("src", "assets/images/rock.png"));
//    } else if(i === 1){
//     $("#two-p").append(imageRPS.attr("src", "assets/images/paper.png"));
//   }else if (i === 2) {
//     $("#two-s").append(imageRPS.attr("src", "assets/images/scissors.png"));
//   }
  
//   } 
// }
// playerTwo();

// });