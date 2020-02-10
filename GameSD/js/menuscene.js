// Phaser3 example game
// mein menu scene

var sky, space, h;
var emitter0, emitter1;
var logo;

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function MainMenu() {
            Phaser.Scene.call(this, { key: 'mainmenu' });
        },

    preload: function () {
        this.load.bitmapFont('zFont', 'img/zFont2.png', 'img/zFont2.fnt');
        this.load.spritesheet('zBackground', 'img/zBackground.png', { frameWidth: 1080, frameHeight: 540 });

        this.load.image('spark0', 'img/particles/muzzleflash2.png');
        this.load.image('spark1', 'img/particles/white.png');

    },

    create: function () {

        h = this.cameras.main.height;
        sky = new Phaser.Display.Color(243, 20, 49);
        space = new Phaser.Display.Color(0, 0, 0);

        var config = {
            key: 'zBackground',
            frames: this.anims.generateFrameNumbers('zBackground', { start: 0, end: 1080, first: 7 }),
            frameRate: 10,
            repeat: -1
        };

        this.anims.create(config);
        zBackground = this.add.sprite(375, 297, 'zBackground');
        zBackground.anims.play('zBackground');

        // add logo
        //this.sys.config.backgroundColor = '#f3cca3';
        logo = this.add.sprite(400, 130, 'sprites', 'phaser3');
        var catchPhrase = this.add.dynamicBitmapText(110, 330, 'zFont', 'SHMOOP MASTER 3000', 65);
        // this.deathZone = catchPhrase;

        // add tutorial and start button
        this.btnhelp = this.addButton(400 - 80, 450, 'sprites', this.doTutor, this, 'btn_quest_hl', 'btn_quest', 'btn_quest_hl', 'btn_quest');
        this.btnstart = this.addButton(400 + 80, 450, 'sprites', this.doStart, this, 'btn_play_hl', 'btn_play', 'btn_play_hl', 'btn_play');

        emitter0 = this.add.particles('spark0').createEmitter({
            // x: 400,
            // y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            active: false,
            quantity: { min: 1, max: 7 },
            lifespan: { min: 600, max: 1000 },
            // gravityY: 800
            // deathZone: { type: 'onEnter', source: catchPhrase }

        });

        emitter1 = this.add.particles('spark1').createEmitter({
            // x: 400,
            // y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.3, end: 0 },
            blendMode: 'SCREEN',
            active: false,
            quantity: { min: 1, max: 7 },
            lifespan: { min: 600, max: 1000 },
            // gravityY: 800
            // deathZone: { type: 'onEnter', source: catchPhrase }
        });

        console.log('create is ready');
    },

    update: function () {

        var odd = (Math.cos(this.time.now / 1000) * (h - 10)) - h;
        var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(sky, space, -h * 2, odd);
        this.cameras.main.setBackgroundColor(hexColor);

        emitter0.active = emitter1.active = true;
        emitter0.setPosition(Phaser.Math.FloatBetween(logo.x - 200, logo.x + 200), Phaser.Math.FloatBetween(logo.y - 65, logo.y + 65));
        emitter1.setPosition(Phaser.Math.FloatBetween(logo.x - 200, logo.x + 200), Phaser.Math.FloatBetween(logo.y - 65, logo.y + 65));

        emitter0.start();
        emitter1.start();

        setTimeout(function () {

            emitter0.stop();
            emitter1.stop();
        }, 100);
    },

    doTutor: function () {
        console.log('doTutor was called!');
        this.scene.start('tutorscene');
    },

    doStart: function () {
        console.log('menuscene doStart was called!');
        this.scene.start('gamescene');
    }

});
