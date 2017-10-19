"use strict";
//url -> div
var root_pages;
const selectsToReset = ['adversary', 'playOrder', 'gamedifficulty'];
var loginInfo = {
	signedIn: false,
	username: null
}
function homepageOnLoad() {
	if(!loginInfo.signedIn) {
		document.getElementById('configuration').style.display = 'none'
		document.getElementById('login-form').style.display = 'block'
	}
	else {
		document.getElementById('configuration').style.display = 'block'
		document.getElementById('login-form').style.display = 'none'
	}
}

const pages = {
	"#/leaderboard": {
		type: "page",
		divID: "leaderboard",
		div: null,
		onload: function() {
			resetSelects()
			buildLeaderboard(document.getElementById('big-leaderboard'))
		}
	},
	"#/about": {
		type: "page",
		divID: "about",
		div: null,
		onload: null
	},
	"#": {
		type: "page",
		divID: "homepage",
		div: null,
		onload: homepageOnLoad
	},
	"#/": {
		type: "page",
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
	navigate(event.target.hash)
}

/**
 * 
 * @param {String} url
 * @returns {HTMLElement} 
 */
function getDivForUrl(url) {
	console.log(`'${url}'`)
	var div = pages[url].div;
	if(div === null)
		div = pages[url].div = document.getElementById(pages[url].divID);
	return div
}
/**
 * Navigates to the given URL
 * @param {String} url 
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
		console.log('lala')
		console.log(elements[i])
		elements[i].addEventListener('keyup', (event) => {
			if(event.target.value.length == 0)
				event.target.style.color = '#919191'
			else
				event.target.style.color = '#353535'
			console.log(event.target.value.length)
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
	var elements = document.getElementsByTagName('select')
	var allGood = true
	for(var i = elements.length - 1; i >= 0; --i) {
		if(elements[i].className !== 'text')
			continue;
		if(elements[i].selectedIndex === 0) {
			elements[i].style.borderColor = '#B00'
			allGood = false			
		}
	}
	if(!allGood)
		return false

	return false
}

function login(event) {

	loginInfo.signedIn = true
	navigate('#')
	return false
}

window.onload = function() {
	disabledColor()
	selectChange()
	var anchors = document.getElementsByTagName('a');
	root_pages = document.getElementById('pages')

	for(var i = anchors.length - 1; i >= 0; --i) {
		anchors[i].addEventListener('click', onAnchorClick)
	}
	if(window.location.hash === '') {
		navigate('#')
		return;
	}
	navigate(window.location.hash)
}