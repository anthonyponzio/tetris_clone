(function() {
var tetris = {
	canvas: null,
	canvasContext: null,
	dropCounter: 0,
	dropInterval: 1000,
	lastTime: 0,
	colors: [null,'#FF0D72','#0DC2FF','#0DFF72','#F538FF','#FF8E0D','#FFE138','#3877FF'],
	player: {
		pos: {x: 0, y: 0},
		matrix: null,
		score: 0
	},
	arena: null,
	createMatrix: function(w, h){
		// this function creates a matrix of arrays filled with zeros.
		// the matrix's size is determined by the w and h args.
		// ARGUMENTS:
		// w - (typeof int) determines the length of each matrix array.
		// h - (typeof int) determines the amount of arrays created.
		var matrix = [];
		while(h--) {
			matrix.push(new Array(w).fill(0));
		}
		return matrix;
	},
	createPiece: function (shape) {
		// this function returns the tetris shapes in a matrix.
		// each shape is assigned a letter and uses a unique num value to
		// display its block color in the arena.
		// ARGUMENTS:
		// shape - (typeof string) expects any of the following letters:
		// T, O, L, J, I, S, Z
		if (shape === 'T') {
			return [
				[0,0,0],
				[1,1,1],
				[0,1,0]
			];
		} else if (shape === 'O') {
			return [
				[2,2],
				[2,2]
			];
		} else if (shape === 'L') {
			return [
				[0,3,0],
				[0,3,0],
				[0,3,3]
			];
		} else if (shape === 'J') {
			return [
				[0,4,0],
				[0,4,0],
				[4,4,0]
			];
		} else if (shape === 'I') {
			return [
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0]
			];

		} else if (shape === 'S') {
			return [
				[0,6,6],
				[6,6,0],
				[0,0,0]
			];

		} else if (shape === 'Z') {
			return [
				[7,7,0],
				[0,7,7],
				[0,0,0]
			];
		}
	},
	arenaSweep: function() {
		// this function checks to see if the user has completed the yth row.
		// If they have, then it sweeps the yth row.
		var rowCount = 1;
		outer: for(var y = this.arena.length - 1; y > 0; y--) {
			for (var x = 0; x < this.arena[y].length; x++) {
				if (this.arena[y][x] === 0) {
					continue outer;
				}
			}
			var row = new Array(12).fill(0);
			this.arena.splice(y,1);
			this.arena.unshift(row);
			this.player.score += rowCount * 10;
			rowCount *= 2;
			y++;
		}
	},
	collide: function(arena, player) {
		// this function checks the players current position and the shape the player has
		// against the arena for collision. When collision is detected the function
		// returns true, otherwise it returns false.
		// ARGUMENTS:
		// arena - (typeof array) - needed to check current state of arena matrix.
		// player - (typeof Object) - needed to check current shape and position in arena matrix.
		var shape = player.matrix;
		var playerPos = player.pos;
		for (var y = 0; y < shape.length; y++) {
			for (var x = 0; x < shape[y].length; x++) {
				if (shape[y][x] !== 0 &&
					(arena[y + playerPos.y] &&
					arena[y + playerPos.y][x + playerPos.x]) !== 0) {
					return true;
				}
			}
		}
		return false;
	},
	draw: function() {
		// this function handles the drawing of the arena and the player shapes.
		this.canvasContext.fillStyle = '#000';
		this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawMatrix(this.arena, {x:0, y:0});
		this.drawMatrix(this.player.matrix, this.player.pos);
	},
	drawMatrix: function(matrix, offset) {
		// this function iterates through a given matrix and colors the blocks as needed.
		// ARGUMENTS:
		// matrix - (typeof array) this can be a shape matrix or the arena matrix.
		// offset - (typeof int) used to determine where in the matrix to draw the colors.
		matrix.forEach(function(row, y) {
			row.forEach(function(value, x){
				if (value !== 0) {
					tetris.canvasContext.fillStyle = tetris.colors[value];
					tetris.canvasContext.fillRect(x + offset.x, y + offset.y, 1, 1);
				}
			});
		});
	},
	merge: function(arena, player) {
		// this function merges the players shape with the arena.
		// ARGUMENTS:
		// arena - (typeof array) arena matrix.
		// player - (typeof object) player object.
		player.matrix.forEach(function(row, y) {
			row.forEach(function(value, x) {
				if (value !== 0) {
					arena[y + player.pos.y][x + player.pos.x] = value;
				}
			});
		});
	},
	playerDrop: function() {
		// this function constantly drops the players shape and
		// handles merging the players shape, resetting the players
		// position and shape, updating the score, and sweeping the arena
		// when a row is completed.
		this.player.pos.y++;
		if (this.collide(this.arena, this.player)) {
			this.player.pos.y--;
			this.merge(this.arena, this.player);
			this.playerReset();
			this.arenaSweep();
			this.updateScore();
		}
		this.dropCounter = 0;
	},
	playerMove: function(dir) {
		// this function handles player movement
		// ARGUMENTS:
		// dir - (typeof int) if there is collision detected, it
		// doesn't allow player movement
		this.player.pos.x += dir;
		if (this.collide(this.arena, this.player)) {
			this.player.pos.x -= dir;
		}
	},
	playerRotate: function (dir) {
		// this function handles player shape rotation
		// ARGUMENTS:
		// dir - (typeof int) uses value if dir to determine rotation
		var posX = this.player.pos.x;
		var offset = 1;
		this.rotate(this.player.matrix, dir);
		while (this.collide(this.arena, this.player)) {
			this.player.pos.x += offset;
			offset = -(offset + (offset > 0) ? 1 : -1);
			if (offset > this.player.matrix[0].length) {
				this.rotate(this.player.matrix, -dir);
				this.player.pos.x = posX;
				return;
			}
		}
	},
	playerReset: function() {
		// this function resets the players position to the top of the arena
		// and randomly chooses a new shape.
		var shapes = 'ILJOTSZ';
		this.player.matrix = this.createPiece(shapes[shapes.length * Math.random() | 0]);
		this.player.pos.y = 0;
		this.player.pos.x = (this.arena[0].length / 2 | 0) -
							(this.player.matrix[0].length / 2 | 0);
		if (this.collide(this.arena, this.player)) {
			this.arena.forEach(function(row) { row.fill(0)});
			this.player.score = 0;
			this.updateScore();
		}
	},
	rotate: function(matrix, dir) {
		// this function rotates the players shape inside its matrix.
		// ARGUMENTS:
		// matrix - (typeof array) takes given shape matrix and rotates values accordingly
		// dir - (typeof int) takes this value to determine rotation direction
		for (var y = 0; y < matrix.length; y++) {
			for (var x = 0; x < y; x++) {
				[matrix[x][y], matrix[y][x]] = [matrix[y][x],matrix[x][y]];
			}
		}
		if (dir > 0) {
			matrix.forEach(function(row){row.reverse()});
		} else {
			matrix.reverse();
		}
	},
	update: function(time = 0) {
		// this function handles the drawing and updating of the arena canvas as well
		// as triggers the players shape drop.
		// No arguments needed.
		var deltaTime = time - tetris.lastTime;
		tetris.lastTime = time;
		tetris.dropCounter += deltaTime;
		if (tetris.dropCounter > tetris.dropInterval) {
			tetris.playerDrop();
		}
		tetris.draw();
		requestAnimationFrame(tetris.update);
	},
	updateScore: function() {
		// this function updates the score value on the page.
		document.getElementById('score').innerText = this.player.score;
	},
	bindEvents: function() {
		// this function binds all keydown events to their relevant keys.
		document.addEventListener('keydown', function(e) {
			if(event.keyCode === 37) {
				tetris.playerMove(-1);
			} else if (event.keyCode === 39) {
				tetris.playerMove(1);
			} else if (event.keyCode === 40) {
				tetris.playerDrop();
			} else if (event.keyCode === 81) {
				tetris.playerRotate(-1);
			} else if (event.keyCode === 87) {
				tetris.playerRotate(1);
			}
		});
	},
	init: function() {
		// this function calls all necessary functions when page loads.
		this.canvas = document.getElementById('tetris');
		this.canvasContext = this.canvas.getContext('2d');
		this.arena = this.createMatrix(12,20);
		this.canvasContext.scale(20,20);
		this.bindEvents();
		this.playerReset();
		this.updateScore();
		this.update();
	}
}
tetris.init();
})();
