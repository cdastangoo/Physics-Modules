window.onload = function() { pendulum(); }

function pendulum() {

	// positioning variables
	var xpos, ypos, mousex, mousey;
	var clicked = false, paused = false, vectors = false;

	// slider variables
    var length_slider, mass_slider, damping_slider;
    var length, mass, damping;

	// physics variables
	var velocity, acceleration, angle;
	var g = 9.81/100;

	// length slider
    length_slider = document.getElementById("length_slider");
    length = document.getElementById("length");
    length.innerHTML = length_slider.value;
    length_slider.oninput = function() {
        length.innerHTML = this.value;
	}

    // mass slider
    mass_slider = document.getElementById("mass_slider");
    mass = document.getElementById("mass");
    mass.innerHTML = mass_slider.value;
    mass_slider.oninput = function() {
        mass.innerHTML = this.value;
	}

    // damping slider
    damping_slider = document.getElementById("damping_slider");
    damping = document.getElementById("damping");
    damping.innerHTML = damping_slider.value;
    damping_slider.oninput = function() {
		damping.innerHTML = this.value;
	}

    var canvas = document.getElementById("pendulum");
	var ctx = canvas.getContext("2d");

	// reset simluation
	function reset() {
		clicked = false;
		velocity = 0.0;
		acceleration = 0.0;
		angle = Math.PI/3;
		xpos = canvas.width/2 + length.innerHTML*Math.sin(angle);
		ypos = canvas.height/5 + length.innerHTML*Math.cos(angle);
	}

	function drawArrow(fromx, fromy, tox, toy) {
		var rotate = Math.atan2(toy-fromy,tox-fromx);
		ctx.strokeStyle = "cyan";
		ctx.lineWidth = 1;
		ctx.shadowBlur = 0;
		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.lineTo(tox - 8*Math.cos(rotate-Math.PI/6), toy - 10*Math.sin(rotate-Math.PI/6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - 8*Math.cos(rotate+Math.PI/6), toy - 10*Math.sin(rotate+Math.PI/6));
		ctx.stroke();
	}

	function Slider(x, y, min, max, step, value) {
		this.x = x;
		this.y = y;
		this.min = min;
		this.max = max;
		this.step = step;
		this.value = value;
		this.dragged = false;
		function draw() {
			ctx.strokeStyle = "cyan";
			ctx.fillStyle = "black";
			ctx.lineWidth = 1;
			if (dragged)
				ctx.shadowBlur = 12;
			else
				ctx.shadowBlur = 0;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x+100, y);
			ctx.stroke();
			ctx.beginPath();
			let location = value/max*100;
			ctx.arc(x+location, y, 5, 0, 2*Math.PI);
			ctx.fill();
			ctx.stroke();
		}
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
			velocity *= (1 - damping.innerHTML*0.0015);
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
		if (clicked) {
			drawArrow(xpos, ypos, xpos, ypos+mass.innerHTML*g*100);
			ctx.shadowBlur = 12;
		}
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
		ctx.font = "10pt Verdana";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		// angle
		if (clicked || paused) {
			var theta = angle*180/Math.PI % 360;
			ctx.fillText("Angle: \u03B8 = " + theta.toFixed(0) + "\xB0", canvas.width/2, canvas.height/5 - 15);
		}
		// force of tension
		var tension = mass.innerHTML/1000*9.81*Math.cos(angle);
		ctx.fillText("Tension: F = " + tension.toFixed(2) + " N", canvas.width/2, canvas.height*4/5+25)
		// period
		var period = 2*Math.PI*Math.sqrt(0.01*length.innerHTML/9.81);
		ctx.fillText("Period: T = " + period.toFixed(2) + " s", canvas.width/2, canvas.height*4/5+45);

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
