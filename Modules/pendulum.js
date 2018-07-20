window.onload = function() { pendulum(); }

function pendulum() {

	// positioning variables
	var xpos, ypos, mousex, mousey;
	var ballClicked = false, paused = false;
	var showForces = true, showVectors = false;

	// physics variables
	var length, mass, damping;
	var velocity, acceleration, angle;
	var g = 9.81/100;

	// canvas
	var canvas = document.getElementById("pendulum");
	var ctx = canvas.getContext("2d");

	// slider variables
	var lengthSlider = new Slider(canvas, "Length", canvas.width/4, 340, 50, 200, 120, 1, "cm");
	var massSlider = new Slider(canvas, "Mass", canvas.width/4, 380, 1, 40, 20, 1, "g");
	var dampingSlider = new Slider(canvas, "Damping", canvas.width/4, 420, 0, 1, 0, 0.1);
	var sliders = [lengthSlider, massSlider, dampingSlider];

	// reset simluation
	function reset() {
		ballClicked = false;
		velocity = 0.0;
		acceleration = 0.0;
		angle = Math.PI/3;
		length = lengthSlider.value;
		mass = massSlider.value;
		damping = dampingSlider.value;
		xpos = canvas.width/2 + length*Math.sin(angle);
		ypos = canvas.height/10 + length*Math.cos(angle);
	}

	// draw vectors
	function drawVector(fromx, fromy, magnitude, direction, label, value, color) {
		if (magnitude == 0)
			return;
		let trans = mass/2, scale = 500;
		let tox = fromx + (scale*magnitude+trans)*Math.cos(direction);
		let toy = fromy + (scale*magnitude+trans)*Math.sin(direction);
		ctx.strokeStyle = color || "yellow";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineTo(tox - 8*Math.cos(direction-Math.PI/6), toy - 10*Math.sin(direction-Math.PI/6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - 8*Math.cos(direction+Math.PI/6), toy - 10*Math.sin(direction+Math.PI/6));
		ctx.stroke();
		let lbl = label || "F = ma";
		let force = value || "";
		ctx.font = "10pt Verdana";
		ctx.fillText(lbl, tox+15, toy-5);
		ctx.fillText(force.toFixed(2) + " N", tox+15, toy+10);
	}

	// main redraw function
	function redraw() {
		// draw canvas
		ctx.strokeStyle = "cyan";
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.stroke();

		// handle physics
		if (!ballClicked) {
			acceleration = -1*g/length * Math.sin(angle);
			velocity += acceleration;
			velocity *= (1 - damping*0.01);
			angle += velocity;
		}
		// handle mouse drag
		else if (!paused) {
			dx = mousex - canvas.width/2;
			dy = mousey - canvas.height/10;
			angle = Math.atan2(-1*dy, dx) + Math.PI/2;
		}
		xpos = canvas.width/2 + length*Math.sin(angle);
		ypos = canvas.height/10 + length*Math.cos(angle);

		// draw sliders
		length = lengthSlider.value;
		mass = massSlider.value;
		damping = dampingSlider.value;
		for (let i = 0; i < sliders.length; i++) {
			sliders[i].drawSlider();
		}

		// draw string
		ctx.shadowBlur = 0;
		ctx.fillStyle = "yellow";
		ctx.strokeStyle = "red";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(xpos, ypos);
		ctx.lineTo(canvas.width/2, canvas.height/10);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/10, 3, 0, 2*Math.PI);
		ctx.fill();

		// draw force vectors
		if (showForces && ballClicked) {
			let mg = mass*g/10;
			let theta = 3*Math.PI/2+Math.atan2(xpos-canvas.width/2,ypos-canvas.height/10);
			console.log(theta*180/Math.PI);
			ctx.shadowBlur = 12;
			ctx.shadowColor = "#FFFF66";
			drawVector(xpos, ypos, mg, Math.PI/2, "Fmg = mg", mg);
			//drawVector(xpos, ypos, mg*Math.cos(theta), theta, "Fx = mg cos \u03b8", mg*Math.cos(theta));
			drawVector(xpos, ypos, mg*Math.cos(angle), Math.PI/2-angle, "Fx = mg cos \u03b8", mg*Math.cos(angle));
			drawVector(xpos, ypos, mg*Math.sin(angle), Math.PI-angle, "Fy = mg sin \u03b8", mg*Math.sin(angle));
			drawVector(xpos, ypos, mg*Math.cos(angle), 3*Math.PI/2-angle, "T = -mg cos \u03b8", -1*mg*Math.cos(angle));
		}
		// draw velocity and acceleration vectors
		if (showVectors && !ballClicked) {
			let speed = Math.sqrt(2*g*length*(1-Math.cos(Math.PI-angle)));
			let dir = Math.PI-angle;
			if (angle < 0)
				dir = Math.PI+angle;
			ctx.shadowColor = "#FF6666";
			drawVector(xpos, ypos, speed/10, dir, "v = \u221a2gL(1 - cos \u03b8)", speed, "red");
			ctx.shadowColor = "#FFFF66";
			let acc = 100*g*Math.sin(angle);
			drawVector(xpos, ypos, acc, angle, "a = -g sin \u03b8", -1*acc);
		}

		// draw ball
		if (ballClicked)
			ctx.shadowBlur = 12;
		else
			ctx.shadowBlur = 0;
		ctx.shadowColor = "#66FF66";
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#00FF00";
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(xpos, ypos, mass, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();

		//draw vectors
		if (paused) {
			ctx.shadowBlur = 0;
		}

		// write labels
		ctx.shadowBlur = 0;
		ctx.font = "10pt Verdana";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		// angle
		if (ballClicked || paused) {
			let theta = angle*180/Math.PI % 360;
			ctx.fillText("Angle: \u03b8 = " + theta.toFixed(0) + "\xB0", canvas.width/2, canvas.height/10 - 15);
		}
		// force of tension
		let tension = mass/1000*9.81*Math.cos(angle);
		//ctx.fillText("Tension: F = " + tension.toFixed(2) + " N", canvas.width/2, canvas.height*4/5+25)
		// period
		let period = 2*Math.PI*Math.sqrt(0.01*length/9.81);
		//ctx.fillText("Period: T = " + period.toFixed(2) + " s", canvas.width/2, canvas.height*4/5+45);

		setTimeout(redraw, 1);
	}

	reset();
	setTimeout(redraw, 1);

	// mouse listeners
	window.onmousedown = function(e) {
		var x = e.clientX - canvas.offsetLeft;
		var y = e.clientY - canvas.offsetTop;
		// if ball is ballClicked
		if (Math.sqrt(Math.pow(xpos-x, 2) + Math.pow(ypos-y, 2)) < mass) {
			ballClicked = true;
			mousex = x;
			mousey = y;
		}
		// if slider is ballClicked
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
		var x = e.clientX - canvas.offsetLeft;
		var y = e.clientY - canvas.offsetTop;
		if (ballClicked) {
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
	}
	window.onmouseup = function(e) {
		if (ballClicked) {
			velocity = 0.0;
			ballClicked = false;
			if (angle == Math.PI)
				angle -= 0.01;
		}
		for (let i = 0; i < sliders.length; i++) {
			if (sliders[i].dragged) {
				sliders[i].dragged = false;
			}
		}
	}

	//key listeners
	window.onkeydown = function(e) {
		var key = e.keyCode;
		if (!paused) {
			// space: reset
			if (key == 32) {
				reset();
			}
			// p or esc: pause
			if (key == 27 || key == 80) {
				paused = !paused;
			}
		}
	}
}
