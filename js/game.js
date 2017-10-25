var how_many_columns = 5;
var difficulty = 100; // 0 to 100, from easiest to hardest.
var myTurn = true;
var max_balls;
var jogada = 0;
var binary_size = 8;
var ball_size;
var table_width;
var verbose = false;
var human_plays; // number of plays the human did.
var ai_plays;

var matrix = new Array(how_many_columns);
var columns = new Array(how_many_columns);
var limits = new Array(how_many_columns);

OnBoardPageLoad = function() {
	prepare_game();
	create_canvas();
}

function isEven(n) {
   return n % 2 == 0;
}

function initialize_playcounters(){
	human_plays = 0;
	ai_plays = 0;
}

function initialize_matrix(){
	for (var i = 0; i < how_many_columns; i++) {
        matrix[i] = new Array(binary_size);
	}
}

function get_nimSum(){
	var nimSum = columns[0];
	for (var i = 1; i < how_many_columns; i++) {
        nimSum = nimSum ^ columns[i];
	}
	return nimSum;
}

function game_finished(code){

	document.body.style.cursor = "default";

	document.getElementById("game").style.display = "none";
	var points_board = document.getElementById("points_board");
	points_board.style.display = "block";

	var h1 = document.createElement('h1');
	points_board.append(h1);
	var hr = document.createElement('hr');
	points_board.append(hr);
	var h2 = document.createElement('h2');
	h2.innerHTML = "Points";
	points_board.append(h2);

	var h3_1 = document.createElement('h3');
	var h3_2 = document.createElement('h3');
	var h3_3 = document.createElement('h3');
	var h3_4 = document.createElement('h3');
	var h3_5 = document.createElement('h1');

	/*
	<h1>you won!</h1>
				<hr>
				<h2>Points</h2>
				<h3>Difficulty multiplier = </h3>
				<h3>Plays multiplier = </h3>
				<h3>Total points = </h3>
	*/			

	//container.append(button_giveup);

	//I STAYED HERE....

	var difficulty_mult = (difficulty/10);

	var plays_mult = 1 + how_many_columns/(human_plays);

	var columns_mult = 1+how_many_columns/10;

	var total_points;

	switch(code) {
    case "giveup":
        h1.innerHTML = "you gave up. the ai won the game.";
        total_points = 0;
        difficulty_mult = "n/a";
        columns_mult = "n/a";
        plays_mult = "n/a";
        h3_5.innerHTML = "Total points = "+"<b>"+total_points+"</b>";
        document.getElementById("points_board").style.height="450px"; // adjust for a smaller windows size, as the lost/win multiplier isnt applicable here
        break;
    case "ai":
        h1.innerHTML = "the ai won the game.";
        total_points = difficulty_mult * columns_mult * plays_mult;
        total_points = total_points*0.1;
        total_points = total_points.toFixed(2);
        h3_4.innerHTML = "Defeated multiplier = <b>0.1</b>";
        h3_5.innerHTML = "Total points = "+"<b>"+total_points+"</b>";
        break;
    case "human":
        h1.innerHTML = "congratulations, you won the game!";
        h1.style.color = "#3889EA";
        h3_4.innerHTML = "Victorious multiplier = <b>1</b>";
        total_points = difficulty_mult * columns_mult * plays_mult;
        total_points = total_points.toFixed(2);
        h3_5.innerHTML = "Total points = "+"<b>"+total_points+"</b>";
        break;
	}

	h3_1.innerHTML = "Difficulty multiplier = <b>"+difficulty_mult+"</b>";

	h3_2.innerHTML = "Plays multiplier = <b>"+plays_mult+"</b>";

	h3_3.innerHTML = "Columns multiplier = <b>"+columns_mult+"</b>";

	

	points_board.append(h3_1);
	points_board.append(h3_2);
	points_board.append(h3_3);
	points_board.append(h3_4);
	points_board.append(h3_5);


	//create buttons now

	var play_again_button = document.createElement('div');
	play_again_button.className = "button";
	play_again_button.id = "play_again_button";
	play_again_button.innerHTML = "Play again";
	points_board.append(play_again_button);

	var change_settings_button = document.createElement('div');
	change_settings_button.className = "button";
	change_settings_button.id = "change_settings_button"; //to have same settings as above button
	change_settings_button.innerHTML = "Change settings";
	points_board.append(change_settings_button);
}

