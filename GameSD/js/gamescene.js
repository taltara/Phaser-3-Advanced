// Phaser3 example game
// main game scene

var startTime, endTime;

var score = 0;

var scoreText, timeText, roundText;
var roundNum = 1;

var timeDiff;
var zText, theTime;

var myCam, platforms, player;

var endGame = 0, bomb, bombs, bombsAway = 0;
var zBackground;

var stars, star, starD;

var lives = 5, hearts;
var immune = 0, difficulty;

var cursors;
var particles, zEmitter;

var zEmitter;
var zExplosion, emitter0, emitter1, emitterGold;

var doubleJ = 0, time2Double = 0, jumpTime, jumpTime2, jumpTimeLapse;

var sfxcoin, sfxbomb;
var coinsCount = 0, coins2Count = 0;



var GameScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function GameScene() {
			Phaser.Scene.call(this, { key: 'gamescene' });
		},

	preload: function () {


	},

	create: function () {

		startTime = new Date();

		this.myCam = this.cameras.main;
		this.myCam.setBounds(0, 0, 800, this.game.config.height);
		this.myCam.setBackgroundColor(0x697e96);

		this.myCam.setViewport(0, 0, 800, 600);
		this.myCam.setLerp(0.7);

		// add random coins and bombs
		// this.gameitems = this.physics.add.group();

		// for (var i = 0; i < 15; i++) {
		// 	// parameters
		// 	var x = Phaser.Math.RND.between(0, 800);
		// 	var y = Phaser.Math.RND.between(0, 600);
		// 	var objtype, newobj;

		// 	if (i == 0) {
		// 		for (var j = 0; j < Phaser.Math.RND.between(1, roundNum); j++) {

		// 			objtype = TYPE_BOMB;
		// 			newobj = new CollectObj(this, x, y, 'sprites', objtype);
		// 			this.gameitems.add(newobj);
		// 		}
		// 	}
		// 	if (Phaser.Math.RND.between(0, 10) > 8) {

		// 		objtype = TYPE_COIN_2;
		// 		coins2Count += 1;
		// 	}
		// 	else {

		// 		objtype = TYPE_COIN;
		// 		coinsCount += 1;
		// 	}

		// 	newobj = new CollectObj(this, x, y, 'sprites', objtype);
		// 	this.gameitems.add(newobj);
		// 	// console.log("KEY: " + newobj.data.texture.key)
		// 	if (objtype === TYPE_BOMB) {

		// 		newobj.setGravityY(Phaser.Math.FloatBetween(100, 700)).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)).player.setVelocityX(Phaser.Math.FloatBetween(-500, 500));;
		// 	}
		// 	else {

		// 		newobj.setGravityY(600).setBounceY(Phaser.Math.FloatBetween(0.2, 0.8)).setCollideWorldBounds(true);
		// 	}
		// 	console.log(newobj);
		// }
		// console.log(`COINS: ${coinsCount + coins2Count}`);
		// this.gameitems.active = true;


		// sound effects
		sfxcoin = this.sound.add('coin');
		sfxbomb = this.sound.add('bomb');

		var zSky = this.add.image(400, 300, 'sky');
		zSky.setScrollFactor(0);

		var mount2 = this.mountain2 = this.add.tileSprite(game.config.width / 2,
			game.config.height / 1.55,
			2048,
			770,
			'mountain2'
		);

		var mount3 = this.mountain3 = this.add.tileSprite(game.config.width / 2,
			game.config.height - 64,
			2048,
			894,
			'mountain3'
		);


		var mount1 = this.mountain1 = this.add.tileSprite(game.config.width / 2,
			game.config.height / 1.35,
			2048,
			482,
			'mountain1',
		);

		mount1.setScale(0.39);
		mount2.setScale(0.39);
		mount3.setScale(0.39);

		mount1.setScrollFactor(0);
		mount2.setScrollFactor(0);
		mount3.setScrollFactor(0);


		var aSun = this.physics.add.group({

			key: 'sun',
			gravityY: 0,
			setScale: { x: 0.3, y: 0.3 },
			setXY: { x: 0, y: 0 },

		});


		hearts = this.physics.add.group({
			key: 'heart',
			repeat: (lives - 1),
			setScale: { x: 0.35, y: 0.35 },
			gravityY: 0,
			setXY: { x: 300, y: 28, stepX: 40 }

		});

		// this.hearts.setScrollFactor(0);

		platforms = this.physics.add.staticGroup();

		platforms.create(400, 568, 'groundLong').setScale(2).refreshBody();
		platforms.create(1000, 568, 'groundLong').setScale(2).refreshBody();


		platforms.create(600, 400, 'groundLong');
		platforms.create(50, 250, 'groundLong');
		platforms.create(750, 220, 'groundLong');


		player = this.physics.add.sprite(200, 450, 'dude');

		player.setBounce(0.2);
		player.setCollideWorldBounds(true);
		player.body.setGravityY(600);

		console.log(player);


		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});


		this.physics.add.collider(player, platforms);

		let pixelSize = 35;
		scoreText = this.add.dynamicBitmapText(16, 64, 'zFont', 'Score: 0', pixelSize);
		roundText = this.add.dynamicBitmapText(16, 16, 'zFont', 'Round: 1', pixelSize);
		timeText = this.add.dynamicBitmapText(530, 16, 'zFont', 'Time: 00 m 00 s', pixelSize);

		scoreText.setScrollFactor(0), roundText.setScrollFactor(0), timeText.setScrollFactor(0);

		cursors = this.input.keyboard.createCursorKeys();

		stars = this.physics.add.group();
		for (let i = 0; i < 15; i++) {

			let r = Phaser.Math.RND.between(0, 7);
			let tempName = i < 3 ? "starDouble" : null;

			star = stars.create(Phaser.Math.FloatBetween(5, game.config.width - 5), Phaser.Math.FloatBetween(5, game.config.height - 100), tempName);
			if (i >= 3) star.play('cointurn', null, r);
			star.setGravityY(600);
			star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
			star.setData("multi", i < 3 ? 2 : 1);

		}



		this.physics.add.collider(stars, platforms);
		// this.physics.add.collider(starsDouble, platforms);
		this.physics.add.overlap(player, stars, this.collectStar, null, this);

		var button = this.add.image(800 - 16, 600 - 50, 'fullscreen', 0).setOrigin(1, 0).setScale(0.5).setInteractive();
		button.setAlpha(0.3);
		button.setScrollFactor(0);

		button.on('pointerover', function (pointer) {

			button.setAlpha(1);
		})

		button.on('pointerout', function (pointer) {

			button.setAlpha(0.3);
		})

		button.on('pointerup', function () {

			if (this.scale.isFullscreen) {
				button.setFrame(0);

				this.scale.stopFullscreen();
			}
			else {
				button.setFrame(1);

				this.scale.startFullscreen();
			}

		}, this);


		var muteButton = this.add.image(800 - 90, 600 - 33, 'muteButt', 0).setScale(0.35).setInteractive();
		muteButton.setAlpha(0.3);
		muteButton.setScrollFactor(0);
		muteButton.setTint(0x000000);

		muteButton.on('pointerover', function (pointer) {

			muteButton.setAlpha(1);
		})

		muteButton.on('pointerout', function (pointer) {

			muteButton.setAlpha(0.3);
		})

		muteButton.on('pointerup', function () {

			if (game.sound.mute) {

				game.sound.mute = false;
				muteButton.setTint(0x000000);

				// muteButton.setTint(0x00FF00);
			}
			else {

				game.sound.mute = true;
				muteButton.setTint(0xFF0000);
			}

		}, this);


		particles = this.add.particles('flares');


		zEmitter = particles.createEmitter({

			frame: ['red', 'blue', 'yellow'],
			speed: 0,
			alpha: 0.025,
			x: player.x,
			y: player.y,
			lifespan: { min: 500, max: 2000 },
			speed: { min: 150, max: 200 },
			angle: { min: 240, max: 300 },
			gravityY: -200,
			quantity: 3,
			bounce: 0.2,
			radial: true,
			// follow: player
			// scale: 0.05,
			// blendMode: 'ADD'

		});

		particles.setScale(0.05);
		// particles.follow = player;
		// zEmitter.stop();

		particles.setScrollFactor(0);

		emitter0 = this.add.particles('spark0').createEmitter({
			// x: 400,
			// y: 300,
			// quantity: ,
			speed: { min: -800, max: 800 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.5, end: 0 },
			blendMode: 'SCREEN',
			active: false,
			lifespan: 600,
			// gravityY: 800

		});

		emitter1 = this.add.particles('spark1').createEmitter({
			// x: 400,
			// y: 300,
			speed: { min: -800, max: 800 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.3, end: 0 },
			blendMode: 'SCREEN',
			active: false,
			lifespan: 300,
			// gravityY: 800
		});
		

		emitterGold = this.add.particles('spark2').createEmitter({
			// x: 400,
			// y: 300,
			speed: { min: -800, max: 800 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.5, end: 0 },
			blendMode: 'SCREEN',
			active: false,
			lifespan: 100,
			// gravityY: 800

		});


		bombs = this.physics.add.group();
		this.physics.add.collider(player, bombs, this.hitBomb, null, this);

		this.physics.add.collider(bombs, platforms);
		this.physics.add.collider(bombs, bombs);
		this.physics.add.collider(stars, platforms);
		this.physics.add.overlap(player, stars, this.collectStar, null, this);

		// quit to menu button
		var btnquit = this.addButton(25, 600 - 33, 'sprites', this.doBack, this, 'btn_close_hl', 'btn_close', 'btn_close_hl', 'btn_close');
		btnquit.setScale(0.75);
		btnquit.setAlpha(0.3);
		btnquit.setScrollFactor(0);

		btnquit.on('pointerover', function (pointer) {

			btnquit.setAlpha(1);
		})

		// making the camera follow the player
		this.myCam.startFollow(player);
	},

	update: function (time, delta) {

		this.mountain1.tilePositionX = this.myCam.scrollX * 0.7;
		this.mountain2.tilePositionX = this.myCam.scrollX * .7;
		this.mountain3.tilePositionX = this.myCam.scrollX * 0.2;

		if (!endGame) {

			this.timeEnd();
			var zeroChar = timeDiff % 60 < 10 ? "0" : "";

			// timeText = " " + Math.floor(timeDiff / 60) + "min " + zeroChar + timeDiff % 60 + "sec";
			timeText.setText(`Time: ${Math.floor(timeDiff / 60)} m ${zeroChar}${timeDiff % 60} s`);
		}

		// if (stars.countActive(true) === 0) {

		// 	roundNum += 1;
		// 	roundText.setText(`Round = ${roundNum}`);
		// }

		var tempCorrectX, tempCorrectY, veloCorrect;

		// console.log(zEmitter.getAliveParticleCount());

		if (cursors.left.isDown) {
			player.setVelocityX(-160);

			player.body.touching.down ? player.anims.play('left', true) : player.anims.play('midAirLeft', true);

			tempCorrectX = -26, tempCorrectY = -15; //-48
			// veloCorrect = { min: 25, max: 50 };

		}
		else if (cursors.right.isDown) {
			player.setVelocityX(160);

			player.body.touching.down ? player.anims.play('right', true) : player.anims.play('midAirRight', true);
			tempCorrectX = 8, tempCorrectY = -15;
			// veloCorrect = { min: -50, max: -25 };

		}
		else {
			player.setVelocityX(0);

			player.anims.play('turn');
			tempCorrectX = 3, tempCorrectY = -15;
			// veloCorrect = 0;

		}
		// zEmitter.follow = player;

		particles.x = player.x + tempCorrectX;
		particles.y = player.y + tempCorrectY;

		// particles.accelerationX = 100;

		if (cursors.up.isDown && player.body.touching.down) {

			player.setVelocityY(-330);
			jumpTime = new Date();
			time2Double = 1;


		}

		if (player.body.touching.down) jumpTimeLapse = 0;


		if (cursors.up.isDown && !(player.body.touching.down) && time2Double) {

			jumpTime2 = new Date();
			jumpTimeLapse = ((jumpTime2 - jumpTime) / 1000);

			// console.log("Jump Times = " + jumpTimeLapse);

			if (jumpTimeLapse >= 0.5) {

				player.setVelocityY(-330);

				// console.log("2nd jump");
				// console.log("doubleJ = " + doubleJ);

				time2Double = 0;
				doubleJ = 0;
			}
			doubleJ += 1;
		}

	},

	// hitBomb Function
	hitBomb: function (player, bomb) {

		sfxbomb.play();
		var tempX = Math.floor((bomb.x + player.x) / 2);
		var tempY = Math.floor((bomb.y + player.y) / 2);

		console.log("EXPLOSION: " + Math.floor(tempX) + " x " + Math.floor(tempY));

		var sparked = 0;

		if (!immune) {

			emitter0.active = emitter1.active = true;
			emitter0.setPosition(tempX, tempY);
			emitter1.setPosition(tempX, tempY);

			emitter0.start();
			emitter1.start();

			sparked = 1;
		}

		if (lives === 1) {

			if (!immune) {

				sfxbomb.play(-1);
				this.physics.pause();

				this.myCam.once('camerafadeoutcomplete', function (camera) { camera.fadeIn(5000, 255); }, this);
				this.myCam.fadeOut(1000, 255);

				setTimeout(function () {

					zScene.scene.pause();

				}, 6000);

				player.setTint(0xff0000);
				player.tintFill = true;

				player.anims.play('turn');

				gameOver = true, endGame = 1;

				zEmitter.stop();

				lives -= 1;

				hearts.clear(true);

				if (sparked) {

					setTimeout(function () {

						emitter0.stop();
						emitter1.stop();
						sfxbomb.stop();
					}, 5000);

				}
			}

		}
		else {


			if (!immune) {

				sfxbomb.play();
				immune = 1;
				player.setTint(0xff0000);

				this.myCam.once('camerafadeoutcomplete', function (camera) { camera.fadeIn(125, 255); }, this);
				this.myCam.fadeOut(125, 255);

				this.physics.pause();
				// console.log(this);
				zScene = this;

				player.tintFill = true;
				zEmitter.stop();

				setTimeout(function () { zEmitter.start(); }, 2000);

				setTimeout(function () {

					player.tintFill = false;

				}, 300);

				player.anims.play('turn');
				lives -= 1;

				hearts.clear(true);

				hearts = this.physics.add.group({
					key: 'heart',
					repeat: (lives - 1),
					setScale: { x: 0.35, y: 0.35 },
					gravityY: 0,
					setXY: { x: 300, y: 28, stepX: 40 }

				});

				setTimeout(function () {

					if (lives) player.clearTint();
					player.setTint(0x757575);
					console.log(this);

					zScene.physics.resume();
					setTimeout(function () {
						immune = 0;
						if (lives) player.clearTint();
					}, 1000);
				}, 600);

				if (sparked) {

					setTimeout(function () {

						emitter0.stop();
						emitter1.stop();
					}, 100);

				}
			}

		}

	},

	collectStar: function (player, star) {

		var tempX = Math.floor((star.x + player.x) / 2);
		var tempY = Math.floor((star.y + player.y) / 2);

		// console.log(star.getData("multi"));

		console.log("STAR: " + Math.floor(tempX) + " x " + Math.floor(tempY));

		sfxcoin.play();

		emitterGold.active = true;
		emitterGold.setPosition(tempX, tempY);
		emitterGold.start();
		setTimeout(function () {

			emitterGold.stop();
		}, 100);

		let multiTemp = star.getData("multi");

		star.disableBody(true, true);
		score += 10 * roundNum * multiTemp;

		player.setTint(0xFFD700);
		player.tintFill = true;

		setTimeout(function () {

			player.clearTint();
		}, 150);

		scoreText.setText(`Score: ${score}`);
		

		console.log("WOOHOO! + " + stars.countActive(true));
		if (stars.countActive(true) === 0) {

			// bombsAway = 1;
			this.myCam.shake(1000, 0.01, true);

			roundNum += 1;
			roundText.setText("Round: " + roundNum);

			// stars.clear(true, true);
			
			// stars = this.physics.add.group();
			for (let i = 0; i < 15; i++) {

				let r = Phaser.Math.RND.between(0, 7);
				let tempName = i < 3 ? "starDouble" : null;

				star = stars.create(Phaser.Math.FloatBetween(5, game.config.width - 5), Phaser.Math.FloatBetween(5, game.config.height - 100), tempName);
				if (i >= 3) star.play('cointurn', null, r);
				star.setGravityY(600);
				star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
				star.setData("multi", i < 3 ? 2 : 1);

			}
			this.physics.add.collider(stars, platforms);
			// this.physics.add.collider(starsDouble, platforms);
			this.physics.add.overlap(player, stars, this.collectStar, null, this);

			// var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
			difficulty = roundNum / 2;

			for (let i = 0; i < difficulty; i++) {

				var x = (player.x < 400) ? Phaser.Math.FloatBetween(400, 800) : Phaser.Math.FloatBetween(0, 400);
				bomb = bombs.create(x, 16, 'bomb');
				bomb.setBounce(1);
				bomb.setCollideWorldBounds(true);

				(difficulty % 2 && difficulty != 0) ? bomb.setGravityY(Phaser.Math.FloatBetween(0, 500)) : bomb.setGravityY(500);

				bomb.setVelocity(Phaser.Math.FloatBetween(-200, 200), 20);
				bomb.setScale(Phaser.Math.FloatBetween(0.5, 3));

			}

			// bombsAway = 0;
		}

	},

	timeEnd: function (aNum) {

		endTime = new Date();
		timeDiff = endTime - startTime;

		timeDiff /= 1000;

		timeDiff = Math.round(timeDiff);

		theTime = 'Time: ' + timeDiff;
	},

	doBack: function () {
		console.log('gamescene doBack was called!');
		this.scene.start('mainmenu');
	}

});
