var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var game = require('./game');

app.set('port', (process.env.PORT || 8090));
app.use(express.static(__dirname + '/public'));

app.get('/games/1', function (req, res) {
  res.sendFile('public/main.html', {root: __dirname });  
});
app.get('/games/2', function (req, res) {
  res.sendFile('public/main.html', {root: __dirname });
});

http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    //console.log('user disconnected');
  });

  socket.on('register', function(id){
  	var gameturn = false;
    if(id == 1){
    	game.player1 = socket.id;    	
    }
	if(id == 2){
    	game.player2 = socket.id;
    }
    if(game.turn == id){
    	gameturn = true;
    }
    io.to(socket.id).emit('game', {
    	turn: gameturn
    });
  });

  socket.on('play', function(id){
  	if(game.turn == 1){
    	if(game.player1 != socket.id){
    		return;
    	}
    	else {
    		var player = 1;
    	}
    }
	if(game.turn == 2){
    	if(game.player2 != socket.id){
    		return;
    	}
    	else {
    		var player = 2;
       	}
    }
    var add = game.add(id, player);
    if(add.valid){
    	io.to(game.player1).emit('board', game.board);
    	io.to(game.player2).emit('board', game.board);
    	if(game.turn == 1){
    		game.turn = 2;
    		io.to(game.player2).emit('game', {
		    	turn: true
		    });
		    io.to(game.player1).emit('game', {
		    	turn: false
		    });
    	}
    	else {
    		game.turn = 1;
    		io.to(game.player1).emit('game', {
		    	turn: true
		    });
		    io.to(game.player2).emit('game', {
		    	turn: false
		    });
    	}
    	if(add.winner){
    		game.newgame();
    		io.to(game.player1).emit('winner', {player: player,
    											board: game.board,
    											game: {turn: true}});
	    	io.to(game.player2).emit('winner', {player: player,
    											board: game.board,
    											game: {turn: false}});	    	
    	}    	
    }
  });  

  //io.to(socket.id).emit('console', 'connected');
  io.to(socket.id).emit('board', game.board);
});

