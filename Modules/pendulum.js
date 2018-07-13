window.onload = function() { pendulum(); }

function pendulum() {

	// positioning variables
	var xpos, ypos;
	var mousex, mousey;
	var clicked;

	// slider variables
	var length_slider = document.getElementById("length_slider");
	var length = document.getElementById("length");
	length.innerHTML = length_slider.value;
	var mass_slider = document.getElementById("mass_slider");
	var mass = document.getElementById("mass");
	mass.innerHTML = mass_slider.value;
	var friction_slider = document.getElementById("friction_slider");
	var friction = document.getElementById("friction");
	friction.innerHTML = friction_slider.value;
	
	// physics variables
	var velocity, acceleration, angle;
	var g = 9.81/100;

	var canvas = document.getElementById("pendulum");
	var ctx = canvas.getContext("2d");
	var paused = false;
	var vectors = false;

	// slider inputs
	length_slider.oninput = function() {
		length.innerHTML = this.value;
	}
	mass_slider.oninput = function() {
		mass.innerHTML = this.value;
	}
	friction_slider.oninput = function() {
		friction.innerHTML = this.value;
	}

	// reset simluation
	function reset() {
		clicked = false;
		velocity = 0.0;
		acceleration = 0.0;
		angle = Math.PI/3;
		xpos = canvas.width/2 + length.innerHTML*Math.sin(angle);
		ypos = canvas.height/4 + length.innerHTML*Math.cos(angle);
	}

	function redraw() {
		// draw canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.shadowColor = "#66FF66";

		// handle physics
		if (!clicked) {
			acceleration = -1*g/length.innerHTML * Math.sin(angle);
			velocity += acceleration;
			velocity *= (1 - friction.innerHTML*0.0015);
			angle += velocity;
		}
		// handle mouse drag
		else if (!paused) {
			dx = mousex - canvas.width/2;
			dy = mousey - canvas.height/4;
			angle = Math.atan2(-1*dy, dx) + Math.PI/2;
		}
		xpos = canvas.width/2 + length.innerHTML*Math.sin(angle);
		ypos = canvas.height/4 + length.innerHTML*Math.cos(angle);

		// draw string
		ctx.shadowBlur = 0;
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "red";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(xpos, ypos);
		ctx.lineTo(canvas.width/2, canvas.height/4);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/4, 3, 0, 2*Math.PI);
		ctx.fill();
		
		// draw ball
		if (clicked)
			ctx.shadowBlur = 12;
		else
			ctx.shadowBlur = 0;
		ctx.shadowColor = "#66FF66";
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#00FF00";
		ctx.fillStyle = "black";
		ctx.arc(xpos, ypos, mass.innerHTML, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();

		//draw vectors
		if (paused) {
			ctx.shadowBlur = 0;
		}

		// write labels
		ctx.shadowBlur = 0;
		ctx.font = "10pt Calibri";
		ctx.fillStyle = "yellow";
		ctx.textAlign = "center";
		// angle
		var theta = angle*180/Math.PI % 360;
		ctx.fillText("Angle: \u03B8 = " + theta.toFixed(0) + "\xB0", canvas.width/2, canvas.height/4 - 15);
		// force of tension
		var tension = mass.innerHTML/1000*9.81*Math.cos(angle);
		ctx.fillText("Tension: F = " + tension.toFixed(2) + " N", canvas.width/2, canvas.height*4/5)
		// period
		var period = 2*Math.PI*Math.sqrt(0.01*length.innerHTML/9.81);
		ctx.fillText("Period: T = " + period.toFixed(2) + " s", canvas.width/2, canvas.height*4/5+20);

		setTimeout(redraw, 1);
	}
	
	reset();
	setTimeout(redraw, 1);

	// mouse listeners
	window.onmousedown = function(e) {
		var x = e.clientX - canvas.offsetLeft;
		var y = e.clientY - canvas.offsetTop;
		if (Math.sqrt(Math.pow(xpos-x, 2) + Math.pow(ypos-y, 2)) < mass.innerHTML) {
			clicked = true;
			mousex = x;
			mousey = y;
		}
	}
	window.onmousemove = function(e) {
		if (clicked) {
			mousex = e.clientX - canvas.offsetLeft;
			mousey = e.clientY - canvas.offsetTop;
		}
	}
	window.onmouseup = function(e) {
		if (clicked) {
			velocity = 0.0;
			clicked = false;
			if (angle == Math.PI)
				angle -= 0.01;
		}
	}

	//key listeners
	// window.onkeydown = function(e) {
	// 	var key = e.keyCode;
	// 	if (!paused) {
	// 		// up: increase length
	// 		if (key == 38) {
	// 			if (length.innerHTML < 225)
	// 				length.innerHTML += 5;
	// 		}
	// 		// down: decrease length
	// 		else if (key == 40) {
	// 			if (length.innerHTML > mass.innerHTML+10)
	// 				length.innerHTML -= 5;
	// 		}
	// 		// right: increase friction
	// 		else if (key == 39) {
	// 			if (friction.innerHTML < 8)
	// 				friction.innerHTML++;
	// 		}
	// 		// left: decrease friction
	// 		else if (key == 37) {
	// 			if (friction.innerHTML > 0)
	// 				friction.innerHTML--;
	// 		}
	// 		// space: reset
	// 		else if (key == 32) {
	// 			reset();
	// 		}
	// 	}
	// }
}
