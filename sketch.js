/*
_______________________________________________________________
TASKS
- Implement spikes and spinners.
- Fix the player randomly stopping falling when touching canyon
- Platform art
- Clean up the draw function (try to implement as many things into functions as possible)
- ADD COMMENTS TO EVERYTHING TO EXPLAIN EACH CODE
- Add more later...
_______________________________________________________________
*/

// Object Variables //
var tree;
var canyon;
var cloud;
var mountain;
var flame;
var rays;
var layerScroll;
var game;
var platforms;
var player;
var enemy;

var lastDirection; // Used to make sure the player faces the same direction when in idle, moving, and jumping.
var movedFromStart; // Uses front facing sprites until the player moves.

// Other variables //
var scrollPosX; // The position of the scrolling canvas when the player reaches the side of the screen.
var restartButton; // Global restart button that only works in certain game states.
let time; // Time used for gravity and certain timers.

function preload() // Loads all sounds and images before loading setup() and start()
{
    soundFormats('mp3','wav');

    flameItem = loadImage('assets/Flame.png');
    flameGlow = loadImage('assets/Flame glow.png');

    gradientBackground = loadImage('assets/background.png');
    topCloud = loadImage('assets/TopCloud.png');

    livesBackground = loadImage('assets/Hearts Background.png');
    heart1 = loadImage('assets/First Heart.png');
    heart2 = loadImage('assets/Second Heart.png');
    heart3 = loadImage('assets/Third Heart.png');

    dash1 = loadImage('assets/First Dash.png');
    dash2 = loadImage('assets/Second Dash.png');
    dash3 = loadImage('assets/Third Dash.png');

    cloud1 = loadImage('assets/Cloud1.png');
    cloud2 = loadImage('assets/Cloud2.png');
    cloud3 = loadImage('assets/Cloud3.png');
    cloud4 = loadImage('assets/Cloud4.png');
    cloud5 = loadImage('assets/Cloud5.png');
    cloud6 = loadImage('assets/Cloud6.png');
    cloud7 = loadImage('assets/Cloud7.png');
    cloud8 = loadImage('assets/Cloud8.png');
    cloud9 = loadImage('assets/Cloud9.png');

    image_tree = loadImage('assets/tree.png');

    mountainLayer5 = loadImage('assets/mountainLayer5.png');
    mountainLayer4 = loadImage('assets/mountainLayer4.png');
    mountainLayer3 = loadImage('assets/mountainLayer3.png');
    mountainLayer2 = loadImage('assets/mountainLayer2.png');
    mountainLayer1 = loadImage('assets/mountainLayer1.png');

    lightRay = loadImage('assets/LightRay.png');
    lightRaysLayer1 = loadImage('assets/LightRayLayer1.png');
    lightRaysLayer3 = loadImage('assets/LightRayLayer3.png');
    lightRaysLayer5 = loadImage('assets/LightRayLayer5.png');

    player_idleFront = loadImage('assets/IdleFront.png');
    player_idleLeft = loadImage('assets/IdleLeft.png');
    player_idleRight = loadImage('assets/IdleRight.png');
    
    player_runLeft = loadImage('assets/RunLeft.png');
    player_runRight = loadImage('assets/RunRight.png');

    player_dashLeft = loadImage('assets/DashLeft.png');
    player_dashRight = loadImage('assets/DashRight.png');
    
    player_jumpFront = loadImage('assets/JumpFront.png');
    player_jumpLeft = loadImage('assets/JumpLeft.png');
    player_jumpRight = loadImage('assets/JumpRight.png');

    enemySprite = loadImage('assets/Enemy.png');

    finishPortal = loadImage('assets/finishportal.png');

    menubackground = loadImage('assets/menuscreen.png');

    downGradient = loadImage('assets/downgradient.png');
    leftGradient = loadImage('assets/leftgradient.jpg');
    rightGradient = loadImage('assets/rightgradient.jpg');

    audio_buttonClick = loadSound('assets/click.mp3');
    audio_wind = loadSound('assets/wind.mp3');
    audio_rumble = loadSound('assets/rumble.mp3');
    audio_deathEnemy = loadSound('assets/deathenemy.mp3');
    audio_deathCanyon = loadSound('assets/canyondeath.mp3');
    audio_gameover = loadSound('assets/gameover.mp3');
    audio_flameCollect = loadSound('assets/flameCollect.mp3');
    audio_dash1 = loadSound('assets/dash1.mp3');
    audio_dash2 = loadSound('assets/dash2.mp3');
    audio_dash3 = loadSound('assets/dash3.mp3');
    finishedMusic = loadSound('assets/finishedmusic.mp3');

    audio_buttonClick.setVolume(0.2);
    audio_wind.setVolume(0.2);
    audio_rumble.setVolume(0.2);
    audio_deathEnemy.setVolume(0.2);
    audio_deathCanyon.setVolume(0.2);
    audio_gameover.setVolume(0.2);
    audio_flameCollect.setVolume(1);
    audio_dash1.setVolume(0.6);
    audio_dash2.setVolume(0.6);
    audio_dash3.setVolume(0.6);
    finishedMusic.setVolume(0.2);
}

