// Tamaño de cada casilla del tablero
let tileSize = 32;
let rows = 16;
let columns = 16;

// Variables del tablero
let board;
let boardWidth = tileSize * columns; // 32*16
let boardHeight = tileSize * rows;
let context;

// Tamaño y posición de la nave
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;
let shipImg;
let alienImg;
let shipvelocityX = tileSize; // velocidad de la nave.

// Variables de las balas
let bullets = [];
let bulletWidth = tileSize / 4;
let bulletHeight = tileSize / 2;
let bulletVelocity = -boardHeight / 100; // velocidad de las balas (aún más rápida)

// Configuraciones de tiempo
let shotDelay = 1200; // Cadencia de tiro en milisegundos (1,2 segundos)
let alienMoveDelay = 5000; // Tiempo en milisegundos (5 segundos)
let score = 0; // Puntaje inicial

// Variables de la nave
let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight,
};

// Variables de los alienígenas
let aliens = [];
let alienRows = 3;
let alienColumns = 6;
let gameOver = false; // Indicador de si el juego ha terminado

// Función para crear alienígenas en filas y columnas
function createAliens() {
    let alienOffsetX = (boardWidth - (alienColumns * tileSize * 2 - tileSize)) / 2;
    for (let r = 0; r < alienRows; r++) {
        for (let c = 0; c < alienColumns; c++) {
            aliens.push({
                x: alienOffsetX + c * tileSize * 2,
                y: r * tileSize * 2,
                width: tileSize,
                height: tileSize
            });
        }
    }
}

window.onload = function() {
    // Inicializar el tablero y el contexto
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Crear alienígenas iniciales en filas y columnas
    createAliens();

    // Cargar la imagen de la nave
    shipImg = new Image();
    shipImg.src = "ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    // Cargar la imagen de los alienígenas
    alienImg = new Image();
    alienImg.src = "alien.png"; // Asegúrate de tener una imagen llamada "alien.png"

    // Agregar el listener del teclado
    document.addEventListener("keydown", moveShip);

    // Iniciar disparos automáticos
    setInterval(shoot, shotDelay);

    // Mover alienígenas hacia abajo cada 5 segundos
    setInterval(moveAliens, alienMoveDelay);

    // Iniciar la actualización del juego
    requestAnimationFrame(update);
}

function update() {
    if (gameOver) {
        // Mostrar mensaje de GAME OVER y reiniciar el juego después de 3 segundos
        context.fillStyle = "red";
        context.font = "50px Arial";
        context.fillText("GAME OVER", boardWidth / 4, boardHeight / 2);
        setTimeout(resetGame, 3000);
        return;
    }

    // Limpiar el canvas
    context.clearRect(0, 0, board.width, board.height);

    // Redibujar la nave si la imagen ha sido cargada
    if (shipImg.complete) {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    // Redibujar alienígenas usando la imagen "alien.png" original
    if (alienImg.complete) {
        for (let i = 0; i < aliens.length; i++) {
            let alien = aliens[i];
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            // Verificar si los alienígenas tocan la nave
            if (alien.y + alien.height >= ship.y &&
                alien.x < ship.x + ship.width &&
                alien.x + alien.width > ship.x) {
                gameOver = true;
            }
        }
    }

    // Mostrar el puntaje en blanco
    context.fillStyle = "white";
    context.font = "20px Courier New";
    context.fillText("Puntaje: " + score, 10, 30);

    // Actualizar y dibujar las balas
    context.fillStyle = "red";
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y += bulletVelocity;
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Verificar colisión entre la bala y los alienígenas
        for (let j = 0; j < aliens.length; j++) {
            let alien = aliens[j];
            if (bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.height + bullet.y > alien.y) {
                // Colisión detectada, eliminar alienígena y bala
                aliens.splice(j, 1);
                bullets.splice(i, 1);
                i--; // Ajustar índice debido a la eliminación
                score += 10; // Incrementar el puntaje
                break; // Salir del bucle de alienígenas
            }
        }

        // Eliminar las balas que están fuera del canvas
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Solicitar la siguiente actualización
    requestAnimationFrame(update);
}

function moveShip(e) {
    // Mover la nave a la izquierda o derecha según la tecla presionada
    if (e.code === "ArrowLeft" && ship.x - shipvelocityX >= 0) {
        ship.x -= shipvelocityX; // Mover a la izquierda
    } else if (e.code === "ArrowRight" && ship.x + shipvelocityX + ship.width <= boardWidth) {
        ship.x += shipvelocityX; // Mover a la derecha
    }
}

function shoot() {
    // Disparar una bala desde la posición de la nave
    let bulletX = ship.x + ship.width / 2 - bulletWidth / 2;
    let bulletY = ship.y;
    bullets.push({
        x: bulletX,
        y: bulletY,
        width: bulletWidth,
        height: bulletHeight
    });
}

function moveAliens() {
    // Mover los alienígenas hacia abajo
    for (let i = 0; i < aliens.length; i++) {
        aliens[i].y += tileSize;
    }

    // Crear nuevas filas de alienígenas en la parte superior
    if (aliens.length < alienRows * alienColumns) {
        createAliens();
    }
}

function resetGame() {
    // Reiniciar el juego
    gameOver = false;
    score = 0;
    bullets = [];
    aliens = [];
    createAliens();
    requestAnimationFrame(update);
}
