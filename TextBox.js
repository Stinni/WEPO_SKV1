var TextBox = Shape.extend({

	constructor: function() {
		this.base("TextBox");
		this.font    = font;
		this.theText = theText;
	},

	draw: function(canvas) {
		canvas.fillStyle = this.color;
		canvas.font = this.font;
		canvas.fillText(this.theText, this.pos.x, this.pos.y);
	},

	shouldBeAdded: function() {
		if(this.theText.length() > 0) {
			return true;
		}
		return false;
	}
});