function start() // Alternative function for setup() to allow the canvas to reset back to its original state
{
    // Tree object containing arrays of position X and Y. Position X is carefully placed throughout the level (including some Y positions), while the rest of the Y positions are in random heights to have some differences between the trees.
    tree = 
    [
        {posX: -580, posY: random(330, 370)},
        {posX: 0, posY: random(330, 370)},
        {posX: 330, posY: random(330, 370)},
        {posX: 550, posY: random(330, 370)},
        {posX: 970, posY: random(330, 370)},
        {posX: 1320, posY: random(330, 370)},
        {posX: 2080, posY: random(330, 370)},
        {posX: 2900, posY: random(330, 370)},
        {posX: 3350, posY: random(330, 370)},
        {posX: 4200, posY: random(330, 370)},
        {posX: 4780, posY: 260},
        {posX: 5700, posY: 120},
        {posX: 7200, posY: random(330, 370)},
        {posX: 7920, posY: 215},
        {posX: 8655, posY: 100},
        {posX: 9300, posY: random(330, 370)},
        {posX: 9800, posY: random(330, 370)},
        {posX: 10500, posY: random(330, 370)}
    ];

    // Canyon object containing arrays of positions X and Y, width, and booleans to check if the player is plummeting in one of them and if the canyon is transparent (this is used for the edges of the level).
    canyon =
    [
        // Width's default is 0 (140 pixels wide)
        {posX: -1250, posY: 500, width: 1000, plummeting: false, transparent: true},
        {posX: 0, posY: 500, width: 5, plummeting: false, transparent: false},
        {posX: 773, posY: 500, width: 60, plummeting: false, transparent: false},
        {posX: 1200, posY: 500, width: 70, plummeting: false, transparent: false},
        {posX: 1900, posY: 500, width: 150, plummeting: false, transparent: false},
        {posX: 2500, posY: 500, width: 300, plummeting: false, transparent: false},
        {posX: 3200, posY: 500, width: 100, plummeting: false, transparent: false},
        {posX: 3600, posY: 500, width: 100, plummeting: false, transparent: false},
        {posX: 4000, posY: 500, width: 100, plummeting: false, transparent: false},
        {posX: 5100, posY: 500, width: 500, plummeting: false, transparent: false},
        {posX: 6400, posY: 500, width: 500, plummeting: false, transparent: false},
        {posX: 7300, posY: 500, width: 150, plummeting: false, transparent: false},
        {posX: 7850, posY: 500, width: 200, plummeting: false, transparent: false},
        {posX: 8700, posY: 500, width: 300, plummeting: false, transparent: false},
        {posX: 9600, posY: 500, width: 100, plummeting: false, transparent: false},
        {posX: 10600, posY: 500, width: 500, plummeting: false, transparent: false},
        {posX: 12900, posY: 500, width: 1000, plummeting: false, transparent: true},
    ];

    // Platforms will contain a list of values of position X and Y with width and height.
    platforms = [];
    platforms.push(createPlatform(1880, 370, 200, 20));
    platforms.push(createPlatform(2300, 320, 250, 20));
    platforms.push(createPlatform(4800, 400, 150, 20));
    platforms.push(createPlatform(5200, 350, 150, 20));
    platforms.push(createPlatform(5780, 270, 100, 20));
    platforms.push(createPlatform(6200, 200, 300, 20));
    platforms.push(createPlatform(6200, 300, 300, 20));
    platforms.push(createPlatform(6200, 400, 300, 20));
    platforms.push(createPlatform(6700, 200, 200, 20));
    platforms.push(createPlatform(8000, 370, 100, 20));
    platforms.push(createPlatform(8350, 300, 50, 20));
    platforms.push(createPlatform(8750, 250, 50, 20));
    platforms.push(createPlatform(9150, 160, 60, 20));
    platforms.push(createPlatform(9700, 250, 60, 20));
    platforms.push(createPlatform(10200, 370, 200, 20));
    platforms.push(createPlatform(11000, 350, 120, 20));
    platforms.push(createPlatform(11000, 150, 120, 20));
    platforms.push(createPlatform(11300, 250, 120, 20));
    platforms.push(createPlatform(12000, 300, 120, 20));

    // Cloud object containing arrays of positions X and Y, width, height, layer, type, and spawned.
    // Most of the properties are randomised to give an effect of actual clouds.
    // Layers will allow the clouds to be drawn behind or infront of mountains to give an effect of depth.
    // There are different types of clouds, which are randomly chosen from the randomCloudType() function.
    // Spawned is used to check if all clouds are spawned before continuing.
    cloud = 
    [   
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false},
        {posX: random(-500,4000), posY: random(50,300), width: random(0.5, 1.2), height: random(0.7, 1), layer: int(random(0,6)), type: null, spawned: false}
    ];
    randomCloudType(); // Chooses a random type of cloud for each cloud in the object.

    // Mountain object containing arrays of positions X, Y, width, and height of all 5 layers.
    // This is to make sure it spawns behind clouds depending on the layer.
    // The mountains also have different shapes depending on the layer.
    // This is all done to give an effect of depth.
    mountain = 
    [
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)},
        {layer5_Width: random(150,600), layer5_Height: random(700,800), layer4_Width: random(350,500), layer4_Height: random(500,700), layer3_Width: random(450,700), layer3_Height: random(400,500), layer2_Width: random(500,900), layer2_Height: random(300,400), layer1_Width: random(700,1100), layer1_Height: random(250,300), layer_posX: random(-1000,6000), layer5_posY: random(-100,50), layer4_posY: random(100,200), layer3_posY: random(200,300), layer2_posY: random(250,400), layer1_posY: random(350,450)}

    ];

    // layerScroll object contains properties of the X position of each layer and the speeds of each layer.
    // The further back the layer, the slower it will move when the screen scrolls - illusion of depth.
    layerScroll = 
    {
        layer6: 0,
        layer5: 0,
        layer4: 0,
        layer3: 0,
        layer2: 0,
        layer1: 0,

        speed_layer6: 0.8,
        speed_layer5: 1.6,
        speed_layer4: 2.4,
        speed_layer3: 3.2,
        speed_layer2: 4,
        speed_layer1: 4.8
    }

    // rays object is an extra touch to the scenery that makes it look great - downside is the lag (which is why it's disabled in game object).
    // There are 3 layers of light rays, which are drawn behind mountains and clouds to also give depth.
    // Only 3 layers due to increase lag if there were more - however, it still lags with 3 of them.
    rays =
    {
        layer1_exists: false,
        layer3_exists: false,
        layer5_exists: false
    }

    // Flame object in an if statement for "restarting" state.
    // It contains arrays of position X and Y, size and boolean for isFound.
    // The positions are carefully placed throughout the level.
    // The boolean is used to check if the player has already got that collectible item.
    // This if statement is used to respawn the collectible items when the player has died or reached the end and wants to restart the game.
    if ((game.state == "restarting"))
    {
        flame = 
        [
            // Size default is 0.8
            {posX: -250, posY: 400, size: 0.8, isFound: false},
            {posX: 630, posY: 400, size: 0.8, isFound: false},
            {posX: 1060, posY: 400, size: 0.8, isFound: false},
            {posX: 1970, posY: 400, size: 0.8, isFound: false},
            {posX: 2750, posY: 500, size: 0.8, isFound: false},
            {posX: 3780, posY: 500, size: 0.8, isFound: false},
            {posX: 4350, posY: 400, size: 0.8, isFound: false},
            {posX: 4850, posY: 500, size: 0.8, isFound: false},
            {posX: 5900, posY: 400, size: 0.8, isFound: false},
            {posX: 6400, posY: 150, size: 0.8, isFound: false},
            {posX: 7280, posY: 500, size: 0.8, isFound: false},
            {posX: 8450, posY: 400, size: 0.8, isFound: false},
            {posX: 10470, posY: 200, size: 0.8, isFound: false},
            {posX: 11480, posY: 100, size: 0.8, isFound: false},
            {posX: 12160, posY: 200, size: 0.8, isFound: false},
            {posX: 12480, posY: 500, size: 0.8, isFound: false},
            {posX: 13850, posY: 50, size: 0.8, isFound: false},
            {posX: 14600, posY: 500, size: 0.8, isFound: false}
        ];
        game.state = "playing"; // Changes to playing state once the properties have been declared.
    }

    // player object containing variety of properties. In-depth explanation within the object.
    player =
    {
        speed: 7, // The speed of the player (Default: 7).
        jumpPower: 17, // The power of the player's jump (Default: 17).
        gravityAccel: 28, // Gravity acceleration when the player is falling (Default: 28).
        groundHeight: 475, // The height of the ground used to calculate collision detections. (Default: 475)
        velocity: 0, // The current velocity of the player when jumping and falling.
        dashVelocity: 3, // The velocity of the dash. (Default: 3)
        dashUsage: 3, // The number of dashes allowed to be used mid-air. (Default: 3)

        currentDashVelocity: null, // The current velocity of dash.
        currentDashUsage: null, // The current number of dashes left.

        posX: 500, // Default X position of the player.
        posY: 475, // Default Y position of the player.
        bodyY: null, // The position of the body (used as a singular point on the player for enemy and item collision detections).

        // Anchor point offsets to perfectly line up singular points for collision detections.
        main_anchorPointOffsetX: -72.5,
        main_anchorPointOffsetY: -150,
        body_anchorPointOffsetY: -80,

        // Booleans to check the player's movement.
        isLeft: false,
        isRight: false,
        isFalling: false,
        isPlummeting: false,
        dashing: false,

        // Booleans to check if the sound of the dash has been played (used to prevent the audios from overlapping).
        dash1Playing: false,
        dash2Playing: false,
        dash3Playing: false,

        lastDirection: null, // Used to check the player's last direction to play certain animations (0 = left, 1 = right).
        movedFromStart: false, // Used to check if the player has moved (displays different sprite when the player hasn't moved).
    }
    player.bodyY = player.posY - 80; // Singular body point calculated.
    currentDashVelocity = player.dashVelocity; // Applies the maximum dash velocity to the current dash velocity.
    currentDashUsage = player.dashUsage; // Applies the maximum dash usage to the current dash usage.

    // Enemy object containing arrays of speed, start and end positions of X and Y, and boolean if the enemy has reachedEnd.
    // Speeds will allow different type of enemies to move in different speeds - used to create different challenges throughout the level.
    // The enemy moves back and fourth between the start position and end position.
    // reachedEnd is used to check if the enemy has reached the end position, used to calculate the enemy's movement back to start position.
    // The values are carefully chosen to fit the level design.
    enemy =
    [
        {speed: 1, startPosX: -50, startPosY: 400, currentPosX: null, currentPosY: null, endPosX: -200, endPosY: 400, reachedEnd: false},
        {speed: 2, startPosX: 1100, startPosY: 400, currentPosX: null, currentPosY: null, endPosX: 1500, endPosY: 400, reachedEnd: false},
        {speed: 3, startPosX: 2200, startPosY: 430, currentPosX: null, currentPosY: null, endPosX: 1700, endPosY: 430, reachedEnd: false},
        {speed: 2, startPosX: 2700, startPosY: 300, currentPosX: null, currentPosY: null, endPosX: 3000, endPosY: 300, reachedEnd: false},
        {speed: 3, startPosX: 3400, startPosY: 400, currentPosX: null, currentPosY: null, endPosX: 3850, endPosY: 400, reachedEnd: false},
        {speed: 4, startPosX: 4300, startPosY: 400, currentPosX: null, currentPosY: null, endPosX: 3800, endPosY: 400, reachedEnd: false},
        {speed: 2, startPosX: 4600, startPosY: 300, currentPosX: null, currentPosY: null, endPosX: 4300, endPosY: 300, reachedEnd: false},
        {speed: 2, startPosX: 5000, startPosY: 300, currentPosX: null, currentPosY: null, endPosX: 5200, endPosY: 400, reachedEnd: false},
        {speed: 2, startPosX: 5700, startPosY: 450, currentPosX: null, currentPosY: null, endPosX: 6000, endPosY: 400, reachedEnd: false},
        {speed: 0, startPosX: 6600, startPosY: 150, currentPosX: null, currentPosY: null, endPosX: 6600, endPosY: 150, reachedEnd: false},
        {speed: 3, startPosX: 8200, startPosY: 430, currentPosX: null, currentPosY: null, endPosX: 7600, endPosY: 430, reachedEnd: false},
        {speed: 3, startPosX: 8500, startPosY: 150, currentPosX: null, currentPosY: null, endPosX: 9000, endPosY: 150, reachedEnd: false},
        {speed: 3, startPosX: 9100, startPosY: 430, currentPosX: null, currentPosY: null, endPosX: 9500, endPosY: 430, reachedEnd: false},
        {speed: 3, startPosX: 9800, startPosY: 430, currentPosX: null, currentPosY: null, endPosX: 10100, endPosY: 430, reachedEnd: false},
        {speed: 5, startPosX: 10900, startPosY: 300, currentPosX: null, currentPosY: null, endPosX: 10200, endPosY: 250, reachedEnd: false},
        {speed: 5, startPosX: 11200, startPosY: 430, currentPosX: null, currentPosY: null, endPosX: 12000, endPosY: 430, reachedEnd: false},
        {speed: 6, startPosX: 12000, startPosY: 430, currentPosX: null, currentPosY: null, endPosX: 11200, endPosY: 430, reachedEnd: false}
    ];

    // Loops through every enemy's current positions to apply the start positions to them.
    for (let i = 0; i < enemy.length; i++)
    {
        enemy[i].currentPosX = enemy[i].startPosX;
        enemy[i].currentPosY = enemy[i].startPosY;
    }

    // restartButton object containing different properties of positions, width, height, colours, text.
    // Used when the player has died or finished the game. It is also used in the menu partially with manually changed properties.
    // isClicked checks if the player has clicked the button, which restarts the game without having to refresh the page.
    restartButton = 
    {
        boxPosX: 412,
        boxPosY: 400,
        boxWidth: 200,
        boxHeight: 50,
        boxColour: 255,

        textPosX: 432,
        textPosY: 437,
        textSize: 35,
        textColour: 0,

        hoverBoxColour: 150,
        clickBoxColour: 0,
        clickTextColour: 255,

        currentBoxColour: 255,
        currentTextColour: 0,

        isClicked: false,


        // If the player clicks the button, an click sound would play, change the colour of box to show interactivity, and change the state to restarting while loading all default things.
        clicked: function(x,y)
        {
            if ((x > restartButton.boxPosX) && (x < restartButton.boxPosX + restartButton.boxWidth) && (y > restartButton.boxPosY) && (y < restartButton.boxPosY + restartButton.boxHeight))
            {
                audio_buttonClick.play();

                restartButton.currentBoxColour = restartButton.clickBoxColour;
                restartButton.currentTextColour = restartButton.clickTextColour;
                restartButton.isClicked = true;

                game.state = "restarting";
                game.lives = 3;
                game.score = 0;

                start();
            }
        },

        // Changes colour of the button when hovered and not hovering.
        hover: function(x,y)
        {
            if (restartButton.isClicked == false)
            {  
                if ((x > restartButton.boxPosX) && (x < restartButton.boxPosX + restartButton.boxWidth) && (y > restartButton.boxPosY) && (y < restartButton.boxPosY + restartButton.boxHeight))
                {
                    restartButton.currentBoxColour = restartButton.hoverBoxColour;
                }
                else
                {
                    restartButton.currentBoxColour = restartButton.boxColour;
                }
            }
        }
    }

    // The X position of the scrolling canvas - used when the player reaches the edge of the screen.
    scrollPosX = 0;
}