function print_state(){

	
	console.log("Printing decimals...");
	for (var i = 0; i < how_many_columns; i++) {
        console.log(columns[i]);
	}

	console.log("nimSum: "+get_nimSum());

	

	console.log("Printing binary...");
	
	

	for (var i = 0; i < how_many_columns; i++) {
		var num = columns[i];
		var num_binary = ("00000000"+num.toString(2)).slice(-8);
			for (var j = 0; j < binary_size; j++) {
				matrix[i][j] = num_binary.charAt(j);
			}
		console.log(matrix[i]);
	}

	console.log("--------------------");

	 //Time to get the nimSum:



	 var nimSum = new Array(binary_size);

	 for (var j = 0; j < binary_size; j++) {
	 	var how_many_ones = 0;
	 		for (var i = 0; i < how_many_columns; i++) {
	 			if(matrix[i][j] == "1"){
	 					how_many_ones++;
	 			}
	 		}

	 		if(isEven(how_many_ones)){
	 			nimSum[j]=0;
	 		}
	 		else{
	 			nimSum[j]=1;
	 		}
	 	//console.log("How many ones: "+how_many_ones);

	 }

	 console.log(nimSum);

	
}


function prepare_game(){

	write_turn();
	initialize_matrix();
	initialize_playcounters();

	//num = 3;
	//console.log(("00000000"+num.toString(2)).slice(-8));

    var counter = 3;
    for (var i = 0; i < how_many_columns; i++) {
        columns[i]=counter;
		//console.log("Setting collumn number " + i + " to " + counter);
		counter+=2;
	}
	max_balls = counter-2; 

	//console.log(max_balls);

	counter = 3;

	for (var i = 0; i < how_many_columns; i++) {
        limits[i]=max_balls-counter-1;
        //console.log(limits[i]);
		counter+=2;
	}

	ball_size = (700/max_balls); //in pxs

	table_width = (how_many_columns*(ball_size+5)); //in pxs; 5 to account for margin in balls

	//console.log("NAKAIDE IMA WA: "+ table_width);

	//console.log("Ball size: " + ball_size);

}

function OnMouseIn(event){
	var elem = event.target;
	var id = elem.id;
	var j = parseInt(id.split("-")[0]);
	var i = parseInt(id.split("-")[1]);
	//console.log("ENTER: " + i + "-" + j);
	if(j>limits[i]){
		document.body.style.cursor = "pointer";
		//console.log("PARA PINTAR: " + id);
		hover_paint(j,i);
	}
}

function OnMouseOut(event){

	var elem = event.target;
	var id = elem.id;
	var j = parseInt(id.split("-")[0]);
	var i = parseInt(id.split("-")[1]);
	if(j>limits[i]){
		document.body.style.cursor = "default";
		//console.log(id);
		unhover_paint(j,i);
	}
}

/*
function hoverGiveUp(event){

}

function unHoverGiveUp(event){

}*/

function hoverButton(event){

	var elem = event.target;
	if(elem.id == "verbose_button"){
		elem.style.backgroundColor = "#3889EA";	
	}
	else{
		elem.style.backgroundColor = "#e4431f";
	}
	document.body.style.cursor = "pointer";
}

function unHoverButton(event){
	var elem = event.target;

	if(verbose==false && elem.id == "verbose_button"){
		elem.style.backgroundColor = "#b4b4b4";
	}
	if(elem.id == "giveup_button"){
		elem.style.backgroundColor = "#b4b4b4";
	}
	document.body.style.cursor = "default";
}

function giveUpButton(event){
	if(confirm("Do you really want to give up?")){
		//console.log("GIVE UP");
		game_finished("giveup");
	}
}

function verboseButton(event){

	event.target.style.backgroundColor = "#3889EA";

	if(verbose==true){
		//console.log("TRUE");
		document.getElementById("verbose").style.display = "none";
		verbose = false;
	}
	else{
		//console.log("FALSE");
		document.getElementById("verbose").style.display = "block";
		verbose = true;
	}
}

function paint_all_balls(color){
	for (var i = 0; i < how_many_columns; i++) {
		for (var j = 0; j < max_balls; j++) {
			if(j>limits[i]){
				var string = j+"-"+i;
				//console.log(string);
				document.getElementById(string).style.backgroundColor = color;
			}
		}
	}
}

