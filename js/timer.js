"use strict";

var timerContext;

function Timer(minutes,seconds,domEllement,size){
	timerContext = this;
	this.currentTime = seconds;
	this.domEllement = domEllement;
	this.size = size;
	this.canvas = document.createElement('canvas');
	this.canvas.id = "canvasID";
	this.canvas.width = size;
	this.canvas.height = size;
	this.domEllement.appendChild(this.canvas);

	this.context=this.canvas.getContext("2d");
	this.blueColor = "#3889EA";
	this.greyColor = "#e9e9e9";
	this.lineWidth = 5;
	this.center = this.size/2;
	this.radius = this.size/2 - this.lineWidth;
	this.context.lineWidth=this.lineWidth;
	this.context.strokeStyle=this.blueColor;
	this.context.textBaseline = 'middle';
	this.context.textAlign="center"; 
	this.context.font="60px Arial";
	this.context.fillStyle = this.blueColor;

	this.totalTime = (minutes*60+seconds)*1000;
	this.endTime = new Date().getTime() + this.totalTime; // convert the second to ms
	this.startTime = new Date().getTime();
	this.currentTime = this.startTime;

	this.minutes = minutes;
	this.seconds = seconds;

	var distance = this.endTime-this.currentTime;
	var roundedDistance = Math.round(distance / 100) * 100;
	var minutes = Math.floor((roundedDistance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((roundedDistance % (1000 * 60)) / 1000);
	this.drawTimer();
}

Timer.prototype.drawTimer = function(){

	var context = timerContext.context;

	context.clearRect(0, 0, timerContext.canvas.width, timerContext.canvas.height);
  	context.beginPath();	

  	if(timerContext.seconds<10){
  		context.fillText(`${timerContext.minutes}:0${timerContext.seconds}`,timerContext.center,timerContext.center);
  	}
  	else{
  		context.fillText(`${timerContext.minutes}:${timerContext.seconds}`,timerContext.center,timerContext.center);
  	}

	

	timerContext.currentTime = new Date().getTime();
	var distance = timerContext.endTime - timerContext.currentTime;
	var percentage = distance*100/timerContext.totalTime;

	var circleInterval = 2*Math.PI;
	var unPercentage = 100 - percentage;

	//console.log(unPercentage);

	var decrease = unPercentage/100*circleInterval;
	var increase = percentage/100*circleInterval;

	context.strokeStyle = timerContext.blueColor;

	context.arc(timerContext.center,timerContext.center,timerContext.radius,-0.5*Math.PI,(1.5*Math.PI-decrease));

	context.stroke();

	context.beginPath();
	context.closePath();

	context.strokeStyle = timerContext.greyColor;

	context.arc(timerContext.center,timerContext.center,timerContext.radius,1.5*Math.PI+increase,1.5*Math.PI);

	context.stroke();

	window.requestAnimationFrame(timerContext.drawTimer);
}


this.runTimer = setInterval(function(){
	var currentTime = new Date().getTime();
	var distance = timerContext.endTime-currentTime;
	var roundedDistance = Math.round(distance / 100) * 100;
	timerContext.minutes = Math.floor((roundedDistance % (1000 * 60 * 60)) / (1000 * 60));
	timerContext.seconds = Math.floor((roundedDistance % (1000 * 60)) / 1000);
},1000);