// Runs only once
function setup()
{
    createCanvas(1024, 576);
    pixelDensity(1); // Pixel density for images.

    time = millis(); // Used to calculate time in miliseconds for gravity and dash.

    angleMode(DEGREES);
    frameRate(60);

    // game Object containing different properties:
    // State is used to determine the state of the game, running different functions based on the state.
    // Menu runs during the beginning of the game.
    // Playing runs when the player is playing the game.
    // Game over runs when the player has lost all lives.
    // Restarting runs when the player has pressed the restart button after game over or finished state.
    // Finished runs when the player has reached the portal (finish line/flagpole).
    game =
    {
        state: null, // "menu", "playing", "game over", "restarting", "finished"
        score: 0, // The number of collectible items collected.
        lives: 3, // The number of lives.
        raysOn: false, // Disabled on default to prevent lag for smoother gameplay experience.
        hasFinishMusicPlayed: false, // Used for the finished state to play a short tune to congratulate the player once (prevents overlapping).
    }

    // The exact same flame object as in start()
    // Used to run at the beginning of the game, the rest respawns when the game state is "restarting".
    flame = 
    [
        // Size default is 0.8
        {posX: -250, posY: 400, size: 0.8, isFound: false},
        {posX: 630, posY: 400, size: 0.8, isFound: false},
        {posX: 1060, posY: 400, size: 0.8, isFound: false},
        {posX: 1970, posY: 400, size: 0.8, isFound: false},
        {posX: 2750, posY: 500, size: 0.8, isFound: false},
        {posX: 3780, posY: 500, size: 0.8, isFound: false},
        {posX: 4350, posY: 400, size: 0.8, isFound: false},
        {posX: 4850, posY: 500, size: 0.8, isFound: false},
        {posX: 5900, posY: 400, size: 0.8, isFound: false},
        {posX: 6400, posY: 150, size: 0.8, isFound: false},
        {posX: 7280, posY: 500, size: 0.8, isFound: false},
        {posX: 8450, posY: 400, size: 0.8, isFound: false},
        {posX: 10470, posY: 200, size: 0.8, isFound: false},
        {posX: 11480, posY: 100, size: 0.8, isFound: false},
        {posX: 12160, posY: 200, size: 0.8, isFound: false},
        {posX: 12480, posY: 500, size: 0.8, isFound: false},
        {posX: 13850, posY: 50, size: 0.8, isFound: false},
        {posX: 14600, posY: 500, size: 0.8, isFound: false}
    ];

    // Menu is the first state that is chosen.
    game.state = "menu";
    start();

    // Plays these audios throughout the whole time playing the game.
    audio_wind.play();
    audio_wind.loop();
    audio_rumble.play();
    audio_rumble.loop();
}

