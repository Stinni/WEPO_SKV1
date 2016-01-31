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
		var startPos      = self.getEventPoint(e);
		var shape         = self.shapeFactory();
		shape.pos         = startPos;
		shape.color       = self.color;
		shape.lineWidth   = self.lineWidth;
		shape.lineJoin    = self.lineJoin;
		shape.lineCap     = self.lineCap;

		shape.startDrawing(startPos,self.canvasContext);
		startPos.log('drawing start');

		var drawing = function(e) {
			if(!self.isTextbox) {
				var pos = self.getEventPoint(e);
				
				shape.drawing(pos,self.canvasContext);

				self.redraw();
				shape.draw(self.canvasContext);
			}
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
			var x = pos.x + $("#canvas").position().left;
			var y = pos.y + $("#canvas").position().top;
			var textBox = document.getElementById("textInput");
			textBox.style.display = 'flex';
			$('#textInput').css({position:'absolute', 'left': x, 'top': y}).focus();
		}
		else if(self.shapeFactory != null) {
			self.drawingStart(e);
		}//textAreaContainer"></div> <textarea id="textInput" hidden></textarea>

		self.redraw();
	}

	self.saveTextInput = function() {
		self.canvasOffset = new Point(self.canvas.offset().left, self.canvas.offset().top);
		var startPos      = self.getEventPoint(e);
		var shape         = self.shapeFactory();
		shape.pos         = startPos;
		shape.color       = self.color;
		shape.font        = self.font;
		shape.theText     = $('#textInput').val();

		if(shape.shouldBeAdded()) {
			self.shapes.push(shape);
			self.shapesUndone = [];
			self.wasCleared = 0;
			shape.added(self.canvasContext);
		}

		shape.startDrawing(startPos,self.canvasContext);
		startPos.log('drawing start');

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
		var fontArgs = self.font.split(' ');
		self.font = fontArgs[0] + ' ' + font;
	}

	self.setTextSize = function(size) {
		var fontArgs = self.font.split(' ');
		self.font = size + ' ' + fontArgs[1];
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
		self.shapes = [];
		self.shapesUndone = [];
		self.wasCleared = 0;
		self.isTextbox = false;
		
		// Set defaults
		self.color     = '#000000';
		self.lineWidth = 1;
		self.lineJoin  = "miter";
		self.lineCap   = "butt";
		self.font      = '12pt Calibri';
	}
	
	self.init();
}

var app = null;
$(function() {
	// Wire up events
	app = new App('#canvas');
	$( "#tabs" ).tabs();
	$('#penbutton').click(function(){app.shapeFactory = function() {
		return new Pen();
		app.isTextbox = false;
	};});
	$('#squarebutton').click(function(){app.shapeFactory = function() {
		return new Square();
		app.isTextbox = false;
	};});
	$('#linebutton').click(function(){app.shapeFactory = function() {
		return new Line();
		app.isTextbox = false;
	};});
	$('#circlebutton').click(function(){app.shapeFactory = function() {
		return new Circle();
		app.isTextbox = false;
	};});
	$('#textbutton').click(function(){app.shapeFactory = function() {
		return new TextBox();};
		app.isTextbox = true;
	});
	$('#textInput').onfocusout(function(){
		app.saveTextInput();
		$('#textInput').hide().clear();
	});
	$('#clearbutton').click(function(){app.clearCanvas()});
	$('#undobutton').click(function(){app.undo()});
	$('#redobutton').click(function(){app.redo()});
	$('#lineWidth').change(function(){app.setLineWidth($(this).val())});
	$('#color').change(function(){app.setColor($(this).val())});
	$('#lineJoin').change(function(){app.setLineJoin($(this).val())});
	$('#lineCap').change(function(){app.setLineCap($(this).val())});
});
