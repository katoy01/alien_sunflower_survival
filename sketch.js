let player, gameState;
let pumpkins, seeds, equip, sunflowers, hiScore, enemy_chance, score, gameMode;
let backDrop, charClimb, charDownL, charDownR, charIdle, charL, charR, enemyL, enemyR, ledge, sunflower1, sunflower2, sunflower3, sunflowerSheet, pumpkin, watering_can;
let enemy_death, field_theme, game_over, grass_walking, harvest_sunflower, seed_plant, player_jump, player_damage, throw_sunflower;
let sunflowerArr, enemyArr, seedArr, pumpkinArr;

let floorY = 445;
const gravity = 0.5;

function preload() {
    let p = window.localStorage.getItem('pumpkinCount');
    let s = window.localStorage.getItem('seedCount');
    let sf = window.localStorage.getItem('sunflowerCount');
    let hs = window.localStorage.getItem('highScore');
    p ? pumpkins = p : pumpkins = 0;
    s ? seeds = s : seeds = 0;
    sf ? sunflowers = sf : sunflowers = 30;
    hs ? hiScore = hs : hiScore = 0;
    backDrop = loadImage('./assets/img/farming_background.jpeg');
    charClimb = loadImage('./assets/img/charClimb.png');
    charDownL = loadImage('./assets/img/charDownL.png');
    charDownR = loadImage('./assets/img/charDownR.png');
    charIdle = loadImage('./assets/img/charIdle.png');
    charL = loadImage('./assets/img/charL.png');
    charR = loadImage('./assets/img/charR.png');
    enemyL = loadImage('./assets/img/enemyL.png');
    enemyR = loadImage('./assets/img/enemyR.png');
    ledge = loadImage('./assets/img/ledge.png');
    sunflower1 = loadImage('./assets/img/sunflower1.png');
    sunflower2 = loadImage('./assets/img/sunflower2.png');
    sunflower3 = loadImage('./assets/img/sunflower3.png');
    sunflowerSheet = loadImage('./assets/img/sunflowerSheet.png');
    pumpkin = loadImage('./assets/img/pumpkin.png');
    watering_can = loadImage('./assets/img/watering_can.png');
    enemy_death = loadSound('./assets/sound/enemy_death.ogg');
    field_theme = loadSound('./assets/sound/field_theme.wav');
    game_over = loadSound('./assets/sound/game_over.ogg');
    grass_walking = loadSound('./assets/sound/grass_walking.ogg');
    harvest_sunflower = loadSound('./assets/sound/harvest_sunflower.ogg');
    seed_plant = loadSound('./assets/sound/seed_plant.ogg');
    player_jump = loadSound('./assets/sound/player_jump.ogg');
    player_damage = loadSound('./assets/sound/player_damage.ogg');
    throw_sunflower = loadSound('./assets/sound/throw_sunflower.ogg');
}

function keyPressed() {
    if (keyCode === 80 && equip === 0 && gameState === 1) {
        if (sunflowers >= 1 && (player.state === 1 || player.state === 2)) {
            let xSpeed;
            if (player.state === 1) {
                xSpeed = -5 * (gameMode + 1);
            } else {
                xSpeed = 5 * (gameMode + 1);
            }
            let temp = new Sunflower(player.x, player.y, xSpeed);
            sunflowerArr.push(temp);
            sunflowers--;
            throw_sunflower.play();
        }
    }
    if (keyCode === 83 && equip === 1 && player.y + player.height / 2 === floorY) {
        if (player.state === 1) {
            player.state = 3;
            player.img = charDownL;
            player.currentFrame = 0;
            player.pauseCounter = player.pauseCounterMax * 2;
        } else if (player.state === 2) {
            player.state = 4;
            player.img = charDownR;
            player.currentFrame = 0;
            player.pauseCounter = player.pauseCounterMax * 2;
        }
    }
}