function draw()
{   
    background(gradientBackground);

    if ((game.state == "playing")) // If the game state is not "playing", nothing will run except the GUI.
    {
        // Drawing Mountains and Clouds //
        respawnClouds(); // Respawns all clouds that have spawned before (setting the boolean from true to false).
        let layer = 6; // There are 6 layers.

        // Loops through all layers and draws clouds and mountains depending on their layer.
        for (layer; layer >= 0; layer--)
        {
            for (var i = 0; i < mountain.length; i++)
            {
                // Gathers the properties of the current cloud index.
                let tempPosX = cloud[i].posX;
                let tempPosY = cloud[i].posY;
                let tempWidth = cloud[i].width;
                let tempHeight = cloud[i].height;

                // Accurately sizes clouds.
                tempPosX = tempPosX / tempWidth;
                tempPosY = tempPosY / tempHeight;

                if (layer == 6)
                {
                    push()
                    translate(layerScroll.layer6, 0); // Translates all objects for layer 6 (this repeats for all layers)
                    drawCloud(tempPosX, tempPosY, tempWidth, tempHeight, i, layer) // (Draws the cloud for this layer of its current index)
                    pop();
                }
                else if (layer == 5)
                {
                    push();
                    translate(layerScroll.layer5, 0);
                    drawMountain(i, layer); // Draws mountains for this layer.

                    // If the rays are turned on in game object, rays will appear.
                    if (game.raysOn == true)
                    {
                        if (rays.layer5_exists == false)
                        {
                            image(lightRaysLayer5, -1000, 0);
                            rays.layer5_exists = true;
                        }
                    }
                    drawCloud(tempPosX, tempPosY, tempWidth, tempHeight, i, layer)
                    pop();
                }
                else if (layer == 4)
                {
                    push();
                    translate(layerScroll.layer4, 0);
                    drawMountain(i, layer);
                    drawCloud(tempPosX, tempPosY, tempWidth, tempHeight, i, layer)
                    pop();
                }
                else if (layer == 3)
                {
                    push();
                    translate(layerScroll.layer3, 0);
                    drawMountain(i, layer);
                    if (game.raysOn == true)
                    {
                        if (rays.layer3_exists == false)
                        {
                            image(lightRaysLayer3, -1000, 0);
                            rays.layer3_exists = true;
                        }
                    }
                    drawCloud(tempPosX, tempPosY, tempWidth, tempHeight, i, layer)
                    pop();
                }
                else if (layer == 2)
                {
                    push();
                    translate(layerScroll.layer2, 0);
                    drawMountain(i, layer);
                    drawCloud(tempPosX, tempPosY, tempWidth, tempHeight, i, layer)
                    pop();
                }
                else if (layer == 1)
                {
                    push();
                    translate(layerScroll.layer1, 0);
                    drawMountain(i, layer);
                    if (game.raysOn == true)
                    {
                        if (rays.layer1_exists == false)
                        {
                            image(lightRaysLayer1, -1000, 0);
                            rays.layer1_exists = true;
                        }
                    }
                    drawCloud(tempPosX, tempPosY, tempWidth, tempHeight, i, layer)
                    pop();
                }
            }
        }
        // Sets rays back to false if they were spawned before.
        rays.layer5_exists = false; 
        rays.layer3_exists = false;
        rays.layer1_exists = false;

        // Everything within the push and pop will be translated based on the scrolling canvas position.
        push();
        translate(scrollPosX, 0);
        image(topCloud, -3000, 0); // Adds black cloud at the top of the screen.

        // Drawing Trees //
        // Loops through all arrays of trees and draws them.
        for(var i = 1; i < tree.length; i++)
        {
            drawTree(tree[i].posX, tree[i].posY);
        }

        // Drawing Flames (Collectibles) // 
        // Temporary positions are used here for the collectibles to be sized correctly with correct detection boundaries
        for (var i = 0; i < flame.length; i++)
        {
            if (flame[i].isFound == false) // If the collectible hasn't been found, it will be drawn.
            {
                let tempPosX = flame[i].posX;
                let tempPosY = flame[i].posY;
                let tempSize = flame[i].size;
        
                tempPosX /= tempSize;
                tempPosY /= tempSize;
        
                push();
                scale(tempSize); // Correctly sizes the collectible.
                drawCollectible(tempPosX, tempPosY, tempSize); // Draws the collectible.
                translate(tempPosX / 2, tempPosY / 2); // Correctly positions the collectible due to the change of scale/size.
                pop(); 
            }
        }
        checkCollectibles(flame); // Checks if the player has touched any of the flames. If player has touched one of them, its boolean will be set to true, unable to be spawned till the game resets.

        // Drawing Enemies //
        // Loops through all enemy arrays and draws them, while also running the enemyMovement function that allows the enemy to move from one point to another.
        for (let i = 0; i < enemy.length; i++)
        {
            drawEnemy(i);
            enemyMovement(i);
        }
        checkEnemyHitPlayer(); // Checks if the player has collision detection with any of the enemies, if true, will lose a life and restart from beginning.

        finishLine(); // Draws the finish line (portal).
        
        ground(); // Draws the ground.

        // Draws Canyons //
        // Loops through all canyon arrays and draws them.
        for (var i = 0; i < canyon.length; i++)
        {
            drawCanyon(canyon[i].posX, canyon[i].posY, canyon[i].width, canyon[i].transparent);
        }
        checkCanyon(canyon); // Checks if the player has contact with any of the canyons, if true, the player will begin to fall due to isPlummeting becoming true.

        // Platforms //
        // Loops through the platforms list to spawn each platform in the game.
        for (let i = 0; i < platforms.length; i++)
        {
            platforms[i].draw();
        }

        // Player Movement //
        if ((player.dashing == true) && (player.lastDirection == 1) && (player.isPlummeting == false) && (player.currentDashUsage > 0)) // The player dashes to the right if it's last direction was to the right, isn't in the canyon, and has enough dashes left.
        {
            dashRight();
        }
        else if ((player.dashing == true) && (player.lastDirection == 0) && (player.isPlummeting == false) && (player.currentDashUsage > 0)) // The player dashes to the left if it's last direction was to the left, isn't in the canyon, and has enough dashes left.
        {
            dashLeft();
        }
        else if ((player.isFalling == true) && (player.isLeft == true)) // The player jumps to the left if the player is falling and is facing to the left.
        {
            jumpLeft();

            if ((player.posX + scrollPosX < width * 0.3)) // If the player is at the left side of the screen, the canvas will scroll to the right and the layers in the background will move at their speeds.
            {
                player.posX -= player.speed;
                scrollPosX += player.speed;

                layerScroll.layer5 += layerScroll.speed_layer5;
                layerScroll.layer4 += layerScroll.speed_layer4;
                layerScroll.layer3 += layerScroll.speed_layer3;
                layerScroll.layer2 += layerScroll.speed_layer2;
                layerScroll.layer1 += layerScroll.speed_layer1;
            }
            else // If the player is not at the edge, they will move normally.
            {
                player.posX -= player.speed;
            }
            player.lastDirection = 0; // Their last direction is now left.
        }
        else if ((player.isFalling == true) && (player.isRight == true)) // If the player jumps to the right if the player is falling and is facing to the right.
        {
            jumpRight();

            if (player.posX + scrollPosX > width * 0.7) // If the player is at the right side of the screen, the canvas will scroll to the left and the layers in the background will move at their speeds.
            {
                player.posX += player.speed;
                scrollPosX -= player.speed;

                layerScroll.layer5 -= layerScroll.speed_layer5;
                layerScroll.layer4 -= layerScroll.speed_layer4;
                layerScroll.layer3 -= layerScroll.speed_layer3;
                layerScroll.layer2 -= layerScroll.speed_layer2;
                layerScroll.layer1 -= layerScroll.speed_layer1;
            }
            else // If the player is not at the edge, they will move normally.
            {
                player.posX += player.speed;
            }
            player.lastDirection = 1; // Their last direction is now right.
        }
        else if ((player.isFalling == true) && (player.isLeft == true) && (player.isRight == true) && (player.lastDirection == 0)) // The player jumps to the left without moving when both left and right are true while falling.
        {
            jumpLeft();
        }
        else if ((player.isFalling == true) && (player.isLeft == true) && (player.isRight == true) && (player.lastDirection == 1)) // The player jumps to the right without moving when both left and right are true while falling.
        {
            jumpRight();
        }
        else if ((player.isFalling == false) && (player.isLeft == true) && (player.isRight == true) && (player.lastDirection == 0)) // The player faces to the left without moving when both left and right are true while on the ground/platform.
        {
            idleLeft();
        }
        else if ((player.isFalling == false) && (player.isLeft == true) && (player.isRight == true) && (player.lastDirection == 1)) // The player faces to the right without moving when both left and right are true while on the ground/platform.
        {
            idleRight();
        }
        else if ((player.isFalling == false) && (player.isLeft == true)) // The player runs to the left if the player is on the ground/platform and is facing to the left.
        {
            runLeft();

            if (player.posX + scrollPosX < width * 0.3)
            {
                player.posX -= player.speed;
                scrollPosX += player.speed;

                layerScroll.layer5 += layerScroll.speed_layer5;
                layerScroll.layer4 += layerScroll.speed_layer4;
                layerScroll.layer3 += layerScroll.speed_layer3;
                layerScroll.layer2 += layerScroll.speed_layer2;
                layerScroll.layer1 += layerScroll.speed_layer1;
            }
            else
            {
                player.posX -= player.speed;
            }

            player.lastDirection = 0;
            player.movedFromStart = true;
        }
        else if ((player.isFalling == false) && (player.isRight == true)) // The player runs to the right if the player is on the ground/platform and is facing to the right.
        {
            runRight();

            if ((player.posX + scrollPosX > width * 0.7) && (player.dashing == false))
            {
                player.posX += player.speed;
                scrollPosX -= player.speed;

                layerScroll.layer5 -= layerScroll.speed_layer5;
                layerScroll.layer4 -= layerScroll.speed_layer4;
                layerScroll.layer3 -= layerScroll.speed_layer3;
                layerScroll.layer2 -= layerScroll.speed_layer2;
                layerScroll.layer1 -= layerScroll.speed_layer1;
            }
            else
            {
                player.posX += player.speed;
            }
            
            player.lastDirection = 1;
            player.movedFromStart = true;
        }
        else if ((player.isFalling == true) && (player.isLeft == false) && (player.lastDirection == 0)) // The player jumps to the left without moving if the player is not going to the left but their last direction was left.
        {
            jumpLeft();
        }
        else if ((player.isFalling == true) && (player.isRight == false) && (player.lastDirection == 1)) // The player jumps to the right without moving if the player is not going to the right but their last direction was right.
        {
            jumpRight();
        }
        else if ((player.isFalling == false) && (player.isLeft == false) && (player.lastDirection == 0)) // The player idles facing left if the player is not going to the left but their last direction was left.
        {
            idleLeft();
        }
        else if ((player.isFalling == false) && (player.isRight == false) && (player.lastDirection == 1)) // The player idles facing right if the player is not going to the right but their last direction was right.
        {
            idleRight();
        }
        else if ((player.isFalling == false) && (player.movedFromStart == false)) // Player idles facing forward when they haven't moved yet.
        {
            idle();
        }
        else if ((player.isFalling == true) && (player.movedFromStart == false)) // Player jumps facing forward when they haven't moved yet but only jump.
        {
            jump();
        }

        gravity(); // Runs gravity for player.

        pop();

        // Restarts the game when player falls down the canyon.
        if (player.posY > height + 100) // When player is outside of the canvas.
        {
            audio_deathCanyon.play(); // Plays falling into canyon death sound.
            game.lives--; // Takes away life.
            start(); // Restarts canvas.
        }

        if (game.lives <= 0) // If the player has no lives.
        {
            audio_gameover.play(); // Plays game over sound.
            game.state = "game over"; // Changes state to game over.
        }
    }
    mainUI(); // Runs the function to load all GUI.
}

