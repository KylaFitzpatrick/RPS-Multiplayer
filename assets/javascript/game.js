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
  
    // Initialize Firebase
    firebase.initializeApp(myConfig);
    var database = firebase.database();
    // Initial Values
    var userOneChoice = "";
    var userTwoChoice = "";
    var userOneWins = "";
    var userTwoWins = "";
    var userOneLosses = "";
    var userTwoLosses = "";
    console.log("is this working");
    // Capture Button Click
    $("#rps-image").on("click", function(event) {
        event.preventDefault();
        userOneChoice = $("#user-one-choice").val().trim();
        userTwoChoice = $("#user-two-choice").val().trim();
        userOneWins = $("#user-one-wins").val().trim();
        userTwoWins = $("#user-two-wins").val().trim();
        userOneLosses = $("#user-one-losses").val().trim();
        userTwoLosses = $("#user-two-losses").val().trim();
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

var userTwoWins = (userTwoWins / (userTwoWins + userOneWins + draws)) * 100;
var userOneWins = (userTwoWins / (userTwoWins + userOneWins + draws)) * 100;
var userTwoLosses = (userTwoLosses / (userTwoWins + userOneWins + draws)) * 100;
var userOneLosses = (userOneLosses / (userTwoWins + userOneWins + draws)) * 100;
// var userTwo = 0;
// var userOne = 0;
var draws = 0;
var userTwoWins = 0;
var userOneWins = 0;
var losses = 0;
var totalScore = [];
// Randomly chooses a choice from the options array.
var rps = [];
var guessedRPS = [];
var options = ["rock", "paper", "scissors"]

var playerChoice = []

var randomRPS = Math.floor(Math.random()*options.length)

var computerChoice = options[randomRPS]

resetGame();

 //showing timer after game starts
 function startGame(){
  $("#hideQuiz").show()
  $("#score").hide()
  $("#image-answer").hide()
  display()
  interval = setInterval(countDown, 1000)
  
}
//after user clicks start button the button is hidden
$("#start-button").on("click", function (){
    //  alert("Clicked");
    $(".hideButton").hide()
      startGame()    
});

function resetGame() {
  $("#wins-text").text(wins);
  $("#losses-text").text(losses);
  $("#score-rps").text("0");
  var randomRPS = Math.floor(Math.random()*options.length)
  $("#random-rps").text(randomRPS);
  console.log("Number to guess: " + randomRPS);
} 

function choiceWinner(){
	// if user 1 choose rock and user 2 chooses rock user tie
// if user 1 chooses scissor and user 2 chooses scissor tie
//if user 1 chooses paper and user 2 chooses paper tie
	if (playerChoice == computerChoice) {
  	// display tie
  	$("#message").html("You selected " + playerChoice + " and the computer selected " + computerChoice + ". Game tied.<br />")
  } 
  // if user 1 choose rock and user 2 chooses paper user 2 wins
//if user 1 choose scissor and user 2 chooses rock user 2 wins
// if user 1 chooses paper and user 2 chooses scissor user 2 wins
  else if (playerChoice == "rock" && computerChoice == "paper" || playerChoice == "scissors" && computerChoice == "rock" || playerChoice == "paper" && computerChoice == "scissors") {
  	//display user 2 wins
  	$("#message").html("You selected " + playerChoice + " and the computer selected " + computerChoice + ". You lost. <br />")  	
    userTwoWins++;
  }

 // if user 1 choose rock and user 2 chooses paper user 1 wins
// if user 1 choose scissor and user 2 chooses paper user 1 wins 
// if user 1 chooses paper and user 2 chooses rock user 1 wins
  else if (playerChoice == "rock" && computerChoice == "scissors" || playerChoice == "scissors" && computerChoice == "paper" || playerChoice == "paper" && computerChoice == "rock") {
  	//display user 1 wins
    $("#message").html("You selected " + playerChoice + " and the computer selected " + computerChoice + ". You won. <br />") 
    userOneWins++;
  } 
  //alert select rps
  else {
  	//alert dipslays
  	alert("Please select rock, paper or scissors")
  }
}
//
choiceWinner()

    // * There will be 3 choices displayed as buttons on the page.
    // * When the player clicks on a r, p ,s , and other user clicks r, p, s evaluate winnerit will add a specific amount of points to the player's total score. 
//   * Your game will hide this amount until thre is a winner.
//   * When they do click one, update the player choice is displayed.  

function userOne(){
// Create 3 number options 
for (var i = 0; i < 3; i++) {
var randomChoice = Math.floor(Math.random()*options.length)

  // Add number options to button tag
  var imageRPS = $("<img>");

  // Each rps will be given the class ".crps-image".
  imageRPS.addClass("rps-image");
  // imageRPS.attr("id", "user-one");

 // Each imageRPS will be given a src link to the rps image
 if(i === 0){ 
imageRPS.attr("src", "assets/images/rock.png");
 } else if(i === 1){
    imageRPS.attr("src", "assets/images/paper.png");
}else if (i === 2) {
    imageRPS.attr("src", "assets/images/scissors.png");
}


  // Each imageRPS will be given a data attribute called rps value.
  imageRPS.attr("rps-value", randomChoice);

  // Lastly, each rps image (with all it classes and attributes) will get added to the page.
  // $("#images").append(imageRPS);
  $("#user-one").append(imageRPS);

} 
} 
userOne();

function userTwo(){
  // Create 3 options 
  // var userTwo = "<p>" + "User 1" + "<p>"
  // userTwo;
for (var i = 0; i < 3; i++) {
  var randomChoice = Math.floor(Math.random()*options.length)
  
    // Add number options to button tag
    var imageRPS = $("<img>");
  
    // Each rps will be given the class ".crps-image".
    imageRPS.addClass("rps-image");
    // imageRPS.attr("id", "user-two");
  
   // Each imageRPS will be given a src link to the rps image
   if(i === 0){ 
  imageRPS.attr("src", "assets/images/rock.png");
   } else if(i === 1){
      imageRPS.attr("src", "assets/images/paper.png");
  }else if (i === 2) {
      imageRPS.attr("src", "assets/images/scissors.png");
  }
  
  
    // Each imageRPS will be given a data attribute called rps value.
    imageRPS.attr("rps-value", randomChoice);
  
    // Lastly, each rps image (with all it classes and attributes) will get added to the page.
    // $("#images").append(imageRPS);
    $("#user-two").append(imageRPS);
  
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

    // if (wins > 3){
    //     $('#wins').text(wins);
    //     $('#message').html("You won!!")
    //     // alert("You win!");
    //     resetGame(); 
   
    // // * The player loses if other play wins 3 times.
    // }else if (guessedNumber > randomNumber){
    //     losses ++;
    //     $('#losses').text(losses);
    //     $('#message').html("You lost. Try again!!")
    //     // alert("You lose!!");
    //     resetGame();
    // }
 //resetgame if tie or player losses
        if(guessedRPS === randomRPS || losses > 0){
            resetGame();
        }
    });
  });