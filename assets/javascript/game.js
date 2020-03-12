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
//     userOneChoice = snapshot.val().userOneChoice,
//     userTwoChoice = snapshot.val().userTwoChoice,
//     userOneWins = snapshot.val().userOneWins;
//     userTwoWins = snapshot.val().userTwoWins;
//     userOneLosses = snapshot.val().userOneLosses;
//     userTwoLosses = snapshot.val().userTwoLosses;
//     $("#user-one-label").append(`
//     <div>${nameInput}</div>`)
//     $("#user-two-label").append(`
//     <div >${nameInput}</div>`)
//     $("#user-one-choice").append(`
//         <div>${nameInput}</div>`)
//     $("#user-two-choice").append(`
//         <div>${nameInput}</div>`)
//     // $("#user-one-wins").append(`
//     //     <div>${userOneWins}</div>`)  
//     // $("#user-two-wins").append(`
//     //     <div>${userTwoWins}</div>`) 
//     // $("#user-one-losses").append(`
//     //     <div>${userOneLosses}</div>`)  
//     // $("#user-two-losses").append(`
//     //     <div>${userTwoLosses}</div>`)
//     $("#comment-display").append(`${message}`)    
// }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
// }) 

// resetGame();

  // Variables
  var player2Name = '';
  var player1Name = '';
  var userOneWins = 0;
  var userOneLoses = 0;
  var player1Choice = '';
  var userTwoWins = 0;
  var userTwoLoses = 0;
  var player2Choice = '';
  var pTurn = '';
  var activePnum = 0;
  var ties = '';

  //dom
  var $player1Name = $("user-one-label");
  var $player2Name = $("user-two-label");
  var $player1Choice = $("user-one-choice");
  var $player2Choice = $("user-two-choice");
  var $nameInput = $("#name-input");
  var $message = $("#comment-input");
  var $submit = $("add-message");
  var $userTwoWins_span = $("#user-two-wins");
  var $userOneWins_span = $("#user-one-wins");
  var $userTwoLoses_span = $("#user-two-loss");
  var $userOneLoses_span = $("#user-one-loss");
  var $result_p = $(".result > p");
  var $oneRock_div = $("#one-r");
  var $onePaper_div = $("#one-p");
  var $oneScissors_div = $("#one-s");
  var $twoRock_div = $("#two-r");
  var $twoPaper_div = $("#two-p");
  var $twoScissors_div = $("#two-s"); 
  var $playerName = $('#name');
  

  //functions

  var playerName = function(){
    connectedRef.on('value', function(snapshot) { // is player connected/disconnected
      if(snaphot.val()){ // if connected
          connectionsRef.push(true);
          connectionsRef.onDisconnect().remove(); // remove user from the connection when they disconnect
      }
  });
  connectionsRef.on('value', function(snapshot){ // If I just moved someone to my connection folder
    console.log(`Number of players online ${snapshot.numChildren()}`); 
    activePnum = snapshot.numChildren();    // Get the number of connections at the moment
    playerNameVal = $playerName.val(); // Get the name of the user
    $pNameSpan.html(` ${pNameVal}`); // Greet current player

    if(activePnum == 1) { // If you're the 1st player
        chatRef.set({}); // If there's only one user, clear the chat history in the db
        $chatUl.empty(); // Clear the HTML
        
        p1NameVal = pNameVal;   // Store the current name into a new variable to keep track inside the app
        // Create the object
        const p1 = {
            choice: '',
            name: p1NameVal, 
        };
        const t = { whoseturn: turn };

        // Sync object
        p1Ref.set(p1);
        turnRef.set(t);

        // Wait for player two
        $rPanel.html('Waiting for player 2');
        console.log('Waiting for player 2');

        turn = 'p2turn';
        turnRef.update({ whoseturn: turn }); // Update the turn in the db

    }
    else if(activePnum == 2) {  // If you are the 2nd player
        p2NameVal = pNameVal;   // Store the current name into a different variable to keep track
        // Create the object
        const p2 = {
            choice: '',
            name: p2NameVal
        };
        const w = {
            p1: p1Wins,
            p2: p2Wins
        }
        const l = {
            p1: p1Losses,
            p2: p2Losses
        }
        // Sync object
        p2Ref.set(p2); 
        winsRef.set(w);
        losesRef.set(l);

        // Inform user
        $rPanel.html('Play Now!');
        console.log('play now');
        turn = 'p1turn';
        turnRef.update({ whoseturn: turn });
    }
});
}

