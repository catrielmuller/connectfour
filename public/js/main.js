var app = {};
app.config = {
	downscale: 2,
	shininess: 50, 
    specular: 0x666666, 
    bumpScale: 1,
    color1: 0xFF0000,
    color2: 0x00FF00,
    colorb: 0xCCCCCC,
};
app.youturn = false;
app.player = 1;
app.isregister = false;

app.loadClickers = function(){
	var geometry = new THREE.BoxGeometry( 1400, 100, 1200);
	app.board = new THREE.Mesh( geometry, app.material3 );
	app.board.position.z = -100;
	app.board.position.y = -100;
	app.scene.add( app.board );

};

app.loadObjects = function(board){
	app.board = board;

	for ( var i = 0, l = app.objects.length; i < l; i ++ ) {
		var object = app.objects[ i ];
		app.scene.remove( object );
	}

	geometry = new THREE.SphereGeometry( 70, 32, 16 );

	var i = 0;
	for (var x = 5; x >= 0; x--) {
		for (var z = 0; z <= 6; z++) {
			if(board[x][z] != 0){
				if(board[x][z] == 1){
					var material = app.material1;
				}
				else {
					var material = app.material2;
				}
				sphere = new THREE.Mesh( geometry, material );
				sphere.position.x = ( i % 7 ) * 200 - 600;
				sphere.position.z = Math.floor( i / 7 ) * 200 - 600;
				app.scene.add( sphere );
				app.objects.push(sphere);
			}
			i++;
		}
	}

	if(!app.isregister){
		app.register();
	}
	
};

app.register = function(){
	app.socket.emit('register', app.player);
};

app.checkturn = function(){
	if(app.youturn){
		app.msg("Chose a Column");		
	}
	else {
		app.msg("Waiting for the other player");
	}
};

app.msg = function(msg){
	var msgdiv = document.getElementById("msg");
	msgdiv.innerHTML = msg;
};

app.setPlayer = function(id){
	var playerdiv = document.getElementById("player");
	playerdiv.innerHTML = "Player " + id;
};

app.init = function(){

	var url = document.URL.split("/");
	var player = url[url.length - 1];
	if(player == 2){
		app.player = 2;
	}
	else {
		app.player = 1;	
	}
	app.setPlayer(app.player);

	app.objects = [];
	app.scene = new THREE.Scene();
	app.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.25, 3000 );
	app.camera.position.set( 0, 1500, 900 );

	app.renderer = new THREE.WebGLRenderer();
	app.renderer.setPixelRatio( window.devicePixelRatio );
	app.renderer.setSize( window.innerWidth / app.config.downscale , window.innerHeight / app.config.downscale);
	app.renderer.setClearColor( 0x0a0a0a );
	app.renderer.sortObjects = true;
	app.renderer.gammaInput = true;
	app.renderer.gammaOutput = true;

	app.maindiv = document.getElementById("main");
	app.maindiv.appendChild( app.renderer.domElement );

	app.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	app.directionalLight.position.set( 1, 1, 1 ).normalize();
	app.scene.add( app.directionalLight );
    app.scene.add( new THREE.AmbientLight( 0x777777 ) );
	app.particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
	//app.scene.add( app.particleLight );


    app.moonTexture = THREE.ImageUtils.loadTexture( "/textures/main.jpg" );
    app.moonTexture.wrapS = app.moonTexture.wrapT = THREE.RepeatWrapping;
    app.moonTexture.anisotropy = 16;

    app.material1 = new THREE.MeshPhongMaterial( { map: app.moonTexture, 
    											   bumpMap: app.moonTexture, 
    											   bumpScale: app.config.bumpScale,
    											   color: app.config.color1, 
    											   specular: app.config.specular, 
    											   shininess: app.config.shininess, 
    											   metal: true, 
    											   shading: THREE.SmoothShading } );

     app.material2 = new THREE.MeshPhongMaterial( { map: app.moonTexture, 
    											   bumpMap: app.moonTexture, 
    											   bumpScale: app.config.bumpScale,
    											   color: app.config.color2, 
    											   specular: app.config.specular, 
    											   shininess: app.config.shininess, 
    											   metal: true, 
    											   shading: THREE.SmoothShading } );

     app.material3 = new THREE.MeshPhongMaterial( { map: app.moonTexture, 
    											   bumpMap: app.moonTexture, 
    											   bumpScale: app.config.bumpScale,
    											   color: app.config.colorb, 
    											   specular: app.config.specular, 
    											   shininess: app.config.shininess, 
    											   metal: true, 
    											   shading: THREE.SmoothShading } ); 

    app.loadClickers();
    app.initSocket();
	app.render();
};

app.loadGame = function(game) {
	app.isregister = true;
	app.youturn = game.turn;
	app.checkturn();	
};

app.click = function(id){
	if(app.youturn){
		if(app.checkplay(id)) {
			app.socket.emit('play', id);	
		}
		else {
			id = id + 1;
			app.msg("The Column " + id + " is full");
		}		
	}
};

app.checkplay = function(id){
	var valid = false;
	for (var x = 5; x >= 0; x--) {
		if(app.board[x][id] == 0){
			valid = true;
		}
	}
	return valid;
};

app.initSocket = function(){
	app.msg("Waiting Server");
	app.socket = io();

	app.socket.on('console', function(msg){
    	console.log(msg);
  	});

  	app.socket.on('board', function(board){
  		app.msg("Load Board");
  		app.loadObjects(board);
  	});

  	app.socket.on('game', function(game){
  		app.loadGame(game);
  	});

  	app.socket.on('winner', function(obj){
  		console.log(obj);
  		app.msg("THE PLAYER " + obj.player + "WIN!");
  		setTimeout(function(){
  			app.loadObjects(obj.board);
  			app.loadGame(obj.game);
  		}, 2000);
  	});
};

app.render = function() {
	requestAnimationFrame( app.render );

	
	//app.camera.position.x = Math.cos( timer ) * 1500;
	//app.camera.position.z = Math.sin( timer ) * 1500;
	app.camera.lookAt( app.scene.position );

	for ( var i = 0, l = app.objects.length; i < l; i ++ ) {
		var object = app.objects[ i ];
		object.rotation.y += 0.005;
	}

	//app.particleLight.position.x = Math.sin( timer * 7 ) * 300;
	//app.particleLight.position.y = Math.cos( timer * 5 ) * 400;
	//app.particleLight.position.z = Math.cos( timer * 3 ) * 300;

	app.renderer.render( app.scene, app.camera );
};

document.addEventListener("DOMContentLoaded", function(event) { 
  app.init();
});