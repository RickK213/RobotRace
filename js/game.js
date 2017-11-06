"use strict";

$(document).ready(function() {
    function runGame(){
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

        function addPiece(playerNumber, totalRoll){
            let pieceSelector;
            let labelSelector;
            let pieceIndex;
            if(playerNumber === 1){
                pieceIndex = getPieceIndex(player1.pieceNumbers, totalRoll);
                player1.pieceNumbers[pieceIndex] = "";
                pieceSelector = "#robot1Piece"+(pieceIndex+1);
                labelSelector = "#robot1Label"+(pieceIndex+1);
            }
            else {
                pieceIndex = getPieceIndex(player2.pieceNumbers, totalRoll);
                player2.pieceNumbers[pieceIndex] = "";
                pieceSelector = "#robot2Piece"+(pieceIndex+1);
                labelSelector = "#robot2Label"+(pieceIndex+1);
            }
            $(pieceSelector).removeClass("invisible");
            $(labelSelector).addClass("invisible");
        }

        function changePlayer1Message(message) {
            let playerMessage = '<span class="text-primary playerName">' + player1.name + ":</span><br>" + message;
            $("#player1Messages").html(playerMessage);
        }

        function changePlayer2Message(message) {
            let playerMessage = '<span class="text-danger playerName">' + player2.name + ":</span><br>" + message;
            $("#player2Messages").html(playerMessage);
        }

        function checkForDice(playerObject, numDice){
            if ( playerObject.diceInHand.length!==numDice ) {
                alert('You must select ' + numDice + ' dice to roll.');
                return false;
            } else {
                return true;
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

        function checkForWin(playerNumber){
            let playerWon = true;
            let playerPieces;
            switch(playerNumber){
                case 1:
                    playerPieces = player1.pieceNumbers;
                    break;
                case 2:
                    playerPieces = player2.pieceNumbers;
                    break;
            }
            for(let i=0; i<playerPieces.length; i++){
                if ( typeof playerPieces[i] === 'number' ) {
                    playerWon = false;
                }
            }
            if (playerWon) {
                return playerNumber;
            }
            else{
                return false;
            }
        }

        function clearPlayerBoards(){
            $('.robotPiece').each(function(){
                $(this).addClass('invisible');
            })
            $('.pieceNumber').each(function(){
                $(this).removeClass('invisible');
            })
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

        function continueRolling(nextPlayer, message){
            if( nextPlayer === 1 ) {
                hidePlayer2Interface();
                changePlayer2Message(message);
                changePlayer1Message('It is your turn, roll the dice');
                showPlayer1Interface();
                clearPlayerHand(1);
                let diceArray = getDiceInPlay("all");
                putDiceInSelector(1,diceArray);
            } else {
                hidePlayer1Interface();
                changePlayer1Message(message);
                changePlayer2Message('It is your turn, roll the dice');
                showPlayer2Interface();
                clearPlayerHand(2);
                let diceArray = getDiceInPlay("all");
                putDiceInSelector(2,diceArray);
            }
        }

        function continueTurns(nextPlayer){
            if ( nextPlayer === 1 ) {
                showPlayer1Interface();
            }
            else {
                showPlayer2Interface();
            }
        }

        function doDieRemove(playerNumber, numSides, dieString){
            let playerObject;
            let diceSelectorDiv;
            switch (playerNumber) {
                case 1:
                    playerObject = player1;
                    diceSelectorDiv = '#player1Interface';
                    break;
                case 2:
                    playerObject = player2;
                    diceSelectorDiv = '#player2Interface';
                    break;
            }
            diceSelectorDiv += " .diceSelector";
            for (let i=0; i<playerObject.diceInHand.length; i++) {
                if ( playerObject.diceInHand[i] === numSides ) {
                    playerObject.diceInHand.splice(i,1);
                    $(diceSelectorDiv).prepend(dieString);
                }
            }

        }

        function drawPlayerBoard(playerNumber){
            clearPlayerBoards();
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
            }
            for (let i=0; i<player.pieceNumbers.length; i++) {
                pieceNumber = player.pieceNumbers[i];
                let selectorDiv = selectorID + " .piece" + (i+1);
                $(selectorDiv).html(pieceNumber);
            }
        }

        function fireModal(messageTitle, messageBody, buttonText, actionAfterClose, actionArgument) {
            $('#messageTitle').html(messageTitle);
            $('#messageBody').html(messageBody);
            $('#messageButton').html(buttonText);
            $('#gameModal').modal({backdrop: 'static'});
            $('#messageButton').on('click tap touchstart', function(event) {
                event.preventDefault();
                actionAfterClose(actionArgument);
            });
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

        function generatePlayerPieces(){
            let floor = 2;
            let ceiling = 32;
            let numPieces = 6;
            player1.pieceNumbers = generatePieceNumbers(floor, ceiling, numPieces);
            player2.pieceNumbers = generatePieceNumbers(floor, ceiling, numPieces);
            drawPlayerBoard(1);
            drawPlayerBoard(2);
        }

        function getDiceHTML(diceArray){
            let diceHTML = "";
            for (let i=0; i<diceArray.length; i++) {
                diceHTML += '<div class="die die-' + diceArray[i] + '"></div>';
            }
            diceHTML += '<div class="clearfix">&nbsp;</div>';
            return diceHTML;
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

        function getDiceInPlay(dice){
            let diceArray;
            switch(dice) {
                case "all":
                    diceArray = [4,6,8,10,12,20];
                    break;
                case 4:
                    diceArray = [4];
                    break;
            }
            return diceArray;
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

        function getDieRollResult(numSides){
            let dieRoll = Math.floor(Math.random() * numSides) + 1;
            return dieRoll;
        }

        function getClassName(selectorObject){
            return selectorObject[0].className;
        }

        function getNumSides(className){
            return parseInt( className.match(/[0-9]+/g)[0] );
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

        function getPlayerNumber(selectorObject){
            return parseInt(selectorObject.parent().parent().parent().parent()[0].className);
        }

        function getSingleRollMessage(numSides, singleRoll) {
            let message = '<div class="die-container"><div class="die-small die-' + numSides + '"></div><span class="dieRoll"> =' + singleRoll + '</span></div>';
            return message;        
        }

        function getTotalRollMessage(playerNumber, totalRoll){
            let playerObject;
            switch(playerNumber){
                case 1:
                    playerObject = player1;
                    break;
                case 2:
                    playerObject = player2;
                    break;
            }
            let message = "";
            for(let i=0; i<playerObject.diceInHand.length; i++){
                message += getSingleRollMessage(playerObject.diceInHand[i], totalRoll);
            }
            return message;
        }

        function handleDiceInHand(){
            $('.diceInHand').on('click tap touchstart', '.die', function(event) {
                event.preventDefault();
                let playerNumber = getPlayerNumber( $(this) );
                let className = getClassName( $(this) );
                let numSides = getNumSides(className);
                removeDieFromHand(playerNumber, numSides);
                $(this).remove();
            });
        }

        function handleDiceSelector(){
            $('.diceSelector').on('click tap touchstart', '.die', function(event) {
                event.preventDefault();
                let playerNumber = getPlayerNumber( $(this) );
                let diceInHand = getDiceInHand(playerNumber);
                let numDiceInHand = diceInHand.length;
                if( numDiceInHand ===2 ) {
                    alert('You can only roll 2 dice. Click the dice in your hand to remove them.');
                } else {
                    let className = getClassName( $(this) );
                    let numSides = getNumSides(className);
                    putDieInHand(playerNumber, numSides);
                    $(this).remove();
                }
            });
        }

        function handlePlayButton() {
            $('#playButton').on('click tap touchstart', function(event) {
                event.preventDefault();
                startNewGame();
            });
        }

        function handleRollButtons(){
            $('#player1Button').on('click tap touchstart', function(event) {
                event.preventDefault();
                let hasProperDice = checkForDice(player1, 2);
                if ( hasProperDice ) {
                    rollForPiece(1);
                }
            });
            $('#player2Button').on('click tap touchstart', function(event) {
                event.preventDefault();
                let hasProperDice = checkForDice(player2, 2);
                if ( hasProperDice ) {
                    rollForPiece(2);
                }
            });
        }

        function handleRollFirstButtons(){
            let player1TotalRoll;
            $('#player1Button').on('click tap touchstart', function(event) {
                event.preventDefault();
                let hasProperDice = checkForDice(player1, 1);
                if ( hasProperDice ) {
                    player1TotalRoll = getDiceTotal(player1.diceInHand);
                    let message = getTotalRollMessage(1, player1TotalRoll);
                    changePlayer1Message(message);
                    changePlayer2Message('It is your turn, roll the dice');
                    switchPlayers(2, false);
                }
            });
            $('#player2Button').on('click tap touchstart', function(event) {
                event.preventDefault();
                let hasProperDice = checkForDice(player2, 1);
                if ( hasProperDice ) {
                    let player2TotalRoll = getDiceTotal(player2.diceInHand);
                    let message = getTotalRollMessage(1, player2TotalRoll);
                    changePlayer2Message(message);
                    hidePlayer2Interface();
                    showRollFirstResults(player1TotalRoll, player2TotalRoll);
                }
            });
        }

        function hidePlayer1Interface(){
            $("#player1Interface").addClass("invisible");
            $("#player1 .diceInHand").html("");
        }

        function hidePlayer2Interface(){
            $("#player2Interface").addClass("invisible");
            $("#player2 .diceInHand").html("");
        }

        function initializeTurns(player){
            switchPlayers(player, true);
            let diceArray = getDiceInPlay("all");
            clearPlayerHand(1);
            clearPlayerHand(2);
            putDiceInSelector(1,diceArray);
            putDiceInSelector(2,diceArray);
        }

        function putDieInHand(playerNumber, numSides){
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

        function removeDieFromHand(playerNumber, numSides){
            let dieString = '<div class="die die-' + numSides + '"</div>';
            switch (playerNumber) {
                case 1:
                    doDieRemove(1, numSides, dieString);
                    break;
                case 2:
                    doDieRemove(2, numSides, dieString);
                    break;
            }
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

        function rollForPiece(playerNumber){
            let fullRobotArray = 6;
            let nextPlayer;
            let player1Won = false;
            let player2Won = false;
            switch (playerNumber) {
                case 1:
                    nextPlayer = 2;
                    break;
                case 2: 
                    nextPlayer = 1;
                    break;
            }
            let diceInHand = getDiceInHand(playerNumber);
            let totalRoll = getDiceTotal(diceInHand);
            let message = getTotalRollMessage(playerNumber, totalRoll);
            message +='<br><strong>TOTAL ROLL: ' + totalRoll + '</strong>';;
            let playerHasPiece = checkForPiece(playerNumber, totalRoll);
            if ( playerHasPiece ) {
                message += '<br><span class="text-success">' + totalRoll + ' IS one of your required piece numbers! It has been added to your robot!</span>';
                addPiece(playerNumber, totalRoll);
                let playerThatWon = checkForWin(playerNumber);
                if ( !playerThatWon ) {
                    continueRolling(nextPlayer, message);            
                } else {
                    showGameWinnerMessage(playerThatWon, message);
                } 
            }
            else {
                message += '<br><span class="text-danger">' + totalRoll + ' IS NOT one of your required piece numbers.</span>';
                continueRolling(nextPlayer, message);            
            }
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

        function showGameBoard() {
            $("#howToPlay").fadeOut(function(){
                $('#gameBoard').fadeIn();
            });
        }

        function showGameWinnerMessage(playerThatWon, message){
            let buttonText = 'Play Again';
            let actionAfterClose = startNewGame;
            let actionArgument = '';
            let playerObject;
            switch (playerThatWon) {
                case 1:
                    changePlayer1Message(message);
                    playerObject = player1;
                    break; 
                case 2:
                    changePlayer2Message(message);
                    playerObject = player2;
                    break;
            }
            let alertTitle = playerObject.name + ' WINS!';
            let gameMessage = playerObject.name + ' is the winner! Would you like to play again?';
            fireModal(alertTitle, gameMessage, buttonText, actionAfterClose, actionArgument);

        }

        function showPlayer1Interface(){
            $("#player1Interface").removeClass("invisible");
        }

        function showPlayer2Interface(){
            $("#player2Interface").removeClass("invisible");
        }

        function showRollFirstResults(player1FirstRoll, player2FirstRoll) {
            let alertTitle;
            let gameMessage;
            let firstPlayer;
            let actionAfterClose;
            let buttonText;
            let isTied = false;
            if ( player1FirstRoll === player2FirstRoll ) {
                alertTitle = 'It\'s a tie!';
                gameMessage = player1.name + ' rolled a ' + player1FirstRoll + '. ' + player2.name + ' rolled a ' + player2FirstRoll + '. It\'s a tie! Please roll again.';
                isTied = true;
            } else if ( player1FirstRoll > player2FirstRoll ) {
                alertTitle = player1.name + ' Goes First!';
                gameMessage = player1.name + ' rolled a ' + player1FirstRoll + '. ' + player2.name + ' rolled a ' + player2FirstRoll + '. <strong class="text-primary">' + player1.name + '</strong> goes first!';
                firstPlayer = 1;
            } else {
                alertTitle = player2.name + ' Goes First!';
                gameMessage = player1.name + ' rolled a ' + player1FirstRoll + '. ' + player2.name + ' rolled a ' + player2FirstRoll + '. <strong class="text-danger">' + player2.name + '</strong> goes first!';
                firstPlayer = 2;
            }

            if (isTied) {
                actionAfterClose = rollForFirsts;
                buttonText = 'Roll Again';
            } else {
                actionAfterClose = startTurns;
                buttonText = 'Let\'s Play!';
            }

            fireModal(alertTitle, gameMessage, buttonText, actionAfterClose, firstPlayer);
        }
        
        function startNewGame() {
            setPlayerNames();
            generatePlayerPieces();
            showGameBoard();
            $('.diceSelector').off();
            handleDiceSelector();
            $('.diceInHand').off();
            handleDiceInHand();
            rollForFirsts();
        }

        function startTurns(player) {
            initializeTurns(player);
            $("#player1Button").off();
            $("#player2Button").off();
            handleRollButtons();
            //TO TEST FOR A GAME WINNER, REMOVE COMMENTS FROM THE 2 LINES BELOW AND ROLL THE d4 & d6 - IT WILL MAKE THE GAME GO MUCH QUICKER!
            player1.pieceNumbers = [5, 6, "", "", "", ""];
            player2.pieceNumbers = [6, 7, "", "", "", ""];
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

        $('#playButton').off();
        handlePlayButton();
    }
    runGame();
});