window.onload = function() { projectile(); }

function projectile() {

	// positioning variables
	var xpos, ypos, mousex, mousey;
	var ballClicked = false, launcherClicked = false;
	var showForces = true, showVelocity = false;
	var launched = false, paused = false;

	// physics variables
	var height, angle, velocity, drag;
	var t, acceleration, theta, range;
	var g = 9.81;
	var ground = 160;

	// canvas
	var canvas = document.getElementById("projectile");
	var ctx = canvas.getContext("2d");
	var pauseButton = new PauseButton(canvas, 360, 420, 30, true);

	// slider variables
	var heightSlider = new Slider(canvas, "Height", 40, 380, 0, 10, 0, 1, "m");
	var angleSlider = new Slider(canvas, "Angle", 40, 420, 0, 90, 30, 5, "\xb0");
	var velocitySlider = new Slider(canvas, "Velocity", 40, 460, 10, 30, 15, 1, "m/s");
	//var dragSlider = new Slider(canvas, "Drag", 40, 460, 0, 1, 0, 0.1);
	var sliders = [heightSlider, angleSlider, velocitySlider];

	// checkbox variables
	var forceCheckbox = new Checkbox(canvas, "Force vectors", 320, 350);
	var velocityCheckbox = new Checkbox(canvas, "Velocity vectors", 320, 380);
	var checkboxes = [forceCheckbox, velocityCheckbox];

	// reset simulation
	function reset() {
		launched = false;
		ballClicked = false;
		launcherClicked = false;
		t = 0.0;
		acceleration = 0.0;
		height = heightSlider.value*10;
		angle = angleSlider.value;
		velocity = velocitySlider.value;
		//drag = dragSlider.value;
		xpos = 40;
		ypos = ground;
		//ypos = canvas.height - height - 25;
	}

	// launch ball
	function launch() {
		launched = true;
		t = 0.0;
	}

	// redraw canvas
	function redraw() {
		// draw canvas
		ctx.strokeStyle = "cyan";
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.stroke();

		// handle physics
		var theta = angle*Math.PI/180;
		if (!launcherClicked && !ballClicked && launched) {
			t += velocity*0.003;
		}
		// handle launch drag
		else if (launcherClicked && !launched) {
			dx = mousex - 15;
			dy = mousey - (canvas.height - height);
			var newangle = Math.atan2(-1*dy, dx) + Math.PI/2;
			if (newangle < 0)
				theta = 0;
			else if (newangle > Math.PI/4)
				theta = Math.PI/4;
			else
				theta = newangle;
			angle = theta*Math.PI/180;
		}
		// handle ball drag
		else if (ballClicked && launched) {
			if (mousex < 15)
				xpos = 15;
			else if (mousex > range+15)
				xpos = range+15;
			else
				xpos = mousex;
			t = (xpos-15)/(velocity*Math.cos(theta));
			ypos = height + velocity*Math.sin(theta)*t - 0.5*g*Math.pow(t, 2);
		}
		xpos = velocity*5*Math.cos(theta)*t + 40;
		ypos = canvas.height-ground - (height + velocity*5*Math.sin(theta)*t - 0.5*g*Math.pow(t, 2));

		// draw sliders
		height = heightSlider.value*10;
		angle = angleSlider.value;
		velocity = velocitySlider.value;
		//drag = dragSlider.value;
		for (let i = 0; i < sliders.length; i++) {
			sliders[i].drawSlider();
		}

		// draw checkboxes
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].drawCheckbox();
		}

		// draw pause button
		pauseButton.drawButton();

		// draw ground
		ctx.shadowBlur = 0;
		ctx.strokeStyle = "red";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(1, canvas.height - ground);
		ctx.lineTo(canvas.width-1, canvas.height - ground);
		ctx.stroke();

		// draw launcher
		if (launcherClicked && !launched)
			ctx.shadowBlur = 12;
		else
			ctx.shadowBlur = 0;
		ctx.lineWidth = 2;
		ctx.strokeStyle = "red";
		ctx.shadowColor = "#FF6666";
		ctx.fillStyle = "black";
		let thetacomp = Math.PI/2 - theta;
		ctx.beginPath();
		ctx.moveTo(40-20*Math.cos(thetacomp)+60*Math.cos(theta), canvas.height-height-ground-20*Math.sin(thetacomp)-60*Math.sin(theta));
		ctx.lineTo(40-20*Math.cos(thetacomp), canvas.height-height-ground-20*Math.sin(thetacomp));
		ctx.lineTo(40+20*Math.cos(thetacomp), canvas.height-height-ground+20*Math.sin(thetacomp));
		ctx.lineTo(40+20*Math.cos(thetacomp)+60*Math.cos(theta), canvas.height-height-ground+20*Math.sin(thetacomp)-60*Math.sin(theta));
		ctx.fill();
		ctx.stroke();
		// ctx.save();
		// ctx.translate(40, canvas.height-height-ground);
		// ctx.rotate(-1*theta);
		// ctx.beginPath();
		// ctx.rect(-25*Math.cos(-1*theta), ground*Math.sin(-1*theta), 60, 40);
		// ctx.fill();
		// ctx.stroke();
		// ctx.restore();

		// draw ball
		if (ballClicked)
			ctx.shadowBlur = 12;
		else
			ctx.shadowBlur = 0;
		if (launched) {
			ctx.shadowColor = "#66FF66";
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = "#00FF00";
			ctx.fillStyle = "black";
			ctx.arc(xpos, ypos, 15, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
		console.log(ypos);
		if (ypos >= canvas.height-ground && xpos != ground) {
			launched = false;
		}

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
		if (launcherClicked && !launched) {
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
		var x = e.clientX - canvas.getBoundingClientRect().left;
		var y = e.clientY - canvas.getBoundingClientRect().top;
		// ball is clicked
		if (Math.sqrt(Math.pow(xpos-x, 2) + Math.pow(ypos-y, 2)) < 15) {
			ballClicked = true;
			mousex = x;
			mousey = y;
		}
		// launcher is clicked
		else if (Math.sqrt(Math.pow(x-15, 2) + Math.pow(canvas.height-height-ground-y, 2)) < 10) {
			launcherClicked = true;
			mousex = x;
			mousey = y;
		}
		// slider is clicked
		else {
			for (let i = 0; i < sliders.length; i++) {
				if (Math.sqrt(Math.pow(sliders[i].valuex-x, 2) + Math.pow(sliders[i].valuey-y, 2)) < 7) {
					sliders[i].dragged = true;
					mousex = x;
					mousey = y;
					break;
				}
			}
		}
	}
	window.onmousemove = function(e) {
		var x = e.clientX - canvas.getBoundingClientRect().left;
		var y = e.clientY - canvas.getBoundingClientRect().top;
		if (ballClicked || launcherClicked) {
			mousex = x;
			mousey = y;
		}
		for (let i = 0; i < sliders.length; i++) {
			sliders[i].hover = Math.sqrt(Math.pow(sliders[i].valuex-x, 2) + Math.pow(sliders[i].valuey-y, 2)) < 7;
			if (sliders[i].dragged) {
				sliders[i].hover = true;
				let location = x - sliders[i].x;
				if (location < 0)
					location = 0;
				else if (location > canvas.width/2)
					location = canvas.width/2;
				let increment = (sliders[i].max-sliders[i].min)/sliders[i].step;
				if (increment > canvas.width/2)
					increment = 1;
				else increment = (canvas.width/2)/increment;
				location = Math.ceil(location/increment) * increment;
				sliders[i].value = (location/(canvas.width/2))*(sliders[i].max-sliders[i].min)+sliders[i].min;
				sliders[i].valuex = sliders[i].x+location;
			}
		}
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].hover = Math.sqrt(Math.pow(checkboxes[i].x+4-x, 2) + Math.pow(checkboxes[i].y+4-y, 2)) < 7;
		}
		pauseButton.hover = Math.sqrt(Math.pow(pauseButton.x+15-x, 2) + Math.pow(pauseButton.y+15-y, 2)) < 18;
	}
	window.onmouseup = function(e) {
		if (ballClicked) {
			velocity = 0.0;
			clicked = false;
		}
		for (let i = 0; i < sliders.length; i++) {
			if (sliders[i].dragged) {
				sliders[i].dragged = false;
			}
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
