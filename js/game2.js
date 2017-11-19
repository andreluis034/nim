"use strict";

var playingGame = false;
const someRandomNumberWeDontKnow = 700;

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

function NimPlay(column, removeCount) {
	this.column = column
	this.removeCount = removeCount
}

/**
 * 
 * @param {Number} columnCount - The Number of columns in the game
 * @param {String} difficultyName - The difficulty name
 * @param {String} mode - Playing vsAi or vsPlayer
 * @param {Bool} meFirst - If the player in the current session plays first
 */

function NimGame(columnCount, difficultyName, mode, meFirst, domElement) {
	playingGame = true;
	this.columnNumber = columnCount;
	this.difficultyName = difficultyName;
	this.difficulty = this.difficulties[difficultyName];
	this.mode = mode;
	this.myTurn = meFirst;
	this.columns = Array(columnCount).fill(0);
	this.limits = Array(columnCount).fill(0);
	this.maxBalls = (columnCount - 1) * 2 + 3;
	this.myPlays = 0;
	this.hisPlays = 0;
	this.initializeColumns();
	this.ballSize = (someRandomNumberWeDontKnow/this.max_balls); //in pxs
	this.table_width = (columnCount*(this.ballSize+5));
	this.events = {
		gameFinish: [],
		switchTurn: []
	}
	this.domElement = domElement;
	this.drawGame();
}

function Ball(size){
	this.element = document.createElement('div');
	this.element.className = "ball";
	this.element.style.height=size;
	this.element.style.width=size;
}	

Ball.prototype.appendBall = function(whereTo){
	whereTo.appendChild(this.element);
}

Ball.prototype.hideBall = function(){
	this.element.style.visibility = "hidden";
}

Ball.prototype.paintBall = function(color){
	this.element.style.backgroundColor = color;
}

function Stack(width,height){

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

	ball.element.innerHTML = length;

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
	var limit = this.balls.length-index;
	for(var i = 0; i<limit; i++){
		var ball = this.balls.pop();
		ball.hideBall();
	}
}

Stack.prototype.removeBalls = function(howMany) {
	this.removeBallsByIndex(this.balls.length-howMany);
}

NimGame.prototype.initializeDOM = function() {

	var turn = document.createElement('h1');
	turn.id = "turn";
	var alert = document.createElement('h2'); 
	alert.id = "alert_message";
	this.canvas = document.createElement('div');
	this.canvas.id = "canvas";
	this.canvas.className = "canvas";

	var width_px = this.table_width+"px";
	this.canvas.style.width = width_px;

	this.domElement.appendChild(turn);
	this.domElement.appendChild(alert);
	this.domElement.appendChild(this.canvas);

}

NimGame.prototype.initializeBoard = function() {
	var stackWidth = this.table_width/this.columnNumber-5;
	var stackHeight = 500; //random number for now
	var counter = 3;
	for(var i = 0; i<this.columnNumber; i++){
		var column = new Stack(stackHeight,stackWidth);
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
 * @returns The nim sum of the current board
 */
NimGame.prototype.nimSum = function() {
	var nimSum = this.columns[0].length;
	for (var i = 1; i < this.columns[i].length; i++) {
		nimSum = nimSum ^ columns[i].length;
	}
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
		if(this.columns[i].length !== 0)
			return false
	}
	return true
}

NimGame.prototype.shouldPlayRandom = function(){
	var random = randomBetween(0, 100)
	return random>=difficulty
}

NimGame.prototype.getRandomValidColumn = function() {
	var valid = [];
	for(var i = this.columns.length - 1; i >= 0; --i) {
		if(this.columns[i].length > 0)
			valid.push(i)
	}
	return valid[randomBetween(0, valid.length - 1)]
}

NimGame.prototype.getAiPlay = function() {
	var nimSum = this.nimSum()
	if(nimSum === 0 || this.shouldPlayRandom()) {
		var column = this.getRandomValidColumn();
		return new NimPlay(column, randomBetween(0, this.columns[column]))
	}
	for(var i = 0; i < this.columns.length; ++i) {
		if(this.columns[i].length ^ nimSum < this.columns[i].length) {
			var ballsToRemove = this.columns[i].length - (this.columns[i].length ^ nimSum);
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

