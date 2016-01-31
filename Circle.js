var Circle = Shape.extend({

	constructor: function() {
		this.base("Circle");
		this.radius = 0;
		this.center = new Point(0,0);
	},


	draw: function(canvas) {

		canvas.strokeStyle = this.color;
		canvas.lineWidth = this.lineWidth;
		
		canvas.beginPath();
		canvas.arc(this.center.x, this.center.y, this.radius, 2* Math.PI, false);
		canvas.closePath();
		canvas.stroke();
		this.base(canvas);
	},

	drawing:function(point) {
		this.center.x = Math.abs((this.pos.x + point.x)/2);
		this.center.y = Math.abs((this.pos.y + point.y)/2);
		var rx = Math.abs(this.center.x - point.x);
		var ry = Math.abs(this.center.y - point.y);
		this.radius = rx > ry ? rx : ry;
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
	}
});
