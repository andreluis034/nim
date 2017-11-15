"use strict";

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
	this.columns = columnCount;
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

NimGame.prototype.initializeDOM = function() {

	var turn = document.createElement('h1');
	turn.id = "turn";
	var alert = document.createElement('h2'); 
	alert.id = "alert_message";
	var canvas = document.createElement('div');
	canvas.id = "canvas";
	canvas.className = "canvas";
	var table = document.createElement('table');
	table.id = "table";
	canvas.appendChild(table);

	this.domElement.appendChild(turn);
	this.domElement.appendChild(alert);
	this.domElement.appendChild(canvas);

}

NimGame.prototype.drawGame = function() {
	this.writeTurn();
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
	var nimSum = this.columns[0];
	for (var i = 1; i < this.columns.length; i++) {
		nimSum = nimSum ^ columns[i];
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
		if(this.columns[i] !== 0)
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
		if(this.columns[i] > 0)
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
		if(this.columns[i] ^ nimSum < this.columns[i]) {
			var ballsToRemove = this.columns[i] - (this.columns[i] ^ nimSum);
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

