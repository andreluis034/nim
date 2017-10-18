"use strict";
//url -> div
const pages = {
	"#/leaderboard": {
		type: "page",
		divID: "leaderboard",
		div: null
	},
	"#/about": {
		type: "page",
		divID: "about",
		div: null
	},
	"#": {
		type: "page",
		divID: "homepage",
		div: null
	},
	"#/": {
		type: "page",
		divID: "homepage",
		div: null
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
	for(var prop in pages) {
		var elem = getDivForUrl(prop)
		elem.style.display = "none"
		console.log(prop)
	}
	getDivForUrl(url).style.display = "block";
	
}

window.onload = function() {
	var anchors = document.getElementsByTagName('a');
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