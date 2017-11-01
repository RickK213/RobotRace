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
        $("#gameMessages").html(message);
    }

    function changePlayer1Message(message) {
        $("#player1Messages").html(message);
    }

    function changePlayer2Message(message) {
        $("#player2Messages").html(message);
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
        let isPlayer1Done;
        if ( player1FirstRoll === player2FirstRoll ) {
            gameMessage = 'Player 1 and Player 2 tied. <button class="btn btn-success" id="rollFirstsAgain">Roll Again</button>';
        } else if ( player1FirstRoll > player2FirstRoll ) {
            gameMessage = '<strong class="text-primary">PLAYER 1</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            isPlayer1Done = false;
        } else {
            gameMessage = '<strong class="text-danger">PLAYER 2</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            isPlayer1Done = true;
        }
        changeGameMessage(gameMessage);
        $("#rollFirstsAgain").click(function(){
            rollForFirsts();
        });        
        $("#startTurns").click(function(){
            startTurns(isPlayer1Done);
        });        
    }
    
    function switchPlayers(isPlayer1Done, doSwitchMessages) {
        if(isPlayer1Done){
            $("#player1Interface").addClass("invisible");
            $("#player2Interface").removeClass("invisible");
            $("#player1 .diceInHand").html("");
            if(doSwitchMessages){
                changePlayer1Message('Wait for your turn.');
                changePlayer2Message('It is your turn, roll the dice');
            }
        } else {
            $("#player1Interface").removeClass("invisible");
            $("#player2Interface").addClass("invisible");
            $("#player1 .diceInHand").html("");
            if(doSwitchMessages){
                changePlayer1Message('It is your turn, roll the dice');
                changePlayer2Message('Wait for your turn.');
            }
        }
    }

    function rollForFirsts(){
        $("#player1Interface").removeClass("invisible");
        changeGameMessage('Begin by rolling the 6-sided die to see who goes first.');
        changePlayer1Message('It is your turn, roll the dice');
        changePlayer2Message('Wait for your turn.');
        let player1FirstRoll;
        let player2FirstRoll;
        $("#player1Button").click(function(){
            player1FirstRoll = rollFirstDie();
            changePlayer1Message('You rolled a ' + player1FirstRoll);
            changePlayer2Message('It is your turn, roll the dice');
            let isPlayer1Done = true;
            let doSwitchMessages = false;
            switchPlayers(isPlayer1Done, doSwitchMessages);
            let diceInPlay = getDiceInPlay("six");
            putDiceInHand(isPlayer1Done, diceInPlay);
        });        
        $("#player2Button").click(function(){
            player2FirstRoll = rollFirstDie();
            changePlayer2Message('You rolled a ' + player2FirstRoll);
            $("#player2Interface").addClass("invisible");
            showRollFirstResults(player1FirstRoll, player2FirstRoll);
        });
    }

    function putDiceInHand(isPlayer1Done, diceInPlay){
        let switchDiv;
        let diceDivs = "";
        if(isPlayer1Done) {
            switchDiv = "#player2 .diceInHand";
        } else {
            switchDiv = "#player1 .diceInHand";
        }
        for (let i=0; i<diceInPlay.length; i++) {
            diceDivs += '<div class="die die-' + diceInPlay[i] + '"></div>';
        }
        $(switchDiv).html(diceDivs);
    }

    function getDiceInPlay(dice){
        if(dice === "all"){
            return [4,6,8,10,12,20];
        } else if ( dice==="six" ) {
            return [6];
        } else if ( dice==="ten" ) {
            return [10];
        }
    }
    function initializeTurns(isPlayer1Done){
        let switchMessages = true;
        switchPlayers(isPlayer1Done, switchMessages);
        let gameMessage = "Here we go!";
        changeGameMessage(gameMessage);
        let diceInPlay = getDiceInPlay("all");
        putDiceInHand(isPlayer1Done, diceInPlay);
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

    function startTurns(isPlayer1Done) {
        initializeTurns(isPlayer1Done);
        let gameOver = false;

    }


});