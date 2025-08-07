const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    jumpStrength: 15,
    isJumping: false,
    velocityY: 0
};

let obstacles = [];
let score = 0;
let gameOver = false;

function spawnObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 50,
        width: 30,
        height: 30
    };
    obstacles.push(obstacle);
}

function update() {
    if (gameOver) return;

    player.y += player.velocityY;
    if (player.isJumping) {
        player.velocityY += 1; // Gravity
    }

    if (player.y >= canvas.height - 50) {
        player.y = canvas.height - 50;
        player.isJumping = false;
        player.velocityY = 0;
    }

    obstacles.forEach(obstacle => {
        obstacle.x -= player.speed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.shift();
            score++;
        }
    });

    checkCollisions();
}

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !player.isJumping) {
        player.isJumping = true;
        player.velocityY = -player.jumpStrength;
    }
});

setInterval(spawnObstacle, 2000);
gameLoop();