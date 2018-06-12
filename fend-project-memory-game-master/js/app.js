// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};



/*
 * Create a list that holds all of your cards
 */

let deck = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle', 'fa-diamond', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-paper-plane-o', 'fa-cube'];

let emptyDeck = []; // list to shuffle all cards in the deck
let matchedCards=[]; //list storing all currently matched cards
let faceUpCards = []; //list storing all currently faced up cards
let stars = 3;
let counter = 0; // turn counter
let StartTimer = true;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method above
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

var variableTimer = setInterval(LeTimer, 1000);
var totalTime = 0;
function LeTimer() {  //timer for the game
   ++totalTime;
   var hour = Math.floor(totalTime /3600);
   var minute = Math.floor((totalTime - hour*3600)/60);
   var seconds = totalTime - (hour*3600 + minute*60);

   document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds; //what the timer will display
}

function resetTimer() {  //in order to reset the timer when 
	clearInterval(variableTimer);
	totalTime = 0;
    variableTimer = setInterval(LeTimer, 1000);
}

function WinningMessage() {   //this id the message that will show up once the game is won if it is won
	let SectionWin = $('#winningSection');
	let hours = Math.floor(totalTime /3600);
    let minutes = Math.floor((totalTime - hours*3600)/60);
    let seconds = totalTime - (hours*3600 + minutes*60);
	$('#winningText').text('You\'ve won with score '+score+' and it took you '+hours+' hour(s) '+minutes+' minute(s) and '+seconds+' second(s). Awsome job!');
	SectionWin.css('display','block');
}

function LosingMessage() { //this is the message that will show up if the losing conditions are missed
	let SectionLoose = $('#losingSection');
	$('#losingText').text('You\'ve lost badly.');
	SectionLoose.css('display','block');
}

function starProgression(){ //this is to adjust the rating level, the more moves you make the lower the rating will go
    counter+=1
    $('.moves').text(counter);
	if (counter===30) { 
		$('#starThree').css('color','#fefefe');
		score=2;
	} else if (counter===50) {
		$('#starTwo').css('color','#fefefe');
		score=1;
	} else if (counter>70) {
		LosingMessage();
	}
}

function NewGame() { //In order to satrt a new game when certain conditions are met, i.e. pressing the restart button
    let cards = $('.card');
    cards.removeClass('match open show');

    let newGameDeck = shuffle(deck);

    emptyDeck = cards.children('i');
    emptyDeck.removeClass('fa-diamond fa-paper-plane-o fa-anchor fa-bolt fa-cube fa-leaf fa-bicycle fa-bomb')
    emptyDeck.each( function(index, item) {
        $(item).addClass(newGameDeck[index]);
    });
    
    //Reset all the variables so the game is fresh
    document.getElementById("timer").innerHTML = '0:0:0'
    faceUpCards = [];
    matchedCards = [];
    stars = 3;
    counter = 0;
    StartTimer = true;
    $('.moves').text(0);
    $('.fa-star').css('color','#000');
    clearInterval(variableTimer);

};



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


 //these funtions are to flip the cards and change the colors in faced up or matched.
function flipCardUp(card) {
	card.addClass('open show');
}

function flipCardDown(card) {
	card.removeClass('open show');
}

function cardsMatch(card) {
    card.removeClass('open show');
	card.addClass('match');
}


//this will add a card that is clicked to the faceupcards array to check to see if it is matched 
function addToFaceUpCards(card){
    let thatCard=card.children('i').attr('class').split(' ')[1];
    faceUpCards.push(thatCard);
};

function isMatched(){ //this function will check to see if the two cards in the faceUpCards array are the same or not, it will also check to see if all cards have been matched to display the winning message
    if (faceUpCards.length==2){
        if(faceUpCards[0]==faceUpCards[1]){
            cardsMatch($('.card:has(.'+faceUpCards[0]+')'));
            matchedCards.push(faceUpCards[0]);
            if(matchedCards.length===8){
                clearInterval(variableTimer);
                WinningMessage();
            }
        }
        else{
            flipCardDown($('.card:has(.'+faceUpCards[0]+')'));
            flipCardDown($('.card:has(.'+faceUpCards[1]+')'));
        }
    faceUpCards=[];
    }
}


//When a card is clicked, if its the first card clicked in the game then it will start the timer, otherwise it will flip the card up and then if two cards are up it will see if they are matched 
// This funtion will also adjust the star rating of the game
$('.card').click( function(event) {
    if(StartTimer){
        resetTimer();
        StartTimer = false;
    }

    let card = $(event.target);
    if(!card.hasClass('match') && !card.hasClass('show')){
        if(faceUpCards.length<=1){
            flipCardUp(card);
            addToFaceUpCards(card);
            starProgression();
            setTimeout(isMatched, 1500);
        };
    }
});



// Reset the board if the restart icon on the top right is clicked
$('.restart').click(NewGame);

//start a new game when the page is loaded 
$(document).ready(NewGame);


//These four are to make sure the winning and losing messages stay hidden until the correct conditons are met and to start a new game after you finish one
$('.close').click(function() {
    $('.Section').css('display', 'none');
});

window.onclick = function(event) {
    $('.Section').css('display', 'none');
};

$('.play').click(NewGame);

$('.no-play').click(function() {
    $('.Section').css('display', 'none');
    clearInterval(variableTimer);
});
