const config = {
    width: 1200,
    height: 700,
    type: Phaser.AUTO, //Phaser vas calculer les performances du pc et vas utiliser le meilleur moteur graphique (obligatoire)
    physics: {
        default: 'arcade', //Nous permet d'utiliser un système de gravité
            arcade: {
                gravity: {y: 500} //La force de notre gravité
        }
    },
    scene: { // On lui explique que notre scene vas contenir les 3 fonctions (preload, create et update)
        preload: preload,
        create: create,
        update: update
        }
    }

    var walkSpeedAnimation = 30;
    var jumpHeight = 400;
    var speedWalk = 400;
    var boxX = 70;
    var boxY = 46;
    var grass;
    var sonic;
    var game = new Phaser.Game(config) //On instencie notre jeux

function preload(){
    //On charge le sprite d'animation de respiration de sonic, on indique les dimensions de chaque céllule

    this.load.image('sky', 'media/sprites/background.jpg');
    this.load.image('grass', 'media/sprites/grass.png');

    this.load.spritesheet("sonicidle", "media/sprites/animations/sonicidle.png", {
        frameWidth: 74,
        frameHeight: 94
    })

    this.load.spritesheet("sonicwalk", "media/sprites/animations/sonicwalk.png", {
        frameWidth: 84,
        frameHeight: 91
    })

    this.load.spritesheet("sonicjump", "media/sprites/animations/sonicjump.png", {
        frameWidth: 58,
        frameHeight: 91
    })

    this.load.spritesheet("ring", "media/sprites/animations/ring.png", {
        frameWidth: 42,
        frameHeight: 40
    })
}

function create(){

    var camera = this.cameras.main;

    keyboard = this.input.keyboard.createCursorKeys()
    var sky = this.add.image(400, 550, 'sky').setScale(5);
    grass = this.physics.add.staticGroup();

    for (var i = 0; i < 5; i++){
    grass.create(i * 150, 500, 'grass').setScale(0.3).refreshBody();
    }

    this.anims.create({
        key: "ring",
        frames: this.anims.generateFrameNumbers('ring'),
        frameRate: 10,
        repeat: -1
    })

    ring = this.physics.add.group({
        key: 'ring',
        repeat: 3,
        setXY: { x: 0, y: 430, stepX: 200 }
    });

    ring.children.iterate(function (child) {
        
        child.anims.play('ring', true);
        
    });
    this.physics.add.collider(grass, ring)

    sonic = this.physics.add.sprite(100, 400, 'sonic');
    
    this.physics.add.overlap(sonic, ring, function(sonic, ring){
        ring.disableBody(true, true);
    }, null, this);

    this.physics.add.collider(grass, sonic);
    camera.startFollow(sonic);
    sky.setScrollFactor(0)

    
    //On créer une animation pour le sprite
    this.anims.create({
        key: "sonicidle_anim", //Le nom de l'animation
        frames: this.anims.generateFrameNumbers("sonicidle"),//On génère le nombre de frames en fonction du nombre d'image contenu dans le "this.sonicidle"
        frameRate: 6,//La vitesse de défilement des images
        repeat: -1//La répétition, si cette valeur est sur -1, alors c'est une répétition infinis
    })

    this.anims.create({
        key: "sonicwalk_animL",
        frames: this.anims.generateFrameNumbers('sonicwalk'),
        frameRate: walkSpeedAnimation,
        repeat: -1
    })

    this.anims.create({
        key: 'sonicwalk_animR',
        frames: this.anims.generateFrameNumbers('sonicwalk'),
        frameRate: walkSpeedAnimation,
        repeat: -1
    });

    this.anims.create({
        key: 'sonicjump_anim',
        frames: this.anims.generateFrameNumbers('sonicjump'),
        frameRate: 20,
        repeat: -1
    });

}

function update(){
    
    if (keyboard.right.isDown){
        sonic.body.setSize(boxX, boxY,true);
        sonic.flipX = false;
        sonic.setVelocityX(speedWalk)
    }

    else if (keyboard.left.isDown){
        sonic.body.setSize(boxX, boxY,true);
        sonic.flipX = true;
        sonic.setVelocityX(-speedWalk)
    }
   
    else if (sonic.body.velocity.y == 0){
        sonic.body.setSize(boxX, boxY,true);
        sonic.setVelocityX(0);
        sonic.anims.play('sonicidle_anim', true);
    }

    if (sonic.body.touching.down){
        if (keyboard.up.isDown || keyboard.space.isDown){
            sonic.body.setSize(boxX, boxY,true);
            sonic.setVelocityY(-jumpHeight);
        }

        else if (keyboard.right.isDown){
            sonic.anims.play('sonicwalk_animL', true);
        }

        else if (keyboard.left.isDown){
            sonic.anims.play('sonicwalk_animR', true);
        }
    }

    else{
        sonic.body.setSize(boxX, boxY,true);
        sonic.anims.play('sonicjump_anim', true);
        
    }
    
}