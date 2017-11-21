"use strict";

var playingGame = false;
const someRandomNumberWeDontKnow = 700;
const aiThinkTime = 2000; //think time of the ai in ms

function IsEven(n) {
	return n % 2 == 0
}

/**
* 
* @param {Number} min 
* @param {Number} max 
*/
function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min
}

/**
* @param {Number} column - The Column on which the balls will be removed
* @param {Number} removeCount - Number of balls to remove in the specified column
*/
function NimPlay(column, removeCount) {
	this.column = column
	this.removeCount = removeCount
}


/**
 * @param {Number} size - The size of the ball in pixels
 */
function Ball(size){
	this.element = document.createElement('div');
	this.element.className = "ball";
	var size_px = size + "px"
	this.element.style.height=size_px;
	this.element.style.width=size_px;
}	


/**
 * @param {HTMLElement} whereTo - The element where to append this ball to
 */
Ball.prototype.appendBall = function(whereTo){
	whereTo.appendChild(this.element);
}

Ball.prototype.hideBall = function(){
	this.element.style.visibility = "hidden";
}

Ball.prototype.paintBall = function(color){
	this.element.style.backgroundColor = color;
}

function Stack(width,height,gameContext,index){
	
	this.index = index;
	this.gameContext = gameContext;
	this.element = document.createElement('div');
	this.element.className = "stack";
	this.element.style.height = height;
	this.element.style.width = width;
	
	this.balls = [];
}

Stack.prototype.hoverStack = function(index){
	for(var i=this.balls.length-1;i>=index;i--){
		this.balls[i].paintBall("#7bb3f7");
	}
}

Stack.prototype.unHoverStack = function(index){
	for(var i=this.balls.length-1;i>=index;i--){
		this.balls[i].paintBall("#3889EA");
	}
}

Stack.prototype.pushToStack = function(ball) {
	
	var length = this.balls.length;
	var context = this;
	
	ball.element.addEventListener('mouseover', function() {
		context.hoverStack(length);
	}, false);
	
	ball.element.addEventListener('mouseout', function() {
		context.unHoverStack(length);
	}, false);
	
	ball.element.addEventListener('click', function() { 
		context.removeBallsByIndex(length);
	}, false);
	
	this.balls.push(ball);
	this.element.appendChild(ball.element);
}

Stack.prototype.appendStack = function(whereTo) {
	whereTo.appendChild(this.element);
}

Stack.prototype.removeBallsByIndex = function(index) {
	this.gameContext.makePlay(new NimPlay(this.index,this.balls.length-index),"me");
}

Stack.prototype.removeBalls = function(removeCount){
	for(var i = 0; i<removeCount; i++){
		var ball = this.balls.pop();
		ball.hideBall();
	}
}

/**
* 
* @param {Number} columnCount - The Number of columns in the game
* @param {String} difficultyName - The difficulty name
* @param {String} mode - Playing vsAi or vsPlayer
* @param {Bool} meFirst - If the player in the current session plays first
*/

function NimGame(columnCount, difficultyName, mode, meFirst, domElement,userName) {	
	
	playingGame = true;
	
	this.meFirst = meFirst;
	(this.meFirst == "enemyFirst") ? this.myTurn = false : this.myTurn = true;
	this.userName = userName;
	this.howManyPlays = 0;
	this.verboseMode = false;
	this.columnNumber = columnCount;
	this.difficultyName = difficultyName;
	this.difficulty = this.difficulties[difficultyName];
	this.mode = mode;
	this.columns = Array(columnCount).fill(0);
	this.limits = Array(columnCount).fill(0);
	this.maxBalls = (columnCount - 1) * 2 + 3;
	this.myPlays = 0;
	this.hisPlays = 0;
	this.initializeColumns();
	this.ballSize = (someRandomNumberWeDontKnow/this.maxBalls); //in pxs
	this.table_width = (columnCount*(this.ballSize));
	this.events = {
		gameFinish: [],
		switchTurn: []
	}
	this.domElement = domElement;
	this.drawGame();
	this.writeTurn();
	
	if(!this.myTurn){
		var context = this;
		setTimeout(function(){context.makePlay(context.getAiPlay(),"him");}, aiThinkTime);
	}
}