function create_canvas(){
	var counter = 3;
	var table = document.getElementById("table");
	for (var i = 0; i < max_balls; i++) {
			var row = table.insertRow(i);
			for (var j = 0; j < how_many_columns; j++) {
				var cell = row.insertCell(j);
				var ball = document.createElement('div');
				ball.className = "ball";
				ball.id = i + "-" + j;
				cell.appendChild(ball);
				cell.addEventListener("mouseover",OnMouseIn);
				cell.addEventListener("mouseout",OnMouseOut);
				cell.addEventListener("click",OnClickMouse);
				if(i<=limits[j]){
					cell.style.visibility = "hidden";
				}
			}
		}

	paint_all_balls("#3889EA");

	//set decent height

	for (var i = 0; i < max_balls; i++) {
			for (var j = 0; j < how_many_columns; j++) {
						var string = i + "-" + j;
						var size = ball_size+"px";
						document.getElementById(string).style.height=size;
						document.getElementById(string).style.width=size;
			}
	}

	//set canvas to correct width:

	//console.log("TABLE WIDTH: "+table_width);
	var table_width_px = table_width+"px";
	var tmp = table_width-10;
	var verbose_chat_width_px = tmp+"px";
	document.getElementById("canvas").style.width=table_width_px;
	document.getElementById("table").style.width=table_width_px;

	//TIME TO WORK WITH THE CHAT NOW:
	var container = document.getElementById("game");

	var canvas = document.createElement('div');
	var verbose_text = document.createElement('div');
	canvas.className = "canvas";
	canvas.id = "verbose";
	verbose_text.className = "verbose_text";
	verbose_text.id = "verbose_chat";
	canvas.append(verbose_text);
	canvas.style.display = "none";
	container.append(canvas);
	

	//place verbose mode button:

	
	var button = document.createElement('div');
	button.className = "button";
	button.id = "verbose_button";
	button.innerHTML = "Verbose Mode";
	button.addEventListener("mouseover",hoverButton);
	button.addEventListener("mouseout",unHoverButton);
	button.addEventListener("click",verboseButton);
	container.append(button);

	/*<div class="button" id="verbose_button">
									Verbose Mode
								</div>
	*/

	

	


	/*<div class="canvas" id="verbose">
									<div class="verbose_text" id="verbose_chat">

									</div>
								</div>
	*/

	//Now its time for the give up button:

	var button_giveup = document.createElement('div');
	button_giveup.className = "button";
	button_giveup.id = "giveup_button";
	button_giveup.innerHTML = "Give up";
	button_giveup.addEventListener("mouseover",hoverButton);
	button_giveup.addEventListener("mouseout",unHoverButton);
	button_giveup.addEventListener("click",giveUpButton);
	container.append(button_giveup);


	//

	document.getElementById("giveup_button").style.width=table_width_px;
	document.getElementById("verbose").style.width=table_width_px;
	document.getElementById("verbose_button").style.width=table_width_px;
	document.getElementById("verbose_chat").style.width=verbose_chat_width_px;



	if(myTurn==true){
		return;
	}

	else{
		setTimeout(play_AI,3000);
	}

}


function write_turn(){
	if(myTurn){
		var turn = document.getElementById("turn");
		while (turn.firstChild) {
		    turn.removeChild(turn.firstChild);
		}
		var text = document.createTextNode("your turn");
		turn.style.color = "#3889EA";
		turn.appendChild(text);
	}
	else{
		var turn = document.getElementById("turn");
		while (turn.firstChild) {
		    turn.removeChild(turn.firstChild);
		}
		var text = document.createTextNode("ai's turn");
		turn.style.color = "#b4b4b4";
		turn.appendChild(text);
	}
}

function hover_paint(j,i){
	for (var vertical = j; vertical>limits[i] ;vertical--) {
		var string = vertical + "-" + i;
		//console.log("PINTAR");
		document.getElementById(string).style.backgroundColor = "#7bb3f7";
	}
}

function unhover_paint(j,i){
	for (var vertical = j; vertical>limits[i] ;vertical--) {
		var string = vertical + "-" + i;
		//console.log("PINTAR");
		document.getElementById(string).style.backgroundColor = "#3889EA";
	}
}

function print_limits(){
	console.log("<<LIMITS>>");
	for (var i = 0; i<how_many_columns;i++) {
		//console.log("limits[" + i + "]: " + limits[i]);
	}	
	//console.log("<<LIMITS>>");
}

function has_ended(){
	for (var i = 0; i< how_many_columns;i++) {
		if(limits[i]!=max_balls-1){
			return false;
		}
	}	

	return true;
}

function appendVerbose(message,color){
	var chat = document.getElementById("verbose_chat");
	var t = document.createTextNode(message);
	var text = document.createElement("P");			
	text.style.color = color;			
	text.appendChild(t);	
	chat.appendChild(text);			
}

