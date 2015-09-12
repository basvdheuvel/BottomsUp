var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload, create: create, update: update});

function preload() {
    game.load.image('ass', 'assets/ass.png');
    game.load.image('beer', 'assets/beer.png');

    game.load.physics('assPhysics', 'assets/ass.json');
}

var ass;
var assSpeed = {x: 0, y: 0};
var assAcceleration = 8;
var assError = 15;

var beer;
var beerScale = 0.3;

function create() {
    game.world.setBounds(0, 0, 800, 600);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 300;

    var beerMaterial = game.physics.p2.createMaterial('beerMaterial');
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    var beerBoundaryMaterial = game.physics.p2.createContactMaterial(
            beerMaterial, worldMaterial, {restitution: 1.0});

    var assMaterial = game.physics.p2.createMaterial('assMaterial');
    var beerAssMaterial = game.physics.p2.createContactMaterial(
            beerMaterial, assMaterial, {restitution: 0.1});

    game.physics.p2.setWorldMaterial(worldMaterial);

    ass = game.add.sprite(300, 430, 'ass');
    game.physics.p2.enable(ass);
    ass.body.clearShapes();
    ass.body.loadPolygon('assPhysics', 'ass');
    ass.body.setMaterial(assMaterial);
    ass.body.data.gravityScale = 0;
    ass.body.fixedRotation = true;

    beer = game.add.sprite(300, 20, 'beer');
    beer.scale.set(beerScale);
    game.physics.p2.enable(beer);
    beer.body.setMaterial(beerMaterial);
    beer.body.mass = 0.1;

    ass.body.createBodyCallback(beer, hitBeer, this);
}

function update() {
    var mouseX = game.input.mousePointer.x;
    var mouseY = game.input.mousePointer.y;

    ass.body.setZeroVelocity();
    var yDiff = mouseY - ass.y;
    if (yDiff < assError && yDiff > -assError) {
        yDiff = 0;
    }
    var xDiff = mouseX - ass.x;
    if (xDiff < assError && xDiff > -assError) {
        xDiff = 0;
    }
    var angle = Math.atan2(yDiff, xDiff);
    assSpeed = {
        x: xDiff? Math.cos(angle) * assAcceleration : 0,
        y: yDiff? Math.sin(angle) * assAcceleration : 0
    };
    //console.log(assSpeed);
    ass.body.x += assSpeed.x;
    ass.body.y += assSpeed.y;
}

function accelerateObjectTo(obj, x, y, speed, rotate) {
    if (typeof rotate === 'undefined') {
        rotate = false;
    }

    var angle = Math.atan2(y - obj.y, x - obj.x);

    if (rotate) {
        obj.body.rotation = angle + game.math.degToRad(90);
    }

    obj.body.force.x = Math.cos(angle) * speed;
    obj.body.force.y = Math.sin(angle) * speed;
}

function hitBeer(body1, body2) {
    // body1 = ass, body2 = beer.
}
