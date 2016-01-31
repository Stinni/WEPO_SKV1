var Circle = Shape.extend({

	constructor: function() {
		this.base("Circle");
	},


	draw: function(canvas) {

		canvas.strokeStyle = this.color;
		canvas.lineWidth = this.lineWidth;
		
		var radius = 0;

		var px = this.pos.x;
		var py = this.pos.y;

		if(this.size.x > this.pos.x)
		{
			radius = Math.abs((this.size.x - this.pos.x)/2);
			px = (this.size.x-this.pos.x)/2 + this.pos.x;
		}
		else//(this.size.y > this.pos.y)
		{
			radius = Math.abs((this.size.y - this.pos.y)/2);
			py = (this.size.y-this.pos.y)/2 + this.pos.y;
		}
		
		canvas.beginPath();
		canvas.arc(px, py, radius, 2* Math.PI, false);
		canvas.closePath();
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

});