var TextBox = Shape.extend({

	constructor: function() {
		this.base("TextBox");
		this.theText = "";
	},

	draw: function(canvas) {
		canvas.fillStyle    = this.color;
		canvas.textBaseline = "middle";
		canvas.textAlign    = "center";
		canvas.font         = "20pt Arial, sans-serif";
		canvas.fillText(this.theText, this.pos.x, this.pos.y);
		this.base(canvas);
	},

	shouldBeAdded: function() {
		if(this.theText.length > 0) {
			return true;
		}
		return false;
	}
});