turnRef.on('child_changed', (snap) => { // Listen for turn changes
let pturn = snap.val();
console.log(`It's ${pturn}`);
if(pturn == 'p1turn' && activePnum == 2) {  // If it's p1 turn and there's 2 players online
    $p1choice.on('click', getPchoice(pturn)); // Listen for p1 click events on the choice btns
}
else if(pturn == 'p2turn' && activePnum == 2) { //If it's p1 turn and there's 2 players online
    $p2choice.on('click', getPchoice(pturn)); // Liste for p2 click events
}
});

playersRef.on('value', (snap) => {   // When P2 makes a choice
if(turn == 'p2turn' && activePnum == 2) {   // Only compute results when is player 2's turn and there are 2 people connected
    let p1name = snap.val().p1.name;
    let p2name = snap.val().p2.name;
    let p1hand = snap.val().p1.choice;
    let p2hand = snap.val().p2.choice;

    if( p1hand == 'rock' && p2hand == 'rock'){
        resultsin = 'Tie';
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'rock' && p2hand == 'paper'){
        resultsin = `Player 2:<br>${p2name}<br>Won`;
        p1Losses++;
        p2Wins++;
        winsRef.update({ p1: p1Wins, p2: p2Wins});
        losesRef.update({ p1: p1Losses, p2: p2Losses });
        $p1LoseCountSpan.html(p1Losses);
        $p2WinCountSpan.html(p2Wins);
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'rock' && p2hand == 'scissors'){
        resultsin = `Player 1:<br>${p1name}<br>Won`;
        p2Losses++;
        p1Wins++;
        winsRef.update({ p1: p1Wins, p2: p2Wins});
        losesRef.update({ p1: p1Losses, p2: p2Losses });
        $p1WinCountSpan.html(p1Wins);
        $p2LoseCountSpan.html(p2Losses);
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'paper' && p2hand == 'paper'){
        resultsin = 'Tie';
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'paper' && p2hand == 'rock'){
        resultsin = `Player 1:<br>${p1name}<br>Won`;
        p2Losses++;
        p1Wins++;
        winsRef.update({ p1: p1Wins, p2: p2Wins });
        losesRef.update({ p1: p1Losses, p2: p2Losses });
        $p1WinCountSpan.html(p1Wins);
        $p2LoseCountSpan.html(p2Losses);
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'paper' && p2hand == 'scissors'){
        resultsin = `Player 2:<br>${p2name}<br>Won`;
        p1Losses++;
        p2Wins++;
        winsRef.update({ p1: p1Wins, p2: p2Wins });
        losesRef.update({ p1: p1Losses, p2: p2Losses });
        $p1LoseCountSpan.html(p1Losses);
        $p2WinCountSpan.html(p2Wins);
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'scissors' && p2hand == 'scissors'){
        resultsin = 'Tie';
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'scissors' && p2hand == 'rock'){
        resultsin = `Player 2:<br>${p2name}<br>Won`;
        p1Losses++;
        p2Wins++;
        winsRef.update({ p1: p1Wins, p2: p2Wins });
        losesRef.update({ p1: p1Losses, p2: p2Losses });
        $p1LoseCountSpan.html(p1Losses);
        $p2WinCountSpan.html(p2Wins);
        $rPanel.html(resultsin);
    }
    else if( p1hand == 'scissors' && p2hand == 'paper'){
        resultsin = `Player 1:<br>${p1name}<br>Won`;
        p2Losses++;
        p1Wins++;
        winsRef.update({ p1: p1Wins, p2: p2Wins });
        losesRef.update({ p1: p1Losses, p2: p2Losses });
        $p1WinCountSpan.html(p1Wins);
        $p2LoseCountSpan.html(p2Losses);
        $rPanel.html(resultsin);
    }
}
});