// Draws the ground
function ground()
{
	noStroke();
	fill(0,0,0);
	rect(-100, 480, 12000, 150);
}

// Draws a canyon
function drawCanyon(posX, posY, width, transparent)
{
    // If it's not transparent, it draws the gradients. Transparent is used to draw illusion of cliffs at the edges of the level.
    if (transparent == false) 
    {
        image(leftGradient, posX + 6 - width, posY - 10, 70 + width, 115);
        image(rightGradient, posX + 77, posY - 10, 70 + width, 115);
    }

    // Draws the edges of the canyon
    fill(0);
    noStroke();
    ellipse(posX + 151 + width, posY, 40, 40);
    ellipse(posX + 1 - width, posY, 40, 40);
    rect(posX - width, posY, 21, 100);
    rect(posX + 131 + width, posY, 40, 100);
}

// Checks if the player is falling in the canyon
function checkCanyon(canyon)
{
    // Loops through canyons.
    for (var i = 0; i < canyon.length; i++)
    {
        if ((player.posX >= canyon[i].posX + 40 - canyon[i].width) && (player.posX <= canyon[i].posX + 100 + canyon[i].width)) // If player is within X position of the canyon.
        {   
            if ((player.posY >= player.groundHeight - 5) && (player.dashing == false)) // If the player is slightly inside the canyon and they are not dashing (allows player to dash through the canyon).
            {
                player.isPlummeting = true; // Player plummets.
                canyon[i].plummeting = true;
            }
        }

        if (player.isPlummeting == true) // If the player is plummeting.
        {   
            if (canyon[i].plummeting == true) // Constrains player's X position to be within the canyon that the player is falling in.
            {
                player.posX = constrain(player.posX, canyon[i].posX + 40 - canyon[i].width, canyon[i].posX + 100 + canyon[i].width);
            }
        }
    }
}