NimGame.prototype.gameFinished = function(iWon, iGaveUp){
	
	console.log("iWon: "+iWon);
	console.log("iGaveUp: "+iGaveUp);
	
	playingGame = false;
	document.body.style.cursor = "default";
	this.domElement.style.display = "none";
	this.pointsBoard.style.display = "block";
	var finalText = document.createElement('h1');
	
	var multiplier = {
		Difficulty: {
			value: iGaveUp ? 0 : (this.difficulties[this.difficultyName]/10),
			element: document.createElement('h3')
		},
		Plays: {
			value:  iGaveUp ? 0 : (1 + this.columns.length/(this.howManyPlays)),
			element: document.createElement('h3')
		},
		Columns: {
			value:  iGaveUp ? 0 : (1 + this.columns.length/10),
			element: document.createElement('h3')
		},
		gameFinished: {
			value: iGaveUp ? 0 : (iWon ? 1 : 0.1),
			element: document.createElement('h3')
		}
	}

	var totalPoints = 1;

	if(iGaveUp){
		this.pointsBoardTitle.innerHTML = "you gave up. the ai won the game.";
	/*	difficultyMultiplier = "n/a"; // TODO
		playsMult = "n/a";
		columnsMult = "n/a";*/
	}
	else{
		if(!iWon){
			this.pointsBoardTitle.innerHTML = "the ai won the game.";
			multiplier.gameFinished.element.innerHTML = "Defeated multiplier = <b>0.1</b>";
		}
		else{
			this.pointsBoardTitle.innerHTML = "congratulations, you won the game!";
			this.pointsBoardTitle.style.color = "#3889EA";
			multiplier.gameFinished.element.innerHTML = "Victorious multiplier = <b>1</b>";
		}
	}
	
//	OnGameFinished(this.userName, totalPoints); //TODO
	
	for(var prop in multiplier) {
		if(prop !== "gameFinished") {
			multiplier[prop].element.innerHTML = `${prop} multiplier = <b>${multiplier[prop].value}</b>`
		}
		totalPoints = totalPoints *  multiplier[prop].value;
		this.pointsBoard.appendChild(multiplier[prop].element)
	}
	totalPoints = totalPoints.toFixed(2);
	finalText.innerHTML = `Total points = <b>${totalPoints}</b>` // "Total points = "+"<b>"+totalPoints+"</b>";
	this.pointsBoard.appendChild(finalText);

	//Hide game and show points
	

	for(var i = this.events.gameFinish.length - 1; i >= 0; --i){
		this.events.gameFinish[i](this, iWon, iGaveUp)
	}
	
}

NimGame.prototype.showAlert = function(message){
	this.alert.innerHTML = message;
}

NimGame.prototype.writeTurn = function(){
	this.turn.innerHTML = this.myTurn ? "your turn" : "opponent's turn";
}

NimGame.prototype.showGiveUp = function(){
	this.confirmationContainer.style.visibility = "visible";
}

NimGame.prototype.hideGiveUp = function(){
	this.confirmationContainer.style.visibility = "hidden";
}

NimGame.prototype.appendVerbose = function(message,color){
	var text = document.createElement('p');	
	text.innerHTML = message;		
	text.style.color = color;			
	this.verboseText.appendChild(text);	
	this.verboseText.scrollTop = this.verboseText.scrollHeight;	
}

NimGame.prototype.makePlay = function(play,whoPlays){
	if((whoPlays == "me" && this.myTurn) || (whoPlays == "him" && !this.myTurn)){
		this.columns[play.column].removeBalls(play.removeCount);
		this.myTurn = !this.myTurn;
		this.showAlert("");
		this.writeTurn();
		
		if(this.isOver()){
			this.gameFinished(!this.myTurn,false);
			return;
		}
		if(whoPlays == "me"){
			this.howManyPlays++;
			this.appendVerbose("You played in column "+play.column+" and removed "+play.removeCount+" balls.","#3889EA");
			var context = this;
			setTimeout(function(){context.makePlay(context.getAiPlay(),"him");}, aiThinkTime);		
		}
		else{
			this.appendVerbose("The opponent played in column "+play.column+" and removed "+play.removeCount+" balls.","#b4b4b4");
		}
	}
	else{
		this.showAlert("Please Wait for the opponent to play");
		return;
	}
}

