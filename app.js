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

    var vie = 1;
    var timer = 0;
    var ringCollected = 0;
    var walkSpeedAnimation = 30;
    var jumpHeight = 400;
    var speedWalk = 400;
    var boxX = 70;
    var boxY = 46;
    var grass;
    var sonic;

    var game = new Phaser.Game(config) //On instencie notre jeux

function preload(){

    this.load.image('sky', 'media/sprites/background.jpg');//On charge l'image de background
    this.load.image('sonicicone', 'media/sprites/sonicicone.png');//On charge l'icone de sonic
    this.load.image('anneausonic', 'media/sprites/anneausonic.png');//On charge l'icone de l'anneau à ramasser
    this.load.image('clockicone', 'media/sprites/clockicone.png');//On charge l'icone de sonic
    this.load.image('grass', 'media/sprites/grass.png');//On charge l'image des blocs de terre

    //Le frameWidth et le frameHeight sont les dimensions de chaque céllule
    this.load.spritesheet("sonicidle", "media/sprites/animations/sonicidle.png", {//On charge les sprites de respiration de sonic
        frameWidth: 74,
        frameHeight: 94
    })

    this.load.spritesheet("sonicwalk", "media/sprites/animations/sonicwalk.png", {//On charge les sprites de marche de sonic
        frameWidth: 84,
        frameHeight: 91
    })

    this.load.spritesheet("sonicjump", "media/sprites/animations/sonicjump.png", {//On charge les sprites de jump de sonic
        frameWidth: 58,
        frameHeight: 91
    })

    this.load.spritesheet("ring", "media/sprites/animations/ring.png", {//On charge les sprites des anneaux à ramasser
        frameWidth: 42,
        frameHeight: 40
    })
}

