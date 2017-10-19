var leaderboard = [
	{name: "Fayaru", 			np: 1337},
	{name: "Arukiap", 			np: 1336},
	{name: "boilknote", 		np: 213},
	{name: "yat0++",			np: 'ez'},
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