// Draws a tree
function drawTree(posX, posY)
{
    image(image_tree, posX, posY - 130);
}

// Draws mountain
function drawMountain(i,layer)
{
    noStroke();
    
    // Draws different mountains based on the layer
    if (layer == 5)
    {
        image(mountainLayer5, mountain[i].layer_posX, mountain[i].layer5_posY, mountain[i].layer5_Width, mountain[i].layer5_Height);
    }
    else if (layer == 4)
    {
        image(mountainLayer4, mountain[i].layer_posX, mountain[i].layer4_posY, mountain[i].layer4_Width, mountain[i].layer4_Height);
    }
    else if (layer == 3)
    {
        image(mountainLayer3, mountain[i].layer_posX, mountain[i].layer3_posY, mountain[i].layer3_Width, mountain[i].layer3_Height);
    }
    else if (layer == 2)
    {
        image(mountainLayer2, mountain[i].layer_posX, mountain[i].layer2_posY, mountain[i].layer2_Width, mountain[i].layer2_Height);
    }
    else if (layer == 1)
    {
        image(mountainLayer1, mountain[i].layer_posX, mountain[i].layer1_posY, mountain[i].layer1_Width, mountain[i].layer1_Height);
    }
}

// Randomly chooses cloud type
function randomCloudType()
{
    let randomCloud = null;

    for (let i = 0; i < cloud.length; i++)
    {
        randomCloud = int(random(1,9))

        if (randomCloud == 1)
        {
            cloud[i].type = cloud1;
        }
        else if (randomCloud == 2)
        {
            cloud[i].type = cloud2;
        }
        else if (randomCloud == 3)
        {
            cloud[i].type = cloud3;
        }
        else if (randomCloud == 4)
        {
            cloud[i].type = cloud4;
        }
        else if (randomCloud == 5)
        {
            cloud[i].type = cloud5;
        }
        else if (randomCloud == 6)
        {
            cloud[i].type = cloud6;
        }
        else if (randomCloud == 7)
        {
            cloud[i].type = cloud7;
        }
        else if (randomCloud == 8)
        {
            cloud[i].type = cloud8;
        }
        else if (randomCloud == 9)
        {
            cloud[i].type = cloud9;
        }
    }
}

// Draws a cloud
function drawCloud(posX, posY, width, height, i, cLayer)
{
    // If the layer from the mountain/cloud loop matches the cloud's layer and it hasn't been spawned, it will draw the cloud.
    // Depending on the layer of the cloud, it will move at certain rates.
    // If it reaches maximum X position, it will reset back to the left side of the level.
    if ((cloud[i].layer == cLayer) && (cloud[i].spawned == false))
    {
        image(cloud[i].type, posX, posY);
        cloud[i].spawned = true;

        if (cloud[i].posX >= 5000)
        {
            cloud[i].posX = -1000;
        }

        if (cloud[i].layer == 6)
        {
            cloud[i].posX += 0.01;
        }
        else if (cloud[i].layer == 5)
        {
            cloud[i].posX += 0.1;
        }
        else if (cloud[i].layer == 4)
        {
            cloud[i].posX += 0.2;
        }
        else if (cloud[i].layer == 3)
        {
            cloud[i].posX += 0.3;
        }
        else if (cloud[i].layer == 2)
        {
            cloud[i].posX += 0.4;
        }
        else if (cloud[i].layer == 1)
        {
            cloud[i].posX += 0.5;
        }
    }
}

// Respawns clouds by setting every cloud's spawned boolean from true to false.
function respawnClouds()
{
    for (let i = 0; i < cloud.length; i++)
    {
        if (cloud[i].spawned == true)
        {
            cloud[i].spawned = false;
        }
    }
}

// Draws a collectible item considered as a flame for the player to collect
function drawCollectible(posX, posY, size)
{   
    push()
    scale(size); // Changes size of the item
    image(flameGlow, posX - 100, posY - 120);
    image(flameItem, posX - 50, posY - 70);
    pop();
}

// Checks if the player has collided with one of the collectibles.
function checkCollectibles(flame)
{
    for (var i = 0; i < flame.length; i++)
    {
        let tempPosX = flame[i].posX;
        let tempPosY = flame[i].posY;
        let tempSize = flame[i].size;

        let distance = dist(player.posX, player.bodyY, tempPosX * tempSize, tempPosY * tempSize);
        if ((distance < 75) && (flame[i].isFound != true)) // If player is within range and it hasn't been found
        {
            audio_flameCollect.play(); // Plays collection sound

            flame[i].isFound = true;
            game.score++; // Adds to the score board
        }
    }
}

// Draws enemy
function drawEnemy(i)
{
    image(enemySprite, enemy[i].currentPosX - 95, enemy[i].currentPosY - 100);
}

