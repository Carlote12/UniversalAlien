let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; // 32*16
let boardHeight = tileSize * rows;
let context;

let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;
let shipImg;
let shipvelocityX = tileSize; // velocidad de la nave.

let bullets = [];
let bulletWidth = tileSize / 4;
let bulletHeight = tileSize / 2;
let bulletVelocity = -boardHeight / 1000; // velocidad de las balas (negativa para que vayan hacia arriba)

let shotDelay = 1200; // Cadencia de tiro en milisegundos (1,2 segundos)

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight,
}

window.onload = function() {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Cargar la imagen de la nave
    shipImg = new Image();
    shipImg.src = "ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    // Agregar el listener del teclado
    document.addEventListener("keydown", moveShip);

    // Iniciar disparos automáticos
    setInterval(shoot, shotDelay);

    requestAnimationFrame(update);
}

function update() {
    context.clearRect(0, 0, board.width, board.height); // Limpiar el canvas

    // Redibujar la nave si la imagen ha sido cargada
    if (shipImg.complete) {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    // Actualizar y dibujar las balas
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y += bulletVelocity;
        context.fillStyle = "red";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Eliminar las balas que están fuera del canvas
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(update);
}

function moveShip(e) {
    if (e.code === "ArrowLeft" && ship.x - shipvelocityX >= 0) {
        ship.x -= shipvelocityX; // Mover a la izquierda
    } else if (e.code === "ArrowRight" && ship.x + shipvelocityX + ship.width <= boardWidth) {
        ship.x += shipvelocityX; // Mover a la derecha
    }
}

function shoot() {
    let bulletX = ship.x + ship.width / 2 - bulletWidth / 2;
    let bulletY = ship.y;
    bullets.push({
        x: bulletX,
        y: bulletY,
        width: bulletWidth,
        height: bulletHeight
    });
}
