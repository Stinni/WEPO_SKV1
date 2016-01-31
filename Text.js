var Text = Shape.extend({

	constructor: function() {
		this.base("Text");
	},

	draw: function(canvas) {
	  	var textBox = document.getElementById("textbox");
		textBox.style.display = 'flex';
		$('#textbox').focus();

	/*	canvas.strokeStyle = this.color;
		canvas.lineWidth = this.lineWidth;
		canvas.strokeText("sf",this.pos.x,this.pos.y);
		//canvas.fillText();
		canvas.measureText();
	*/	//this.base(canvas);
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