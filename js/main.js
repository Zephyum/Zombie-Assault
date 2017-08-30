var player;
let total = 0;
var horde;
let timer = 0;
var bullet;
var bullets;
var bulletTime = 0;
var zombie;
let gameState = {

  preload: function () {
    this.load.spritesheet('background', './assets/images/background.png', 662, 500, 1);
    this.load.spritesheet('player', './assets/images/sold1.png');
    this.load.spritesheet('zomb1', './assets/images/zomb1.png');
    this.load.spritesheet('bullet', './assets/images/bullet.png')

  },


  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.enable('player', Phaser.Physics.ARCADE);
    //this background
    bg = this.game.add.tileSprite(0, 0, 1919, 1919, 'background');
    this.game.world.setBounds(0, 0, 1000, 1000);

    // bg.fixedToCamera = true;

    //this you
    player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
    player.enableBody = true;
    this.physics.arcade.enable(player)
    player.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);
    this.game.camera.follow(player);
    health: 200;
    //////////////////////////////////////
  //  zombCreate();
  //   this.zombie = game.add.sprite(game.world.randomX, game.world.randomY, 'zomb1')
  //   this.physics.arcade.enable(this.zombie)
  //   this.zombie.anchor.setTo(0.5, 0.5)

  //bullets
    // weapon = game.add.weapon(30, 'bullet')
    // weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    // ///////////////////////////////////
    // weapon.bulletSpeed = 600;
    // weapon.fireRate = 100;
    //
    // weapon.trackSprite(player, 0, 0, true);
    // weapon.damage = 1000000;
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);


    horde = game.add.group();
    horde.enableBody = true;
    horde.physicsBodyType = Phaser.Physics.ARCADE;
    horde.setAll('anchor.x', 0.5);
    horde.setAll('anchor.y', 0.5);

  },

  update: function () {

    //////////////////////////////////////
// console.log(game.timer.now)
    //player movement
    if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
      // player.angle = -90
      player.x -= 4
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
      // player.angle = 90
      player.x += 4
    }
    if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
      // player.angle = 0
      player.y -= 4
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
      // player.angle = 0
      player.y += 4
    }


    player.rotation = game.physics.arcade.angleToPointer(player);

    if (player.x > 990) {
      player.x = 990,
      player.body.acceleration.x = 0;
    }

    if (player.x < 10) {
      player.x = 10,
      player.body.acceleration.x = 0;
    }

    if (player.y > 990) {
      player.y = 990,
      player.body.acceleration.y = 0;
    }

    if (player.y < 10) {
      player.y = 10,
      player.body.acceleration.y = 0;
    }

    // game.physics.arcade.moveToObject(zombie, player)

    if(total < 1 && game.time.now > timer){
      ZombCreate();
    }

    horde.forEach(function(el) {
      el.anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(el);
      el.rotation = game.physics.arcade.angleBetween(el, player);
      game.physics.arcade.moveToObject(el, player, 100);
      game.physics.arcade.overlap(bullet, el, zomDie);
    });



    //bullets
    if(game.input.activePointer.isDown){
      fireBullet();
      }

    } //update ends here

  };
///////////////////////////////////////////

  // render: function (){
  //   game.debug.cameraInfo(this.game.camera, 32, 32);
  // }

function ZombCreate(){
  zombie = horde.add(game.add.sprite(game.world.randomX, game.world.randomY, 'zomb1'))

  total++
  timer = game.time.now + 100

}


//bullets
function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(player.x, player.y);
            bullet.lifespan = 2000;
            bullet.rotation = player.rotation;
            game.physics.arcade.velocityFromRotation(player.rotation, 400, bullet.body.velocity);
            bulletTime = game.time.now + 50;
            bullet.physicsBodyType = Phaser.Physics.ARCADE;
        }
    }
}

function zomDie() {
  console.log('hit mf');
  bullet.kill()
  zombie.kill()
}


const game = new Phaser.Game(800, 800, Phaser.AUTO)

game.state.add('gameState', gameState)
game.state.start('gameState')
