"use strict";

var playingGame = false;
const someRandomNumberWeDontKnow = 700;
const aiThinkTime = 2000; //think time of the ai in ms
//const host = "twserver.alunos.dcc.fc.up.pt";
//const port = 8008;

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
	switch(this.gameContext.mode){
		case "Human":
		console.log("notifying...");
		this.gameContext.notifyPlay(new NimPlay(this.index,this.balls.length-index));
		break;
		case "Computer":
		this.gameContext.makePlay(new NimPlay(this.index,this.balls.length-index),"me");
		break;
	}
	
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

function NimGame(mode,columnCount, difficultyName, meFirst, domElement,userName,groupNumber,password) {	

	//new NimGame(mode,columns,undefined,undefined,domElement,loginInfo.username,group,loginInfo.password)
	
	playingGame = true;

	this.mode = mode;
	this.userName = userName;
	this.columnNumber = columnCount;
	this.verboseMode = false;
	this.columns = Array(columnCount).fill(0);
	this.limits = Array(columnCount).fill(0);
	this.maxBalls = (columnCount - 1) * 2 + 3;
	//this.myPlays = 0;
	//this.hisPlays = 0;
	this.initializeColumns();
	this.ballSize = (someRandomNumberWeDontKnow/this.maxBalls); //in pxs
	this.table_width = (columnCount*(this.ballSize)) + 5;
	this.events = {
		gameFinish: [],
		switchTurn: []
	}
	this.domElement = domElement;
	this.drawGame();

	switch(this.mode){
		case "Human":
			this.groupNumber = groupNumber;
			this.password = password;
			this.joinGame();
		break;
		case "Computer":
			this.meFirst = meFirst;
			(this.meFirst == "enemyFirst") ? this.myTurn = false : this.myTurn = true;
			this.howManyPlays = 0;
			this.difficultyName = difficultyName;
			this.difficulty = this.difficulties[difficultyName];
			this.writeTurn();
			if(!this.myTurn){
				var context = this;
				setTimeout(function(){context.makePlay(context.getAiPlay(),"him");}, aiThinkTime);
			}
		break;
	}

	
}

NimGame.prototype.notifyPlay = function(play){

	console.log(play);

	
	console.log("LENGTH: "+ this.columns[play.column].balls.length);
	console.log("REMOVE COUNT: "+play.removeCount);

	var tmpPieces = this.columns[play.column].balls.length-play.removeCount;

	console.log("MAKING REQUEST OF POST OF NOTIFY:");
	console.log(loginInfo.username);
	console.log(loginInfo.password);
	console.log(this.gameId);
	console.log(play.column);
	console.log(tmpPieces);
	console.log("---");

	makeRequest(host, port, "notify", "POST", {nick: loginInfo.username, pass: loginInfo.password,game: this.gameId, stack: play.column, pieces: tmpPieces}, (status, data) => {
		if(data.error){
			this.showAlert(data.error);
		}

		else{
			console.log("Valid play. Let's wait for the update!");
		}
	})

}

NimGame.prototype.onReceiveUpdate = function(data){
	console.log("\n\n\nRECEIVED UPDATE");
	console.log(data);
	console.log("\n\n\n");
	if(data.error){
		console.log(data);
	}
	else{
		if(data.turn!=undefined && data.rack!=undefined && data.stack==undefined && data.pieces==undefined){
			switch(data.turn){
				case this.userName:
				console.log("Your turn to play!");
				break;
				default:
				console.log("Enemy's turn to play!");
				break;
			}
			console.log(data.rack);
		}

		else{
			if(data.stack!=undefined && data.pieces!=undefined){
				//new play update being received
				var ballsRemoved = this.columns[data.stack].balls.length-data.pieces;
				var play = new NimPlay(data.stack,ballsRemoved);
				console.log("BALLSZ:");
				console.log(this.columns[data.stack]);
				console.log(ballsRemoved);
				this.columns[data.stack].removeBalls(ballsRemoved); //here we update the play on our screen!
			}
		}
	}
}

