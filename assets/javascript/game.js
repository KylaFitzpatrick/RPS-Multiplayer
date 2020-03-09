var randomNumbers = Math.floor(Math.random() * (120 - 19 + 1)) + 19;

var wins = 0;
var losses = 0;
var totalScore = [];
// // Randomly chooses a choice from the options array.
var randomNumber = [];
var guessedNumber = 0;

resetGame();

// * The player will be shown a random number at the start of the game.
//   * When the game begins again, the player should see a new random number. Also, all the crystals will have four new hidden values. Of course, the user's score (and score counter) will reset to zero.
// * The app should show the number of games the player wins and loses. To that end, do not refresh the page as a means to restart the game.
function resetGame() {
    $("#wins-text").text(wins);
    $("#losses-text").text(losses);
    $("#score-number").text("0");
    randomNumber = Math.floor(Math.random() * (120 - 19 + 1)) + 19;
    $("#random-number").text(randomNumber);
    console.log("Number to guess: " + randomNumber);
} 

    // * There will be four crystals displayed as buttons on the page.
    // * When the player clicks on a crystal, it will add a specific amount of points to the player's total score. 
//   * Your game will hide this amount until the player clicks a crystal.
//   * When they do click one, update the player's score counter.  

// Create 4 number options 
for (var i = 0; i < 3; i++) {
var numberOptions = Math.floor(Math.random() * 12) + 1;

  // Add number options to button tag
  var imageCrystal = $("<img>");

  // Each crystal will be given the class ".crystal-image".
  imageCrystal.addClass("crystal-image");

 // Each imageCrystal will be given a src link to the crystal image
 if(i === 0){ 
imageCrystal.attr("src", "assets/images/rock.png");
 } else if(i === 1){
    imageCrystal.attr("src", "assets/images/paper.png");
}else if (i === 2) {
    imageCrystal.attr("src", "assets/images/scissors.png");
}


  // Each imageCrystal will be given a data attribute called crystal value.
  imageCrystal.attr("crystal-value", numberOptions);

  // Lastly, each crystal image (with all it classes and attributes) will get added to the page.
  $("#images").append(imageCrystal);

}  
   // This time, our click event applies to every single crystal on the page. Not just one.
  $(".crystal-image").on("click", function() {

   
    //extracting value of the clicked crystal
    var crystalValue = ($(this).attr("crystal-value"));
    //converting this crystal value form a string to an integer
    crystalValue = parseInt(crystalValue);
    // Every click, from every crystal adds to the guessesNumber counter.
    guessedNumber += crystalValue;
    //dipslay the guessed number
    $("#score-number").text(guessedNumber);
    console.log(guessedNumber);

      // * The player wins if their total score matches the random number from the beginning of the game.

    if (guessedNumber === randomNumber){
        wins++;
        $('#wins').text(wins);
        $('#message').html("You won!!")
        // alert("You win!");
        resetGame(); 
   
    // * The player loses if their score goes above the random number.
    }else if (guessedNumber > randomNumber){
        losses ++;
        $('#losses').text(losses);
        $('#message').html("You lost. Try again!!")
        // alert("You lose!!");
        resetGame();
    }
  // * The player wins if their total score matches the random number from the beginning of the game.
// * The game restarts whenever the player wins or loses.
        if(guessedNumber === randomNumber || losses > 0){
            resetGame();
        }
    });