function mousePressed() {
    // only if game state is choose level
    if (gameState === 4) {
        if ((mouseX <= (width / 4 + 75) && mouseX >= (width / 4 - 75)) &&
            (mouseY <= (height / 2 + 40) && mouseY >= (height / 2 - 40))) {
            gameMode = 0;
            gameState = 1;
        } else if ((mouseX <= (width / 2 + 75) && mouseX >= (width / 2 - 75)) &&
            (mouseY <= (height / 2 + 40) && mouseY >= (height / 2 - 40))) {
            gameMode = 1;
            gameState = 1;
        } else if ((mouseX <= (width * (3 / 4) + 75) && mouseX >= (width * (3 / 4) - 75)) &&
            (mouseY <= (height / 2 + 40) && mouseY >= (height / 2 - 40))) {
            gameMode = 2;
            gameState = 1;
        }
    }
}

function setup() {
    field_theme.loop();
    // set the background size of our canvas
    let cnv = createCanvas(1000, 500);
    cnv.parent('#canvas_container');
    colorMode(RGB);
    noStroke();
    charClimb.resize(0, 50);
    charDownL.resize(0, 50);
    charDownR.resize(0, 50);
    charIdle.resize(0, 50);
    charL.resize(0, 50);
    charR.resize(0, 50);
    enemyL.resize(0, 50);
    enemyR.resize(0, 50);
    sunflower1.resize(0, 50);
    sunflower2.resize(0, 50);
    sunflower3.resize(0, 50);
    sunflowerSheet.resize(0, 50);
    pumpkin.resize(0, 50);
    watering_can.resize(0, 50);
    player = new Player(width / 2, height / 2);
    platform1 = new Platform(50, height - 170, 294, player);
    platform2 = new Platform(width - 344, height - 170, 294, player);
    platform3 = new Platform(353, height - 300, 294, player);
    // 0 = sunflower
    // 1 = watering can
    equip = 0;
    sunflowerArr = [];
    enemyArr = [];
    pumpkinArr = [];
    seedArr = [];
    // modes
    // 0 = easy
    // 1 = medium
    // 2 = hard
    gameMode = 0;
    enemy = new Enemy(width / 3, height / 3, 0);
    enemyArr.push(enemy);
    // states
    // 0 = game ready
    // 1 = game start
    // 2 = game over
    // 3 = game paused
    // 4 = game choose level
    gameState = 0;
    score = 0;
}

