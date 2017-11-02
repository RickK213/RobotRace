"use strict"

$(document).ready(function() {

/*****************************************
/** GLOBAL VARIABLES
*****************************************/
    let player1 = {
        name: "Player 1",
        piecesEarned: [],
        pieceNumbers: [],
        diceInHand: []
    };
    let player2 = {
        name: "Player 2",
        piecesEarned: [],
        pieceNumbers: [],
        diceInHand: []
    };

/*****************************************
/** MAIN GAME FUNCTION
*****************************************/

    startGame();

/*****************************************
/** HELPER FUNCTIONS
*****************************************/

    function initGameBoard() {
        $("#howToPlay").fadeOut(function(){
            $('#gameBoard').fadeIn();
            setDiceColumnHeights();
            handleDiceColumnResize();
        });
    }

    function changePlayer1Message(message) {
        let playerMessage = '<span class="text-primary playerName">' + player1.name + ":</span> " + message;
        $("#player1Messages").html(playerMessage);
    }

    function changePlayer2Message(message) {
        let playerMessage = '<span class="text-danger playerName">' + player2.name + ":</span> " + message;
        $("#player2Messages").html(playerMessage);
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
            player1FirstRoll = getDieRollResult(numSides);
            message = generateSingleRollMessage(numSides, player1FirstRoll);
            changePlayer1Message(message);
            changePlayer2Message('It is your turn, roll the dice');
            let player = 2;
            let doSwitchMessages = false;
            switchPlayers(player, doSwitchMessages);
            let diceInPlay = getDiceInPlay(numSides);
            putDiceInHand(player, diceInPlay);
            event.preventDefault();
            return false;
        });
        $("#player2Button").on('click touchstart', function(event) {
            player2FirstRoll = getDieRollResult(numSides);
            message = generateSingleRollMessage(numSides, player2FirstRoll);
            changePlayer2Message(message);
            $("#player2Interface").addClass("invisible");
            showRollFirstResults(player1FirstRoll, player2FirstRoll);
            event.preventDefault();
            return false;
        });
    }

    function handleRollButtons(){
        let numSides = "all";
        $("#player1Button").on('click touchstart', function(event) {
            let player = 1;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPrime(player, diceInHand);
            event.preventDefault();
            return false;
        });
        $("#player2Button").on('click touchstart', function(event) {
            event.preventDefault();
            let player = 2;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPrime(player, diceInHand);
            event.preventDefault();
            return false;
        });
    }

    function handleRollForPieceButtons(){
        let numSides = 6;
        $("#player1Button").on('click touchstart', function(event) {
            let player = 1;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPiece(player, diceInHand);
            event.preventDefault();
            return false;
        });
        $("#player2Button").on('click touchstart', function(event) {
            let player = 2;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPiece(player, diceInHand);
            event.preventDefault();
            return false;
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

    function generatePieceNumbers(floor, ceiling, numPieces){
        let pieceNumberArray = [];
        while ( pieceNumberArray.length<numPieces ) {
            let pieceNumber = Math.floor(Math.random()*(ceiling-floor+1)+floor);
            pieceNumberArray.push(pieceNumber);
        }
        return pieceNumberArray;
    }

    function drawPlayerBoard(playerNumber){
        let player;
        let pieceNumber;
        let selectorID;
        switch(playerNumber){
            case 1:
                player = player1;
                selectorID = "#player1Robot";
                break;
            case 2:
                player = player2;
                selectorID = "#player2Robot";
                break;
            default:
                player = player1;
                selectorID = "#player1Robot";
        }
        for(let i=0; i<player.pieceNumbers.length; i++) {
            pieceNumber = player.pieceNumbers[i];
            let selectorDiv = selectorID + " .piece" + (i+1);
            $(selectorDiv).html(pieceNumber);
        }
    }

    function generatePlayerPieces(){
        let floor = 2;
        let ceiling = 32;
        let numPieces = 6;
        player1.pieceNumbers = generatePieceNumbers(floor, ceiling, numPieces);
        player2.pieceNumbers = generatePieceNumbers(floor, ceiling, numPieces);
        drawPlayerBoard(1);
        drawPlayerBoard(2);
    }

    function setDiceColumnHeights(){
        let heightSelector = $(".diceSelector").height(); 
        let heightInHand = $(".diceInHand").height(); 
        let maxHeight;
        if ( heightSelector>heightInHand ) {
            maxHeight = heightSelector;
        } else {
            maxHeight = heightInHand;
        }
        $(".diceInHand").height(maxHeight);
        $(".diceSelector").height(maxHeight);
    }
    function handleDiceColumnResize(){
        $( window ).resize(function() {
          setDiceColumnHeights();
        });
    }

    function handleDiceSelector(){
        $('.diceSelector').on('click touchstart', '.die' , function(event) {
            let diceInHandObject = $(this).parent().parent().siblings().children('.diceInHand');
            let numDiceInHand = diceInHandObject.children().length-1;
            console.log( numDiceInHand );
            if( numDiceInHand ===2 ) {
                alert('You can only roll 2 dice. Click the dice in your hand to remove them.');
            } else {
                let className = ( $(this)[0].className );
                let divString = '<div class="' + className + '"></div>';
                diceInHandObject.prepend(divString);
                $(this).remove();
            }
        });
    }

    function handleDiceInHand(){
        $('.diceInHand').on('click touchstart', '.die' , function(event) {
            let diceSelectorObject = $(this).parent().parent().siblings().children('.diceSelector');
            let className = ( $(this)[0].className );
            let divString = '<div class="' + className + '"></div>';
            diceSelectorObject.prepend(divString);
            $(this).remove();
        });
    }
    function handlePlayersDice(){
        
    }

    function setPlayerNames(){
        let player1Name = $("#player1Name").val();
        let player2Name = $("#player2Name").val();
        if ( player1Name.length > 0 ) {
            player1.name = player1Name;
        }
        if ( player2Name.length > 0 ) {
            player2.name = player2Name;
        }
    }

/*****************************************
/** START GAME
*****************************************/

    function startGame() {
        $("#playButton").on('click touchstart tap', function(event) {
            setPlayerNames();
            generatePlayerPieces();
            initGameBoard();
            handleDiceSelector();
            handleDiceInHand();
            handlePlayersDice();
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