"use strict"

$(document).ready(function() {

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

    function getDieRollResult(numSides){
        let dieRoll = Math.floor(Math.random() * numSides) + 1;
        return dieRoll;
    }

    function rollFirstDie() {
        let numSides = 6;
        let dieRoll = getDieRollResult(numSides);
        return dieRoll;
    }

    function showRollFirstResults(player1FirstRoll, player2FirstRoll) {
        let gameMessage;
        let isPlayer1Done;
        if ( player1FirstRoll === player2FirstRoll ) {
            gameMessage = 'Player 1 and Player 2 tied. <button class="btn btn-success" id="rollFirstsAgain">Roll Again</button>';
        } else if ( player1FirstRoll > player2FirstRoll ) {
            gameMessage = 'Player 1 rolled a ' + player1FirstRoll + '. Player 2 rolled a ' + player2FirstRoll + '. <strong class="text-primary">PLAYER 1</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            isPlayer1Done = false;
        } else {
            gameMessage = 'Player 1 rolled a ' + player1FirstRoll + '. Player 2 rolled a ' + player2FirstRoll + '. <strong class="text-danger">PLAYER 2</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            isPlayer1Done = true;
        }
        changeGameMessage(gameMessage);
        $("#rollFirstsAgain").click(function(){
            rollForFirsts();
        });        
        $("#startTurns").click(function(){
            $("#player1Button").off("click");
            $("#player2Button").off("click");
            startTurns(isPlayer1Done);
        });        
    }
    
    function switchPlayers(isPlayer1Done, doSwitchMessages) {
        if(isPlayer1Done){
            clearPlayer1Interface();
            showPlayer2Interface();
            if(doSwitchMessages){
                changePlayer1Message('Wait for your turn.');
                changePlayer2Message('It is your turn, roll the dice');
            }
        } else {
            clearPlayer2Interface();
            showPlayer1Interface();
            if(doSwitchMessages){
                changePlayer1Message('It is your turn, roll the dice');
                changePlayer2Message('Wait for your turn.');
            }
        }
    }

    function handleRollFirstButtons(){
        let player1FirstRoll;
        let player2FirstRoll;
        let numSides = 6;
        let message;
        $("#player1Button").on('click', function(event) {
            event.preventDefault();
            player1FirstRoll = getDieRollResult(numSides);
            message = generateSingleRollMessage(numSides, player1FirstRoll);
            changePlayer1Message(message);
            changePlayer2Message('It is your turn, roll the dice');
            let isPlayer1Done = true;
            let doSwitchMessages = false;
            switchPlayers(isPlayer1Done, doSwitchMessages);
            let diceInPlay = getDiceInPlay("six");
            putDiceInHand(isPlayer1Done, diceInPlay);
        });
        $("#player2Button").on('click', function(event) {
            event.preventDefault();
            player2FirstRoll = rollFirstDie();
            message = generateSingleRollMessage(numSides, player2FirstRoll);
            changePlayer2Message(message);
            $("#player2Interface").addClass("invisible");
            showRollFirstResults(player1FirstRoll, player2FirstRoll);
        });
    }

    function generateSingleRollMessage(numSides, singleRoll) {
        let message = '<div class="die-container"><div class="die-small die-' + numSides + '"></div><span class="dieRoll"> =' + singleRoll + '</span></div>';
        return message;        
    }

    function clearPlayer1Interface(){
        $("#player1Interface").addClass("invisible");
        $("#player1 .diceInHand").html("");
    }

    function clearPlayer2Interface(){
        $("#player2Interface").addClass("invisible");
        $("#player2 .diceInHand").html("");
    }

    function showPlayer1Interface(){
        $("#player1Interface").removeClass("invisible");
    }

    function showPlayer2Interface(){
        $("#player2Interface").removeClass("invisible");
    }

    function checkForPrime(totalRoll) {
        let isPrime;
        for(let i=2; i<=totalRoll; i++){
            isPrime = true;
            for(let j=2; j<i; j++) {
                if( i % j ===0 ) {
                    isPrime = false;
                }
            }
        }
        return isPrime;
    }

    function rollDice(player, diceInHand){
        let totalRoll = 0;
        let singleRoll;
        let message = "";
        for( let i=0; i<diceInHand.length; i++ ) {
            singleRoll = getDieRollResult(diceInHand[i]);
            totalRoll += singleRoll;
            message += generateSingleRollMessage(diceInHand[i], singleRoll);
        }
        message += '<hr><h5 class="text-primary">Total roll: ' + totalRoll;
        let isPrime = checkForPrime(totalRoll);
        if ( isPrime ) {
            message += '<br>' + totalRoll + ' IS a prime number!</h5>';
        } else {
            message += '<br>' + totalRoll + ' IS NOT a prime number!</h5>';
        }
        console.log(isPrime);
        if( player === 1 ) {
            clearPlayer1Interface();
            changePlayer1Message(message);
            showPlayer2Interface();
        } else {
            clearPlayer2Interface();
            changePlayer2Message(message);
            showPlayer1Interface();
        }
    }

    function handleRollButtons(){
        $("#player1Button").on('click', function(event) {
            event.preventDefault();
            let player = 1;
            let diceInHand = getDiceInPlay("all");
            rollDice(player, diceInHand);
        });
        $("#player2Button").on('click', function(event) {
            event.preventDefault();
            let player = 2;
            let diceInHand = getDiceInPlay("all");
            rollDice(player, diceInHand);
        });
    }

    function rollForFirsts(){
        $("#player1Interface").removeClass("invisible");
        changeGameMessage('Begin by rolling the 6-sided die to see who goes first.');
        changePlayer1Message('It is your turn, roll the dice');
        changePlayer2Message('Wait for your turn.');
        handleRollFirstButtons();
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
        handleRollButtons();
    }

});