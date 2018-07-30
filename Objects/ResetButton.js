class ResetButton {

	constructor(canvas, x, y, width, color) {
		// pause button variables
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.width = width || 32;
		this.color = color || "magenta";
		this.hover = false;
	}

	drawButton() {
		// draw button
		let canvas = this.canvas;
		let ctx = canvas.getContext("2d");
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;

		// handle shadow
		ctx.shadowColor = "#FF66FF";
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

        // draw reset symbol
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x+this.width/2, this.y+this.width/2, this.width/3, Math.PI/6, 11*Math.PI/6);
        ctx.stroke();
        let tox = this.x+this.width/2+this.width/3*Math.cos(Math.PI/6);
        let toy = this.y+this.width/2-this.width/3*Math.sin(Math.PI/6);
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox+5*Math.cos(Math.PI/3+Math.PI/9), toy-5*Math.sin(Math.PI/3+Math.PI/9));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-5*Math.cos(Math.PI/3-Math.PI/9), toy+5*Math.sin(Math.PI/3-Math.PI/9));
        ctx.stroke();
	}
}
