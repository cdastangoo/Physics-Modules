class Checkbox {

    constructor(canvas, label, x, y, selected, color) {
        // checkbox variables
        this.canvas = canvas;
        this.label = label;
        this.x = x;
        this.y = y;
        this.selected = selected || true;
        this.color = color || "yellow";
        this.hover = false;
    }

    drawCheckbox() {
        // draw box
        let canvas = this.canvas;
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 2;

        //handle shadow
        ctx.shadowColor = "#FFFF66";
        if (this.hover)
            ctx.shadowBlur = 12;
        else
            ctx.shadowBlur = 0;

        // draw sides
        ctx.beginPath();
        ctx.moveTo(this.x, this.y-3);
        ctx.lineTo(this.x+8, this.y-3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x+11, this.y);
        ctx.lineTo(this.x+11, this.y+8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y+11);
        ctx.lineTo(this.x+8, this.y+11);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x-3, this.y);
        ctx.lineTo(this.x-3, this.y+8);
        ctx.stroke();

        // draw corners
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, Math.PI, 1.5*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x+8, this.y, 3, 1.5*Math.PI, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y+8, 3, 0.5*Math.PI, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x+8, this.y+8, 3, 0, 0.5*Math.PI);
        ctx.stroke();

        // draw select indicator
        ctx.shadowBlur = 0;
        if (this.selected) {
            ctx.beginPath();
            ctx.arc(this.x+4, this.y+4, 2, 0, 2*Math.PI);
            ctx.fill();
        }

        // write label
        ctx.font = "10pt Verdana";
        ctx.textAlign = "left";
        ctx.fillText(this.label, this.x+18, this.y+8);
    }
}
