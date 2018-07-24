class PauseButton {

	constructor(canvas, x, y, width, selected, color)
	{
		// pause button variables
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.width = width;
		this.selected = selected || false;
		this.color = color || "red";
		this.hover = false;
	}

	drawButton() {
		// draw button
		let canvas = this.canvas;
		let ctx = canvas.getContext("2d");
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;

		// handle shadow
		ctx.shadowColor = "#FF6666";
		if (this.hover)
			ctx.shadowblur = 12;
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
		ctx.arc(this.x, this.y, 3, Math.PI, 1.5*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x+this.width, this.y, 3, 1.5*Math.PI, 2*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x, this.y+this.width, 3, 0.5*Math.PI, Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(this.x+this.width, this.y+this.width, 3, 0, 0.5*Math.PI);
		ctx.stroke();

		// draw pause indicator
		ctx.shadowBlur = 0;
		if (this.selected) {
			// TODO: draw play symbol
		}
		else {
			// TODO: draw pause symbol
		}
	}
}