NimGame.prototype.joinGame = function(){
	//console.log("SIZE IS GOING TO BE "+this.columnNumber);
	makeRequest(host, port, "join", "POST", {group: this.groupNumber, nick: this.userName, pass: this.password, size: this.columnNumber},(status, data) => {
		if(data.error){
			console.log(data.error);
		}
		else{
			console.log(data);
			this.gameId = data.game;
			this.initializeServerEventListener(data.game);	
			console.log("Waiting for other player...");
		}
	})
}

NimGame.prototype.initializeServerEventListener = function(gameId){
	//we wait for updates to do stuff
	//console.log("Fetching from ... "+ `http://${host}:${port}/update?nick=${this.userName}&game=${gameId}`);
	this.eventSource = new EventSource(`http://${host}:${port}/update?nick=${this.userName}&game=${gameId}`);
	var context = this;
	this.eventSource.onmessage = function(event) {
		console.log("RECEIVED AN UPDATE!")
   		var data = JSON.parse(decodeURIComponent(event.data));
   		context.onReceiveUpdate(data);
 	}
}

NimGame.prototype.showOfflinePoints = function(iWon, iGaveUp) {
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
	playingGame = false;
	this.boardContainer.style.display = "none";
	this.pointsBoard.style.display = "block";
	var finalText = document.createElement('h1');
	var totalPoints = 1;
	

	if(iGaveUp){
		this.pointsBoardTitle.innerHTML = "you gave up. the ai won the game.";
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
	buttonContainer.appendChild(changeSettignsButton)
	buttonContainer.appendChild(playAgainButton)
	this.pointsBoard.appendChild(buttonContainer)
}

NimGame.prototype.gameFinished = function(iWon, iGaveUp){
	this.showOfflinePoints(iWon, iGaveUp)
//	OnGameFinished(this.userName, totalPoints); //TODO
	
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
	this.boardContainer = document.createElement('div');
	
	//Verbose container:
	
	this.verboseCanvas = document.createElement('div');
	this.verboseCanvas.className = "verbose"
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
	buttonContainer.appendChild(changeSettignsButton)
	buttonContainer.appendChild(playAgainButton)
	
	// -------------------- //
	this.boardContainer.appendChild(this.turn);
	this.boardContainer.appendChild(this.alert);
	this.boardContainer.appendChild(this.canvas);
	this.boardContainer.appendChild(this.verboseCanvas);
	this.boardContainer.appendChild(this.verboseButton);
	this.boardContainer.appendChild(this.giveUpButton);
	this.boardContainer.appendChild(this.confirmationContainer);
	this.domElement.appendChild(this.boardContainer);
	this.verboseCanvas.appendChild(this.verboseText);
	this.confirmationContainer.appendChild(confirmation);
	confirmation.appendChild(confirmationText);
	confirmation.appendChild(buttonYes);
	confirmation.appendChild(buttonNo);
		
	this.domElement.appendChild(this.pointsBoard);
	this.pointsBoard.appendChild(this.pointsBoardTitle);
	this.pointsBoard.appendChild(hr);
	this.pointsBoard.appendChild(pointsBoardPoints);
	this.pointsBoard.style.display = "none"
	
}

NimGame.prototype.initializeBoard = function() {
	var stackWidth = this.table_width/this.columnNumber-5;
	var stackHeight = this.ballSize*this.maxBalls;
	var counter = 1;
	for(var i = 0; i<this.columnNumber; i++){
		var column = new Stack(stackHeight,stackWidth,this,i);
		for(var j = 0; j<counter ; j++){
			var ball = new Ball(this.ballSize);
			column.pushToStack(ball);
		}
		column.appendStack(this.canvas);
		this.columns[i]=column; //store dem stacks on the array of this NimGame object
		counter+=1;
	}
}

NimGame.prototype.drawGame = function() {
	this.initializeDOM();
	this.initializeBoard();
}

NimGame.prototype.initializeColumns = function() {
	var incrementer = 1;
	for (var i = 0; i < this.columns.length; i++) {
		this.columns[i] = incrementer;
		this.limits[i]=this.max_balls-incrementer-1;
		incrementer+=1;
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

