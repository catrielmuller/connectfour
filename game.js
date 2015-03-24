exports.name = 'Connect Four';

exports.board = [];
for(var i=0; i<6; i++) {
    exports.board[i] = new Array(0,0,0,0,0,0,0);
}

exports.turn = 1;
exports.player1 = null;
exports.player2 = null;


exports.newgame = function () {
	for(var i=0; i<6; i++) {
		this.board[i] = new Array(0,0,0,0,0,0,0);
	}
	this.turn = 1;
};

exports.add = function(id, player){
	for (var x = 0; x <= 5; x++) {
		if(this.board[x][id] == 0){
			this.board[x][id] = player;
			var winner = this.checkWinner(x, id);			
			return {valid: true, winner: winner};
		}
	}
	return {valid: false, winner: false};
}

exports.checkWinner = function(x, y){
	var p = this.board[x][y];
	var winner = false;

	if(this.board[x-3]){
		if(this.board[x-3][y] == p && this.board[x-2][y] == p && this.board[x-1][y] == p){
			winner = true;
		}
	}
	if(this.board[x-2] && this.board[x+1]){
		if(this.board[x-2][y] == p && this.board[x-1][y] == p && this.board[x+1][y] == p){
			winner = true;
		}	
	}
	if(this.board[x-1] && this.board[x+2]){
		if(this.board[x-1][y] == p && this.board[x+1][y] == p && this.board[x+2][y] == p){
			winner = true;
		}
	}
	if(this.board[x+3]){
		if(this.board[x+1][y] == p && this.board[x+2][y] == p && this.board[x+3][y] == p){
			winner = true;
		}
	}
	if(this.board[x][y-3] == p && this.board[x][y-2] == p && this.board[x][y-1] == p){
		winner = true;
	}
	if(this.board[x][y-2] == p && this.board[x][y-1] == p && this.board[x][y+1] == p){
		winner = true;
	}
	if(this.board[x][y-1] == p && this.board[x][y+1] == p && this.board[x][y+2] == p){
		winner = true;
	}
	if(this.board[x][y+1] == p && this.board[x][y+2] == p && this.board[x][y+3] == p){
		winner = true;
	}
	if(this.board[x-3]){
		if(this.board[x-3][y-3] == p && this.board[x-2][y-2] == p && this.board[x-1][y-1] == p){
			winner = true;
		}
	}
	if(this.board[x-2] && this.board[x+1]){
		if(this.board[x-2][y-2] == p && this.board[x-1][y-1] == p && this.board[x+1][y+1] == p){
			winner = true;
		}
	}
	if(this.board[x-1] && this.board[x+2]){
		if(this.board[x-1][y-1] == p && this.board[x+1][y+1] == p && this.board[x+2][y+2] == p){
			winner = true;
		}
	}
	if(this.board[x+3]){
		if(this.board[x+1][y+1] == p && this.board[x+2][y+2] == p && this.board[x+3][y+3] == p){
			winner = true;
		}
	}
	if(this.board[x+3]){
		if(this.board[x+3][y-3] == p && this.board[x+2][y-2] == p && this.board[x+1][y-1] == p){
			winner = true;
		}
	}
	if(this.board[x-1] && this.board[x+2]){
		if(this.board[x+2][y-2] == p && this.board[x+1][y-1] == p && this.board[x-1][y+1] == p){
			winner = true;
		}
	}
	if(this.board[x-2] && this.board[x+1]){
		if(this.board[x+1][y-1] == p && this.board[x-1][y+1] == p && this.board[x-2][y+2] == p){
			winner = true;
		}
	}
	if(this.board[x-3]){
		if(this.board[x-1][y+1] == p && this.board[x-2][y+2] == p && this.board[x-3][y+3] == p){
			winner = true;
		}
	}
	return winner;

}