// Loops through enemy's movement between their start and end positions.
// There are 2 big if statements that checks if the starting position is on the left or right side, which determines how their movement is calculated.
function enemyMovement(i)
{
    if (enemy[i].startPosX < enemy[i].endPosX)
    {
        if ((enemy[i].currentPosX <= enemy[i].endPosX) && (enemy[i].reachedEnd == false))
        {
            enemy[i].currentPosX += enemy[i].speed;
        }
        else if ((enemy[i].currentPosX >= enemy[i].endPosX) && (enemy[i].reachedEnd == false))
        {
            enemy[i].reachedEnd = true;
            enemy[i].currentPosX -= enemy[i].speed;
        }
        else if ((enemy[i].currentPosX >= enemy[i].startPosX) && (enemy[i].reachedEnd == true))
        {
            enemy[i].currentPosX -= enemy[i].speed;
        }
        else if ((enemy[i].currentPosX <= enemy[i].startPosX) && (enemy[i].reachedEnd == true))
        {
            enemy[i].reachedEnd = false;
            enemy[i].currentPosX += enemy[i].speed;
        }
    }
    else if (enemy[i].startPosX > enemy[i].endPosX)
    {
        if ((enemy[i].currentPosX >= enemy[i].endPosX) && (enemy[i].reachedEnd == false))
        {
            enemy[i].currentPosX -= enemy[i].speed;
        }
        else if ((enemy[i].currentPosX <= enemy[i].endPosX) && (enemy[i].reachedEnd == false))
        {
            enemy[i].reachedEnd = true;
            enemy[i].currentPosX += enemy[i].speed;
        }
        else if ((enemy[i].currentPosX <= enemy[i].startPosX) && (enemy[i].reachedEnd == true))
        {
            enemy[i].currentPosX += enemy[i].speed;
        }
        else if ((enemy[i].currentPosX >= enemy[i].startPosX) && (enemy[i].reachedEnd == true))
        {
            enemy[i].reachedEnd = false;
            enemy[i].currentPosX -= enemy[i].speed;
        }
    }
}

// Loops through enemies to check if it has collided with the player.
// Similar to the collectible, but it takes away life instead of adding to the score.
function checkEnemyHitPlayer(i)
{
    for (var i = 0; i < enemy.length; i++)
    {
        let distance = dist(player.posX, player.bodyY, enemy[i].currentPosX, enemy[i].currentPosY);
        if ((distance < 60) && (player.dashing == false))
        {
            // Add player hit audio
            game.lives--;
            audio_deathEnemy.play(); // Plays death sound from enemy.
            start(); // Restarts canvas.
        }
    }
}

// All sprites of different animations //
function idle()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_idleFront, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function idleRight()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_idleRight, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function idleLeft()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_idleLeft, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function jump()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_jumpFront, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function runRight()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_runRight, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function runLeft()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_runLeft, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function jumpRight()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_jumpRight, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

function jumpLeft()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_jumpLeft, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);
}

// Dash Left calculations
// It uses time to make the player's velocity at maximum when starting to dash, eventually slowing down to normal speed.
function dashLeft()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_dashLeft, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);

    let newTime = millis();
    let timeDeltaSeconds = (newTime - time) / 1000;
    let pixelsPerMeter = 200;
    time = newTime;

    if (player.posX + scrollPosX < width * 0.3) // If player is at the edge, it will calculate the scrolling position of the background and canvas as well.
    {
        player.posX -= player.currentDashVelocity * timeDeltaSeconds * pixelsPerMeter;
        scrollPosX += player.currentDashVelocity * timeDeltaSeconds * pixelsPerMeter;

        layerScroll.layer5 += layerScroll.speed_layer5 * player.currentDashVelocity;
        layerScroll.layer4 += layerScroll.speed_layer4 * player.currentDashVelocity;
        layerScroll.layer3 += layerScroll.speed_layer3 * player.currentDashVelocity;
        layerScroll.layer2 += layerScroll.speed_layer2 * player.currentDashVelocity;
        layerScroll.layer1 += layerScroll.speed_layer1 * player.currentDashVelocity;
    }
    else
    {
        player.posX -= player.currentDashVelocity * timeDeltaSeconds * pixelsPerMeter;
    }

    if (player.dashing == true) // If the player is dashing, it will play different sound effects depending on the number of dashes the player has left.
    {
        if ((player.currentDashUsage == 3) && (player.dash3Playing == true))
        {
            audio_dash3.play();
            player.dash3Playing = false;
        }
        else if ((player.currentDashUsage == 2) && (player.dash2Playing == true))
        {
            audio_dash2.play();
            player.dash2Playing = false;
        }
        else if ((player.currentDashUsage == 1) && (player.dash1Playing == true))
        {
            audio_dash1.play();
            player.dash1Playing = false;
        }

        player.currentDashVelocity -= player.speed * timeDeltaSeconds; // Decreases velocity overtime.
        
        if (player.currentDashVelocity <= 1) // If the player is back to normal speed, the dash usage is decreased.
        {
            player.currentDashUsage--;
            player.dashing = false;
        }
    }
}

// The exact same as dashLeft but for the right
function dashRight()
{
    image(flameGlow, player.posX - 100, player.posY - 175);
    image(player_dashRight, player.posX + player.main_anchorPointOffsetX, player.posY + player.main_anchorPointOffsetY, 150, 150);

    let newTime = millis();
    let timeDeltaSeconds = (newTime - time) / 1000;
    let pixelsPerMeter = 250;
    time = newTime;

    if (player.posX + scrollPosX > width * 0.7)
    {
        player.posX += player.currentDashVelocity * timeDeltaSeconds * pixelsPerMeter;
        scrollPosX -= player.currentDashVelocity * timeDeltaSeconds * pixelsPerMeter;

        layerScroll.layer5 -= layerScroll.speed_layer5 * player.currentDashVelocity;
        layerScroll.layer4 -= layerScroll.speed_layer4 * player.currentDashVelocity;
        layerScroll.layer3 -= layerScroll.speed_layer3 * player.currentDashVelocity;
        layerScroll.layer2 -= layerScroll.speed_layer2 * player.currentDashVelocity;
        layerScroll.layer1 -= layerScroll.speed_layer1 * player.currentDashVelocity;
    }
    else
    {
        player.posX += player.currentDashVelocity * timeDeltaSeconds * pixelsPerMeter;
    }

    if (player.dashing == true)
    {
        if ((player.currentDashUsage == 3) && (player.dash3Playing == true))
        {
            audio_dash3.play();
            player.dash3Playing = false;
        }
        else if ((player.currentDashUsage == 2) && (player.dash2Playing == true))
        {
            audio_dash2.play();
            player.dash2Playing = false;
        }
        else if ((player.currentDashUsage == 1) && (player.dash1Playing == true))
        {
            audio_dash1.play();
            player.dash1Playing = false;
        }

        player.currentDashVelocity -= player.speed * timeDeltaSeconds;

        if (player.currentDashVelocity <= 1)
        {
            player.currentDashUsage--;
            player.dashing = false;
        }
    }
}

