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


    function handleRollButtons(){
        let numSides = "all";
        $("#player1Button").on('click tap touchstart', function(event) {
            event.preventDefault();
            let player = 1;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPrime(player, diceInHand);
        });
        $("#player2Button").on('click tap touchstart', function(event) {
            event.preventDefault();
            let player = 2;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPrime(player, diceInHand);
        });
    }

    function handleRollForPieceButtons(){
        let numSides = 6;
        $("#player1Button").on('click tap touchstart', function(event) {
            event.preventDefault();
            let player = 1;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPiece(player, diceInHand);
        });
        $("#player2Button").on('click tap touchstart', function(event) {
            event.preventDefault();
            let player = 2;
            let diceInHand = getDiceInPlay(numSides);
            rollDiceForPiece(player, diceInHand);
        });
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

