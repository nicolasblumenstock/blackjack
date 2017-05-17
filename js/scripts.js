//=============================//
//============================//
//===========================//




$(document).ready(function(){
	const freshDeck = createDeck();
	var theDeck = freshDeck;
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
		theDeck = shuffleDeck();
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		placeCard('player',1,playersHand[0]);
		placeCard('dealer',1,dealersHand[0]);
		placeCard('player',2,playersHand[1]);
		placeCard('dealer',2,dealersHand[1]);
		calculateTotal(playersHand,'player');
		calculateTotal(dealersHand,'dealer');
		checkBust();

	});

	function placeCard(who,where,cardToPlace){
		var classSelector = '.' + who + '-cards .card-' + where;
		$(classSelector).html('<img src="cards/' + cardToPlace + '.png">');

	}

	$('.hit-button').click(function(){
		playersHand.push(theDeck.shift());
		placeCard('player',playersHand.length,playersHand[playersHand.length-1])
		calculateTotal(playersHand,'player');
		calculateTotal(dealersHand, 'dealer');
		if ($('.dealer-score').html() < 17){
			dealersHand.push(theDeck.shift());
			placeCard('dealer',dealersHand.length,dealersHand[dealersHand.length-1]);
			calculateTotal(dealersHand,'dealer');
		}
		checkBust();

	})

	function calculateTotal(hand,who){
		var total = 0;
		var thisCardValue = 0;
		var score = '.' + who + '-score';
		var length = hand.length;
		for(let i = 0; i < hand.length; i++){
			thisCardValue = Number(hand[i].slice(0,-1));
			if ((total == 10) && (thisCardValue == 1) && (length == 2)){
				total = 21;
			}else if (thisCardValue >= 10){
				total += 10;
			}else{
			total += thisCardValue;
			}
		}
		$(score).html(total)
		return total;
	}

	function checkWin(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		if ((playerTotal == 21) && (playersHand.length == 2)){
			$('.game-text').html('BLACKJACK! You win!');
		}else if((dealerTotal == 21) && (dealersHand.length == 2)){
			$('.game-text').html('Dealer wins with BLACKJACK!');
		}else if (playerTotal > 21){
			$('.game-text').html('BUST! You lose.');
		}else if(dealerTotal > 21){
			$('.game-text').html('Dealer busts! You win.');
		}else if(playerTotal > dealerTotal){
			$('.game-text').html('You win!');
		}else if(dealerTotal > playerTotal){
			$('.game-text').html('Dealer wins!');
		}else{
			$('.game-text').html('Tie game.');
		}

	}

	function checkBust(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		if ((playerTotal == 21) && (playersHand.length == 2)){
			$('.game-text').html('BLACKJACK! You win!');
		}else if((dealerTotal == 21) && (dealersHand.length == 2)){
			$('.game-text').html('Dealer wins with BLACKJACK!');
		}else if (playerTotal > 21){
			$('.game-text').html('BUST! You lose.');
		}else if(dealerTotal > 21){
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



	$('.stand-button').click(function(){
		var dealerTotal = calculateTotal(dealersHand,'dealer');
		while (dealerTotal < 17){
			dealersHand.push(theDeck.shift());
			placeCard('dealer',dealersHand.length,dealersHand[dealersHand.length-1]);
			dealerTotal = calculateTotal(dealersHand,'dealer');
		};
		checkWin();
	})




})



