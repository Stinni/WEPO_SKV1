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
		this.size.x = point.x;
		this.size.y = point.y;
		this.center.x = Math.abs((this.pos.x + point.x)/2);
		this.center.y = Math.abs((this.pos.y + point.y)/2);
		var rx = Math.abs(this.center.x - point.x);
		var ry = Math.abs(this.center.y - point.y);
		this.radius = rx > ry ? rx : ry;
	},

	shouldBeAdded: function(canvas) {
		if(this.size.x === this.center.x && this.size.y === this.center.y) {
			return false;
		}
		return true;
	}
});
