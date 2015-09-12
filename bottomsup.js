var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, create: create, update: update});

function preload() {
    game.load.image('ass', 'ass.png');
    game.load.image('derest', 'derest.png');
    game.load.image('beer', 'beer.png');

    game.load.image('shard1', 'shard1.png');
    game.load.image('shard2', 'shard2.png');
    game.load.image('shard3', 'shard3.png');
    game.load.image('shard4', 'shard4.png');

    game.load.image('arrow', 'arrow.png');

    game.load.image('back', 'back.png');

    game.load.audio('plafond', 'plafond.mp3');
    game.load.audio('beerhit', 'beerhit.wav');
    game.load.audio('beerbroken', 'beerbroken.wav');
    game.load.audio('tumtum', 'tumtum.wav');
}

var ass, derest, beers, cursors;
var assScale = 0.2;
var upDown;
var beersHit, beersBroken;
var arrow;
var newBeerX;
var hopSpeed;
var score;
var plafond, beerhit, beerbroken, tumtum;
var assdif, assdifx;

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.gravity.y = 500;
    game.physics.p2.restitution = 1;

    game.add.tileSprite(0, 0, game.width, game.height, 'back');

    ass = game.add.sprite(300, 430, 'ass');
    ass.scale.setTo(assScale, assScale);
    game.physics.p2.enable(ass);

    assdif = 135;
    assdifx = 35;
    derest = game.add.sprite(300 - assdifx, 430 - assdif, 'derest');
    derest.scale.setTo(assScale, assScale);

    ass.body.collideWorldBounds = true;
    ass.body.fixedRotation = true;

    beers = [];

    ass.body.onBeginContact.add(assHit, this);
    beersHit = 0;
    beersBroken = 0;
    hopSpeed = 350;

    score = game.add.text(5, 5, 'Hier komt je score', {
        font: '20px Arial', fill: '#ff0044', align: 'left'});

    cursors = game.input.keyboard.createCursorKeys();
    upDown = false;

    warnBeer();
    game.time.events.repeat(Phaser.Timer.SECOND * 10, Infinity, warnBeer);

    plafond = game.add.audio('plafond');
    game.sound.setDecodedCallback(plafond, start, this);

    beerhit = game.add.audio('beerhit');
    beerbroken = game.add.audio('beerbroken');
    tumtum = game.add.audio('tumtum');
}

function start() {
    plafond.loopFull(0.3);
}

function assHit(body) {
    if (body && body.sprite.key === 'beer') {
        beersHit ++;
        beerhit.play();

        var mid = ass.width / 2 + ass.body.x;
        var dif = body.x - mid;
        body.velocity.x = dif * 3;
        body.velocity.y = body.velocity.y * 2;
    }
    else {
        ass.body.velocity.y = -200;
    }
}

function beerHit(beer) {
    beer.destroy();
}

function warnBeer() {
    if (tumtum) {
        tumtum.play();
    }

    newBeerX = Math.random() * 800;
    arrow = game.add.sprite(newBeerX, 5, 'arrow');

    game.time.events.add(Phaser.Timer.SECOND * 2, addBeer, this);
}


function addBeer() {
    arrow.destroy();
    beer = game.add.sprite(newBeerX, 10, 'beer');
    beer.scale.setTo(0.1, 0.1);
    game.physics.p2.enable(beer);
    beer.body.collideWorldBounds = true;
    beers.push(beer);
}

function addShard(x, y, n) {
    shard = game.add.sprite(x, y, 'shard' + n);
    shard.scale.setTo(0.1, 0.1);
    game.physics.p2.enable(shard);
    shard.body.collideWorldBounds = true;
}

function update() {
    ass.body.velocity.x = 0;

    if (cursors.left.isDown) {
        ass.body.velocity.x = -hopSpeed;
    }
    else if (cursors.right.isDown) {
        ass.body.velocity.x = hopSpeed;
    }

    if (cursors.up.isDown) {
        if (!upDown && ass.body.y + ass.height * assScale >= 600 - 80) {
            ass.body.velocity.y = -400;
        }
        upDown = true;
    }
    else {
        upDown = false;
    }

    derest.x = ass.body.x - assdifx;
    derest.y = ass.body.y - assdif;

    for (var i in beers) {
        var beer = beers[i];
        if (beer.y >= 600 - 30) {
            var x = beer.x, y = beer.y;
            beersBroken ++;
            beerbroken.play();

            beers.pop(beer);
            beer.destroy();
            addShard(x, y, 1);
            addShard(x, y, 2);
            addShard(x, y, 3);
            addShard(x, y, 4);
        }
    }

    score.text = 'Bownces: ' + beersHit + ', faalhaaspunten: ' + beersBroken;
}
