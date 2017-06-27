# My Tetris Clone
## [Play Now!](https://anthonyponzio1992.github.io/tetris_clone/index.html) - [Read The Code](https://github.com/anthonyponzio1992/tetris_clone/blob/master/tetris.js)
> Growing up in the age of Sega Genesis and Super Nintendo, Tetris was a game everyone in my family used to enjoy playing. I wanted to learn more about HTML5 canvas manipulation through JavaScript and I figured no better way to accomplish that than through making a loved childhood game.
---
##### I really enjoyed building this project and all the headaches I encountered along the way. All told this was a 3 day project with a lot of breaks and a lot of time spent sketching out my thoughts and ideas.
##### There where a couple sticking points that took me a while to work through, but the toughest was figuring out how to detect a finished row and sweeping it from the board and more importantly, how to detect more than one rows completion.
```javascript
	arenaSweep: function() {
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
		}
```
##### This function was the end result of a lot of trial and error. The main issue I had developing this function was handling multiple row completions, I ended up using nested for loops along with back stepping in the outermost loop to catch multi-row completions. I probably should have separated out the score increase into another function, but for now I'll leave it as is.
##### There are a lot of fun functions throughout this small game, with lots of quirky array manipulation and value swapping. I encourage you to have a read of my code, and by all means clone and make your own changes, or make your very own version of this classic game.

