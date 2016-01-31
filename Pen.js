var Pen = Shape.extend({

	constructor: function() {
		this.base("Pen");
		this.points = [];
	},

	draw: function(canvas) {
		canvas.strokeStyle = this.color;
		canvas.lineWidth   = this.lineWidth;
		canvas.lineJoin    = this.lineJoin;
		canvas.lineCap     = this.lineCap;
		if(this.points.length > 1) {
			var p1 = this.points[0];
			var p2 = this.points[1]
			canvas.beginPath();
			canvas.moveTo(p1.x, p1.y);
			for(var i = 1; i < this.points.length; i++) {
				var midPoint = this.midPointBtw(p1, p2);
				canvas.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
				p1 = this.points[i];
				p2 = this.points[i+1];
			}
			canvas.lineTo(p1.x, p1.y);
			canvas.stroke();
		} else {
		}
		this.base(canvas);
	},

	drawing:function(point) {
		var newPoint = new Point(point.x, point.y);
		this.points.push(newPoint);
	},

	added: function(canvas) {
		// not sure what this is for so...
	},

	midPointBtw: function(p1, p2) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		}
	},

	shouldBeAdded: function() {
		if(this.points.length > 1) {
			return true;
		}
		return false;
	}
});