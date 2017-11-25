var leaderboard = [
	{name: "Fayaru", 			np: 1337},
	{name: "Arukiap", 			np: 1336},
	{name: "boilknote", 		np: 213},
	{name: "yat0++",			np: 37},
	{name: "El_Rocha", 			np: 20},
	{name: "Eirne", 			np: 10}
]
var supportStorage = ((typeof window.localStorage) !== 'undefined')

var isOfflineActive
/**
 * Creates a leaderboard on the given div(tbody)
 * @param {HTMLTableSectionElement} div 
 * @param {*} leadeboard
 * @param {Boolean} online
 */
function buildLeaderboard(div, leadeboard, online)
{
	while(div.firstChild)
		div.removeChild(div.firstChild)
		
	for(var i = 0; i < leaderboard.length; ++i) {
		var elem = document.createElement('tr')
		var user = document.createElement('th')
		var np = document.createElement('th')
		user.className = 'user'
		user.textContent = leaderboard[i].name
		np.className = 'victories'
		np.textContent = leaderboard[i].np
		elem.appendChild(user)
		elem.appendChild(np)
		div.appendChild(elem)
	}
		
}

/**
 * 
 * @param {String} username 
 * @param {Number} points 
 */
function OnGameFinished(username, points) {
	var foundUser = false;
	for(var i = 0; i < leaderboard.length; i++) {
		console.log(leaderboard[i])
		if(leaderboard[i].name === username) {
			leaderboard[i].np = parseFloat(leaderboard[i].np) +  points
			foundUser = true;
			break;
		}
	}
	if(!foundUser) {
		leaderboard.push({name: username, np: points})
	}
	leaderboard.sort((a,b) => {
		return b.np-a.np
	})
	if(supportStorage)
		window.localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
}

/**
 * Handles the load of the leaderboard page
 */
function OnLeaderBoardPageLoad() {
	buildLeaderboard(document.getElementById('big-leaderboard'))
	
}


if(supportStorage) {
	var temp = window.localStorage.getItem('leaderboard')
	if(temp === null){
		window.localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
	} else {
		leaderboard = JSON.parse(temp)
	}
}

