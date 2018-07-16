window.onload = function() { projectile(); }

function projectile() {

	// positioning variables
	var xpos, ypos, mousex, mousey;
	var ballclicked = false, launchclicked = false;
	var launched = false, paused = false, vectors = false;

	// slider variables
	var height_slider, mass_slider, angle_slider, velocity_slider, drag_slider;
	var height, mass, angle, velocity, drag;

	// physics variables
	var t, acceleration, range;
	var g = 9.81;

	// height slider
	height_slider = document.getElementById("height_slider");
	height = document.getElementById("height");
	height.innerHTML = height_slider.value;
	height_slider.oninput = function() {
		height.innerHTML = this.value;
	}

	// mass slider
	mass_slider = document.getElementById("mass_slider");
	mass = document.getElementById("mass");
	mass.innerHTML = mass_slider.value;
	mass_slider.oninput = function() {
		mass.innerHTML = this.value;
	}

	// angle slider
	angle_slider = document.getElementById("angle_slider");
	angle = document.getElementById("angle");
	angle.innerHTML = angle_slider.value;
	angle_slider.oninput = function() {
		angle.innerHTML = this.value;
	}

	// velocity slider
	velocity_slider = document.getElementById("velocity_slider");
	velocity = document.getElementById("velocity");
	velocity.innerHTML = velocity_slider.value;
	velocity_slider.oninput = function() {
		velocity.innerHTML = this.value;
	}

	// drag slider
	drag_slider = document.getElementById("drag_slider");
	drag = document.getElementById("drag");
	drag.innerHTML = drag_slider.value;
	drag_slider.oninput = function() {
		drag.innerHTML = this.value;
	}

	var canvas = document.getElementById("projectile");
	var ctx = canvas.getContext("2d");

	// reset simulation
	function reset() {
		launched = false;
		ballclicked = false;
		launchclicked = false;
		t = 0.0;
		acceleration = 0.0;
		xpos = 15;
		ypos = canvas.height - height.innerHTML;
	}

	// launch ball
	function launch() {
		launched = true;
		t = 0.0;
	}

	// redraw canvas
	function redraw() {
		// draw canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.shadowColor = "#66FF66";

		// handle physics
		var theta = angle.innerHTML*180/Math.PI;
		if (!launchclicked && !ballclicked && launched) {
			t += 0.001;
		}
		// handle launch drag
		else if (launchclicked && !launched) {
			dx = mousex - 15;
			dy = mousey - (canvas.height - height.innerHTML);
			var newangle = Math.atan2(-1*dy, dx) + Math.PI/2;
			if (newangle < 0)
				theta = 0;
			else if (newangle > Math.PI/4)
				theta = Math.PI/4;
			else
				theta = newangle;
			angle_slider.value = theta*Math.PI/180;
		}
		// handle ball drag
		else if (ballclicked && launched) {
			if (mousex < 15)
				xpos = 15;
			else if (mousex > range+15)
				xpos = range+15;
			else
				xpos = mousex;
			t = (xpos-15)/(velocity.innerHTML*Math.cos(theta));
			ypos = height.innerHTML + velocity.innerHTML*Math.sin(theta)*t - 0.5*g*Math.pow(t, 2);
		}
		xpos = velocity.innerHTML*Math.cos(theta)*t + 15;
		ypos = height.innerHTML + velocity.innerHTML*Math.sin(theta)*t - 0.5*g*Math.pow(t, 2);

		// draw ground
		ctx.shadowBlur = 0;
		ctx.strokeStyle = "#FF0000";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, canvas.height - 60);
		ctx.lineTo(canvas.width, canvas.height - 60);
		ctx.stroke();

		// draw launch
		// if (launchclicked && !launched)
		// 	ctx.shadowBlur = 12;
		// else
		// 	ctx.shadowBlur = 0;
		// ctx.shadowColor = "#FF6666";
		// ctx.beginPath();
		// ctx.lineWidth = 2;
		// ctx.strokeStyle = "red";
		// ctx.fillStyle = "black";

		// draw ball
		if (ballclicked && launched)
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

		// draw vectors
		if (paused) {
			ctx.shadowBlur = 0;
		}

		// write labels
		ctx.shadowBlur = 0;
		ctx.font = "11pt Calibri";
		ctx.fillStyle = "yellow";
		ctx.textAlign = "center";
		// angle
		if (launchclicked && !launched) {
			ctx.fillText("Angle: \u03B8 = " + theta.toFixed(0) + "\xB0", 15, canvas.height - 30);
		}
		// time
		ctx.fillText("Time: t = " + t.toFixed(2) + " s", canvas.width/2, canvas.height-40);
		// position
		ctx.fillText("x = " + xpos.toFixed(2) + " m", canvas.width/2 - 40, canvas.height - 20);
		ctx.fillText("y = " + ypos.toFixed(2) + " m", canvas.width/2 + 40, canvas.height - 20);
		
		setTimeout(redraw, 1);
	}

	reset();
	setTimeout(redraw, 1);

	// mouse listeners
	window.onmousedown = function(e) {
		var x = e.clientX - canvas.offsetLeft;
		var y = e.clientY - canvas.offsetTop;
		if (Math.sqrt(Math.pow(xpos-x, 2) + Math.pow(ypos-y, 2)) < mass.innerHTML) {
			ballclicked = true;
			mousex = x;
			mousey = y;
		}
		if (Math.sqrt(Math.pow(x-15, 2) + Math.pow(canvas.height-height.innerHTML-y, 2)) < 10) {
			launchclicked = true;
			mousex = x;
			mousey = y;
		}
	}
	window.onmousemove = function(e) {
		if (ballclicked || launchclicked) {
			mousex = e.clientX - canvas.offsetLeft;
			mousey = e.clientY - canvas.offsetTop;
		}
	}
	window.onmouseup = function(e) {
		if (ballclicked) {
			velocity.innerHTML = 0.0;
			clicked = false;
		}
	}

	// key listeners
	window.onkeydown = function(e) {
		var key = e.keyCode;
		// space: launch
		if (key == 32) {
			launch();
		}
		// p or sec: pause
		if (key == 27 || key == 80) {
			paused = !paused;
		}
	}
}