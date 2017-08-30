
var gameProperties = {
	screenWidth: window.innerWidth -40,
	screenHeight: window.innerHeight -160,

	delayToStartLevel: 3,
};

var states = {
	game: "game",
};

var graphicAssets = {
	player: {URL:'assets/images/sold1.png', name:'player'},
	bullet: {URL:'assets/images/bullet.png', name:'bullet'},
  background: {URL: 'assets/images/background.png', name: 'background'},
	zombie: {URL:'assets/images/zomb1.png', name: 'zombie'}
};

var PlayerProperties = {
    startX: window.innerWidth * 0.5,
    startY: window.innerHeight * 0.5,
	  //  Phaser.physics.arcade.enable(this.player),
	    startingLives: 5,
	    timeToReset: 3,
	    blinkDelay: 0.2,
};

var bulletProperties = {
}

var zombieProperties = {
	startingZombies: 3,
	maxZombie: 20,
	incrementZombie: 2,
};

var fontAssets = {
	counterFontStyle: {font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

var gameState = function (game){
    this.PlayerSprite;
    this.PlayerIsInvulnerable;

    this.key_left;
    this.key_right;
    this.key_thrust;
    this.key_fire;

    this.bulletGroup;
    this.bulletInterval = 0;

    this.zombieGroup;
    this.zombiesCount= zombieProperties.startingZombie;

    this.PlayerLives = PlayerProperties.startingLives;
    this.tf_lives;

    this.score = 0;
    this.tf_score;

    this.sndDestroyed;
    this.sndFire;
};

gameState.prototype = {

    preload: function () {
      this.load.spritesheet('background', './assets/images/background.png', 662, 500, 1);
      this.load.spritesheet('player', './assets/images/sold1.png');
      this.load.spritesheet('zomb1', './assets/images/zomb1.png');
      this.load.spritesheet('bullet', './assets/images/bullet.png');
    },

    create: function () {
        this.initGraphics();
        this.initPhysics();
        this.initKeyboard();

        weapon = game.add.weapon(30, 'bullet'),
        weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

        weapon.bulletSpeed = 600;
        weapon.fireRate = 100;

        weapon.trackSprite(this.player, 0, 0, true);
    },

    update: function () {
        this.checkPlayerInput();
        this.checkBoundaries(this.PlayerSprite);
        this.bulletGroup.forEachExists(this.checkBoundaries, this);
        this.zombieGroup.forEachExists(this.checkBoundaries, this);

        game.physics.arcade.overlap(this.bulletGroup, this.zombieGroup, this.zombieCollision, null, this);
        if (!this.PlayerIsInvulnerable) {
        game.physics.arcade.overlap(this.PlayerSprite, this.zombieGroup, this.zombieCollision, null, this);
        }
    },

    initGraphics: function () {
        this.PlayerSprite = game.add.sprite(PlayerProperties.startX, PlayerProperties.startY, 'player');
        this.PlayerSprite.angle = -90;
        this.PlayerSprite.anchor.set(0.5, 0.5);

        this.bulletGroup = game.add.group();
        this.zombieGroup = game.add.group();

        this.tf_lives = game.add.text(20, 10, PlayerProperties.startingLives, fontAssets.counterFontStyle);

        this.tf_score = game.add.text(gameProperties.screenWidth - 20, 10, "0", fontAssets.counterFontStyle);
    	this.tf_score.align - 'right';
    	this.tf_score.anchor.set(1,0);
    },

    initSounds: function () {
    	this.sndDestroyed = game.add.audio(soundAssets.destroyed.name);
    	this.sndFire = game.add.audio(soundAssets.fire.name);
    },

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.physics.enable(this.PlayerSprite, Phaser.Physics.ARCADE);
        this.PlayerSprite.body.drag.set(PlayerProperties.drag);
        this.PlayerSprite.body.maxVelocity.set(PlayerProperties.maxVelocity);
        this.zombieGroup.enableBody = true;
        this.zombieGroup.physicsBodyType = Phaser.Physics.ARCADE;
    },

    initKeyboard: function () {
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.key_up = game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.key_down = game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.key_fire = game.input.activePointer.isDown;
    },
      console.log('movin' + game)
    checkPlayerInput: function () {
        if (this.key_left.isDown) {
            this.PlayerSprite.body.x -= 4
        }
        if (this.key_right.isDown) {
            this.PlayerSprite.body.x += 4
        }
        if (this.key_up){
            this.PlayerSprite.body.y -= 4
        }
        if (this.key_down) {
          this.PlayerSprite.body.y += 4
        }
        if (this.key_fire.isDown) {
            weapon.fire();
        }
    },

    checkBoundaries: function (sprite) {
        if (sprite.x < 0) {
            sprite.x = game.width;
        } else if (sprite.x > game.width) {
            sprite.x = 0;
        }

        if (sprite.y < 0) {
            sprite.y = game.height;
        } else if (sprite.y > game.height) {
            sprite.y = game.height;
        }
    },

    zombieCollision: function (target, zombie) {
    	this.sndDestroyed.play();

        target.kill();
        zombie.kill();

        if (target.key == graphicAssets.Player.name) {
            this.destroyPlayer();
        }

        this.updateScore(zombieProperties[zombie.key].score);

        if (!this.zombieGroup.countLiving() ) {
        	game.time.events.add(Phaser.Timer.SECOND * gameProperties.delayToStartLevel, this.nextLevel, this);
        }
    },

    destroyPlayer: function () {
        this.PlayerLives --;
        this.tf_lives.text = this.PlayerLives;

        if (this.PlayerLives) {
            game.time.events.add(Phaser.Timer.SECOND * PlayerProperties.timeToReset, this.resetShip, this);
        }
    },

    resetPlayer: function () {
        this.PlayerIsInvulnerable = true;
        this.PlayerSprite.reset(PlayerProperties.startX, PlayerProperties.startY);
        this.PlayerSprite.angle = -90;

        game.time.events.add(Phaser.Timer.SECOND * PlayerProperties.timeToReset, this.PlayerReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * PlayerProperties.blinkDelay, PlayerProperties.timeToReset / PlayerProperties.blinkDelay, this.PlayerBlink, this);
    },

    PlayerReady: function() {
    	this.PlayerIsInvulnerable = false;
    	this.PlayerSprite.visible = true;
    },

    PlayerBlink: function() {
    	this.PlayerSprite.visible = !this.PlayerSprite.visible;
    },

    updateScore: function(score){
    	this.score += score;
    	this.tf_score.text = this.score;
    },

    nextLevel: function() {
    	this.zombieGroup.removeAll(true);

    	if (this.zombiesCount < zombieProperties.maxZombie) {
    		this.zombiesCount += zombieProperties.incrementZombie;
    	}

    	this.resetZombie();
    }
};

var game = new Phaser.Game(800, 800, Phaser.AUTO);
game.state.add(states.game, gameState);
game.state.start(states.game);



//http://msrinteractive.com/blasteroids/
