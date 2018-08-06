function projectile() {

	// positioning variables
	var xpos, ypos, mousex, mousey;
	var ballClicked = false, launched = false, paused = false;
	var showForces = false, showVelocity = false, showAcceleration = false;

	// physics variables
	var height, angle, velocity, drag;  // user defined parameters
	var t, v, vx, vy, theta, range;     // vector parameters
	var g = 9.81;  // gravity
	var ground = 180;  // pixel height offset of ground

	// canvas
	var canvas = document.getElementById("projectilemotion");
	var ctx = canvas.getContext("2d");
	var pauseButton = new PauseButton(canvas, 540, 480, 32, false, "cyan");
	var resetButton = new ResetButton(canvas, 540, 540, 32);

	// slider variables
	var heightSlider = new Slider(canvas, "Height", 30, 490, 0, 10, 0, 1, "m");
	var angleSlider = new Slider(canvas, "Angle", 30, 530, 0, 90, 60, 5, "\xb0");
	var velocitySlider = new Slider(canvas, "Velocity", 30, 570, 10, 30, 10, 1, "m/s");
	//var dragSlider = new Slider(canvas, "Drag", 40, 460, 0, 1, 0, 0.1);
	var sliders = [heightSlider, angleSlider, velocitySlider];

	// checkbox variables
	var forceCheckbox = new Checkbox(canvas, "Forces", 380, 500, "yellow");
	var velocityCheckbox = new Checkbox(canvas, "Velocity", 380, 530, "red");
	var accelerationCheckbox = new Checkbox(canvas, "Acceleration", 380, 560, "magenta");
	var checkboxes = [forceCheckbox, velocityCheckbox, accelerationCheckbox];

	// vector objects
	var vxVector, vyVector, vnetVector, aVector;
	var fmax, vmax, amax, thetamax;

	// reset simulation
	function reset() {
		launched = true;
		ballClicked = false;
		t = 0.0;
		height = heightSlider.value*10;
		angle = angleSlider.value;
		velocity = velocitySlider.value;
		//drag = dragSlider.value;
		xpos = 40;
		ypos = canvas.height-ground;
		vx = velocity*Math.cos(angle*Math.PI/180);
		vy = velocity*Math.sin(angle*Math.PI/180);
		// create vectors
		vxVector = new Vector(canvas, xpos, ypos, vx, 0, true, "yellow");
		vyVector = new Vector(canvas, xpos, ypos, vy, 3*Math.PI/2, true, "yellow");
		vnetVector = new Vector(canvas, xpos, ypos, velocity, angle*Math.PI/180, false, "yellow");
		aVector = new Vector(canvas, xpos, ypos, g, Math.PI/2, false, "red");
	}

	// redraw canvas
	function redraw() {
		// draw canvas
		ctx.strokeStyle = "cyan";
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.stroke();

		// handle physics
		if (!ballClicked && !paused && launched) {
			t += velocity*0.002;
			vy = velocity*Math.sin(angle*Math.PI/180) - g*t;
			v = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
			theta = Math.atan(vy/vx);
		}
		// handle launch drag
		// else if (!launched) {
		// 	dx = mousex - 15;
		// 	dy = mousey - (canvas.height - height);
		// 	var newangle = Math.atan2(-1*dy, dx) + Math.PI/2;
		// 	if (newangle < 0)
		// 		theta = 0;
		// 	else if (newangle > Math.PI/4)
		// 		theta = Math.PI/4;
		// 	else
		// 		theta = newangle;
		// 	angle = theta*Math.PI/180;
		// }
		// handle mouse drag
		else if (ballClicked && (!launched || paused)) {
            if (mousex < 40)
				xpos = 40;
			else if (mousex > 5*range+40)
				xpos = 5*range+40;
			else
				xpos = mousex;
			t = (xpos-40)/(5*velocity*Math.cos(angle*Math.PI/180));
			ypos = canvas.height-ground - (height + velocity*5*Math.sin(angle*Math.PI/180)*t - 0.5*g*Math.pow(t, 2));
		}
		if (launched || ballClicked) {
			xpos = velocity*5*Math.cos(angle*Math.PI/180)*t + 40;
			ypos = canvas.height-ground - (height + velocity*5*Math.sin(angle*Math.PI/180)*t - 0.5*g*Math.pow(t, 2));
		}

		// draw launcher
		ctx.shadowBlur = 0;
		ctx.lineWidth = 2;
		ctx.strokeStyle = "red";
		ctx.fillStyle = "black";
		let anglecomp = Math.PI/2 - angle*Math.PI/180;
		ctx.beginPath();
		ctx.moveTo(40-20*Math.cos(anglecomp)+60*Math.cos(angle*Math.PI/180), canvas.height-height-ground-20*Math.sin(anglecomp)-60*Math.sin(angle*Math.PI/180));
		ctx.lineTo(40-20*Math.cos(anglecomp), canvas.height-height-ground-20*Math.sin(anglecomp));
		ctx.lineTo(40+20*Math.cos(anglecomp), canvas.height-height-ground+20*Math.sin(anglecomp));
		ctx.lineTo(40+20*Math.cos(anglecomp)+60*Math.cos(angle*Math.PI/180), canvas.height-height-ground+20*Math.sin(anglecomp)-60*Math.sin(angle*Math.PI/180));
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
		//if (launched) {
		ctx.shadowColor = "#66FF66";
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#00FF00";
		ctx.fillStyle = "black";
		ctx.arc(xpos, ypos, 15, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
		//}
		if (ypos >= canvas.height-ground && xpos != 40) {
			launched = false;
		}

		// draw velocity vectors
		range = 5*Math.pow(velocity, 2)*Math.sin(2*angle*Math.PI/180)/g;
		console.log(xpos, 40+range/2);
		if (showVelocity && launched) {
			vxVector.drawVector(xpos, ypos, 3*velocity*Math.cos(angle*Math.PI/180), 0);
			if ((xpos-40)/5 < 40+range/2)
				vyVector.drawVector(xpos, ypos, 3*vy, 3*Math.PI/2);
			else
				vyVector.drawVector(xpos, ypos, 3*vy, Math.PI/2);
			vnetVector.drawVector(xpos, ypos, 3*v, 2*Math.PI-theta);
		}

		// draw acceleration vector
		if (showAcceleration && launched) {
			aVector.drawVector(xpos, ypos, 1.5*g, Math.PI/2);
		}

		// draw UI border
		ctx.shadowBlur = 0;
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.rect(1, 0.75*canvas.height-5, canvas.width-2, 0.25*canvas.height-6);
		ctx.fill();
		ctx.beginPath();
		ctx.strokeStyle = "cyan";
		ctx.lineWidth = 1;
		ctx.moveTo(0, 0.75*canvas.height-5);
		ctx.lineTo(canvas.width, 0.75*canvas.height-5);
		ctx.stroke();
		ctx.stroke();

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

		// draw buttons
		pauseButton.drawButton();
		resetButton.drawButton();

		// write labels
		ctx.shadowBlur = 0;
		ctx.font = "11pt Calibri";
		ctx.fillStyle = "yellow";
		ctx.textAlign = "center";
		// time
		ctx.fillText("Time: t = " + t.toFixed(2) + " s", canvas.width/2, canvas.height-40);
		// position
		ctx.fillText("x = " + xpos.toFixed(2) + " m", canvas.width/2 - 40, canvas.height - 20);
		ctx.fillText("y = " + ypos.toFixed(2) + " m", canvas.width/2 + 40, canvas.height - 20);
	}

	reset();
	setInterval(redraw, 1);

	// mouse listeners
	canvas.onmousedown = function(e) {
		var x = e.clientX - canvas.getBoundingClientRect().left;
		var y = e.clientY - canvas.getBoundingClientRect().top;
		// ball is clicked
		if (Math.sqrt(Math.pow(xpos-x, 2) + Math.pow(ypos-y, 2)) < 15) {
			ballClicked = true;
			mousex = x;
			mousey = y;
		}
		// show velocity vectors clicked
		else if (Math.sqrt(Math.pow(velocityCheckbox.x-x, 2) + Math.pow(velocityCheckbox.y-y, 2)) < velocityCheckbox.width+2) {
			showVelocity = !showVelocity;
			velocityCheckbox.selected = !velocityCheckbox.selected;
		}
		// show acceleration vectors clicked
		else if (Math.sqrt(Math.pow(accelerationCheckbox.x-x, 2) + Math.pow(accelerationCheckbox.y-y, 2)) < accelerationCheckbox.width+2) {
			showAcceleration = !showAcceleration;
			accelerationCheckbox.selected = !accelerationCheckbox.selected;
		}
		// pause button clicked
		else if (Math.sqrt(Math.pow(pauseButton.x+pauseButton.width/2-x, 2) + Math.pow(pauseButton.y+pauseButton.width/2-y, 2)) < 3*pauseButton.width/4) {
			paused = !paused;
			pauseButton.selected = !pauseButton.selected;
		}
		// reset button clicked
		else if (Math.sqrt(Math.pow(resetButton.x+resetButton.width/2-x, 2) + Math.pow(resetButton.y+resetButton.width/2-y, 2)) < 3*resetButton.width/4) {
			reset();
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
	canvas.onmousemove = function(e) {
		var x = e.clientX - canvas.getBoundingClientRect().left;
		var y = e.clientY - canvas.getBoundingClientRect().top;
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
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].hover = Math.sqrt(Math.pow(checkboxes[i].x-x, 2) + Math.pow(checkboxes[i].y-y, 2)) < checkboxes[i].width+2;
		}
		pauseButton.hover = Math.sqrt(Math.pow(pauseButton.x+pauseButton.width/2-x, 2) + Math.pow(pauseButton.y+pauseButton.width/2-y, 2)) < 3*pauseButton.width/4;
		resetButton.hover = Math.sqrt(Math.pow(resetButton.x+resetButton.width/2-x, 2) + Math.pow(resetButton.y+resetButton.width/2-y, 2)) < 3*resetButton.width/4;
	}
	canvas.onmouseup = function(e) {
		if (ballClicked) {
			velocity = 0.0;
			ballClicked = false;
		}
		for (let i = 0; i < sliders.length; i++) {
			if (sliders[i].dragged) {
				sliders[i].dragged = false;
			}
		}
	}
}