function draw() {
    console.log(enemyArr, seedArr, sunflowerArr);
    imageMode(CORNER);
    background(0);
    image(backDrop, -15, 0);
    fill('green');
    rect(0, height - 70, width, 70);
    fill('yellow');
    rect(width - 70, 0, 70, 70);
    stroke(255, 288, 23, 100);
    strokeWeight(2);
    let w = 344;
    for (let i = 0; i < 10; i++) {
        line(w, height - 69, w - 69, height);
        w -= 34;
    }
    w = 656
    for (let i = 0; i < 10; i++) {
        line(w, height - 69, w + 69, height);
        w += 34;
    }
    noStroke();
    // brown
    fill(160, 82, 45);
    rect(width - 60, 10, 50, 50);
    rect(0, height - 30, width, 30);
    image(ledge, 50, height - 170);
    image(ledge, width - 344, height - 170);
    image(ledge, 353, height - 300);

    // equipment
    textSize(30);
    fill('white');
    stroke('black');
    strokeWeight(3);
    (showEquipped = () => {
        if (equip === 0) {
            image(sunflower3, width - 60, 10);
            text("" + sunflowers, width - 70, 70);
        }
        if (equip === 1) {
            image(watering_can, width - 60, 10);
        }
    })()

    if (gameState === 0) {
        fill(0, 0, 0, 200)
        rect(0, 0, width, height);
        textAlign(CENTER);
        stroke('white');
        fill('black');
        textSize(50);
        strokeWeight(10);
        text("ALIEN SUNFLOWER SURVIVAL", width / 2, height / 2);
        noStroke();
        textAlign(LEFT);
    } else if (gameState === 1 || gameState === 3) {
        textSize(30);
        fill('white');
        stroke('black');
        text("Score: " + score + "\nHighScore: " + hiScore, 50, 50);
        noStroke();
        imageMode(CENTER);
        (checkPlatforms = () => {
            if (platform1.state === 1) {
                platform1.check();
            } else if (platform2.state === 1) {
                platform2.check();
            } else if (platform3.state === 1) {
                platform3.check();
            } else {
                platform1.check();
                platform2.check();
                platform3.check();
            }
        })();
        seedArr.forEach(i => {
            i.display();
        })
        player.display();
        birthEnemy();
        enemyArr.forEach(i => {
            i.display();
        })
        sunflowerArr.forEach(i => {
            i.display();
        })
        if (gameState === 3) {
            fill(0, 0, 0, 200)
            rect(0, 0, width, height);
            textAlign(CENTER);
            stroke('white');
            fill('black');
            textSize(50);
            strokeWeight(10);
            text("PAUSED", width / 2, height / 2);
            noStroke();
            textAlign(LEFT);
        }
    } else if (gameState === 2) {
        fill(0, 0, 0, 200)
        rect(0, 0, width, height);
        textAlign(CENTER);
        stroke('white');
        fill('black');
        textSize(50);
        strokeWeight(10);
        text("GAME OVER", width / 2, height / 2);
        noStroke();
        textAlign(LEFT);
    } else {
        fill(0, 0, 0, 200)
        rect(0, 0, width, height);
        textAlign(CENTER);
        stroke('white');
        fill('black');
        textSize(50);
        strokeWeight(10);
        text("Choose Level:", width / 2, height / 4);
        fill(160, 82, 45);
        strokeWeight(2);
        rectMode(CENTER);
        rect(width / 4, height / 2, 150, 80);
        rect(width / 2, height / 2, 150, 80);
        rect(width * (3 / 4), height / 2, 150, 80);
        textSize(30);
        strokeWeight(5);
        fill('green');
        text("EASY", width / 4, height / 2);
        fill('orange');
        text("MEDIUM", width / 2, height / 2);
        fill('red');
        text("HARD", width * (3 / 4), height / 2);
        noStroke();
        textAlign(LEFT);
        rectMode(CORNER);
    }

    window.localStorage.setItem('pumpkinCount', pumpkins);
    window.localStorage.setItem('seedCount', seeds);
    window.localStorage.setItem('sunflowerCount', sunflowers);
    score > hiScore ? hiScore = score : null;
    window.localStorage.setItem('highScore', hiScore);
    window.localStorage.setItem('equipped', equip);
}

/** 
 * HELPER FUNCTIONS
 */
function compareFn(a, b) {
    return a - b;
}

function uniqueId(array) {
    let idArray = array.map(i => i.id).sort(compareFn);
    let i;
    for (i = 0; i < idArray.length; i++) {
        if (idArray[i] !== i) {
            break;
        }
    }
    return i;
}

function birthEnemy() {
    if (random(300 - (gameMode * 140)) < 1) {
        let dir = int(random(2));
        let tempEnemy = new Enemy(dir * width, int(random(0, 450)), dir ? 0 : 1);
        enemyArr.push(tempEnemy);
    }
}

function pauseGame() {
    if (gameState === 3) gameState = 1;
    else if (gameState === 1) gameState = 3;
}

function startGame() {
    if (gameState === 0 || gameState === 2) {
        player.life = 5;
        player.x = width / 2;
        player.y = height / 2;
        equip = 0;
        sunflowerArr = [];
        enemyArr = [];
        pumpkinArr = [];
        seedArr = [];
        gameMode = 0;
        enemy = new Enemy(width / 3, height / 3, 0);
        enemyArr.push(enemy);
        gameState = 4;
    }
}

function gameOver() {
    gameState = 2;
    sunflowers = 30;
    game_over.play();
}

/** 
 * CLASSES
 */
