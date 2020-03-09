$(document).ready(function() {

var percentageWins = (playerWins / (computerWins + playerWins + draws)) * 100;

var computerWins = 0;
var playerWins = 0;
var draws = 0;
var wins = 0;
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
    computerWins++;
  }

 // if user 1 choose rock and user 2 chooses paper user 1 wins
// if user 1 choose scissor and user 2 chooses paper user 1 wins 
// if user 1 chooses paper and user 2 chooses rock user 1 wins
  else if (playerChoice == "rock" && computerChoice == "scissors" || playerChoice == "scissors" && computerChoice == "paper" || playerChoice == "paper" && computerChoice == "rock") {
  	//display user 1 wins
    $("#message").html("You selected " + playerChoice + " and the computer selected " + computerChoice + ". You won. <br />") 
    playerWins++;
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

// Create 6 number options 
for (var i = 0; i < 6; i++) {
var randomChoice = Math.floor(Math.random()*options.length)

  // Add number options to button tag
  var imageRPS = $("<img>");

  // Each rps will be given the class ".crps-image".
  imageRPS.addClass("rps-image");

 // Each imageRPS will be given a src link to the rps image
 if(i === 0 || i === 3){ 
imageRPS.attr("src", "assets/images/rock.png");
 } else if(i === 1 || i === 4){
    imageRPS.attr("src", "assets/images/paper.png");
}else if (i === 2 || i === 5) {
    imageRPS.attr("src", "assets/images/scissors.png");
}


  // Each imageRPS will be given a data attribute called rps value.
  imageRPS.attr("rps-value", randomChoice);

  // Lastly, each rps image (with all it classes and attributes) will get added to the page.
  $("#images").append(imageRPS);

}  
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