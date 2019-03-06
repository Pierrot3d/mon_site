var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var cellsNo = 20;
var cellSize = 400 / cellsNo;
var difficulty = 1;

var score = 0;

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var btnStart = document.querySelector('.btn-start');
var btnPause = document.querySelector('.btn-pause');
var scoreVal = document.querySelector('.score_val');


var direction = void 0;
var DIR = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40


	// ctx.strokeStyle = '#616161'
};ctx.strokeStyle = '#27373F';
ctx.fillStyle = '#fff';

var snake = [];
var food = null;
var paused = false;
var needsGrowth = false;

var lastUpdate = void 0,lastFood = void 0,tick = void 0;
var state = void 0;
var flash = false;
var lastKeyPressed = void 0;

function update() {
	tick = Date.now();


	if (hasCollisions()) {
		flash = true;
		return;
	}

	if (tick - lastUpdate > 500 / difficulty) {
		if (lastKeyPressed && lastKeyPressed !== direction) {
			setDirection(lastKeyPressed);
		}

		moveSnake();
		lastUpdate = tick;
	}

	if (tick - lastFood > foodTreshold()) {
		putFood();
	}

	if (headMeetsFood()) {
		needsGrowth = true;
		food = null;
		putFood();
		setScore(score + difficulty);
	}
}

function foodTreshold() {
	return 5000 / difficulty * cellsNo;
}

function hasCollisions() {
	var head = snake[0];
	var check = snake.concat([]);
	check.shift();
	return check.find(
	function (c) {return c.x === head.x && c.y === head.y;});

}

function snakeContains(cell) {
	return snake.find(function (c) {return c.x === cell.x && c.y === cell.y;});
}

function headMeetsFood() {
	var head = snake[0];
	return food && head.x == food.x && head.y === food.y;
}

function moveSnake() {
	var head = snake[0];
	var next = Object.assign({}, head);

	switch (direction) {
		case DIR.LEFT:
			--next.x;
			break;
		case DIR.UP:
			--next.y;
			break;
		case DIR.RIGHT:
			++next.x;
			break;
		case DIR.DOWN:
			++next.y;
			break;}


	if (next.x >= cellsNo) next.x = 0;
	if (next.y >= cellsNo) next.y = 0;
	if (next.x < 0) next.x = cellsNo - 1;
	if (next.y < 0) next.y = cellsNo - 1;

	if (!needsGrowth) {
		snake.pop();
	}

	needsGrowth = false;
	snake.unshift(next);
}

function putFood() {
	do {
		food = {
			x: ~~(Math.random() * (cellsNo - 1)),
			y: ~~(Math.random() * (cellsNo - 1)) };

	} while (snakeContains(food));

	lastFood = tick;
}

function draw() {
	ctx.clearRect(0, 0, 400, 400);
	drawCells();
	drawFood();
	if (flash && ~~(Date.now() / 100) % 2 === 0) {
		return;
	}
	drawSnake();
}

function drawCells() {
	for (var i = 0; i < cellsNo; ++i) {
		for (var j = 0; j < cellsNo; ++j) {
			drawCell(i, j);}}
}

function drawFood() {
	if (food) {
		ctx.fillStyle = '#4FC3F7';
		fillCell(food.x, food.y);
		ctx.fillStyle = '#fff';
	}
}

function drawCell(i, j) {
	ctx.strokeRect(
	i * cellSize,
	j * cellSize,
	cellSize, cellSize);

}

function drawSnake() {
	snake.forEach(
	function (_ref) {var x = _ref.x,y = _ref.y;return fillCell(x, y);});

}

function fillCell(x, y) {
	ctx.beginPath();
	ctx.rect(
	x * cellSize,
	y * cellSize,
	cellSize, cellSize);


	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}

function setScore(next) {
	score = next;
	scoreVal.textContent = score;
}

