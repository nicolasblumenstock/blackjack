//=============================//
//============================//
//===========================//




$(document).ready(function(){
	const freshDeck = createDeck();
	var theDeck = freshDeck.slice();
	var playersHand = [];
	var dealersHand = [];


	function createDeck(){
		var newDeck = [];
		const suits = ['h', 'c', 'd', 's'];

		for (let s = 0; s < suits.length; s++){
			for (let c = 1; c <= 13; c++){
				newDeck.push(c + suits[s]);
			};
		};
		return newDeck;
	};

	$('.deal-button').click(function(){
		resetGame();
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		placeCard('player',1,playersHand[0]);
		placeCard('dealer',1,dealersHand[0]);
		placeCard('player',2,playersHand[1]);
		placeCard('dealer',2,dealersHand[1]);
		calculateTotal(playersHand,'player');
		displayTotal(playersHand,'player');
		calculateTotal(dealersHand,'dealer');
		setTimeout(function(){
			startFlip();
		}, 2000);
		checkBust();
	});

	function placeCard(who,where,cardToPlace){
		var classBack = '.' + who + '-cards .card-' + where + ' .back';
		var classFront = '.' + who + '-cards .card-' + where + ' .front';
		var classSelector = '.' + who + '-cards .card-' + where;
		$(classBack).html('<img src="cards/cardback.jpg">');
		$(classFront).html('<img src="cards/' + cardToPlace + '.png">');
		$(classSelector).addClass('dealt');
		// $(classSelector).html('<img src="cards/' + cardToPlace + '.png">');
		// $(classSelector).addClass('dealt');
	}

	function startFlip(){
		$('.player-cards .card-1').addClass('flipped');
		$('.player-cards .card-2').addClass('flipped');
		$('.dealer-cards .card-1').addClass('flipped');		
	}

	$('.hit-button').click(function(){
		playersHand.push(theDeck.shift());
		placeCard('player',playersHand.length,playersHand[playersHand.length-1])
		console.log(playersHand.length-1)
		$(`.player-cards .card-${(playersHand.length)}`).addClass('flipped');
		calculateTotal(playersHand,'player');
		displayTotal(playersHand,'player');
		calculateTotal(dealersHand, 'dealer');
		checkBust();

	})

	function calculateTotal(hand,who){
		var total = 0;
		var thisCardValue = 0;
		var hasAce = false;
		var numAces = 0;
		var classSelector = '.' + who + '-score';
		for (let i = 0; i < hand.length; i++){
			thisCardValue = Number(hand[i].slice(0,-1));
			if (thisCardValue > 10){
				thisCardValue = 10;
			}else if(thisCardValue == 1){
				hasAce = true;
				numAces++;
				thisCardValue = 11;
			}
		
			total += thisCardValue;
		}
		for(let i = 0; i<numAces;i++){
			if((total > 21) && (hand.length >= 2)){
				total -= 10;
			}
		}
			
		// $(classSelector).text(total);
		return total;
	}

	function checkWin(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		if ((playerTotal == 21) && (playersHand.length == 2)){
			$('.game-text').html('BLACKJACK! You win!');
		}else if((dealerTotal == 21) && (dealersHand.length == 2)){
			displayTotal(dealersHand,'dealer');
			$('.game-text').html('Dealer wins with BLACKJACK!');
		}else if (playerTotal > 21){
			$('.game-text').html('BUST! You lose.');
		}else if(dealerTotal > 21){
			displayTotal(dealersHand,'dealer');			
			$('.game-text').html('Dealer busts! You win.');
		}else if(playerTotal > dealerTotal){
			displayTotal(dealersHand,'dealer');						
			$('.game-text').html('You win!');
		}else if(dealerTotal > playerTotal){
			displayTotal(dealersHand,'dealer');			
			$('.game-text').html('Dealer wins!');
		}else{
			displayTotal(dealersHand,'dealer');			
			$('.game-text').html('Tie game.');
		}

	}

	function checkBust(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		if ((playerTotal == 21) && (playersHand.length == 2)){
			$('.game-text').html('BLACKJACK! You win!');
		}else if((dealerTotal == 21) && (dealersHand.length == 2)){
			flipCards();
			displayTotal(dealersHand,'dealer');
			$('.game-text').html('Dealer wins with BLACKJACK!');
		}else if (playerTotal > 21){
			$('.game-text').html('BUST! You lose.');
		}else if(dealerTotal > 21){
			flipCards();
			displayTotal(dealersHand,'dealer');
			$('.game-text').html('Dealer busts! You win.');
		}else{
			return;
		} 
	}

	function shuffleDeck(){
		for (let i = 0; i < 50000; i++){
			var random1 = Math.floor(Math.random() * theDeck.length);
			var random2 = Math.floor(Math.random() * theDeck.length);
			var tempCard = theDeck[random1];
			theDeck[random1] = theDeck[random2];
			theDeck[random2] = tempCard;
		}
		return theDeck;
	}


	function flipCards(){
		for (let i = 1; i < dealersHand.length; i++){
			var dealersCards = ".dealer-cards .card-" + (i+1);
			$(dealersCards).addClass('flipped');							
		}
	}


	$('.stand-button').click(function(){
		var dealerTotal = calculateTotal(dealersHand,'dealer');
		while (dealerTotal < 17){
			dealersHand.push(theDeck.shift());
			placeCard('dealer',dealersHand.length,dealersHand[dealersHand.length-1]);
			dealerTotal = calculateTotal(dealersHand,'dealer');
			displayTotal(dealersHand,'dealer');
		};

		flipCards();
		setTimeout(function(){
			checkWin();
		}, 1000);

	})

	function resetGame(){
		playersHand = [];
		dealersHand = [];
		$('.card').html('<div class="front"></div><div class="back"></div>');
		calculateTotal(playersHand,'player');
		calculateTotal(dealersHand,'dealer');
		$('.dealer-score').html('');
		$('.player-score').html('');
		$('.game-text').html('');
		theDeck = freshDeck.slice();
		shuffleDeck();
		$('.dealer-cards .card').removeClass('flipped');
	}

	function displayTotal(hand,who){
		var whoseTotal = '.' + who + '-score';
		$(whoseTotal).html(calculateTotal(hand,who));
	}

})



