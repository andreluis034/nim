"use strict";
//url -> div
var root_pages;
const selectsToReset = ['adversary', 'playOrder', 'gamedifficulty'];

const pages = {
	"#/leaderboard": {
		type: "page",
		divID: "leaderboard",
		div: null,
	},
	"#/about": {
		type: "page",
		divID: "about",
		div: null,
	},
	"#": {
		type: "page",
		divID: "homepage",
		div: null,
	},
	"#/": {
		type: "page",
		divID: "homepage",
		div: null,
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

	for(var elem in pages) {
		getDivForUrl(elem).style.display = 'none'
	}
	for(var i = root_pages.children.length - 1; i >= 0; --i) {
		root_pages.children[i].style.display ='none'
	}	
	var div = getDivForUrl(url)
	if(pages[url].divID !== "homepage")
		document.getElementById('big-header').style.display = 'block'

	div.style.display = "block";
}

function resetSelects() {
	for(var i = selectsToReset.length - 1; i >= 0; --i) {
		document.getElementById(selectsToReset[i]).selectedIndex = 0
	}
}

function placeholderColor() {

}

window.onload = function() {
	resetSelects()
	var anchors = document.getElementsByTagName('a');
	root_pages = document.getElementById('pages')

	for(var i = anchors.length - 1; i >= 0; --i) {
		anchors[i].addEventListener('click', onAnchorClick)
		var s = document.createElement('div')
		s.className = "ball"
		s.id = ""
		s.appen
	}
	var matches = document.URL.match(/#(\/(.+)?)?$/);
	if(matches === null)
		return
	var loadedPage = matches[0]
	navigate(loadedPage)
	console.log(loadedPage)
}