NimGame.prototype.initializeDOM = function(){
	this.turn = document.createElement('h1');
	this.turn.className = "turn"
	this.alert = document.createElement('h2'); 
	this.canvas = document.createElement('div');
	this.canvas.className = "canvas";
	
	var width_px = this.table_width+"px";
	this.canvas.style.width = width_px;
	this.canvas.style.height = this.ballSize*this.maxBalls;
	
	//Verbose container:
	
	this.verboseCanvas = document.createElement('div');
	this.verboseText = document.createElement('div');
	this.verboseCanvas.className = "canvas";
	this.verboseCanvas.style.width = this.table_width + "px";
	this.verboseText.className = "verbose_text";
	this.verboseCanvas.style.display = "none";
	
	//Verbose button
	this.verboseButton = document.createElement('div');
	this.verboseButton.className = "button verbose";
	this.verboseButton.innerHTML = "Verbose Mode";
	this.verboseButton.style.width = this.table_width + "px";
	
	var context = this;
	
	this.verboseButton.addEventListener('click', function() {
		(context.verboseMode) ? context.verboseCanvas.style.display = "none" : context.verboseCanvas.style.display = "block";
		context.verboseMode = !context.verboseMode;
	}, false);
	
	// -------------------- //
	
	//Give up button:
	
	this.giveUpButton = document.createElement('div');
	this.giveUpButton.className = "button giveup";
	this.giveUpButton.innerHTML = "Give up";
	this.giveUpButton.style.width = this.table_width + "px";
	this.giveUpButton.addEventListener("click", function() {
		context.showGiveUp();
	}, false);
	
	// -------------------- //
	
	//Give up container:
	
	this.confirmationContainer = document.createElement('div');
	this.confirmationContainer.style.visibility = "hidden";
	
	var confirmation = document.createElement('div');
	
	var confirmationText = document.createElement('h1');
	confirmationText.innerHTML = "Give up?";
	
	//Give up YES or NO buttons:
	
	var buttonYes = document.createElement('div');
	buttonYes.className = "button";
	buttonYes.innerHTML = "yes"
	
	buttonYes.addEventListener("click", function() {
		context.gameFinished(false,true);
	}, false);
	
	var buttonNo = document.createElement('div');
	buttonNo.className = "button";
	buttonNo.innerHTML = "no";
	
	buttonNo.addEventListener("click", function() {
		context.hideGiveUp();
	}, false);
	
	
	// ---------------------- //
	
	//Points board for when the game is finished:
	
	this.pointsBoard = document.createElement('div');
	
	
	this.pointsBoardTitle = document.createElement('h1');
	this.pointsBoardTitle.className ="title";
	
	
	var hr = document.createElement('hr');
	this.pointsBoard.appendChild(hr);
	
	var pointsBoardPoints = document.createElement('h2');
	pointsBoardPoints.innerHTML = "Points";
	
	var buttonContainer = document.createElement('div');
	buttonContainer.className = "buttons";
	var changeSettignsButton = document.createElement('input');
	changeSettignsButton.className = "button right";
	changeSettignsButton.type = "submit";
	changeSettignsButton.value = "Change settings";
	
	var playAgainButton = document.createElement('input');
	playAgainButton.className = "button left";
	playAgainButton.type = "submit";
	playAgainButton.value = "Play again";
	
	// -------------------- //
	buttonContainer.appendChild(changeSettignsButton)
	buttonContainer.appendChild(playAgainButton)
	this.domElement.appendChild(this.turn);
	this.domElement.appendChild(this.alert);
	this.domElement.appendChild(this.canvas);
	this.domElement.appendChild(this.verboseCanvas);
	this.domElement.appendChild(this.verboseButton);
	this.domElement.appendChild(this.giveUpButton);
	this.domElement.appendChild(this.confirmationContainer);
	this.verboseCanvas.appendChild(this.verboseText);
	this.confirmationContainer.appendChild(confirmation);
	confirmation.appendChild(confirmationText);
	confirmation.appendChild(buttonYes);
	confirmation.appendChild(buttonNo);
		
	this.domElement.appendChild(this.pointsBoard);
	this.pointsBoard.appendChild(this.pointsBoardTitle);
	this.pointsBoard.appendChild(hr);
	this.pointsBoard.appendChild(pointsBoardPoints);
	this.pointsBoard.appendChild(buttonContainer);
	this.pointsBoard.appendChild(playAgainButton);
	this.pointsBoard.style.display = "none"
	
}