const getPchoice = (pturn) => {  // Save user choice to Firebase
return e => {
    let leTarget = $(e.target);
    let pChoice = leTarget.attr('data-userChoice');    // Get player choice attr from the clicked button
    leTarget.closest('div.card').find('img').attr('src', `./assets/imgs/${pChoice}.png`); // Change the img to match the user's choice
    if (pturn == 'p1turn'){
        p1Choice = pChoice; // store the the data-userChoice attr value in a variable
        p1Ref.update({ choice: p1Choice }); //Update the database with the user choice
        turn = 'p2turn';    // Change the turn and store the value in a variable
        turnRef.update({ whoseturn: turn });    // Update the turn in the database
        $p1Badge.toggleClass('yourturn');
        $p2Badge.toggleClass('yourturn');
        $p1choice.off('click'); // Removes the event listener 
    }
    else {
        p2Choice = pChoice;
        p2Ref.update({ choice: p2Choice }); //Update the user choice
        turn = 'p1turn';
        turnRef.update({ whoseturn: turn });
        $p1Badge.toggleClass('yourturn');
        $p2Badge.toggleClass('yourturn');
        $p2choice.off('click');
    }
}
}

const chat = () => {
let leMsg = $chatInput.val();   // Get the msg from the chat input
chatRef.push({  // Push the message
    msg: leMsg
});
$chatInput.val(''); // Empty input
}

chatRef.on('child_added', (snap) => {   // Listen for changes in the chat Reference in the db
let msgStr = `<li class="list-group-item list-group-item-dark">${snap.val().msg}`;  // Create a string with the msg
$chatUl.prepend(msgStr);    // Prepend the msg so it's at the top
});

// Event Binders
$lego.on('click', playerName);
$chatBtn.on('click', chat);



});

    $("#start-button").on("click", function() {
      //send to database
  
     //send to user1
          if(nameInput !== "" && currentPlayer == player1){
            // nameInput.push("");
            player1Name.text(nameInput)
            player1Choice.text(nameInput);
          }
          else if(nameInput !== "" && player1Name !== "" && currentPlayer == player2){
            $("#waiting-player").text("Waiting for Player 2 to join...")
            // nameInput.push(name);
            player2Name.text(nameInput);
            player2Choice.text(nameInput);
            // player1Name.val()
            // player1Input.clear()
          }else if(nameInput !== "" && player1Name !== "" && player2Name !== ""){
            $("#waiting-player").text("Start game! Ro Sham Bo...")
          }
  
          setTurn();
  
          changePlayer();
      });
    
      $("#add-message").on("click", function(event) {
        event.preventDefault();
        message = $("#comment-input").val().trim();
  
        database.ref().push({
          message: message,
        
      });
    });
      $("#start-button").on("click", function(event) {
        event.preventDefault();
        nameInput = $("#name-input").val().trim();
  
      database.ref().push({
          nameInput: nameInput,
          // player2Input: player2Input,
    });
  });
      
  //   // Initial Values
  //   var userOneChoice = "";
  //   var userTwoChoice = "";
  //   var userOneWins = "";
  //   var userTwoWins = "";
  //   var userOneLosses = "";
  //   var userTwoLosses = "";
  //   console.log("is this working");
  //   // Capture Button Click
    // $(".choice").on("click", function(event) {
    //     event.preventDefault();
    //     userOneChoice = $("#user-one-choice").val().trim();
    //     userTwoChoice = $("#user-two-choice").val().trim();
        // userOneWins = $("#user-one-wins").val().trim();
        // userTwoWins = $("#user-two-wins").val().trim();
        // userOneLosses = $("#user-one-losses").val().trim();
        // userTwoLosses = $("#user-two-losses").val().trim();
        // database.ref().push({
            
        //     userOneChoice: userOneChoice,
        //     userTwoChoice: userTwoChoice,
            // userOneWins: userOneWins,
            // userTwoWins: userTwoWins,
            // userOneLoses: userOneLoses,
            // userTwoLoses: userTwoLoses,
    //         dateAdded: firebase.database.ServerValue.TIMESTAMP
    //     });
    // });
  
  function changePlayer(){
      if( currentPlayer  == player1 ){
        currentPlayer = player2;

        // nameInput.push(name);
        player2Name.text(nameInput)
        player2Choice.text(nameInput);
      }else{
          currentPlayer = player1;
          // nameInput.push(name);
          player1Name.text(nameInput);
          player1Choice.text(nameInput);
      }
  }

function translateToWord(varter){
  if(varter === "r1" || varter === "r2") return "Rock";
  if(varter === "p1" || varter === "p2") return "Paper";
  if(varter === "s1" || varter === "s2") return "Scissors";
}

