var TextBox = Shape.extend({

	constructor: function() {
		this.base("TextBox");
		this.fontAndSize = fontAndSize;
		this.theText     = "";
	},

	draw: function(canvas) {
		canvas.fillStyle = this.color;
		canvas.font      = this.fontAndSize;
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
