// Phaser3 example game
// preloader and loading bar

var Preloader = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function Preloader() {
			// note: the pack:{files[]} acts like a pre-preloader
			// this eliminates the need for an extra "boot" scene just to preload the loadingbar images
			Phaser.Scene.call(this, {
				key: 'preloader',
				pack: {
					files: [
						{ type: 'image', key: 'loadingbar_bg', url: 'img/loadingbar_bg.png' },
						{ type: 'image', key: 'loadingbar_fill', url: 'img/loadingbar_fill.png' }
					]
				}
			});
		},

	setPreloadSprite: function (sprite) {
		this.preloadSprite = { sprite: sprite, width: sprite.width, height: sprite.height };

		//sprite.crop(this.preloadSprite.rect);
		sprite.visible = true;

		// set callback for loading progress updates
		this.load.on('progress', this.onProgress, this);
		this.load.on('fileprogress', this.onFileProgress, this);
	},

	onProgress: function (value) {

		if (this.preloadSprite) {
			// calculate width based on value=0.0 .. 1.0
			var w = Math.floor(this.preloadSprite.width * value);
			console.log('onProgress: value=' + value + " w=" + w);

			// sprite.frame.width cannot be zero
			//w = (w <= 0 ? 1 : w);

			// set width of sprite			
			this.preloadSprite.sprite.frame.width = (w <= 0 ? 1 : w);
			this.preloadSprite.sprite.frame.cutWidth = w;

			// update screen
			this.preloadSprite.sprite.frame.updateUVs();
		}
	},

	onFileProgress: function (file) {
		console.log('onFileProgress: file.key=' + file.key);
	},

	preload: function () {

		this.load.scenePlugin({
			key: 'rexuiplugin',
			url: 'js/rexuiplugin.min.js',
			sceneKey: 'rexUI'
		});
		// setup the loading bar
		// note: images are available during preload because of the pack-property in the constructor
		this.loadingbar_bg = this.add.sprite(400, 300, "loadingbar_bg");
		this.loadingbar_fill = this.add.sprite(400, 300, "loadingbar_fill");
		this.setPreloadSprite(this.loadingbar_fill);

		// now load images, audio etc.
		// sprites, note: see free sprite atlas creation tool here https://www.leshylabs.com/apps/sstool/

		this.load.image('sky', 'img/skyArt.png');
		this.load.image('star', 'img/star.png');
		this.load.image('starDouble', 'img/starD.png');
		this.load.image('bomb', 'img/bomb.png');
		this.load.image('muteButt', 'img/mute.png');
		this.load.image('heart', 'img/heart2low.png');
		// this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.spritesheet('dude', 'img/zDude2.png', { frameWidth: 32, frameHeight: 67 });
		this.load.spritesheet('fullscreen', 'img/fullscreen.png', { frameWidth: 64, frameHeight: 64 });

		this.load.image('smoke', 'img/particles/smoke-puff.png');
		this.load.atlas('flares', 'img/particles/flares-smoke.png', 'img/particles/flares.json');

		this.load.atlas('sprites', 'img/spritearray.png', 'img/spritearray.json');

		this.load.image("ground", "img/ground.png");
		this.load.image("groundLong", "img/groundlong.png", { frameWidth: 400, frameHeight: 32 });

		// this.load.image('spark0', 'img/particles/blue.png');
		// this.load.image('spark1', 'img/particles/red.png');

		this.load.image('spark0', 'img/particles/muzzleflash2.png');
		this.load.image('spark1', 'img/particles/white.png');
		this.load.image('spark2', 'img/particles/yellow.png');
		this.load.image('spark3', 'img/particles/red.png');

		this.load.image('mountain1', 'img/mountain101.png');
		this.load.image('mountain2', 'img/mountain201.png');
		this.load.image('mountain3', 'img/mountain301.png');

		this.load.image('sun', 'img/sun.png');

		
		this.load.bitmapFont('fontwhite', 'img/fontwhite.png', 'img/fontwhite.xml');

		// sound effects
		this.load.audio('coin', ['snd/coin.mp3', 'snd/coin.ogg']);
		this.load.audio('bomb', ['snd/expl.mp3', 'snd/expl.ogg']);
		this.load.audio('btn', ['snd/btn.mp3', 'snd/btn.ogg']);

	},

	create: function () {
		// also create animations
		this.anims.create({
			key: 'cointurn',
			frames: [
				{ key: 'sprites', frame: 'coin1' },
				{ key: 'sprites', frame: 'coin2' },
				{ key: 'sprites', frame: 'coin3' },
				{ key: 'sprites', frame: 'coin4' },
				{ key: 'sprites', frame: 'coin5' },
				{ key: 'sprites', frame: 'coin6' },
				{ key: 'sprites', frame: 'coin7' },
				{ key: 'sprites', frame: 'coin8' }
			],
			frameRate: 15,
			repeat: -1
		});

		var slider = this.rexUI.add.slider(config);
		
		this.anims.create({
			key: 'midAirLeft',
			frames: [{ key: 'dude', frame: 1 }],
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'dude', frame: 4 }],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'midAirRight',
			frames: [{ key: 'dude', frame: 6 }],
			frameRate: 10,
			repeat: -1
		});

		console.log('Preloader scene is ready, now start the actual game and never return to this scene');

		// dispose loader bar images
		this.loadingbar_bg.destroy();
		this.loadingbar_fill.destroy();
		this.preloadSprite = null;

		// start actual game
		this.scene.start('mainmenu');
	}
});