// This is used to calculate the gravity of the player when jumping and falling.
// Contains the player when falling through canyon and jumping on platform.
function gravity()
{
    let newTime = millis();
    let timeDeltaSeconds = (newTime - time) / 1000;
    let pixelsPerMeter = -20;
    time = newTime;
    player.posY += player.velocity * timeDeltaSeconds * pixelsPerMeter;
    player.bodyY += player.velocity * timeDeltaSeconds * pixelsPerMeter;

    if (player.isPlummeting == false) // If the player is not in the canyon
    {
        if ((player.posY >= player.groundHeight)) // If the player is on the ground level, the player will not fall.
        {
            player.velocity = 0;
            player.currentDashUsage = player.dashUsage;
            player.posY = player.groundHeight;
            player.bodyY = player.groundHeight + player.body_anchorPointOffsetY;
            player.isFalling = false;
        }

        if (player.posY < player.groundHeight) // If the player is above ground level, the player will fall.
        {
            let isContact = false;
            let platformPosY = null;

            for (let i = 0; i < platforms.length; i++) // Loops through all platforms to check if the player has contact with one of them.
            {
                if (platforms[i].detectionCheck(player.posX, player.posY) == true) // If the player is touching a platform, it will save the position Y of the platform and stop the loop.
                {
                    isContact = true;
                    platformPosY = platforms[i].posY;
                    break;
                }
            }
            
            if (isContact == false) // If the player hasn't touched a platform, they will continue to fall with gravity.
            {
                player.velocity -= player.gravityAccel * timeDeltaSeconds;
                player.isFalling = true;
            }
            else // If the player has touched a platform, they will stop falling and snap onto the platform.
            {
                player.velocity = 0;
                player.currentDashUsage = player.dashUsage;
                player.posY = platformPosY - 5;
                player.headY = platformPosY - 5;
                player.isFalling = false;
            }
        }
    }
    else // If the player is plummeting into the canyon, they will fall as usual.
    {
        player.velocity -= player.gravityAccel * timeDeltaSeconds;
        player.isFalling = true;
    }
}

// A function to create a platform.
// It has built-in functions to draw and detect if a player is touching one of the platforms.
function createPlatform(x, y, w, h)
{
    var p =
    {
        posX: x,
        posY: y,
        width: w,
        height: h,
        draw: function() // Draws the platform
        {
            fill(0);
            stroke(100);
            strokeWeight(1);
            image(downGradient, x, y, w, 120);
            rect(x, y, w, h);
        },
        detectionCheck: function(playerX, playerY) // Collision detection with player and platform
        {
            if ((playerX >= x) && (playerX <= x + w) && (playerY >= y - 5) && (playerY <= y + h) && (player.velocity <= 0)) // Checks if the player is in range and if the player's velocity is at 0 (this allows the player to fall onto the platform instead of snapping onto one when jumping).
            {
                return true; // Returns true if they are in contact.
            }
            return false;
        }
    }
    return p; // Returns the variable platform to be added into a list of platforms.
}

// Draws a portal as the finish line.
function finishLine()
{
    image(finishPortal, 12300, 150, 100, 200);
    if ((player.posX >= 12300) && (player.posY >= 100) && (player.posY <= 400)) // If player touches the portal, the game state changes to finished.
    {
        game.state = "finished";
    }
}

// Draws all of the UI components.
function mainUI()
{
    image(livesBackground, 0, 0);

    // Draws different number of hearts depending on the number of lives left.
    if (game.lives == 3)
    {
        image(heart1, 0, 0);
        image(heart2, 0, 0);
        image(heart3, 0, 0);
    }
    else if (game.lives == 2)
    {
        image(heart1, 0, 0);
        image(heart2, 0, 0);
    }
    else if (game.lives == 1)
    {
        image(heart1, 0, 0);
    }

    // Draws different number of dash usages depending on the number of dashes left.
    if (player.currentDashUsage == 3)
    {
        image(dash1, 0, 50);
        image(dash2, 0, 50);
        image(dash3, 0, 50);
    }
    else if (player.currentDashUsage == 2)
    {
        image(dash1, 0, 50);
        image(dash2, 0, 50);
    }
    else if (player.currentDashUsage == 1)
    {
        image(dash1, 0, 50);
    }

    // Draws a flame icon at the corner to draw a score counter.
    image(flameItem, 925, 10, 50, 50);
    push();
    fill(255);
    textSize(30);
    text(game.score, 980, 45);
    pop();

    // If the game state is "game over", it draws a game over screen with a restart button.
    if (game.state == "game over")
    {   
        background(0);
        push();
        fill(255);
        textSize(100);
        text("GAME OVER", 200, height/2);
        pop();

        push();
        fill(restartButton.currentBoxColour);
        button = rect(restartButton.boxPosX, restartButton.boxPosY, restartButton.boxWidth, restartButton.boxHeight);
        fill(restartButton.currentTextColour);
        textSize(restartButton.textSize);
        text("RESTART", restartButton.textPosX, restartButton.textPosY);
        pop();

        restartButton.hover(mouseX, mouseY);
    }

    // If the game state is "finished", it draws a congratulations screen with a restart button.
    if (game.state == "finished")
    {
        if (game.hasFinishMusicPlayed == false)
        {
            finishedMusic.play(); // Plays a jingle
            game.hasFinishMusicPlayed = true; // Prevents overlapping
        }

        background(81,158,93);
        push();
        fill(255);
        textSize(100);
        text("YOU MADE IT OUT!", 55, height/2);
        pop();

        push();
        fill(restartButton.currentBoxColour);
        button = rect(restartButton.boxPosX, restartButton.boxPosY, restartButton.boxWidth, restartButton.boxHeight);
        fill(restartButton.currentTextColour);
        textSize(restartButton.textSize);
        text("RESTART", restartButton.textPosX, restartButton.textPosY);
        pop();
    }

    // If the game state is "menu", it will draw a menu for the player to begin and read useful information.
    if (game.state == "menu")
    {
        background(menubackground);
        push();
        fill(0);
        textSize(70);
        text("PERPETUAL NIGHTMARE", 75, height/2);
        fill(255,0,0)
        text("PERPETUAL NIGHTMARE", 75, (height/2) - 6);
        textSize(20);
        fill(255);
        text("Left: A // Right: D // Jump: W // Dash: Shift // Get to finish (optional 18 collectibles)", 150, height/2 + 40);
        textSize(15);
        text("Tip: You can dash through enemies", 395, height/2 + 60);
        pop();

        push();
        fill(255,0,0);
        button = rect(restartButton.boxPosX, restartButton.boxPosY, restartButton.boxWidth, restartButton.boxHeight);
        fill(restartButton.currentTextColour);
        textSize(17);
        text("BEGIN NIGHTMARE", restartButton.textPosX, 431);
        pop();
    }
}

// All key press functions for player movement
function keyPressed()
{
    // Moving left
    if (keyCode == 65) // a
    {
        player.isLeft = true;
    }

    // Moving right
    if (keyCode == 68) // d
    {
        player.isRight = true;
    }

    // Jumping
    if ((keyCode == 87) && (player.isFalling == false)) // w
    {
        player.velocity = player.jumpPower; // Sets maximum jump elocity
    }

    // Dashing
    if ((keyCode == 16) && (player.dashing == false) && (player.currentDashUsage > 0)) // shift
    {
        player.currentDashVelocity = player.dashVelocity; // Sets maximum dash velocity
        player.dashing = true;

        player.dash3Playing = true;
        player.dash2Playing = true;
        player.dash1Playing = true;
    }
}

// When keys are released, the player will stop moving
function keyReleased()
{
    // Stops moving right
    if (keyIsDown(65))
    {
        player.isRight = false;
    }
    else if (keyIsDown(68)) // Stops moving left
    {
        player.isLeft = false;
    }
    else
    {
        player.isLeft = false;
        player.isRight = false;
    }
}

// Mouse click for restart button
function mouseClicked()
{
    // If any of these game states are true, the restart button will be allowed to click (prevents from accidental clicks from other states).
    if ((game.state == "game over") || (game.state == "menu") || (game.state == "finished"))
    {
        restartButton.clicked(mouseX,mouseY);
    }
}