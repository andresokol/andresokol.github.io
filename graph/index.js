function max(a, b) { return (a > b ? a : b) };
function min(a, b) { return (a < b ? a : b) };

var canvas = document.getElementById('graph'),
	context = canvas.getContext('2d'),
	graph = [[false, true,  true,  true], 
			 [true,  false, false, true],
			 [true,  false, false, false],
			 [true,  true,  false, false]],
	pos = [],
	glen = graph.length,
	rad = 50,
	movement = 0,
	const1 = 5 * 1e4,
	const2 = 0.05,
	const3 = 100;
	eps = 1e-3,
	fps = 20;
		
var drawPoint = function(x, y) {
	context.beginPath();
	context.arc(x, y, 4, 0, 2 * Math.PI, false);
	context.fillStyle = 'black';
	context.fill();	
};
		
var drawLine = function(x1, y1, x2, y2) {
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.strokeStyle = 'gray';
	context.stroke();
};
		
var getX = function(i) {
	return rad * Math.cos(2 * Math.PI / glen * i) + canvas.width / 2 + Math.random() - 0.5;
}
		
var getY = function(i) {
	return rad * Math.sin(2 * Math.PI / glen * i) + canvas.height / 2 + Math.random() - 0.5;
}
		
var handleForces = function(p) {
	var forceX = 0, forceY = 0;
	for(var i = 0; i < glen; i++)
		if(i != p) {
			dist = Math.sqrt((pos[i][0] - pos[p][0]) * (pos[i][0] - pos[p][0]) +
						  (pos[i][1] - pos[p][1]) * (pos[i][1] - pos[p][1]));
			force = const1 / dist / dist;
			if(graph[i][p]) force -= const2 * (dist - const3);
			forceX -= force * (pos[i][0] - pos[p][0]) / dist;
			forceY -= force * (pos[i][1] - pos[p][1]) / dist;
		}
	movement += Math.abs(forceX) + Math.abs(forceY);
	pos[p][0] += forceX;
	pos[p][1] += forceY;
}

var render = function() {
	context.clearRect (0, 0, canvas.width, canvas.height);
	for(var i = 0; i < glen; i++)
		for(var j = i + 1; j < glen; j++)
			if(graph[i][j]) drawLine(pos[i][0], pos[i][1], pos[j][0], pos[j][1]);
	
	for(var i = 0; i < glen; i++)
		drawPoint(pos[i][0], pos[i][1]);
}

var count = function() {
	movement = 0;
	for(var i = 0; i < glen; i++)
		handleForces(i);
	return (2 * glen * eps < movement);
}

var draw = function() {
	var midx = 0,
		midy = 0;
	
	console.log(count());
	
	for(var i = 0; i < glen; i++) {
		midx += pos[i][0];
		midy += pos[i][1];
	}
		
	midx = canvas.width  / 2 - midx / glen;
	midy = canvas.height / 2 - midy / glen;
	
	for(var i = 0; i < glen; i++) {
		pos[i][0] += midx;
		pos[i][1] += midy;
	}
	
	var mix = canvas.width / 2,
		maX = canvas.width / 2,
		miy = canvas.height / 2,
		may = canvas.height / 2;
	
	for(var i = 0; i < glen; i++) {
		mix = min(mix, pos[i][0]);
		maX = max(maX, pos[i][0]);
		miy = min(miy, pos[i][1]);
		may = max(may, pos[i][1]);
	}
	
	if (maX > canvas.width || mix < 0 || may > canvas.height || miy < 0) const3 *= 0.7;
	if (maX < canvas.width * 3 / 5 || mix > canvas.width * 2 / 5 || may < canvas.height * 3 / 5 || miy > canvas.height * 3 / 5) const3 /= 0.9;
	console.log(const3);
	render();
}

var main = function() {
	for(var i = 0; i < glen; i++) pos.push([getX(i), getY(i)]);
	
	render();
	window.setInterval(draw, 1000 / fps);
	//for(var i = 0; i < 100 || t; i++) window.setTimeout(myConsole, 500);
}

var start = function() {
	var input = document.getElementById("input").value;
	input = input.split('\n');
	glen = parseInt(input[0]);
	
	graph = new Array(glen);
	for(var i = 0; i < glen; i++) {
		graph[i] = new Array(glen);
		for(var j = 0; j < glen; j++) graph[i][j] = false;
    }
	
	for(var i = 1; i < input.length; i++) {
		if(input[i] == "") break;
		var x = parseInt(input[i].split(" ")[0]),
			y = parseInt(input[i].split(" ")[1]);
		graph[x - 1][y - 1] = true;
		graph[y - 1][x - 1] = true;
	}
	
	main();
}
