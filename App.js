function App(canvasSelector) {
	var self = this;
	self.getEventPoint = function(e) {
		return new Point(e.pageX - self.canvasOffset.x,e.pageY - self.canvasOffset.y);
	}

	self.drawingStart = function(e) {
		// moved the canvasOffset point initialization to here. The point often started at the wrong place,
		// so the whole drawing was askew. Now it gets a new Point every time something's drawn so if the
		// first shape drawn is in the wrong place (which hasn't happened yet) it's easy to just clear the
		// canvas and start again.
		self.canvasOffset = new Point(self.canvas.offset().left, self.canvas.offset().top);
		self.startPos     = self.getEventPoint(e);
		var shape         = self.shapeFactory();
		shape.pos         = self.startPos;
		shape.color       = self.color;
		shape.lineWidth   = self.lineWidth;
		shape.lineJoin    = self.lineJoin;
		shape.lineCap     = self.lineCap;

		shape.startDrawing(self.startPos,self.canvasContext);
		self.startPos.log('drawing start');

		var drawing = function(e) {
			var pos = self.getEventPoint(e);
			
			shape.drawing(pos,self.canvasContext);

			self.redraw();
			shape.draw(self.canvasContext);
		}

		var drawingStop = function(e) {
			var pos = self.getEventPoint(e);
			shape.stopDrawing(pos,self.canvasContext);
			pos.log('drawing stop')
			if(shape.shouldBeAdded()) {
				self.shapes.push(shape);
				self.shapesUndone = [];
				self.wasCleared = 0;
				shape.added(self.canvasContext);
			}

			// Remove drawing and drawingStop functions from the mouse events
			self.canvas.off({
				mousemove:drawing,
				mouseup:drawingStop
			});

			self.redraw();
		}

		// Add drawing and drawingStop functions to the mousemove and mouseup events
		self.canvas.on({
			mousemove:drawing,
			mouseup:drawingStop
		});	
	}

	self.mousedown = function(e) {
		if(self.isTextbox) {
			e.preventDefault();
			self.canvasOffset = new Point(self.canvas.offset().left, self.canvas.offset().top);
			self.startPos = self.getEventPoint(e);
			var x = self.startPos.x + $("#canvas").position().left;
			var y = self.startPos.y + $("#canvas").position().top;
			var textBox = document.getElementById("textInput");
			textBox.style.display = 'flex';
			$('#textInput').css({position:'absolute', 'left': x, 'top': y}).show().focus();
		}
		else if(self.shapeFactory != null) {
			self.drawingStart(e);
		}

		self.redraw();
	}

	self.saveTextInput = function() {
		var shape         = self.shapeFactory();
		shape.pos         = self.startPos;
		shape.color       = self.color;
		shape.fontAndSize = self.fontAndSize;
		shape.theText     = $('#textInput').val();

		if(shape.shouldBeAdded()) {
			self.shapes.push(shape);
			self.shapesUndone = [];
			self.wasCleared = 0;
			shape.added(self.canvasContext);

			shape.startDrawing(self.startPos,self.canvasContext);
			self.startPos.log('drawing start');
		}

		self.redraw();
	}

	self.redraw = function() {
		self.canvasContext.clearRect(0, 0, self.canvasContext.canvas.width, self.canvasContext.canvas.height);
		for(var i = 0; i < self.shapes.length; i++) {
			self.shapes[i].draw(self.canvasContext);
		}
	}
	
	self.clearCanvas = function() {
		if(self.wasCleared > 0) {
			self.wasCleared = 0;
			self.shapes = [];
			self.shapesUndone = [];
		}
		else {
			self.wasCleared = self.shapes.length;
			while(self.shapes.length > 0) {
				self.shapesUndone.push(self.shapes.pop());
			}
		}

		if(self.isTextbox) {
			self.resetTextbox();
			self.isTextbox = true;
		}

		self.redraw();
	}
	
	self.undo = function() {
		if(self.wasCleared > 0) {
			for(var i = 0; i < self.wasCleared; i++) {
				self.shapes.push(self.shapesUndone.pop());
			}
			self.wasCleared = 0;
			self.redraw();
		}
		else if(self.shapes.length > 0) {
			self.shapesUndone.push(self.shapes.pop());
			self.redraw();
		}

		if(self.isTextbox) {
			self.resetTextbox();
			self.isTextbox = true;
		}
	}

	self.redo = function() {
		if(self.wasCleared > 0) {
			self.shapes.push(self.shapesUndone.pop());
			self.wasCleared--;
			self.redraw();
		}
		else if(self.shapesUndone.length > 0) {
			self.shapes.push(self.shapesUndone.pop());
			self.redraw();
		}

		if(self.isTextbox) {
			self.resetTextbox();
			self.isTextbox = true;
		}
	}

	self.setColor = function(color) {
		self.color = color;
	}

	self.setLineWidth = function(lineWidth) {
		self.lineWidth = lineWidth;
	}

	self.setLineJoin = function(lineJoin) {
		self.lineJoin = lineJoin;
	}

	self.setLineCap = function(lineCap) {
		self.lineCap = lineCap;
	}

	self.setFont = function(font) {
		var fontArgs = self.fontAndSize.split(' ');
		self.fontAndSize = fontArgs[0] + ' ' + font;
	}

	self.setFontSize = function(size) {
		var fontArgs = self.fontAndSize.split(' ');
		self.fontAndSize = size + ' ';
		for(var i = 1; i < fontArgs.length-1; i++) {
			self.fontAndSize += fontArgs[i] + ' ';
		}
		self.fontAndSize += fontArgs[fontArgs.length-1];
	}

	self.resetTextbox = function() {
		if(self.isTextbox) {
			$('#textInput').hide().val("");
			app.isTextbox = false;
		}
	}

	self.init = function() {
		// Initialize App	
		self.canvas = $(canvasSelector);
		self.canvasOffset = null;
		self.canvas.on({
			mousedown:self.mousedown
		});
		self.shapeFactory = function() {
			return new Pen();
		}
		self.canvasContext = canvas.getContext("2d");
		self.startPos      = null;
		self.shapes        = [];
		self.shapesUndone  = [];
		self.wasCleared    = 0;
		self.isTextbox     = false;
		
		// Set defaults
		self.color       = '#000000';
		self.lineWidth   = 1;
		self.lineJoin    = "miter";
		self.lineCap     = "butt";
		self.fontAndSize = "20pt Calibri";
	}
	
	self.init();
}

