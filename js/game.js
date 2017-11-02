"use strict"

$(document).ready(function() {

/*****************************************
/** GLOBAL VARIABLES
*****************************************/
    let player1 = {
        name: "Player 1",
        piecesEarned: []
    };
    let player2 = {
        name: "Player 2",
        piecesEarned: []
    };

/*****************************************
/** MAIN GAME FUNCTION
*****************************************/

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

    function showRollFirstResults(player1FirstRoll, player2FirstRoll) {
        let gameMessage;
        let player;
        if ( player1FirstRoll === player2FirstRoll ) {
            gameMessage = 'Player 1 and Player 2 tied. <button class="btn btn-success" id="rollFirstsAgain">Roll Again</button>';
        } else if ( player1FirstRoll > player2FirstRoll ) {
            gameMessage = 'Player 1 rolled a ' + player1FirstRoll + '. Player 2 rolled a ' + player2FirstRoll + '. <strong class="text-primary">PLAYER 1</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            player = 1;
        } else {
            gameMessage = 'Player 1 rolled a ' + player1FirstRoll + '. Player 2 rolled a ' + player2FirstRoll + '. <strong class="text-danger">PLAYER 2</strong> goes first! <button class="btn btn-success" id="startTurns">Let\'s Play!</button>';
            player = 2;
        }
        changeGameMessage(gameMessage);
        $("#rollFirstsAgain").on('click touchstart', function(event) {
            event.preventDefault();
            rollForFirsts();
        });        
        $("#startTurns").on('click touchstart', function(event) {
            event.preventDefault();
            $("#player1Button").off();
            $("#player2Button").off();
            startTurns(player);
        });        
    }
    
    function switchPlayers(player, doSwitchMessages) {
        if(player === 1){
            clearPlayer2Interface();
            showPlayer1Interface();
            if(doSwitchMessages){
                changePlayer1Message('It is your turn, roll the dice');
                changePlayer2Message('Wait for your turn.');
            }
        } else {
            clearPlayer1Interface();
            showPlayer2Interface();
            if(doSwitchMessages){
                changePlayer1Message('Wait for your turn.');
                changePlayer2Message('It is your turn, roll the dice');
            }
        }
    }

    function handleRollFirstButtons(){
        let player1FirstRoll;
        let player2FirstRoll;
        let numSides = 4;
        let message;
        $("#player1Button").on('click touchstart', function(event) {
            event.preventDefault();
            player1FirstRoll = getDieRollResult(numSides);
            message = generateSingleRollMessage(numSides, player1FirstRoll);
            changePlayer1Message(message);
            changePlayer2Message('It is your turn, roll the dice');
            let player = 2;
            let doSwitchMessages = false;
            switchPlayers(player, doSwitchMessages);
            let diceInPlay = getDiceInPlay(numSides);
            putDiceInHand(player, diceInPlay);
        });
        $("#player2Button").on('click touchstart', function(event) {
            event.preventDefault();
            player2FirstRoll = getDieRollResult(numSides);
            message = generateSingleRollMessage(numSides, player2FirstRoll);
            changePlayer2Message(message);
            $("#player2Interface").addClass("invisible");
            showRollFirstResults(player1FirstRoll, player2FirstRoll);
        });
    }

    function handleRollButtons(){
        let numSides = "all";
        $("#player1Button").on('click touchstart', function(event) {
            event.preventDefault();
            let player = 1;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPrime(player, diceInHand);
        });
        $("#player2Button").on('click touchstart', function(event) {
            event.preventDefault();
            let player = 2;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPrime(player, diceInHand);
        });
    }

    function handleRollForPieceButtons(){
        let numSides = 6;
        $("#player1Button").on('click touchstart', function(event) {
            event.preventDefault();
            let player = 1;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPiece(player, diceInHand);
        });
        $("#player2Button").on('click touchstart', function(event) {
            event.preventDefault();
            let player = 2;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPiece(player, diceInHand);
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
        let isPrime = true;
        for(let i=2; i<=totalRoll; i++){
            for(let j=2; j<i; j++) {
                if( totalRoll % j ===0 ) {
                    isPrime = false;
                }
            }
        }
        return isPrime;
    }

    function rollForPiece(player, message){
        changeGameMessage('Player ' + player + ' is rolling for a piece of the robot!');
        let inactivePlayerMessage = 'Player ' + player + ' is rolling for a piece of their robot.';
        let numSides = 6;
        if( player === 1 ) {
            changePlayer1Message(message);
            clearPlayer2Interface();
            changePlayer2Message(inactivePlayerMessage);
            let diceInHand = getDiceInPlay(numSides);
            let nextPlayer = 1;
            putDiceInHand(nextPlayer, diceInHand);
        } else {
            changePlayer2Message(message);
            clearPlayer1Interface();
            changePlayer1Message(inactivePlayerMessage);
            let diceInHand = getDiceInPlay(numSides);
            let nextPlayer = 2;
            putDiceInHand(nextPlayer, diceInHand);
        }
        handleRollForPieceButtons(player);
    }

    function continueRolling(player, message){
        changeGameMessage('The result was not a prime number, the game continues...');
        if( player === 1 ) {
            clearPlayer1Interface();
            changePlayer1Message(message);
            changePlayer2Message('It is your turn, roll the dice');
            showPlayer2Interface();
            let diceInHand = getDiceInPlay("all");
            let nextPlayer = 2;
            putDiceInHand(nextPlayer, diceInHand);
        } else {
            clearPlayer2Interface();
            changePlayer2Message(message);
            changePlayer1Message('It is your turn, roll the dice');
            showPlayer1Interface();
            let diceInHand = getDiceInPlay("all");
            let nextPlayer = 1;
            putDiceInHand(nextPlayer, diceInHand);
        }
    }

    function rollDiceForPrime(player, diceInHand){
        let totalRoll = 0;
        let singleRoll;
        let message = "";
        for( let i=0; i<diceInHand.length; i++ ) {
            singleRoll = getDieRollResult(diceInHand[i]);
            totalRoll += singleRoll;
            message += generateSingleRollMessage(diceInHand[i], singleRoll);
        }
        message += '<h5 class="text-primary">Total Roll: ' + totalRoll;
        let isPrime = checkForPrime(totalRoll);
        if ( isPrime ) {
            message += '<br>' + totalRoll + ' IS a prime number! You get to roll for a piece of your robot!</h5>';
            rollForPiece(player, message); //need to write this
        } else {
            message += '<br>' + totalRoll + ' IS NOT a prime number!</h5>';
            continueRolling(player, message);
        }
    }

    function rollDiceForPiece(player, diceInHand){
        let pieceRoll;
        let message = "";
        let pieceSelector;
        let fullRobotArray = 6;
        let nextPlayer;
        let gameOver;
        for( let i=0; i<diceInHand.length; i++ ) {
            pieceRoll = getDieRollResult(diceInHand[i]);
            message += generateSingleRollMessage(diceInHand[i], pieceRoll);
        }
        if( player===1 ){
            if ( !player1.piecesEarned.includes(pieceRoll) ) {
                pieceSelector = "#robot1Piece"+pieceRoll;
                $(pieceSelector).removeClass("invisible");
                player1.piecesEarned.push(pieceRoll);
                message += getAddedPieceMessage(pieceRoll);
                if (player1.piecesEarned.length === fullRobotArray) {
                    message += '<h3>YOU WIN!</h3>';
                    gameOver = true;
                }
            } else {
                message += getDuplicatePieceMessage(pieceRoll);
            }
            clearPlayer1Interface();
            changePlayer1Message(message);
            nextPlayer = 2;
        } else {
            if ( !player2.piecesEarned.includes(pieceRoll) ) {
                pieceSelector = "#robot2Piece"+pieceRoll;
                $(pieceSelector).removeClass("invisible");
                player2.piecesEarned.push(pieceRoll);
                message += getAddedPieceMessage(pieceRoll);
                if (player2.piecesEarned.length === fullRobotArray) {
                    message += '<h3>YOU WIN!</h3>';
                    gameOver = true;
                }
            } else {
                message += getDuplicatePieceMessage(pieceRoll);
            }
            clearPlayer2Interface();
            changePlayer2Message(message);
            nextPlayer = 1;
        }
        if ( gameOver ) {
            clearPlayer1Interface();
            clearPlayer2Interface();
        } else {
            $("#player1Button").off();
            $("#player2Button").off();
            continueTurns(nextPlayer);
        }
    }

    function getAddedPieceMessage(pieceRoll){
        return '<h5>Awesome! You earned piece #' + pieceRoll + ' for your robot!</h5>';
    }

    function getDuplicatePieceMessage(pieceRoll){
        return '<h5>Sorry! You already have piece #' + pieceRoll + ' for your robot!</h5>';
    }

    function rollForFirsts(){
        $("#player1Interface").removeClass("invisible");
        changeGameMessage('Begin by rolling the 4-sided die to see who goes first.');
        changePlayer1Message('It is your turn, roll the dice');
        changePlayer2Message('Wait for your turn.');
        handleRollFirstButtons();
    }

    function putDiceInHand(player, diceInPlay){
        let switchDiv;
        let diceDivs = "";
        if(player === 1) {
            switchDiv = "#player1 .diceInHand";
        } else {
            switchDiv = "#player2 .diceInHand";
        }
        for (let i=0; i<diceInPlay.length; i++) {
            diceDivs += '<div class="die die-' + diceInPlay[i] + '"></div>';
        }
        $(switchDiv).html(diceDivs);
    }

    function getDiceInPlay(dice){
        let diceArray;
        switch(dice) {
            case "all":
                diceArray = [4,6,8,10,12,20];
                break;
            case 4:
                diceArray = [4];
                break;
            case 6:
                diceArray = [6];
                break;
        }
        return diceArray;
    }
    function initializeTurns(player){
        let switchMessages = true;
        switchPlayers(player, switchMessages);
        let gameMessage = "Here we go!";
        changeGameMessage(gameMessage);
        let diceInPlay = getDiceInPlay("all");
        putDiceInHand(player, diceInPlay);
    }

    function continueTurns(nextPlayer){
        if ( nextPlayer === 1 ) {
            showPlayer1Interface();
        }
        else {
            showPlayer2Interface();
        }
        handleRollButtons();
    }

/*****************************************
/** START GAME
*****************************************/

    function startGame() {
        $(".playButton").on('click touchstart', function(event) {
            event.preventDefault();
            fadeInGameBoard();
            rollForFirsts();
        });
    }

/*****************************************
/** START TURNS
*****************************************/

    function startTurns(player) {
        initializeTurns(player);
        handleRollButtons();
    }

});