function win(userChoice, userTwoChoice){
 userOneWins++;
 userTwoLoses++;
 userOneWins_span.html(userOneWins)
 userTwoLoses_span.html(userTwoLoses)
 result_p.html(`${translateToWord(userChoice)} beats ${translateToWord(userTwoChoice)}. You Win!`);
}

function lose(userChoice, userTwoChoice){
  userTwoWins++;
  userOneLoses++;
 userOneLoses_span.html(userOneLoses)
 userTwoWins_span.html(userTwoWins)
 result_p.html(`${translateToWord(userChoice)} loses to ${translateToWord(userTwoChoice)}. You Lose!`);
}


function tie(userChoice, userTwoChoice){
  result_p.html(`${translateToWord(userChoice)} ties with ${translateToWord(userTwoChoice)}. It's a tie!`);

}
function getUserTwoChoices(){
  // var choices = ["r2", "p2", "s2"]
  // var randomNumber = Math.floor(Math.random() * 3);
  // return choices[""];
  twoRock_div.on("click", function(){
    game("r2");
  })
  
  twoPaper_div.on("click", function(){
    game("p2");
  })
  
  twoScissors_div.on("click", function(){
    game("s2");
  })
}
getUserTwoChoices();
// console.log(getUserTwoChoices()); 

// var userChoice = getUserOneChoices();

function game(userChoice){
  var userTwoChoice = getUserTwoChoices();
  // userChoice = getUserOneChoices();
  
  switch(userChoice + userTwoChoice){
    case "r1s2":
    case "p1r2":
    case "s1p2":
      console.log("user1 wins");
      win(userChoice, userTwoChoice);
      break;
    case "s1r2":
    case "r1p2":
    case "p1s2":
      console.log("user1 loses")
      lose(userChoice, userTwoChoice);
      break;
    case "r1r2":
    case "p1p2":
    case "s1s2":
      console.log("tie")
      tie(userChoice, userTwoChoice);
      break;
  }
}

// var userTwoChoice = "r2"; "p2"; "s2"
// var userChoice = "r1"; "p1"; "s1"

// function getUserOneChoices(){
 
function main(){

oneRock_div.on("click", function(){
  game("r1");
})

onePaper_div.on("click", function(){
  game("p1");
})

oneScissors_div.on("click", function(){
  game("s1");
})

// twoRock_div.on("click", function(){
//   game("r2");
// })

// twoPaper_div.on("click", function(){
//   game("p2");
// })

// twoScissors_div.on("click", function(){
//   game("s2");
// })
}
// var userChoice = getUserOneChoices();
main();



function resetGame() {
  //resetgame if tie or player losses
 if(userTwoWins === 3 || userOneWins === 3){
  $("#user-one-wins").text("0");
  $("#user-two-wins").text("0");
  $("#user-one-loses").text("0");
  $("#user-two-loses").text("0");
 }
  console.log(" game is reset");
} 


function userOne(){
// Create 3 number options 
for (var i = 0; i < 3; i++) {

  // Add number options to img tag
  var imageRPS = $("<img>");

  // Each rps will be given the class ".rps-image".
  imageRPS.addClass("rps-image");
  // imageRPS.attr("id", "user-one");

 // Each imageRPS will be given a src link to the rps image
 if(i === 0){ 
$("#one-r").append(imageRPS.attr("src", "assets/images/rock.png"));
 } else if(i === 1){
$("#one-p").append(imageRPS.attr("src", "assets/images/paper.png"));
}else if (i === 2) {
  $("#one-s").append(imageRPS.attr("src", "assets/images/scissors.png"));
}

} 
} 
userOne();

function userTwo(){
  
for (var i = 0; i < 3; i++) {
  
    // Add number options to img tag
    var imageRPS = $("<img>");
  
    // Each rps will be given the class ".crps-image".
    imageRPS.addClass("rps-image");
    // imageRPS.attr("id", "user-two");
  
   // Each imageRPS will be given a src link to the rps image
   if(i === 0){ 
    $("#two-r").append(imageRPS.attr("src", "assets/images/rock.png"));
   } else if(i === 1){
    $("#two-p").append(imageRPS.attr("src", "assets/images/paper.png"));
  }else if (i === 2) {
    $("#two-s").append(imageRPS.attr("src", "assets/images/scissors.png"));
  }
  
  } 
}
userTwo();

});