class Checkbox {

    constructor(canvas, label, x, y, width, selected, color) {
        // checkbox variables
        this.canvas = canvas;
        this.label = label;
        this.x = x;
        this.y = y;
        this.width = width || 8;
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

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, 2*Math.PI);
        ctx.stroke();

        // draw select indicator
        ctx.shadowBlur = 0;
        if (this.selected) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width-5, 0, 2*Math.PI);
            ctx.fill();
        }

        // write label
        ctx.font = "10pt Verdana";
        ctx.textAlign = "left";
        ctx.fillText(this.label, this.x+16, this.y+4);
    }
}
