"use strict"

$(document).ready(function() {

/*****************************************
/** GLOBAL VARIABLES
*****************************************/
    let player1 = {
        name: "Player 1",
        pieceNumbers: [],
        diceInHand: []
    };
    let player2 = {
        name: "Player 2",
        pieceNumbers: [],
        diceInHand: []
    };

/*****************************************
/** MAIN GAME FUNCTION
*****************************************/

    $('#playButton').off();
    handlePlayButton();

/*****************************************
/** HELPER FUNCTIONS
*****************************************/

    function initGameBoard() {
        $("#howToPlay").fadeOut(function(){
            $('#gameBoard').fadeIn();
        });
    }

    function changePlayer1Message(message) {
        let playerMessage = '<span class="text-primary playerName">' + player1.name + ":</span><br>" + message;
        $("#player1Messages").html(playerMessage);
    }

    function changePlayer2Message(message) {
        let playerMessage = '<span class="text-danger playerName">' + player2.name + ":</span><br>" + message;
        $("#player2Messages").html(playerMessage);
    }

    function getDieRollResult(numSides){
        let dieRoll = Math.floor(Math.random() * numSides) + 1;
        return dieRoll;
    }

    function showRollFirstResults(player1FirstRoll, player2FirstRoll) {
        let gameMessage;
        let player;
        let alertTitle;
        let buttonText;
        let isTied = false;
        let actionAfterClose;
        if ( player1FirstRoll === player2FirstRoll ) {
            alertTitle = 'It\'s a tie!'
            gameMessage = player1.name + ' rolled a ' + player1FirstRoll + '. ' + player2.name + ' rolled a ' + player2FirstRoll + '. It\'s a tie! Please roll again.';
            isTied = true;
        } else if ( player1FirstRoll > player2FirstRoll ) {
            alertTitle = player1.name + ' Goes First!'
            gameMessage = player1.name + ' rolled a ' + player1FirstRoll + '. ' + player2.name + ' rolled a ' + player2FirstRoll + '. <strong class="text-primary">' + player1.name + '</strong> goes first!';
            player = 1;
        } else {
            alertTitle = player2.name + ' Goes First!'
            gameMessage = player1.name + ' rolled a ' + player1FirstRoll + '. ' + player2.name + ' rolled a ' + player2FirstRoll + '. <strong class="text-danger">' + player2.name + '</strong> goes first!';
            player = 2;
        }

        if (isTied) {
            actionAfterClose = rollForFirsts;
            buttonText = 'Roll Again';
        } else {
            actionAfterClose = startTurns;
            buttonText = 'Let\'s Play!';
        }
        let actionArgument = player;

        fireModal(alertTitle, gameMessage, buttonText, actionAfterClose, actionArgument);
    }
    
    function switchPlayers(player, doSwitchMessages) {
        if(player === 1){
            hidePlayer2Interface();
            showPlayer1Interface();
            if(doSwitchMessages){
                changePlayer1Message('It is your turn, roll the dice');
                changePlayer2Message('Wait for your turn.');
            }
        } else {
            hidePlayer1Interface();
            showPlayer2Interface();
            if(doSwitchMessages){
                changePlayer1Message('Wait for your turn.');
                changePlayer2Message('It is your turn, roll the dice');
            }
        }
    }

    function getDiceTotal(diceInHand){
        let singleRoll;
        let totalRoll = 0;
        for(let i=0; i<diceInHand.length; i++) {
            singleRoll = getDieRollResult( diceInHand[i] );
            totalRoll += singleRoll;
        }
        return totalRoll;

    }

    function handleRollFirstButtons(){
        let player1FirstRoll;
        let player2FirstRoll;
        $('#player1Button').on('click tap touchstart', function(event) {
            event.preventDefault();
            let message = "";
            player1FirstRoll = getDiceTotal(player1.diceInHand);
            for(let i=0; i<player1.diceInHand.length; i++){
                message += generateSingleRollMessage(player1.diceInHand[i], player1FirstRoll);
            }
            changePlayer1Message(message);
            changePlayer2Message('It is your turn, roll the dice');
            let player = 2;
            let doSwitchMessages = false;
            switchPlayers(player, doSwitchMessages);
        });
        $('#player2Button').on('click tap touchstart', function(event) {
            event.preventDefault();
            let message = "";
            player2FirstRoll = getDiceTotal(player2.diceInHand);
            for(let i=0; i<player2.diceInHand.length; i++){
                message += generateSingleRollMessage(player2.diceInHand[i], player2FirstRoll);
            }
            changePlayer2Message(message);
            $("#player2Interface").addClass("invisible");
            showRollFirstResults(player1FirstRoll, player2FirstRoll);
        });
    }

    function handleRollButtons(){
        $('#player1Button').on('click tap touchstart', function(event) {
            event.preventDefault();
            let playerNumber = 1;
            if ( player1.diceInHand.length!==2 ) {
                alert('You must select 2 dice to roll.');
            }
            else {
                rollDiceForPiece(playerNumber);
            }
        });
        $('#player2Button').on('click tap touchstart', function(event) {
            event.preventDefault();
            let playerNumber = 2;
            if ( player2.diceInHand.length!==2 ) {
                alert('You must select 2 dice to roll.');
            }
            else {
                rollDiceForPiece(playerNumber);
            }
        });
    }

    function fireModal(messageTitle, messageBody, buttonText='Close', actionAfterClose=null, actionArgument=null) {
        $('#messageTitle').html(messageTitle);
        $('#messageBody').html(messageBody);
        $('#messageButton').html(buttonText);
        $('#gameModal').modal({backdrop: 'static'});
        $('#messageButton').on('click tap touchstart', function(event) {
            event.preventDefault();
            actionAfterClose(actionArgument);
        });
    }

    function generateSingleRollMessage(numSides, singleRoll) {
        let message = '<div class="die-container"><div class="die-small die-' + numSides + '"></div><span class="dieRoll"> =' + singleRoll + '</span></div>';
        return message;        
    }

    function hidePlayer1Interface(){
        $("#player1Interface").addClass("invisible");
        $("#player1 .diceInHand").html("");
    }

    function hidePlayer2Interface(){
        $("#player2Interface").addClass("invisible");
        $("#player2 .diceInHand").html("");
    }

    function showPlayer1Interface(){
        $("#player1Interface").removeClass("invisible");
    }

    function showPlayer2Interface(){
        $("#player2Interface").removeClass("invisible");
    }

    function rollDiceForPiece(playerNumber){
        let totalRoll = 0;
        let singleRoll;
        let message = "";
        let pieceSelector;
        let fullRobotArray = 6;
        let nextPlayer;
        let player1Won = false;
        let player2Won = false;
        let playerHasPiece;
        switch (playerNumber) {
            case 1:
                nextPlayer = 2;
                break;
            case 2: 
                nextPlayer = 1;
                break;
        }
        let diceInHand = getDiceInHand(playerNumber);
        for( let i=0; i<diceInHand.length; i++ ) {
            singleRoll = getDieRollResult(diceInHand[i]);
            totalRoll += singleRoll;
            message += generateSingleRollMessage(diceInHand[i], singleRoll);
        }
        message +='<br><strong>TOTAL ROLL: ' + totalRoll + '</strong>';;
        playerHasPiece = checkForPiece(playerNumber, totalRoll);
        if ( playerHasPiece ) {
            message += '<br>' + totalRoll + ' IS one of your piece numbers!</h5>';
            addPiece(playerNumber, totalRoll);
            let playerThatWon = checkForWin(playerNumber);
            if ( !playerThatWon ) {
                continueRolling(nextPlayer, message);
            } else {
                showGameWinnerMessage(playerThatWon, message);
            } 
        }
        else {
            message += '<br>' + totalRoll + ' IS NOT one of your piece numbers.</h5>';
            continueRolling(nextPlayer, message);
        }
    }

    function showGameWinnerMessage(playerThatWon, message){
        let alertTitle = '';
        let gameMessage = '';
        let buttonText = 'Play Again';
        let actionAfterClose = startNewGame;
        let actionArgument = '';
        if ( playerThatWon === 1 ) {
            changePlayer1Message(message);
            alertTitle += player1.name;
            gameMessage += player1.name; 
        } else {
            changePlayer2Message(message);
            alertTitle += player2.name;
            gameMessage += player2.name; 
        }
        alertTitle += ' WINS!';
        gameMessage += ' is the winner! Click below to play again.';
        fireModal(alertTitle, gameMessage, buttonText, actionAfterClose, actionArgument);

    }

    function checkForWin(playerNumber){
        if(playerNumber === 1) {
            let player1Won = true;
            for(let i=0; i<player1.pieceNumbers.length; i++){
                if ( typeof player1.pieceNumbers[i] === 'number' ) {
                    player1Won = false;
                }
            }
            if (player1Won) {
                return playerNumber;
            }
            else{
                return false;
            }
        } else {
            let player2Won = true;
            for(let i=0; i<player2.pieceNumbers.length; i++){
                if ( typeof player2.pieceNumbers[i] === 'number' ) {
                    player2Won = false;
                }
            }
            if (player2Won) {
                return playerNumber;
            }
            else{
                return false;
            }
        }
    };

    function addPiece(playerNumber, totalRoll){
        if(playerNumber === 1){
            let pieceIndex = getPieceIndex(player1.pieceNumbers, totalRoll);
            player1.pieceNumbers[pieceIndex] = "";
            let pieceSelector = "#robot1Piece"+(pieceIndex+1);
            $(pieceSelector).removeClass("invisible");
            let labelSelector = "#robot1Label"+(pieceIndex+1);
            $(labelSelector).addClass("invisible");
        }
        else {
            let pieceIndex = getPieceIndex(player2.pieceNumbers, totalRoll);
            player2.pieceNumbers[pieceIndex] = "";
            let pieceSelector = "#robot2Piece"+(pieceIndex+1);
            $(pieceSelector).removeClass("invisible");
            let labelSelector = "#robot2Label"+(pieceIndex+1);
            $(labelSelector).addClass("invisible");
        }
    }

    function getPieceIndex(playerPieces, totalRoll){
        let pieceIndex;
        for(let i=0; i<playerPieces.length; i++){
            if ( playerPieces[i] === totalRoll ) {
                pieceIndex = i;
            }
        }
        return pieceIndex;
    }

    function continueRolling(nextPlayer, message){
        if( nextPlayer === 1 ) {
            hidePlayer2Interface();
            changePlayer2Message(message);
            changePlayer1Message('It is your turn, roll the dice');
            showPlayer1Interface();
            clearPlayerHand(1);
            let diceArray = getDiceInPlay("all");
            putDiceInSelector(1,diceArray);
            // let diceInHand = getDiceInPlay("all");
            // let nextPlayer = 2;
            // putDiceInHand(nextPlayer, diceInHand);
        } else {
            hidePlayer1Interface();
            changePlayer1Message(message);
            changePlayer2Message('It is your turn, roll the dice');
            showPlayer2Interface();
            clearPlayerHand(2);
            let diceArray = getDiceInPlay("all");
            putDiceInSelector(2,diceArray);
            // let diceInHand = getDiceInPlay("all");
            // let nextPlayer = 1;
            // putDiceInHand(nextPlayer, diceInHand);
        }
    }

    function checkForPiece(playerNumber, totalRoll){
        let playerPieces;
        let playerHasPiece = false;
        switch(playerNumber){
            case 1:
                playerPieces = player1.pieceNumbers;
                break;
            case 2:
                playerPieces = player2.pieceNumbers;
                break;
        }
        if ( playerPieces.includes(totalRoll) ) {
            playerHasPiece = true;
        }
        return playerHasPiece;
    }

    function getAddedPieceMessage(pieceRoll){
        return '<h5>Awesome! You earned piece #' + pieceRoll + ' for your robot!</h5>';
    }

    function getDuplicatePieceMessage(pieceRoll){
        return '<h5>Sorry! You already have piece #' + pieceRoll + ' for your robot!</h5>';
    }

    function rollForFirsts(){
        let diceArray = getDiceInPlay(4);
        putDiceInSelector(1,diceArray);
        putDiceInSelector(2,diceArray);
        clearPlayerHand(1);
        clearPlayerHand(2);
        showPlayer1Interface();
        hidePlayer2Interface();
        changePlayer1Message('It is your turn, roll the dice');
        changePlayer2Message('Wait for your turn.');
        $("#player1Button").off();
        $("#player2Button").off();
        handleRollFirstButtons();
    }

    function putDiceInSelector(playerNumber, diceArray) {
        let selectorDiv;
        switch(playerNumber){
            case 1:
                selectorDiv = "#player1Interface .diceSelector";
                break;
            case 2:
                selectorDiv = "#player2Interface .diceSelector";
                break;
        }
        let diceHTML = getDiceHTML(diceArray);

        $(selectorDiv).html("").html(diceHTML);
    }

    function getDiceHTML(diceArray){
        let diceHTML = "";
        for (let i=0; i<diceArray.length; i++) {
            diceHTML += '<div class="die die-' + diceArray[i] + '"></div>';
        }
        diceHTML += '<div class="clearfix">&nbsp;</div>';
        return diceHTML;
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
        let diceArray = getDiceInPlay("all");
        //NEED TO DISABLE ROLL BUTTONS IF THERE ARE NO DICE IN THE HAND
        clearPlayerHand(1);
        clearPlayerHand(2);
        putDiceInSelector(1,diceArray);
        putDiceInSelector(2,diceArray);
    }

    function clearPlayerHand(playerNumber){
        let handDiv;
        switch(playerNumber){
            case 1:
                handDiv = "#player1Interface .diceInHand";
                player1.diceInHand = [];
                break;
            case 2:
                handDiv = "#player2Interface .diceInHand";
                player2.diceInHand = [];
                break;
        }

        $(handDiv).html("");
    }

    function continueTurns(nextPlayer){
        if ( nextPlayer === 1 ) {
            showPlayer1Interface();
        }
        else {
            showPlayer2Interface();
        }
    }

    function generatePieceNumbers(floor, ceiling, numPieces){
        let pieceNumberArray = [];
        while ( pieceNumberArray.length<numPieces ) {
            let pieceNumber = Math.floor(Math.random()*(ceiling-floor+1)+floor);
            if( !pieceNumberArray.includes(pieceNumber) ) {
                pieceNumberArray.push(pieceNumber);
            }
        }
        return pieceNumberArray;
    }

    function drawPlayerBoard(playerNumber){
        clearPlayerBoard();
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

    function clearPlayerBoard(){
        $('.robotPiece').each(function(){
            $(this).addClass('invisible');
        })
        $('.pieceNumber').each(function(){
            $(this).removeClass('invisible');
        })
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

    function handleDiceSelector(){
        $('.diceSelector').on('click tap touchstart', '.die', function(event) {
            event.preventDefault();
            let playerNumber = parseInt($(this).parent().parent().parent().parent()[0].className);
            let diceInHand = getDiceInHand(playerNumber);
            let numDiceInHand = diceInHand.length;
            if( numDiceInHand ===2 ) {
                alert('You can only roll 2 dice. Click the dice in your hand to remove them.');
            } else {
                let className = ( $(this)[0].className );
                let numSides = parseInt( className.match(/[0-9]+/g)[0] );
                putDiceInHand(playerNumber, numSides);
                $(this).remove();
            }
        });
    }

    function handleDiceInHand(){
        $('.diceInHand').on('click tap touchstart', '.die', function(event) {
            event.preventDefault();
            let playerNumber = parseInt($(this).parent().parent().parent().parent()[0].className);
            let className = ( $(this)[0].className );
            let numSides = parseInt( className.match(/[0-9]+/g)[0] );
            removeDieFromHand(playerNumber, numSides);
            $(this).remove();
        });
    }

    function removeDieFromHand(playerNumber, numSides){
        let dieString = '<div class="die die-' + numSides + '"</div>';
        switch (playerNumber) {
            case 1:
                for (let i=0; i<player1.diceInHand.length; i++) {
                    if ( player1.diceInHand[i] === numSides ) {
                        player1.diceInHand.splice(i,1);
                        $('#player1Interface .diceSelector').prepend(dieString);
                    }
                }
                break;
            case 2:
                for (let i=0; i<player2.diceInHand.length; i++) {
                    if ( player2.diceInHand[i] === numSides ) {
                        player2.diceInHand.splice(i,1);
                        $('#player2Interface .diceSelector').prepend(dieString);
                    }
                }
                break;
        }
    }

    function putDiceInHand(playerNumber, numSides){
        let diceInHandDiv;
        switch(playerNumber){
            case 1:
                diceInHandDiv = "#player1Interface .diceInHand";
                player1.diceInHand.push(numSides);
                break;
            case 2:
                diceInHandDiv = "#player2Interface .diceInHand";
                player2.diceInHand.push(numSides);
                break;
        }
        let diceArray = getDiceInHand(playerNumber);
        let diceHTML = getDiceHTML(diceArray);

        $(diceInHandDiv).html("").html(diceHTML);
    }

    function getDiceInHand(playerNumber){
        let diceInHand;
        switch(playerNumber){
            case 1:
                diceInHand = player1.diceInHand;
                break;
            case 2:
                diceInHand = player2.diceInHand;
                break;
        }
        return diceInHand;
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

    function handlePlayButton() {
        $('#playButton').on('click tap touchstart', function(event) {
            startNewGame();
        });
    }

    function startNewGame() {
        setPlayerNames();
        generatePlayerPieces();
        initGameBoard();
        $('.diceSelector').off();
        handleDiceSelector();
        $('.diceInHand').off();
        handleDiceInHand();
        rollForFirsts();
    }

/*****************************************
/** START TURNS
*****************************************/

    function startTurns(player) {
        initializeTurns(player);
        $("#player1Button").off();
        $("#player2Button").off();
        handleRollButtons();
        //TO TEST FOR A GAME WINNER, UN-COMMENT OUT THE 2 LINES BELOW AND ROLL THE d4 & d6 - IT WILL MAKE THE GAME GO MUCH QUICKER!
        //player1.pieceNumbers = [5, 6, "", "", "", ""];
        //player2.pieceNumbers = [6, 7, "", "", "", ""];
    }

});