function check_finished(){
		if (has_ended()) {
			if (myTurn!=true) {
							
							if(verbose==true){
								appendVerbose("THE AI WON THE GAME.","#b4b4b4");							
							}

							game_finished("ai");
			}
			else{							
							if(verbose==true){
								appendVerbose("YOU WON THE GAME!","#3889EA");
							}

							game_finished("human");
			}

			throw new Error("Acabou o jogo");
		}
}

function eliminate_balls(j,i){
	//console.log("eliminating...");
	for (var vertical = j; vertical>limits[i] ;vertical--) {
		var string = vertical + "-" + i;
		//console.log("PINTAR");
		document.getElementById(string).style.visibility = "hidden";
		columns[i]-=1;
	}
	limits[i]=j; //super duper important!
}

function random_play(){
	var random = Math.floor((Math.random() * (100)));
	//console.log("RANDOM NUMBER: "+random);
	//console.log(random>=difficulty);
	return (random>=difficulty);
}

function play_AI(){

	//print_limits();

	var play_column;
	var play_ball;

	if(random_play()){

		//console.log("Playing randomly...");

		play_column = Math.floor((Math.random() * how_many_columns));

		while(limits[play_column]==max_balls-1){
			play_column = Math.floor((Math.random() * how_many_columns));
		}

		//print_limits();

		//console.log("Playing on column " + play_column);

		var wtf = Number(limits[play_column]);

		var wtf_ = wtf+1;

		//console.log("Generating random number between " + wtf_ + " and " + (max_balls-1));

		play_ball = Math.floor((Math.random() * (max_balls-wtf_)))+wtf_;

		//console.log("Playing in: " + play_ball + "-" + play_column);
	}
	else{

		//console.log("Playing by algorithm...");
		var NIM_SUM = get_nimSum();

		if(NIM_SUM==0){

			//here the AI plays randomly
			play_column = Math.floor((Math.random() * how_many_columns));

			while(limits[play_column]==max_balls-1){
				play_column = Math.floor((Math.random() * how_many_columns));
			}

			//print_limits();

			//console.log("Playing on column " + play_column);

			var wtf = Number(limits[play_column]);

			var wtf_ = wtf+1;

			//console.log("Generating random number between " + wtf_ + " and " + (max_balls-1));

			play_ball = Math.floor((Math.random() * (max_balls-wtf_)))+wtf_;

			//console.log("Playing in: " + play_ball + "-" + play_column);
		}

		else{
				//play to get nim sum to 0
				for (var i = 0; i < how_many_columns; i++) {
			        if((columns[i] ^ NIM_SUM)<columns[i]){     	
			        	//var index_to_remove = i;
			        	var balls_to_remove = columns[i]-(columns[i]^NIM_SUM);
			        	play_column = i;
			        	play_ball = limits[i]+balls_to_remove;
			        	break;
			        }
				}
		}

	}

	//console.log("play_column: "+play_column);
	//console.log("play_ball: "+play_ball);
	//console.log("limits: "+limits[play_column]); 

	var temporary = play_ball-limits[play_column];  //get how many balls the AI removed
	
	eliminate_balls(play_ball,play_column);

	ai_plays++;

	console.log(ai_plays);

	if(temporary==1){
		appendVerbose("ai played in column " + play_column + ", removed " + temporary + " ball","#b4b4b4");
	}
	else{
		appendVerbose("ai played in column " + play_column + ", removed " + temporary + " balls","#b4b4b4");
	}
	check_finished();
	myTurn=!myTurn;
	write_turn();

	//print_state();
}

function OnClickMouse(event){
	var elem = event.target;
	var id = elem.id;
	var j = parseInt(id.split("-")[0]);
	var i = parseInt(id.split("-")[1]);
	if(j>limits[i]){
		if(myTurn!=true){
			alert("Please wait for the AI to play.");
			return;
		}

		

		var temporary = j-limits[i]; //get how many balls the player removed

		eliminate_balls(j,i);

		human_plays++;
		console.log(human_plays);

		if(temporary==1){
			appendVerbose("you played in column " + i + ", removed " + temporary + " ball","#3889EA");
		}
		else{
			appendVerbose("you played in column " + i + ", removed " + temporary + " balls","#3889EA");
		}

		
		//console.log(myTurn);
		//console.log("Current state: " + columns[0] + " " + columns[1] + " " + columns[2]);
		check_finished();
		myTurn=!myTurn;
		write_turn();
		//print_state();
		setTimeout(play_AI, 3000);
	}	
			
}