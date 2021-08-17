window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const playerWin = document.querySelector(".player-winner");
    const start = document.querySelector(".start");
    const restart = document.querySelector(".restart");
    const turn = document.querySelector(".turn");
    const ctx = canvas.getContext("2d");
    const size = 40;
    const g_width = 400;
    const g_height = 400;
    canvas.width = g_width;
    canvas.height = g_height;

    var player, runGame = false;
    var mark;
    function settingGame() {
        // draw grid col
        for (let i = 1; i < g_width / size; i++) {
            ctx.beginPath();
            ctx.lineWidth = "1"
            ctx.strokeStyle = "#bdc3c7";
            ctx.moveTo(size * i, 0);
            ctx.lineTo(size * i, g_height);
            ctx.stroke();
        }
        // draw grid row
        for (let i = 1; i < g_height / size; i++) {
            ctx.beginPath();
            ctx.moveTo(0, size * i);
            ctx.lineTo(g_width, size * i);
            ctx.stroke();
        }
        // matrix mark
        mark = [];
        for (let i = 0; i < 10; i++) {
            let tg = [];
            for (let j = 0; j < 10; j++) {
                tg.push(0);
            }
            mark.push(tg);
        }
        player = 1;
    }
    settingGame();

    // draw circle (player 1)
    function drawCircle(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = "green";
        ctx.lineWidth = "4"
        ctx.arc(x * size + 20, y * size + 20, 12, 0, 2 * Math.PI);
        ctx.stroke()
    }
    // draw X (player 2)
    function drawX(x, y) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = "4"
        ctx.moveTo(x * size + 10, y * size + 10);
        ctx.lineTo(x * size + 30, y * size + 30);
        ctx.moveTo(x * size + 30, y * size + 10);
        ctx.lineTo(x * size + 10, y * size + 30);
        ctx.stroke()
    }

    //start game
    start.addEventListener("click", () => {
        runGame = true;
        start.classList.remove("open");
        // turn player
        turn.textContent = "Turn player 1";
        turn.classList.add("open");
        turn.classList.add("player1");
    });

    // player click
    canvas.addEventListener("click", (e) => {
        if (!runGame) return;
        let x = Math.floor(e.offsetX / size);
        let y = Math.floor(e.offsetY / size);
        if (player === 1 && mark[y][x] === 0) {
            drawCircle(x, y);
            mark[y][x] = player;
            // display turn
            turn.textContent = "Turn player 2";
            turn.classList.remove("player1");
            turn.classList.add("player2");
            // check win
            if (check(y, x)[0]) {
                drawLineWin(check(y, x)[1], check(y, x)[2], check(y, x)[3], check(y, x)[4], player);
                displayPlayerWin(player);
                restart.classList.add("open");
            }
            player = 2;
        } else if (player === 2 && mark[y][x] === 0) {
            drawX(x, y);
            mark[y][x] = player;
            // display turn
            turn.textContent = "Turn player 1";
            turn.classList.remove("player2");
            turn.classList.add("player1");
            // check win
            if (check(y, x)[0]) {
                drawLineWin(check(y, x)[1], check(y, x)[2], check(y, x)[3], check(y, x)[4], player);
                displayPlayerWin(player);
                restart.classList.add("open");
            }
            player = 1;
        }
    });

    // check player win
    function check(y, x) {
        // mark line win
        let x1, y1, x2, y2;

        // horizontal
        let count = 0;
        let col = x;
        while (col >= 0) {
            if (mark[y][col] === mark[y][x]) {
                count++;
            } else break;
            col--;
        }
        x1 = y; y1 = col + 1;
        col = x + 1;
        while (col < g_width / size) {
            if (mark[y][col] === mark[y][x]) {
                count++;
            }
            else break;
            col++;
        }
        x2 = y; y2 = col - 1;
        if (count >= 5) return [true, x1, y1, x2, y2];
        // vertically
        count = 0;
        let row = y;
        while (row >= 0) {
            if (mark[row][x] === mark[y][x]) {
                count++;
            } else break;
            row--;
        }
        x1 = row + 1; y1 = x;
        row = y + 1;
        while (row < g_height / size) {
            if (mark[row][x] === mark[y][x]) {
                count++;
            }
            else break;
            row++;
        }
        x2 = row - 1; y2 = x;
        if (count >= 5) return [true, x1, y1, x2, y2];
        // diagonally
        // left to right
        count = 0;
        row = y; col = x;
        while (row >= 0 && col >= 0) {
            if (mark[row][col] === mark[y][x]) {
                count++;
            } else break;
            row--; col--;
        }
        x1 = row + 1; y1 = col + 1;
        row = y + 1; col = x + 1;
        while (row < g_height / size && col < g_width / size) {
            if (mark[row][col] === mark[y][x]) {
                count++;
            } else break;
            row++; col++;
        }
        x2 = row - 1; y2 = col - 1;
        if (count >= 5) return [true, x1, y1, x2, y2];
        // right to left
        count = 0;
        row = y; col = x;
        while (row >= 0 && col < g_width / size) {
            if (mark[row][col] === mark[y][x]) {
                count++;
            } else break;
            row--; col++;
        }
        x1 = row + 1; y1 = col - 1;
        row = y + 1; col = x - 1;
        while (row < g_height / size && col >= 0) {
            if (mark[row][col] === mark[y][x]) {
                count++;
            } else break;
            row++; col--;
        }
        x2 = row - 1; y2 = col + 1;
        if (count >= 5) return [true, x1, y1, x2, y2];
        return [false, 0, 0, 0, 0];
    }

    // draw line win
    function drawLineWin(x1, y1, x2, y2, player) {
        if (player === 1) ctx.strokeStyle = "green";
        else ctx.strokeStyle = "red";
        ctx.lineWidth = "4";
        ctx.moveTo(y1 * size + size / 2, x1 * size + size / 2);
        ctx.lineTo(y2 * size + size / 2, x2 * size + size / 2);
        ctx.stroke();
        runGame = false;
    }
    //  display player win
    function displayPlayerWin(player) {
        playerWin.textContent = "Player " + player + " win";
        playerWin.classList.add("open");
    }

    // restart 
    restart.addEventListener("click", () => {
        ctx.clearRect(0, 0, g_width, g_height);
        settingGame();
        runGame = false;
        restart.classList.remove("open");
        playerWin.classList.remove("open");
        start.classList.add("open");
        turn.classList.remove("open");
        turn.classList.remove("player1");
        turn.classList.remove("player2");
    });
});