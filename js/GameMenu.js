var introMusic;
let gameMenu = {
 preload: function() {
   this.load.spritesheet('playBtn', './assets/images/btn.jpg')
   this.load.spritesheet('kenBtn', './assets/images/kenbtn.png')
   this.load.spritesheet('audioBtn', './assets/images/audioIcon.png')
   this.load.audio('intro', './assets/images/Undead Rising.mp3')
 },
 create: function() {
  var menuText = game.add.text(650, 150,'Zombie Assault Shooter', { font: '84px Arial', fill: '#fff' });
  menuText.anchor.setTo(0.5, 0.5);
  menuText.visible = true;
  menuText.fixedToCamera = true;


  var button = game.add.button(650, 400, 'playBtn', actionOnClick, this, 2, 1, 0)
    button.anchor.setTo(0.5, 0.5)

  var kenbtn = game.add.button(1200, 600, 'kenBtn', clickyclicky, this, 2, 1, 0);
  kenbtn.anchor.setTo(0.5, 0.5)

  // introMusic = game.add.audio('intro')

  var audiobtn = game.add.button(1220, 10, 'audioBtn', intro);
  // introMusic.play();
},

};

function intro(){
  introMusic = game.add.audio('intro')
  introMusic.loopFull()
}

function actionOnClick (){
  game.state.add('gameState', gameState)
  game.state.start('gameState')
}

function clickyclicky(){
  game.state.add('kenState', kenState);
  game.state.start('kenState');
}

const game = new Phaser.Game(1300, 700, Phaser.AUTO, "gameDiv")
game.state.add('gameMenu', gameMenu)
game.state.start('gameMenu')
