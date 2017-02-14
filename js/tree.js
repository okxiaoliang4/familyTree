var allPeople = [];
var zoom = 1;

canvas.getMouseCoordinate = function(c, e) {
	var e = window.event || e
	var rect = c.getBoundingClientRect();
	var mouse = {
		mouseX: e.clientX - rect.left,
		mouseY: e.clientY - rect.top
	};
	return mouse;
}

canvas.onmousedown = function(e) {
	var mouse = this.getMouseCoordinate(this, e);
	for(var i = 0; i < allPeople.length; i++) {
		if(mouse.mouseX >= allPeople[i].x &&
			mouse.mouseX <= allPeople[i].x + allPeople[i].width &&
			mouse.mouseY >= allPeople[i].y &&
			mouse.mouseY <= allPeople[i].y + allPeople[i].height) {
			console.log(allPeople[i]);
		}
	}
}

canvas.onmousemove = function(e) {
	var mouse = this.getMouseCoordinate(this, e);

}

canvas.onmouseup = function(e) {
	var mouse = this.getMouseCoordinate(this, e);
}

canvas.onmousewheel = function(e) {
	if(e.deltaY == -100) {
		ctx.scale(1.1, 1.1);
	} else {
		ctx.scale(0.9, 0.9);
	}
	ctx.translate(0, 0);
	canvas.clear();
	// TODO 缩放线条bug是因为重绘的时候画多了
	drawBoss(option);
	draw(option);
}

canvas.clear = function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	console.log()
	allPeople = [];
}

function drawBoss(boss) {
	ctx.fillStyle = boss.color;
	ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
	// TODO 绘出父辈
	allPeople[allPeople.length] = boss;
}

function draw(d) {
	if(d.children.length > 0) {
		drawChildren(d);
	}
	if(d.siblings.length > 0) {
		drawSiblings(d);
	}
}

function drawChildren(d) {
	for(var i = 0; i < d.children.length; i++) {
		ctx.fillStyle = d.children[i].color;
		ctx.fillRect(d.children[i].x, d.children[i].y, d.children[i].width, d.children[i].height);

		ctx.strokeStyle = "#000000";
		ctx.moveTo(d.x + d.width / 2, d.y + d.height);
		ctx.lineTo(d.x + d.width / 2, d.y + d.height + 20);
		ctx.lineTo(d.children[i].x + d.children[i].width / 2, d.y + d.height + 20);
		ctx.lineTo(d.children[i].x + d.children[i].width / 2, d.children[i].y);
		ctx.lineWidth = 1;
		ctx.stroke();

		allPeople[allPeople.length] = d.children[i];
		draw(d.children[i]);
	}
}

function drawSiblings(d) {
	for(var i = 0; i < d.siblings.length; i++) {
		ctx.fillStyle = d.siblings[i].color;
		ctx.fillRect(d.siblings[i].x, d.siblings[i].y, d.siblings[i].width, d.siblings[i].height);

		ctx.strokeStyle = "#000000";
		ctx.moveTo(d.x > d.siblings[i].x ? d.x : d.x + d.width, d.y + d.height / 2);
		ctx.lineTo(d.x > d.siblings[i].x ? d.siblings[i].x + d.siblings[i].width : d.siblings[i].x, d.siblings[i].y + d.siblings[i].height / 2);
		ctx.stroke();

		allPeople[allPeople.length] = d.children[i];
		draw(d.siblings[i]);
	}
}

drawBoss(option);
draw(option);