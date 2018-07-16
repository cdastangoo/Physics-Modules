window.onload = function() { ramp(); }

function ramp() {

	// positioning variables
	var xpos, ypos;
	var mousex, mousey;
	var clicked;

	// slider variables
	var mass_slider = document.getElementById("mass_slider");
	var mass = document.getElementById("mass");
	mass.innerHTML = mass_slider.value;
	var friction_slider = document.getElementById("friction_slider");
	var friction = document.getElementById("friction");
	friction.innerHTML = friction_slider.value;
	var angle_slider = document.getElementById("angle_slider");
	var angle = document.getElementById("angle");
	angle.innerHTML = angle_slider.value;

	// physics variables
	var velocity, acceleration;
	var g = 9.81;

	var canvas = document.getElementById("ramp");
	var ctx = canvas.getContext("2d");
	var vectors = false;

	// slider inputs
	mass_slider.oninput = function() {
		mass.innerHTML = this.value;
	}
	friction_slider.oninput = function() {
		friction.innerHTML = this.value;
	}
	angle_slider.oninput = function() {
		angle.innerHTML = this.value;
	}

	// reset simulation
	function reset() {
		clicked = false;
		velocity = 0.0;
		acceleration = 0.0;
		xpos = canvas.width/2;
		ypos = canvas.height/2;
	}

	function redraw() {
		// draw canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.shadowColor = "#66FF66";

		if (!clicked) {
			
		}
	}
}