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