var app = null;
$(function() {
	// Wire up events
	app = new App('#canvas');
	$( "#tabs" ).tabs();
	$('#penbutton').click(function(){app.shapeFactory = function() {
		return new Pen();};
		app.resetTextbox();
	});
	$('#squarebutton').click(function(){app.shapeFactory = function() {
		return new Square();};
		app.resetTextbox();
	});
	$('#linebutton').click(function(){app.shapeFactory = function() {
		return new Line();};
		app.resetTextbox();
	});
	$('#circlebutton').click(function(){app.shapeFactory = function() {
		return new Circle();};
		app.resetTextbox();
	});
	$('#textbutton').click(function(){app.shapeFactory = function() {
		return new TextBox();};
		app.isTextbox = true;
	});
	$('#textInput').on({
		keydown: function(e) {
			if(e.keyCode === 13) {
		 		app.saveTextInput();
		 		app.resetTextbox();
		 		app.isTextbox = true;
			}
			else if(e.keyCode === 27) {
				$('#textInput').hide();
			}
		},
		focusout: function() {
			$('#textInput').hide();
		}
	});
	$('#clearbutton').click(function(){app.clearCanvas()});
	$('#undobutton').click(function(){app.undo()});
	$('#redobutton').click(function(){app.redo()});
	$('#lineWidth').change(function(){app.setLineWidth($(this).val())});
	$('#color').change(function(){app.setColor($(this).val())});
	$('#lineJoin').change(function(){app.setLineJoin($(this).val())});
	$('#lineCap').change(function(){app.setLineCap($(this).val())});
	$('#fontType').change(function(){app.setFont($(this).val())});
	$('#fontSize').change(function(){app.setFontSize($(this).val())});
});
