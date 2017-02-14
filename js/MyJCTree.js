var img = new Image();
img.src = "img/avatar.png";
jc.addObject('people', { x: 0, y: 0, width: 0, height: 0, color: 'rgba(0,0,0,0)' },
	function(ctx) {
		ctx.drawImage(img, this._x, this._y, this._height, this._height);
		ctx.rect(this._x, this._y, this._width, this._height);
	}, "rect"
);

var scrollFunc = function(e) {
	var direct = 0;
	e = e || window.event;
	var scale
	if(e.wheelDelta) { //IE/Opera/Chrome
		scale = e.wheelDelta == 120 ? 1.1 : 0.9;
	} else if(e.detail) { //Firefox
		scale = e.detail == -3 ? 1.1 : 0.9;
	}
	var bodyLayer = jc.layer("body");

	var rect = this.getBoundingClientRect();
	var mouseX = e.clientX - rect.left; //获取鼠标在canvsa中的坐标
	var mouseY = e.clientY - rect.top;

	bodyLayer.scale(scale, scale);

	var bodyLayerCenter = bodyLayer.getCenter();
	bodyLayer.translate(canvas.width / 2 - bodyLayerCenter.x, canvas.height / 2 - bodyLayerCenter.y);
}
/*注册事件*/
if(canvas.addEventListener) {
	canvas.addEventListener('DOMMouseScroll', scrollFunc, false);
} //W3C

canvas.onmousewheel = scrollFunc; //IE/Opera/Chrome/Safari

function drawCanvasBackground() {
	// 绘制背景
	jc.rect(0, 0, canvas.width, canvas.height, "#efefef", true).id("canvasBackground").layer("canvasBackground");
	/*----------------画布拖拽------------------*/
	var isMove;
	var moveStartX;
	var moveStartY;

	jc.layer("canvasBackground").mouseover(function(e) {
		$("#canvas").css("cursor", "move");
		isMove = false;
	});

	jc.layer("canvasBackground").mouseout(function(e) {
		isMove = false;
	});

	jc.layer("canvasBackground").mousemove(function(e) {
		if(isMove) {
			var bodyRect = jc.layer("body").getRect();
			var translateX = e.x - moveStartX;
			var translateY = e.y - moveStartY;
			var isCanTranslateX = false;
			var isCanTranslateY = false;
			jc.layer("body").translate(translateX, translateY);
			moveStartX += translateX;
			moveStartY += translateY;
		}
	});

	jc.layer("canvasBackground").mousedown(function(e) {
		isMove = true;
		moveStartX = e.x;
		moveStartY = e.y;
	});

	jc.layer("canvasBackground").mouseup(function(e) {
		isMove = false;
	});
}

function drawBoss(boss) {
	jc.people(boss.x, boss.y, boss.width, boss.height, '#F00').id(boss.id).click(function() {
		console.log(this.id());
	}).layer("body");
	// TODO 绘出父辈
	drawElder(boss);
}

function draw(d) {
	if(d.elder != null && d.elder.length > 0)
		drawElder(d);
	if(d.children != null && d.children.length > 0)
		drawChildren(d);
	if(d.companion != null && d.companion.length > 0)
		drawCompanion(d);
}

function drawElder(d) {
	for(var i = 0; i < d.elder.length; i++) {
		jc.line([
			[d.x + d.width / 2, d.y],
			[d.x + d.width / 2, d.y - 20],
			[d.elder[i].x + d.elder[i].width / 2, d.y - 20],
			[d.elder[i].x + d.elder[i].width / 2, d.elder[i].y + d.elder[i].height]
		]).layer("body");

		jc.people(d.elder[i].x, d.elder[i].y, d.elder[i].width, d.elder[i].height, '#35b2fb').id(d.elder[i].id).click(function() {
			console.log(this);
		}).layer("body");

		draw(d.elder[i]);
	}
}

function drawChildren(d) {
	var maxWidth = getMaxWidth(d);
	var beforeCompanionNum = 0;
	for(var i = 0; i < d.children.length; i++) {
		var peopleX = 0;
		var peopleY = 0;
		if(d.children[i].companion != null && d.children[i].companion.length > 0) {
			beforeCompanionNum += d.children[i].companion.length;
		}
		peopleX = (beforeCompanionNum + i) * 200;
		console.log(d.id + ":" + beforeCompanionNum);

		jc.line([
			[d.x + d.width / 2, d.y + d.height],
			[d.x + d.width / 2, d.y + d.height + 20],
			[(canvas.width - maxWidth) / 2 + peopleX + d.children[i].width / 2, d.y + d.height + 20],
			[(canvas.width - maxWidth) / 2 + peopleX + d.children[i].width / 2, d.children[i].y]
		]).layer("body");

		jc.people((canvas.width - maxWidth) / 2 + peopleX, d.children[i].y, d.children[i].width, d.children[i].height, '#883336').id(d.children[i].id).click(function() {
			console.log(this);
		}).layer("body");

		d.children[i].x = peopleX;
		draw(d.children[i]);
	}
}

function drawCompanion(d) {
	for(var i = 0; i < d.companion.length; i++) {
		// TODO d.x - (i + 1) * 200
		jc.line([
			[i > 0 ? (i + 1) * 200 : d.x, d.y + d.height / 2],
			[i > 0 ? (i + 1) * 200 - 20 : d.x - 20, d.companion[i].y + d.companion[i].height / 2]
		]).layer("body");

		var peopleX = d.x - (i + 1) * 200;
		console.log(peopleX);

		jc.people(peopleX, d.companion[i].y, d.companion[i].width, d.companion[i].height, '#9911CC').id(d.companion[i].id).click(function() {
			console.log(this);
		}).layer("body");

		//		draw(d.companion[i]);
	}
}

function drawToolBar() {
	var img = new Image();
	img.src = "img/reset.png";
	img.onload = function() {
		jc.image(img, canvas.width - 20 - 40, 20, 30, 30).id("reset").mouseover(function(e) {
			$("#canvas").css("cursor", "pointer");
		}).layer("toolBar");
	};
}

// 绘制元素
drawCanvasBackground();
drawBoss(option);
draw(option);
drawToolBar();

function getMaxWidth(d) {
	var elderNum = 0;
	if(d.elder != null && d.elder.length > 0) {
		elderNum += d.elder.length;
		for(var i = 0; i < d.elder.length; i++) {
			if(d.elder[i].companion != null && d.elder[i].companion.length > 0) {
				elderNum += d.elder[i].companion.length;
			}
		}
	}

	var childrenNum = 0;
	if(d.children != null && d.children.length > 0) {
		childrenNum += d.children.length;
		for(var i = 0; i < d.children.length; i++) {
			if(d.children[i].companion != null && d.children[i].companion.length > 0) {
				childrenNum += d.children[i].companion.length;
			}
		}
	}
	return(childrenNum >= elderNum ? childrenNum : elderNum) * 200;
}

jc.layer("body").mouseover(function(e) {
	$("#canvas").css("cursor", "default");
});