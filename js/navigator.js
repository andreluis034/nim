"use strict";
//url -> div
var root_pages;
const selectsToReset = ['adversary', 'playOrder', 'gamedifficulty'];
var loginInfo = {
	signedIn: false,
	username: null
}
var playing = false
var currentPage = "#"
function homepageOnLoad() {
	if(!loginInfo.signedIn) {
		document.getElementById('configuration').style.display = 'none'
		document.getElementById('login-form').style.display = 'block'
	}
	else {
		document.getElementById('configuration').style.display = 'block'
		document.getElementById('login-form').style.display = 'none'
		document.getElementById('username-display').innerHTML = loginInfo.username
	}
}

function onMyTurnToPlay() {
	if(currentPage !== "#/game") {
		document.getElementById('your-turn').style.display='block'		
	}
}

function bigHeaderHandler(show){
	if(show && playingGame && currentPage !== "#/game"){
		document.getElementById('returnToGame').style.display='block'
		if(myTurn)
			document.getElementById('your-turn').style.display='block'
	}
	else {
		document.getElementById('returnToGame').style.display='none'		
		document.getElementById('your-turn').style.display='none'
	}
}

const pages = {
	"#/leaderboard": {
		divID: "leaderboard",
		div: null,
		onload: function() {
			resetSelects()
			buildLeaderboard(document.getElementById('big-leaderboard'))
			bigHeaderHandler(true)
		}
	},
	"#/about": {
		divID: "about",
		div: null,
		onload: function() {
			bigHeaderHandler(true)
		}
	},
	"#/game": {
		divID: "game-content",
		div: null,
		onload: function() {
			if(!playingGame) {
				var form = document.getElementById('startGame')
				var children = form.children
				var columns = parseInt(children[0].value)
				var gameType = (children[1].value) //not used for now
				var playingFirst = (children[2].value)
				var difficulty = (children[3].value)
				OnBoardPageLoad(columns, gameType, playingFirst, difficulty, loginInfo.username)
			}
			bigHeaderHandler(false)
		}
	},
	"#": {
		divID: "homepage",
		div: null,
		onload: homepageOnLoad
	},
	"#/": {
		divID: "homepage",
		div: null,
		onload: homepageOnLoad
	},
	
}

/**
 * Handles the click on links
 * @param {MouseEvent} event
 */
function onAnchorClick(event){
	if(event.target.hash === '#/logout') {
		navigate('#')
		return;
	}
	navigate(event.target.hash)
}

/**
 * 
 * @param {String} url
 * @returns {HTMLElement} 
 */
function getDivForUrl(url) {
	var div = pages[url].div;
	if(div === null)
		div = pages[url].div = document.getElementById(pages[url].divID);
	return div
}
/**
 * Navigates to the given URL
 * @param {String} url 
 * @param {Bool} triggerEvent
 */
function navigate(url) {
	if(url === "")
		url = "#"
	url = url || '#'
	for(var elem in pages) {
		getDivForUrl(elem).style.display = 'none'
	}
	for(var i = root_pages.children.length - 1; i >= 0; --i) {
		root_pages.children[i].style.display ='none'
	}	
	var div = getDivForUrl(url)
	if(pages[url].divID !== "homepage")
		document.getElementById('big-header').style.display = 'block'
	
	currentPage = url
	window.location.hash = url;
	if(pages[url].onload !== null)
		pages[url].onload()
	div.style.display = "block";
}

function resetSelects() {
	for(var i = selectsToReset.length - 1; i >= 0; --i) {
		document.getElementById(selectsToReset[i]).selectedIndex = 0
	}
}

function  disabledColor() {
	var elements = document.getElementsByTagName('input')
	for(var i = elements.length - 1; i >= 0; --i){
		if(elements[i].className !== 'text')
			continue;
		elements[i].addEventListener('keyup', (event) => {
			if(event.target.value.length == 0)
				event.target.style.color = '#919191'
			else
				event.target.style.color = '#353535'
		})
	}
}

function selectChange() {
	var elements = document.getElementsByTagName('select')
	for(var i = elements.length - 1; i >= 0; --i) {
		if(elements[i].className !== 'text')
			continue;
		elements[i].addEventListener('change', (event) => {
			event.target.style.borderColor = '#7A7A7A'
		})
	}
}

function playGame(event) {
	event.preventDefault()
	var elements = document.getElementById('startGame').children
	var allGood = true
	for(var i = elements.length - 1; i >= 0; --i) {
		if(elements[i].tagName === 'DIV')
			continue;
		console.log(elements[i].tagName)
		console.log(elements[i].selectedIndex)
		console.log(elements[i].value)
		if((elements[i].tagName === "SELECT" && elements[i].selectedIndex === 0) 
			|| (elements[i].tagName === "INPUT" && elements[i].value === "")){
				elements[i].style.borderColor = '#B00'
				allGood = false			
		}

	}
	if(!allGood)
		return 
	navigate('#/game')
}

function login(event) {
	loginInfo.username = document.getElementById('username_box').value
	loginInfo.signedIn = true
	navigate('#')
}

function logout(event) {
	loginInfo.signedIn = false
	navigate('#')
}

function register(event) {
	//TODO
}

var FormEvents = [
	{
		elemId: 'startGame',
		eventName: 'submit',
		callback: playGame
	},
	{
		elemId: 'loginForm',
		eventName: 'submit',
		callback: (event) => {event.preventDefault()}
	},
	{
		elemId: 'loginButton',
		eventName: 'click',
		callback:login
	},
	{
		elemId: 'registerButton',
		eventName: 'click',
		callback: register
	},
	{
		elemId: 'logoutbutton',
		eventName: 'click',
		callback: logout
	},
	{
		elemId: 'returnToGame',
		eventName: 'click',
		callback: (event) => { navigate('#/game') }
	}
]
var initialPageNotAllowed = ['#/game', '#/logout']
window.onload = function() {
	disabledColor()
	selectChange()
	var anchors = document.getElementsByTagName('a');
	root_pages = document.getElementById('pages')

	for(var i = FormEvents.length - 1; i >= 0; --i) {
		var elem = document.getElementById(FormEvents[i].elemId)
		elem.addEventListener(FormEvents[i].eventName, FormEvents[i].callback)
	}
	for(var i = anchors.length - 1; i >= 0; --i) {
		anchors[i].addEventListener('click', onAnchorClick)
	}
	if(initialPageNotAllowed.indexOf(window.location.hash) > -1)
		window.location.hash = ''
	
	if(window.location.hash === '') {
		navigate('#')
		return;
	}
	navigate(window.location.hash)
}