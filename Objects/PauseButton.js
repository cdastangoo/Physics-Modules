class PauseButton {

	constructor(canvas, x, y, width, selected, color) {
		// pause button variables
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.width = width || 32;
		this.selected = selected || false;
		this.color = color || "magenta";
		this.hover = false;
	}

	drawButton() {
		// draw button
		let canvas = this.canvas;
		let ctx = canvas.getContext("2d");
		ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
		ctx.lineWidth = 2;

		// handle shadow
		ctx.shadowColor = this.color.replace("00", "66");
		if (this.hover)
			ctx.shadowBlur = 12;
		else
			ctx.shadowBlur = 0;

		// draw sides
 		ctx.beginPath();
		ctx.moveTo(this.x, this.y-3);
		ctx.lineTo(this.x+this.width, this.y-3);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.x+this.width+3, this.y);
		ctx.lineTo(this.x+this.width+3, this.y+this.width);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.x, this.y+this.width+3);
		ctx.lineTo(this.x+this.width, this.y+this.width+3);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.x-3, this.y);
		ctx.lineTo(this.x-3, this.y+this.width);
		ctx.stroke();

		// draw corners
		ctx.beginPath();
		ctx.arc(this.x, this.y, 3, Math.PI, 3*Math.PI/2);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x+this.width, this.y, 3, 3*Math.PI/2, 2*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x, this.y+this.width, 3, Math.PI/2, Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x+this.width, this.y+this.width, 3, 0, Math.PI/2);
		ctx.stroke();

        // draw pause indicator
		if (this.selected) {
			// play symbol edges
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(this.x+this.width/4 + 3*Math.cos(Math.PI/3), this.y+this.width/4 - 3*Math.sin(Math.PI/3));
			ctx.lineTo(this.x+Math.sqrt(3)/2*this.width-3 + 3*Math.cos(Math.PI/3), this.y+this.width/2 - 3*Math.sin(Math.PI/3));
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.x+this.width/4 + 3*Math.cos(Math.PI/3), this.y+3*this.width/4 + 3*Math.sin(Math.PI/3));
			ctx.lineTo(this.x+Math.sqrt(3)/2*this.width-3 + 3*Math.cos(Math.PI/3), this.y+this.width/2 + 3*Math.sin(Math.PI/3))
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(this.x+this.width/4-3, this.y+this.width/4);
			ctx.lineTo(this.x+this.width/4-3, this.y+3*this.width/4);
			ctx.stroke();
			// play symbol corners
			ctx.beginPath();
			ctx.arc(this.x+this.width/4, this.y+this.width/4, 3, Math.PI, 5*Math.PI/3); //19*Math.PI/12);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this.x+this.width/4, this.y+3*this.width/4, 3, Math.PI/3, Math.PI); //5*Math.PI/12, Math.PI);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this.x+Math.sqrt(3)/2*this.width-3, this.y+this.width/2, 3, 5*Math.PI/3, Math.PI/3);
			ctx.stroke();
		}
		else {
			// TODO: draw pause symbol
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.x+this.width/3, this.y+this.width/4);
            ctx.lineTo(this.x+this.width/3, this.y+3*this.width/4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x+2*this.width/3, this.y+this.width/4);
            ctx.lineTo(this.x+2*this.width/3, this.y+3*this.width/4);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.x+this.width/3, this.y+this.width/4, 2.5, 0, 2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x+this.width/3, this.y+3*this.width/4, 2.5, 0, 2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x+2*this.width/3, this.y+this.width/4, 2.5, 0, 2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x+2*this.width/3, this.y+3*this.width/4, 2.5, 0, 2*Math.PI);
            ctx.fill();
		}
	}
}
