let gameState = {

  preload: function () {
    this.load.spritesheet('background', './assets/images/background.png', 662, 500, 1);
    this.load.spritesheet('player', './assets/images/sold1.png');
    this.load.spritesheet('zomb1', './assets/images/zomb1.png');

  },


  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.enable('player', Phaser.Physics.ARCADE);
    //this background
    bg = this.game.add.tileSprite(0, 0, 1919, 1919, 'background');
    this.game.world.setBounds(0, 0, 1000, 1000);

    // bg.fixedToCamera = true;

    //this you
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
    this.physics.arcade.enable(this.player)
    this.player.collideWorldBounds = true;
    this.player.anchor.setTo(0.5, 0.5);
    this.game.camera.follow(this.player);

    //this zombie
    var zombs = game.add.group();
    for (var i = 0; i < 100; i++) {
    this.zombie = zombs.create(game.world.randomX, game.world.randomY, 'zomb1');

  };
    this.physics.arcade.enable(this.zombie)
    this.zombie.anchor.setTo(0.5, 0.5)

  },

  update: function () {

    ////////////////////////////////////// this.player.world.collideWorldBounds = true;
    this.zombie.scale.setTo(.01)
    this.player.scale.setTo(.3)
    //player movement
    if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
      // this.player.angle = -90
      this.player.x -= 4
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
      // this.player.angle = 90
      this.player.x += 4
    }
    if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
      // this.player.angle = 0
      this.player.y -= 4
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
      // this.player.angle = 0
      this.player.y += 4
    }

    // this.game.physics.arcade.angleBetween(zombie, player)

    this.player.rotation = game.physics.arcade.angleToPointer(this.player);

    if (this.player.x > 990) {
      this.player.x = 990,
      this.player.body.acceleration.x = 0;
    }

    if (this.player.x < 10) {
      this.player.x = 10,
      this.player.body.acceleration.x = 0;
    }

    if (this.player.y > 990) {
      this.player.y = 990,
      this.player.body.acceleration.y = 0;
    }

    if (this.player.y < 10) {
      this.player.y = 10,
      this.player.body.acceleration.y = 0;
    }

    // game.physics.arcade.moveToObject(zombie, player)



  }
///////////////////////////////////////////

  // render: function (){
  //   game.debug.cameraInfo(this.game.camera, 32, 32);
  // }
}

const game = new Phaser.Game(800, 800, Phaser.AUTO)

game.state.add('gameState', gameState)
game.state.start('gameState')









// var game = new Phaser.Game(640, 360, Phaser.AUTO, 'gameDiv');
// //game only has 1 state
// var GameState = {
//   //load game assets first
//   preload: function() {
//     this.load.image('BackGround', 'assets/images/background.png');
//   },
//   //start
//   create: function() {
//     // this.stage.backgroundColor = 'background'
//     this.background =  this.game.add.sprite(0, 0, 'BackGround');
//   },
//   //update/play
//   update: function() {
//
//   }
// };
//
// //init framework
// game.state.add('gameState', GameState);
// game.state.start('gameState');
