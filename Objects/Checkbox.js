class Checkbox {

    constructor(canvas, label, x, y, color, selected, width) {
        // checkbox variables
        this.canvas = canvas;
        this.label = label;
        this.x = x;
        this.y = y;
        this.color = color || "#FFFF00";
        this.selected = selected || false;
        this.width = width || 8;
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
        ctx.shadowColor = this.color.replace("00", "66");
        if (this.hover)
            ctx.shadowBlur = 12;
        else
            ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, 2*Math.PI);
        ctx.stroke();

        // draw select indicator
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