NimGame.prototype.initializeBoard = function() {
	var stackWidth = this.table_width/this.columnNumber-5;
	var stackHeight = this.ballSize*this.maxBalls;
	var counter = 3;
	for(var i = 0; i<this.columnNumber; i++){
		var column = new Stack(stackHeight,stackWidth,this,i);
		for(var j = 0; j<counter ; j++){
			var ball = new Ball(this.ballSize);
			column.pushToStack(ball);
		}
		column.appendStack(this.canvas);
		this.columns[i]=column; //store dem stacks on the array of this NimGame object
		counter+=2;
	}
}

NimGame.prototype.drawGame = function() {
	this.initializeDOM();
	this.initializeBoard();
}

NimGame.prototype.initializeColumns = function() {
	var incrementer = 3;
	for (var i = 0; i < this.columns.length; i++) {
		this.columns[i] = incrementer;
		this.limits[i]=this.max_balls-incrementer-1;
		incrementer+=2;
	}	
}

/**
* @returns {Number} The nim sum of the current board
*/
NimGame.prototype.nimSum = function() {
	var nimSum = this.columns[0].balls.length;
	console.log("nimSum = "+nimSum);
	for (var i = 1; i < this.columns.length; i++) {
		nimSum = nimSum ^ this.columns[i].balls.length;
		console.log("nimSum = "+nimSum);
	}
	console.log("Return nimSum of "+nimSum);
	console.log("\n\n---\n\n");
	return nimSum;
}

/**
* @param {String} eventName
* @param {Function} callback
*/
NimGame.prototype.on = function(eventName, callback) {
	if(this.events[eventName] === null)
	this.events[eventName] = []
	this.events[eventName].push(callback)
}

NimGame.prototype.isOver = function() {
	for(var i = this.columns.length - 1; i >= 0; --i) {
		if(this.columns[i].balls.length !== 0)
		return false
	}
	return true
}

NimGame.prototype.shouldPlayRandom = function(){
	var random = randomBetween(0, 100)
	return random>=this.difficulty
}

/**
* @returns {Number} - Returns a random column which contains atleast one ball
*/
NimGame.prototype.getRandomValidColumn = function() {
	var valid = [];
	for(var i = this.columns.length - 1; i >= 0; --i) {
		if(this.columns[i].balls.length > 0){
			valid.push(i)
			console.log("Pushing: "+i);
		}
	}
	return valid[randomBetween(0, valid.length - 1)]
}

NimGame.prototype.getAiPlay = function() {
	console.log("getting AI play...");
	var nimSum = this.nimSum()
	console.log("nimSum: "+nimSum);
	if(nimSum === 0 || this.shouldPlayRandom()) {
		var column = this.getRandomValidColumn();
		console.log("Playing random...");
		console.log("column chosen is "+column);
		//console.log("aaPlaying in column "+column+" And "+randomBetween(0, this.columns[column].length));
		return new NimPlay(column, randomBetween(1, this.columns[column].balls.length))
	}
	for(var i = 0; i < this.columns.length; ++i) {
		if((this.columns[i].balls.length ^ nimSum) < this.columns[i].balls.length) {
			console.log("Playing legit...");
			console.log("i: "+i+" this.columns[i].balls.length: "+this.columns[i].balls.length+" nimSum: "+nimSum);
			var ballsToRemove = this.columns[i].balls.length - (this.columns[i].balls.length ^ nimSum);
			console.log("Playing in column "+i+" And "+ballsToRemove);
			return new NimPlay(i, ballsToRemove);
		}
	}
	
}

NimGame.prototype.difficulties = {
	easy: 25,
	normal: 50,
	heroic: 75,
	legendary: 100
}

