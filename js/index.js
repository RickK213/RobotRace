$(document).ready(function() {

    "use strict";

    startGame();

/*****************************************
/** HELPER FUNCTIONS
*****************************************/

    function fadeInGameBoard() {
        $("#howToPlay").fadeOut(function(){
            $('#gameBoard').fadeIn();
        });
    }
    function changeGameMessage(message) {
        $("#gameMessages p").html(message);
    }

    function changePlayer1Message(message) {
        $("#player1Messages p").html(message);
    }

    function changePlayer2Message(message) {
        $("#player2Messages p").html(message);
    }

    function rollDice(numSides){
        let dieRoll = Math.floor(Math.random() * numSides) + 1;
        return dieRoll;
    }

    function rollFirstDie() {
        let numSides = 6;
        let dieRoll = rollDice(numSides);
        return dieRoll;
    }

    function showRollFirstResults(player1FirstRoll, player2FirstRoll) {
        let gameMessage;
        let firstPlayer;
        if ( player1FirstRoll === player2FirstRoll ) {
            gameMessage = 'Player 1 and Player 2 tied. <button class="btn btn-success" id="rollFirstsAgain">Roll Again</button>';
        } else if ( player1FirstRoll > player2FirstRoll ) {
            gameMessage = '<strong class="text-primary">PLAYER 1</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            firstPlayer = 1;
        } else {
            gameMessage = '<strong class="text-danger">PLAYER 2</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            firstPlayer = 2;
        }
        changeGameMessage(gameMessage);
        $("#rollFirstsAgain").click(function(){
            rollForFirsts();
        });        
        $("#startTurns").click(function(){
            startTurns(firstPlayer);
        });        
    }
    function rollForFirsts(){
        $("#player1Button").prop('disabled', false);
        changeGameMessage('Let\'s begin by rolling the 6-sided die to see who goes first.');
        changePlayer1Message('It is your turn, roll the dice');
        changePlayer2Message('Wait for your turn.');
        let player1FirstRoll;
        let player2FirstRoll;
        $("#player1Button").click(function(){
            player1FirstRoll = rollFirstDie();
            changePlayer1Message('You rolled a ' + player1FirstRoll);
            $(this).prop('disabled', true);
            changePlayer2Message('It is your turn, roll the dice');
            $("#player2Button").prop('disabled', false);

        });        
        $("#player2Button").click(function(){
            player2FirstRoll = rollFirstDie();
            changePlayer2Message('You rolled a ' + player2FirstRoll);
            $(this).prop('disabled', true);
            showRollFirstResults(player1FirstRoll, player2FirstRoll);
        });
    }

/*****************************************
/** START GAME
*****************************************/

    function startGame() {
        $(".playButton").click(function(){
            fadeInGameBoard();
            rollForFirsts();
        });
    }

/*****************************************
/** START TURNS
*****************************************/

    function startTurns(firstPlayer) {
        console.log("Player " + firstPlayer + " goes first");
    }


});