function create(){

    var camera = this.cameras.main;//La référence de la caméra dans le jeux

    keyboard = this.input.keyboard.createCursorKeys();//La référence des actions au clavier 

    var sky = this.add.image(400, 550, 'sky').setScale(5);//On ajoute l'image d'arrière-plan

    grass = this.physics.add.staticGroup();//On créer le groupe des blocs de terre en statique

    for (var i = 0; i < 30; i++){//On créer une boucle pour ajouter nos blocs de terre rapidemment
    grass.create(i * 150, 500, 'grass').setScale(0.3).refreshBody();
    }

    this.anims.create({//On ajoute l'animation de nos anneaux à ramasser dans le viewport (le jeux)
        key: "ring",
        frames: this.anims.generateFrameNumbers('ring'),
        frameRate: 10,
        repeat: -1
    })

    ring = this.physics.add.group({//On lui dit de dupliquer 3 fois (4 en tout) nos anneaux qu'on stocke dans un objet
        key: 'ring',
        repeat: 25,
        setXY: { x: 0, y: 430, stepX: 200 }
    });

    ring.children.iterate(function (child) {//On demande de pouvoir accéder aux enfants de notre objet (donc à chaque anneaux)
        child.anims.play('ring', true);
    });

    this.physics.add.collider(grass, ring) //On lui explique que nos anneaux seront bloqués par le sol, qu'il ne pourront pas tomber dans le vide

    sonic = this.physics.add.sprite(100, 400, 'sonic');//On ajoute le sprite de sonic
    
    this.physics.add.overlap(sonic, ring, function(sonic, ring){ //Dés que sonic touche un anneau
        ring.disableBody(true, true);//On retire l'anneau
        ringCollected ++;
        ringRecup.setText(ringCollected);
    }, null, this);

    this.physics.add.collider(grass, sonic);//On lui explique que sonic ne peut pas traverser les blocs de terre
    camera.startFollow(sonic);//On demande à la caméra de suivre sonic
    sky.setScrollFactor(0)//On demande au background de rester fixe


    vieSonic = this.add.text(100, 20, vie, { fontFamily: 'Georgia',
                                            fontSize: "40px" });//On affiche la vie restante de sonic
    vieSonic.setScrollFactor(0)

    ringRecup = this.add.text(100, 95, ringCollected, { fontFamily: 'Georgia',
                                            fontSize: "40px" });//On affiche les rings collectés
    ringRecup.setScrollFactor(0)

    timeRestant = this.add.text(100, 165, timer, { fontFamily: 'Georgia',
                                            fontSize: "40px" });//On affiche le temps restant
    timeRestant.setScrollFactor(0)

    var sonicicone = this.add.image(50, 50, 'sonicicone').setScale(0.1);//On ajoute l'icone de sonic au viewport (au jeux)
    sonicicone.setScrollFactor(0)//On demande à ce que l'icone de sonic reste fixe

    var anneausonic = this.add.image(50, 120, 'anneausonic').setScale(0.06);//On ajoute l'icone de l'anneau au viewport (au jeux)
    anneausonic.setScrollFactor(0)//On demande à ce que l'icone de l'anneau reste fixe

    var clockicone = this.add.image(50, 190, 'clockicone').setScale(.1);//On ajoute l'icone de l'orloge au viewport (au jeux)
    clockicone.setScrollFactor(0)//On demande à ce que l'icone de l'orloge reste fixe

    setInterval(function(){
        timer ++
        timeRestant.setText(timer);
            }, 1000)

    
    //On créer une animation pour le sprite
    this.anims.create({
        key: "sonicidle_anim", //Le nom de l'animation
        frames: this.anims.generateFrameNumbers("sonicidle"),//On génère le nombre de frames en fonction du nombre d'image contenu dans le "this.sonicidle"
        frameRate: 6,//La vitesse de défilement des images
        repeat: -1//La répétition, si cette valeur est sur -1, alors c'est une répétition infinis
    })

    this.anims.create({//On créer l'animation de marche à gauche
        key: "sonicwalk_animL",
        frames: this.anims.generateFrameNumbers('sonicwalk'),
        frameRate: walkSpeedAnimation,
        repeat: -1
    })

    this.anims.create({//On créer l'animation de marche à droite
        key: 'sonicwalk_animR',
        frames: this.anims.generateFrameNumbers('sonicwalk'),
        frameRate: walkSpeedAnimation,
        repeat: -1
    });

    this.anims.create({//On créer l'animation de jump
        key: 'sonicjump_anim',
        frames: this.anims.generateFrameNumbers('sonicjump'),
        frameRate: 20,
        repeat: -1
    });

}

function update(){
    
    if (keyboard.right.isDown){//Si on veux aller à droite
        sonic.body.setSize(boxX, boxY,true);
        sonic.flipX = false;
        sonic.setVelocityX(speedWalk)
    }

    else if (keyboard.left.isDown){//Si on veux aller à gauche
        sonic.body.setSize(boxX, boxY,true);
        sonic.flipX = true;
        sonic.setVelocityX(-speedWalk)
    }
   
    else if (sonic.body.velocity.y == 0){//Si sonic n'est pas dans les airs et qu'il n'avance pas alors on joue l'animation de respiration
        sonic.body.setSize(boxX, boxY,true);
        sonic.setVelocityX(0);
        sonic.anims.play('sonicidle_anim', true);
    }

    if (sonic.body.touching.down){//Si sonic touche le sol

        if (keyboard.up.isDown || keyboard.space.isDown){//Si on veux jump
            sonic.body.setSize(boxX, boxY,true);
            sonic.setVelocityY(-jumpHeight);
        }

        else if (keyboard.right.isDown){//Si on veux avancer à droite (sur le sol)
            sonic.anims.play('sonicwalk_animL', true);
        }

        else if (keyboard.left.isDown){//Si on veux avancer à gauche (sur le sol)
            sonic.anims.play('sonicwalk_animR', true);
        }
    }

    else{
        sonic.body.setSize(boxX, boxY,true);//Si Sonic ne touche pas le sol, alors jouer l'animation de jump (dans les airs)
        sonic.anims.play('sonicjump_anim', true);
        
    }
    
}