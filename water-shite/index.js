var nDot = function(x, y, vx, vy) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	},
	Border = function(x) {
		this.x = x;
	}
	dots = [],
	borders = [];
	canvas = document.getElementById('xxx'),
	context = canvas.getContext('2d'),
	R = 5,
	Rvis = 15,
	const1 = 0.2,  // Guk coefficient
	g = 0.05,  // gravity
	const2 = 0.99,    // air stop
	left_b = 0,
	right_b = canvas.width;

function drawDot (dot) {
	context.beginPath();
	context.arc(dot.x, dot.y, Rvis, 0, 2 * Math.PI, false);
	context.fillStyle = 'black';
	context.fill();	
};

function drawBorders() {
	for(var i = 0; i < 2; i++) {
		context.beginPath();
		context.rect(borders.x - Rb, 0, borders.x + Rb, canvas.height);
		context.fillStyle = 'yellow';
		context.fill();	
	}
}

function dndCollision (i, j) {
	var dist = Math.sqrt((dots[i].x - dots[j].x) * (dots[i].x - dots[j].x) + 
						 (dots[i].y - dots[j].y) * (dots[i].y - dots[j].y));
	dots[i].vx += const1 * (2 * R - dist) * (dots[i].x - dots[j].x) / dist;
	dots[j].vx += const1 * (2 * R - dist) * (dots[j].x - dots[i].x) / dist;
	dots[i].vy += const1 * (2 * R - dist) * (dots[i].y - dots[j].y) / dist;
	dots[j].vy += const1 * (2 * R - dist) * (dots[j].y - dots[i].y) / dist;
};

function draw () {
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	borders[1].x = borders[1].x + easeAmount*(targetX - borders[1].x);
		
	if ((!dragging) && (Math.abs(borders[1].x - targetX) < 0.1) && (Math.abs(borders[1].y - targetY) < 0.1)) {
		borders[1].x = targetX;
	}
	
	for (var i = 0; i < dots.length; i++) {
		dots[i].x += dots[i].vx;
		dots[i].y += dots[i].vy;
		dots[i].vy += g;
		dots[i].vx *= const2;
		dots[i].vy *= const2;
	};
	for (var i = 0; i < dots.length; i++) {
		if(dots[i].x + R > max(borders[0].x, borders[1].x)) 
			dots[i].vx -= 2 * const1 * (R - max(borders[0].x, borders[1].x) + dots[i].x);
		else if (dots[i].x - R < min(borders[0].x, borders[1].x))
			dots[i].vx += 2 * const1 * (R - dots[i].x + min(borders[0].x, borders[1].x));
		
		if(dots[i].y + R > canvas.height) dots[i].vy -= 2 * const1 * (R - canvas.height + dots[i].y);
		else if (dots[i].y - R < 0) dots[i].vy += 2 * const1 * (R - dots[i].y);
		
		for (var j = i + 1; j < dots.length; j++) {
			if((dots[i].x - dots[j].x) * (dots[i].x - dots[j].x) + 
			   (dots[i].y - dots[j].y) * (dots[i].y - dots[j].y) < 4 * R * R) {
				dndCollision(i, j);
			};
		};
		
		drawDot(dots[i]);
		drawBorders();
	};
};

$(document).ready(function() {
	canvas.width = $(window).width() * 0.95;
	canvas.height = $(window).width() * 0.95 * 0.5;	
	
	borders = [new Border(0), new Border(canvas.width)];
	
	for(var i = 0; i < 1000; i++) {
		var t = new nDot(Math.random() * canvas.width, Math.random() * canvas.height, 
						Math.random() * 2 - 1,  Math.random() * 2 - 1);
		dots.push(t);
	}
	canvas.addEventListener("mousedown", mouseDownListener, false);
	setInterval(draw, 25);
});

function mouseDownListener(evt) {
	var i;
	
	//getting mouse position correctly 
	var bRect = canvas.getBoundingClientRect();
	mouseX = (evt.clientX - bRect.left) * (canvas.width / bRect.width);
	mouseY = (evt.clientY - bRect.top) * (canvas.height / bRect.height);
				
	/*
	Below, we find if a shape was clicked. Since a "hit" on a square or a circle has to be measured differently, the
	hit test is done using the hitTest() function associated to the type of particle. This function is an instance method
	for both the SimpleDiskParticle and SimpleSqureParticle classes we have defined with the external JavaScript sources.		
	*/
	for (i=0; i < 2; i++) {
		if (borders[i]x - Rbord < mouseX < borders[i]x + Rbord)) {	
			dragging = true;
			//the following variable will be reset if this loop repeats with another successful hit:
			dragIndex = i;
		}
	}
	
	if (dragging) {
		window.addEventListener("mousemove", mouseMoveListener, false);
		
		//place currently dragged shape on top
		borders.push(borders.splice(dragIndex,1)[0]);
		
		//shapeto drag is now last one in array
		dragHoldX = mouseX - borders[1].x;
		
		//The "target" position is where the object should be if it were to move there instantaneously. But we will
		//set up the code so that this target position is approached gradually, producing a smooth motion.
		targetX = mouseX - dragHoldX;
			
	}
	canvas.removeEventListener("mousedown", mouseDownListener, false);
	window.addEventListener("mouseup", mouseUpListener, false);

	//code below prevents the mouse down from having an effect on the main browser window:
	if (evt.preventDefault) {
		evt.preventDefault();
	} //standard
	else if (evt.returnValue) {
		evt.returnValue = false;
	} //older IE
	return false;
}

function mouseUpListener(evt) {
	canvas.addEventListener("mousedown", mouseDownListener, false);
	window.removeEventListener("mouseup", mouseUpListener, false);
	if (dragging) {
		dragging = false;
		window.removeEventListener("mousemove", mouseMoveListener, false);
	}
}

function mouseMoveListener(evt) {
	var posX;
	var posY;
	var minX = Rb;
	var maxX = canvas.width - Rb;
	var minY = Rb;
	var maxY = canvas.height - Rb;
	
	//getting mouse position correctly 
	var bRect = canvas.getBoundingClientRect();
	mouseX = (evt.clientX - bRect.left) * (canvas.width / bRect.width);
	
	posX = mouseX - dragHoldX;
	posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
	
	targetX = posX;
}