class Player {
    constructor(x, y) {
        // basic info
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.img = charR;
        this.totalFrames = int(this.img.width / this.width);
        // keep track of frames
        this.currentFrame = 0;
        this.pauseCounter = 0;
        this.pauseCounterMax = 20;
        // jump
        this.jumpMode = true;
        this.jumpPower = 0;
        // states
        // 0 = idle
        // 1 = left walking
        // 2 = right walking
        // 3 = left crouching
        // 4 = right crouching
        // 5 = climbing
        this.state = 2;
        this.life = 5;
    }

    display() {
        image(this.img, this.x, this.y, this.width, this.height,
            this.currentFrame * this.width, 0, this.width, this.height);
        // if game paused
        if (gameState === 3) return;

        // life counter
        if (this.life < 5) {
            stroke('white');
            strokeWeight(1);
            fill('black');
            rect(this.x - this.width / 2, this.y - 40, this.width, 10);
            if (this.life <= 3) {
                if (this.life <= 1) {
                    fill('red');
                } else {
                    fill(246, 190, 0);
                }
            } else {
                fill('green');
            }
            noStroke();
            rect(this.x - this.width / 2, this.y - 40, this.width * (this.life / 5), 10);
        }

        // frame animation
        this.pauseCounter--;
        this.walkCounter--;

        if (this.pauseCounter <= 0) {
            if (this.state === 3 || this.state === 4) {
                if (this.state === 3) {
                    this.state = 1;
                    this.img = charL;
                } else {
                    this.state = 2;
                    this.img = charR;
                }
                let tempSeed = new Seed(this.x, this.y);
                seedArr.push(tempSeed);
                seed_plant.play();
            }
            this.totalFrames = int(this.img.width / this.width);
            this.currentFrame += 1;
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
            this.pauseCounter = this.pauseCounterMax;
        }

        // movement mechanics
        if (keyIsDown(65)) {
            this.x -= 5;
            this.state = 1;
            this.img = charL;
        }
        if (keyIsDown(68)) {
            this.x += 5;
            this.state = 2;
            this.img = charR;
        }
        if (keyIsDown(87)) {
            if (this.state === 3) {
                this.state = 1;
                this.img = charL;
            }
            if (this.state === 4) {
                this.state = 2;
                this.img = charR;
            }
            if (this.jumpMode === false) {
                this.jumpMode = true;
                this.jumpPower = -13;
                player_jump.play();
            }
        }
        if (keyIsDown(49)) {
            equip = 0;
        }
        if (keyIsDown(50)) {
            equip = 1;
        }
        this.totalFrames = int(this.img.width / this.width);

        // jumping
        if (this.jumpMode) {
            this.y += this.jumpPower;
            this.jumpPower += gravity;
            if (this.y + this.height / 2 >= floorY) {
                this.jumpMode = false;
                this.jumpPower = 0;
                this.y = floorY - this.height / 2;
                grass_walking.play();
            }
        }
    }
}

class Enemy {
    constructor(x, y, state) {
        // basic info
        this.x = x;
        this.y = y;
        this.id = uniqueId(enemyArr);
        this.width = 50;
        this.height = 50;
        // state
        // 0 = left facing
        // 1 = right facing
        this.state = state;
        if (state === 1) {
            this.img = enemyR;
            this.xSpeed = 2 + (5 * gameMode);
        } else {
            this.img = enemyL;
            this.xSpeed = -2 - (5 * gameMode);
        }

        // keep track of frames
        this.totalFrames = int(this.img.width / this.width);
        this.currentFrame = 0;
        this.pauseCounter = 0;
        this.pauseCounterMax = 10;
    }

    delete() {
        let index = enemyArr.map(i => i.id).indexOf(this.id);
        enemyArr.splice(index, 1);

    }

