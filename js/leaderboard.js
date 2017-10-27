var leaderboard = [
	{name: "Fayaru", 			np: 1337},
	{name: "Arukiap", 			np: 1336},
	{name: "boilknote", 		np: 213},
	{name: "yat0++",			np: 37},
	{name: "El_Rocha", 			np: 20},
	{name: "Eirne", 			np: 10}
]

/**
 * Creates a leaderboard on the given div(tbody)
 * @param {HTMLTableSectionElement} div 
 */
function buildLeaderboard(div)
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

function OnGameFinished(username, points) {
	var foundUser = false;
	console.log(points)
	console.log(username)
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
	window.localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
}
var temp = window.localStorage.getItem('leaderboard')
if(temp === null){
	window.localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
} else {
	leaderboard = JSON.parse(temp)
}

console.log(leaderboard)