function startGame() {
	btnStart.textContent = 'restart';
	flash = false;
	lastKeyPressed = null;
	food = null;
	setScore(0);
	direction = DIR.LEFT;
	lastFood = lastUpdate = Date.now();
	paused = false;
	setTimeout(putFood, 1000);
	var startX = cellsNo / 2;
	snake = [startX, startX + 1, startX + 2, startX + 3].map(
	function (x) {return { x: x, y: 15 };});

}

function loop() {
	requestAnimationFrame(loop);
	draw();

	if (paused) return;
	update();
}

requestAnimationFrame(loop);

btnStart.addEventListener('click', startGame);
btnPause.addEventListener('click', pause);

function pause() {
	paused = !paused;
	btnPause.textContent = paused ? 'resume' : 'pause';
}

window.addEventListener('keydown', onKeyDown);
function onKeyDown(_ref2) {var keyCode = _ref2.keyCode;
	switch (true) {
		case keyCode === DIR.DOWN && direction === DIR.UP:
		case keyCode === DIR.UP && direction === DIR.DOWN:
		case keyCode === DIR.LEFT && direction === DIR.RIGHT:
		case keyCode === DIR.RIGHT && direction === DIR.LEFT:
			return;}


	lastKeyPressed = keyCode;
}

function setDirection(keyCode) {
	direction = keyCode;
}

function checkFood() {
	if (!food) return;

	if (food.x >= cellsNo) {
		food.x = cellsNo - 1;
	}

	if (food.y >= cellsNo) {
		food.y = cellsNo - 1;
	}
}var

RangeSlider = function () {
	function RangeSlider(el, cb) {var _this = this;_classCallCheck(this, RangeSlider);
		this.input = el.querySelector('input');
		this.slider = el.querySelector('.range_inputSlider');
		this.value = el.querySelector('.range_inputValue');

		this.input.addEventListener('input', function (_) {return _this.onChange();});
		this.input.addEventListener('keydown', function (e) {
			e.preventDefault();
		});

		this.onChangeCallback = cb;
		this.onChange();
	}_createClass(RangeSlider, [{ key: 'onChange', value: function onChange()

		{
			this.value.textContent = this.input.value;
			this.slider.style.transform = 'scaleX(' + this.input.value / this.input.step / 10 + ')';
			this.onChangeCallback(this.input.value);
		} }]);return RangeSlider;}();



new RangeSlider(
document.querySelector('.range-difficulty'),
function (value) {return difficulty = Number(value);});


new RangeSlider(
document.querySelector('.range-columns'),
function (value) {
	cellsNo = Number(value);
	cellSize = 400 / cellsNo;
	checkFood();
});



// --- TOUCH CONTROLS
var isPointerDown, pointerStart, pointerPos;

function onTouchStart(e) {var _e$touches$ =
	e.touches[0],clientX = _e$touches$.clientX,clientY = _e$touches$.clientY;
	isPointerDown = true;
	pointerStart = { x: clientX, y: clientY };
	pointerPos = Object.assign({}, pointerStart);
}

function onTouchMove(e) {var _e$touches$2 =
	e.touches[0],clientX = _e$touches$2.clientX,clientY = _e$touches$2.clientY;
	pointerPos = { x: clientX, y: clientY };
}

function onTouchEnd() {
	if (!isPointerDown) return;
	isPointerDown = false;

	var deltaX = pointerStart.x - pointerPos.x;
	var deltaY = pointerStart.y - pointerPos.y;
	var keyCode = touchToKeyCode(deltaX, deltaY);

	if (keyCode) onKeyDown({ keyCode: keyCode });
}

function touchToKeyCode(x, y) {
	if (Math.abs(x) > Math.abs(y)) {
		if (x < -1) {
			keyCode = DIR.RIGHT;
		} else if (x > 1) {
			keyCode = DIR.LEFT;
		}
	} else {
		if (y < -1) {
			keyCode = DIR.DOWN;
		} else if (y > 1) {
			keyCode = DIR.UP;
		}
	}

	return keyCode;
}


canvas.addEventListener('touchstart', onTouchStart);
window.addEventListener('touchmove', onTouchMove);
window.addEventListener('touchend', onTouchEnd);