    display() {
        image(this.img, this.x, this.y, this.width, this.height,
            this.currentFrame * this.width, 0, this.width, this.height);
        // if game paused
        if (gameState === 3) return;
        // frame animation
        this.pauseCounter--;
        if (this.pauseCounter <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
            this.pauseCounter = this.pauseCounterMax;
        }

        // movement
        this.x += this.xSpeed;
        if (this.x < 0 || this.x > width || dist(this.x, this.y, player.x, player.y) <= 50) {
            this.delete();
            if (dist(this.x, this.y, player.x, player.y) <= 50) {
                player.life--;
                player_damage.play();
                if (player.life <= 0) {
                    gameOver();
                }
            }
        }
    }
}

class Platform {
    constructor(x, y, width, player1) {
        this.min_x = x;
        this.max_x = x + width;
        this.y = y;
        this.player = player1;
        // states
        // 0 = player not above
        // 1 = player above
        this.state = 0;
    }
    // checks if player is on top of platform
    check() {
        if (this.player.x >= this.min_x && this.player.x <= this.max_x) {
            if (this.player.y + this.player.height / 2 <= this.y) {
                this.state = 1;
            }
        } else {
            this.state = 0;
        }
        if (this.state === 1 && keyIsDown(83)) {
            this.state = 0;
        }
        // if player is off of platform, fall
        if (this.state === 0 && this.player.y + this.player.height / 2 <= this.y) {
            this.player.jumpMode = true;
        }
        if (this.state === 1 && this.player.y + this.player.height / 2 >= this.y) {
            if (this.player.jumpMode) {
                grass_walking.play();
            }
            this.player.jumpMode = false;
            this.player.jumpPower = 0;
            this.player.y = this.y - this.player.height / 2;
        }
    }
}

class Sunflower {
    constructor(x, y, xSpeed) {
        this.img = sunflowerSheet;
        this.width = 50;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.id = uniqueId(sunflowerArr);
        // keep track of frames
        this.totalFrames = int(this.img.width / this.width);
        this.currentFrame = 0;
        this.pauseCounter = 0;
        this.pauseCounterMax = 5;
    }

    delete() {
        let index = sunflowerArr.map(i => i.id).indexOf(this.id);
        sunflowerArr.splice(index, 1);
    }

    display() {
        image(this.img, this.x, this.y, this.width, this.height,
            this.currentFrame * this.width, 0, this.width, this.height);
        // if game paused
        if (gameState === 3) return;
        // frame animation
        this.pauseCounter--;
        if (this.pauseCounter <= 0) {
            this.currentFrame += 1;
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
            this.pauseCounter = this.pauseCounterMax;
        }

        this.x += this.xSpeed;
        if (this.x >= width || this.x <= 0) {
            this.delete();
        }

        enemyArr.forEach(enemy => {
            if (dist(this.x, this.y, enemy.x, enemy.y) <= 50) {
                this.delete();
                enemy.delete();
                score += 50 * (gameMode + 1);
                enemy_death.play();
            }
        })
    }
}

class Seed {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = uniqueId(seedArr);
        this.img = [sunflower1];
        this.maxCounter = 180;
        this.growCounter = this.maxCounter;
        // states
        // 0 = sapling
        // 1 = half sunflower
        // 2 = fully grown sunflower
        this.state = 0;
    }
    display() {
        let yDisplace = 0;
        this.img.forEach(i => {
            image(i, this.x, this.y - yDisplace);
            yDisplace += 50;
        })
        // if game paused
        if (gameState === 3) return;
        // growth progress tracking
        if (this.growCounter <= 0) {
            if (this.state === 0) {
                this.img[0] = sunflower2;
            } else if (this.state === 1) {
                this.img.push(sunflower3);
            }
            this.growCounter = this.maxCounter;
            this.state++;
        }
        if (this.state < 2) {
            this.growCounter--;
        } else {
            if (dist(this.x, this.y, player.x, player.y) <= 50) {
                let index = seedArr.map(i => i.id).indexOf(this.id);
                seedArr.splice(index, 1);
                sunflowers = int(sunflowers) + (30 - 10 * gameMode);
                harvest_sunflower.play();
            }
        }
    }
}