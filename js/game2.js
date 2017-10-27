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
 * @param {Number} columns - The Number of columns in the game
 * @param {String} difficultyName - The difficulty name
 * @param {String} mode - Playing vsAi or vsPlayer
 * @param {Bool} meFirst - If the player in the current session plays first
 */
function NimGame(columns, difficultyName, mode, meFirst) {
	this.columns = columns;
	this.difficultyName = difficultyName;
	this.difficulty = this.difficulties[difficultyName];
	this.mode = mode;
	this.meFirst = meFirst;
	this.columns = Array(columns).fill(0)
	this.events = {
		gameFinish: [],
		switchTurn: []
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