var player;
let total = 0;
var horde;
let timer = 0;
var bullet;
var bullets;
var bulletTime = 0;
var zombie;
var lives = 10;
var invincible = false;
var kills = 0;
var killString = '';
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
    killString = 'Zeds Dead : ';
    killText = game.add.text(10, 10, killString + kills, { font: '34px Arial', fill: '#fff' });

    //this you
    player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
    player.enableBody = true;
    this.physics.arcade.enable(player)
    player.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);
    this.game.camera.follow(player);
    health: 200;

    //////////////////////////////////////
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


    if(total < 2000 && game.time.now > timer){
      ZombCreate();
    }

    horde.forEach(function(el) {
      el.anchor.setTo(0.5, 0.5);
      game.physics.arcade.enable(el);
      el.rotation = game.physics.arcade.angleBetween(el, player);
      game.physics.arcade.moveToObject(el, player, 100);
      bullets.forEach(function(bu) {
        game.physics.arcade.overlap(bu, el, zomDie);
        if(invincible === false) {
        game.physics.arcade.overlap(el, player, playerDie)
      } else{
        //do nothing
      }

      function zomDie() {
        console.log('hit');
        bu.kill()
        el.kill()
        kills++;
        killText.text = killString + kills;
      }

    })
    });



    //bullets
    if(game.input.activePointer.isDown){
      fireBullet();
      }

    } //update ends here

  };
///////////////////////////////////////////


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

//player die
function playerDie(){
  lives --;
  player.kill();
  invincible = true;
  game.time.events.add(2000, () => invincible = false);
  console.log('you have ' + lives + ' left');
  if (lives > 0) {
     player.reset(game.world.randomX, game.world.randomY);
  } else {

  }
}


const game = new Phaser.Game(1000, 700, Phaser.AUTO, "gameDiv")

game.state.add('gameState', gameState)
game.state.start('gameState')
