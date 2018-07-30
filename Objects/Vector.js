class Vector {

	constructor(canvas, x, y, magnitude, direction, dotted, color, label, subscript) {
		// vector variables
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.magnitude = magnitude;  // in pixels
		this.direction = direction;  // in radians
		this.color = color || "yellow";
		this.dotted = dotted || false;
		this.label = label || "";
		this.subscript = subscript || "";
		this.show = true;
	}

	drawVector(newx, newy, newmag, newdir) {
		// reposition vector
		let ctx = this.canvas.getContext("2d");
		this.x = newx;
		this.y = newy;
		if (newmag < 0) {
			newmag = Math.abs(newmag);
			newdir = Math.PI+newdir;
		}
		this.magnitude = Math.abs(newmag);
		this.direction = newdir;
		if (!this.show || Math.abs(newmag) <= 3)
			return;
		let tox = this.x + this.magnitude*Math.cos(this.direction);
		let toy = this.y + this.magnitude*Math.sin(this.direction);

		// draw vector
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2;
		if (this.dotted)
			ctx.setLineDash([5, 3]);
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(tox, toy);
		ctx.stroke();
		
		// draw arrow head
		ctx.setLineDash([]);
		ctx.lineJoin = "round";
		ctx.beginPath();
		ctx.moveTo(tox + 8*Math.cos(Math.PI+this.direction-Math.PI/6), toy + 8*Math.sin(Math.PI+this.direction-Math.PI/6));
		ctx.lineTo(tox, toy);
		ctx.lineTo(tox + 8*Math.cos(Math.PI+this.direction+Math.PI/6), toy + 8*Math.sin(Math.PI+this.direction+Math.PI/6));
		ctx.stroke();
		
		// draw label
		if (this.label != "") {
			ctx.font = "10pt Verdana";
			ctx.fillText(this.label, tox+15, toy-5);
			if (this.subscript != "") {
				ctx.font = "6pt Verdana";
				ctx.fillText(this.subscript, tox+20, toy);
			}
		}
	}
}
