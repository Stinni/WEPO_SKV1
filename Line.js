var Line = Shape.extend({

	constructor: function() {
		this.base("Line");
	},

	draw: function(canvas) {
		canvas.strokeStyle = this.color;
		canvas.lineWidth   = this.lineWidth;
		canvas.lineJoin    = this.lineJoin;
		canvas.lineCap     = this.lineCap;
		canvas.beginPath();

		// To prevent a line being drawn to point 0,0 when the mouse is clicked without being moved or a line is drawn outside the canvas
		if(this.size.x === 0 && this.size.y === 0)
		{
			this.size.x = this.pos.x;
			this.size.y = this.pos.y;
		}

		canvas.moveTo(this.pos.x, this.pos.y);
		canvas.lineTo(this.size.x, this.size.y);
		canvas.stroke();
		//this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x;
		this.size.y = point.y;
	},

	added: function(canvas) {
		if(this.size.x < 0) {
			this.pos.x += this.size.x;
			this.size.x = Math.abs(this.size.x);
		}

		if(this.size.y < 0) {
			this.pos.y += this.size.y;
			this.size.y = Math.abs(this.size.y);
		}
	},

	shouldBeAdded: function() {
		if(this.size.x === 0 && this.size.y === 0) {
			return false;
		}
		return true;
	}
});