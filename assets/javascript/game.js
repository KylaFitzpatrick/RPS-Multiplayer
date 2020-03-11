$(document).ready(function() {
  var player1 = true;
  var player2 = true;
  var player1Name = $("user-one-label");
  var player2Name = $("user-two-label");
  var player1Choice = $("user-one-choice")
  var player2Choice = $("user-two-choice")
  var nameInput = $("#name-input")
  var name = ""
  var currentPlayer = player1;
  
  function changePlayer(){
      if( currentPlayer  == player1 ){
        currentPlayer = player2;

        nameInput.push(name);
        player2Name.text(name)
        player2Choice.text(name);
      }else{
          currentPlayer = player1;
          nameInput.push(name);
          player1Name.text(name);
          player1Choice.text(name);
      }
  }

 function resetGame(){
  userOneWins = 0;
  userTwoWins = 0;
  userTwoLoses = 0;
  userOneLoses = 0;

 }
  $("#start-button").on("click", function() {
    //send to database

//   //send to user1

        //   if(wins === 3){
        //     resetGame();
        // }

        // player1Name = $("#player-1-inp").val();
        // player2Name = $("#player-2-inp").val();

        // if(player1Name=="" || player2Name==""){
        //     alert("Please set player all the names.");
        //     return;
        // }

        // setTurn();

        changePlayer();
    });
  
 
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
  //   // Initial Values
  //   var userOneChoice = "";
  //   var userTwoChoice = "";
  //   var userOneWins = "";
  //   var userTwoWins = "";
  //   var userOneLosses = "";
  //   var userTwoLosses = "";
  //   console.log("is this working");
  //   // Capture Button Click
    $("#rps-image").on("click", function(event) {
        event.preventDefault();
        userOneChoice = $("#user-one-choice").val().trim();
        userTwoChoice = $("#user-two-choice").val().trim();
        // userOneWins = $("#user-one-wins").val().trim();
        // userTwoWins = $("#user-two-wins").val().trim();
        // userOneLosses = $("#user-one-losses").val().trim();
        // userTwoLosses = $("#user-two-losses").val().trim();
        database.ref().push({
            userOneChoice: userOneChoice,
            userTwoChoice: userTwoChoice,
            userOneWins: userOneWins,
            userTwoWins: userTwoWins,
            userOneLosses: userOneLosses,
            userTwoLosses: userTwoLosses,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });
    database.ref().on("child_added", function(snapshot){
        userOneChoice = snapshot.val().userOneChoice,
        userTwoChoice = snapshot.val().userTwoChoice,
        userOneWins = snapshot.val().userOneWins;
        userTwoWins = snapshot.val().userTwoWins;
        userOneLosses = snapshot.val().userOneLosses;
        userTwoLosses = snapshot.val().userTwoLosses;
        $("#user-one-choice").append(`
            <div>${userOneChoice}</div>`)
        $("#user-two-choice").append(`
            <div>${userTwoChoice}</div>`)
        $("#user-one-wins").append(`
            <div>${userOneWins}</div>`)  
        $("#user-two-wins").append(`
            <div>${userTwoWins}</div>`) 
        $("#user-one-losses").append(`
            <div>${userOneLosses}</div>`)  
        $("#user-two-losses").append(`
            <div>${userTwoLosses}</div>`)    
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    }) 

var userTwoWins = 0;
var userTwoWins_span = $("#user-two-wins");
var userOneWins = 0;
var userOneWins_span = $("#user-one-wins");
var userTwoLoses = 0;
var userTwoLoses_span = $("#user-two-losses");
var userOneLoses = 0;
var userOneLoses_span = $("#user-one-losses");
var scoreBoard_div = $("#score-board");
var result_p = $(".result > p");
var oneRock_div = $("#one-r")
var onePaper_div = $("#one-p")
var oneScissors_div = $("#one-s")
var twoRock_div = $("#two-r")
var twoPaper_div = $("#two-p")
var twoScissors_div = $("#two-s")

// $("#start-button").on("click", function (){
//    alert("Clicked");
//   // $(".hideButton").hide()
//   //send to database
//   //send to user1

//     startGame()    
// });
function translateToWord(letter){
  if(letter === "r1" || letter === "r2") return "Rock";
  if(letter === "p1" || letter === "p2") return "Paper";
  if(letter === "s1" || letter === "s2") return "Scissors";
}

function win(userChoice, userTwoChoice){
 userOneWins++;
 userOneWins_span.html(userOneWins)
 userTwoLoses_span.html(userTwoLoses)
 result_p.html(`${translateToWord(userChoice)} beats ${translateToWord(userTwoChoice)}. You Win!`);
}

function lose(){
  userTwoWins++;
 userOneLoses_span.html(userOneLoses)
 userTwoWins_span.html(userTwoWins)
 result_p.html(`${translateToWord(userChoice)} loses to ${translateToWord(userTwoChoice)}. You Lose!`);
}


function tie(){
  result_p.html(`${translateToWord(userChoice)} ties with ${translateToWord(userTwoChoice)}. It's a tie!`);

}
function getUserTwoChoices(){
  var choices = ["r2", "p2", "s2"]
  var randomNumber = Math.floor(Math.random() * 3);
  return choices[randomNumber];
}
// console.log(getUserTwoChoices());

function game(userChoice){
  var userTwoChoice = getUserTwoChoices();
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
main();



function resetGame() {
  $("#wins-text").text(wins);
  $("#losses-text").text(losses);
  $("#score-rps").text("0");
  console.log("Number to guess: " + randomRPS);
} 


function userOne(){
// Create 3 number options 
for (var i = 0; i < 3; i++) {
// var randomChoice = Math.floor(Math.random()*options.length)

  // Add number options to button tag
  var imageRPS = $("<img>");

  // Each rps will be given the class ".crps-image".
  imageRPS.addClass("rps-image");
  // imageRPS.attr("id", "user-one");

 // Each imageRPS will be given a src link to the rps image
 if(i === 0){ 
// imageRPS.attr("src", "assets/images/rock.png");
$("#one-r").append(imageRPS.attr("src", "assets/images/rock.png"));
 } else if(i === 1){
$("#one-p").append(imageRPS.attr("src", "assets/images/paper.png"));
}else if (i === 2) {
  $("#one-s").append(imageRPS.attr("src", "assets/images/scissors.png"));
}


  // Each imageRPS will be given a data attribute called rps value.
  // imageRPS.attr("rps-value", randomChoice);

  // Lastly, each rps image (with all it classes and attributes) will get added to the page.
  // $("#images").append(imageRPS);
  // $("#user-one").append(imageRPS);

} 
} 
userOne();

function userTwo(){
  // Create 3 options 
  // var userTwo = "<p>" + "User 1" + "<p>"
  // userTwo;
for (var i = 0; i < 3; i++) {
  // var randomChoice = Math.floor(Math.random()*options.length)
  
    // Add number options to button tag
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
  
  
    // Each imageRPS will be given a data attribute called rps value.
    // imageRPS.attr("rps-value", randomChoice);
  
    // Lastly, each rps image (with all it classes and attributes) will get added to the page.
    // $("#images").append(imageRPS);
    // $("#user-two").append(imageRPS);
  
  } 
}
userTwo();
   // This time, our click event applies to every single rps on the page. Not just one.
  $(".rps-image").on("click", function() {

   
    //extracting value of the clicked rps
    var rpsValue = ($(this).attr("rps-value"));
    // Every click, from every rps adds to the guessesRPS counter.
    guessedRPS += rpsValue;
    //dipslay the guessed number
    $("#score-rps").text(guessedRPS);
    console.log(guessedRPS);

    if (wins > 3){
        $('#wins').text(wins);
        $('#message').html("You won!!")
        // alert("You win!");
        resetGame(); 
   
    // // * The player loses if other play wins 3 times.
    }else if (guessedNumber > randomNumber){
        losses ++;
        $('#losses').text(losses);
        $('#message').html("You lost. Try again!!")
        // alert("You lose!!");
        resetGame();
    }
 //resetgame if tie or player losses
        if(guessedRPS === randomRPS || losses > 0){
            resetGame();
        }
    });
  });