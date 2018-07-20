class Slider {

    constructor(canvas, label, x, y, min, max, value, step, unit, color) {
        // slider variables
        this.canvas = canvas;
        this.label = label;
        this.x = x;
        this.y = y;
        this.min = min;
        this.value = value;
        this.step = step || 1;
        this.unit = unit || "";
        this.color = color || "cyan";
        this.valuex = x + value/max*(canvas.width/2);
        this.valuey = y;
        this.hover = false;
        this.dragged = false;
    }

    drawSlider() {
        // draw outline
        let canvas = this.canvas;
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y-3);
        ctx.lineTo(this.x+canvas.width/2, this.y-3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y+3);
        ctx.lineTo(this.x+canvas.width/2, this.y+3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0.5*Math.PI, 1.5*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x+canvas.width/2, this.y, 3, 0.5*Math.PI, 1.5*Math.PI, true);
        ctx.stroke();

        // handle shadow
        ctx.shadowColor = "#66FFFF";
        if (this.hover)
            ctx.shadowBlur = 12;
        else
            ctx.shadowBlur = 0;

        // draw selector
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.valuex, this.valuey, 6, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();

        // write label
        ctx.shadowBlur = 0;
        ctx.font = "10pt Verdana";
        ctx.fillStyle = this.color;
        ctx.textAlign = "left";
        ctx.fillText(this.label + ": " + this.value + " " + this.unit, this.x+5, this.y-15);
    }
}
