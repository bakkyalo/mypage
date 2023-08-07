let canvas = document.getElementById("gameCanvas");
let img = new Image();
img.src = "png/block.png";

let context = canvas.getContext("2d");


const board = [];
for( let j = 0; j <= 20; j++) {
    board[j] = [];
    for(let i = 0; i <= 10; i++) {
        board[j][i] = 0;
    }
}


window.onload = () => {

    // let context = document.getElementById("gameCanvas").getContext("2d");

    // let img = new Image();
    // img.src = "./block.png";

    // img.onload = () => {
        // Create first board
        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 20; j++) {
                let x = 24 * i;
                let y = 24 * j;
                context.drawImage(img, 0, 0, 24, 24, x, y, 24, 24);
            }
        }
    // }


    showTetromino(0, 2, 2, 0);
    showTetromino(1, 2, 2, 0);
    showTetromino(2, 5, 2, 2);
    showTetromino(3, 5, 10, 3);
    showTetromino(4, 7, 15, 4);
    showTetromino(5, 2, 10, 4);
    showTetromino(6, 2, 18, 5);
    showTetromino(7, 7, 8, 4);

}




const Tetrominos = [
    [],
    [[0, 0], [0, 1], [0, 2], [0, -1]],  // I
    [[0, 0], [0, -1], [-1, 0], [1, 0]], // T
    [[0, 0], [0, 1], [1, 1], [0, -1]],  // L
    [[0, 0], [0, 1], [-1, 1], [0, -1]], // 逆L
    [[0, 0], [1, 0], [1, 1], [0, -1]],  // S
    [[0, 0], [0, 1], [1, 0], [1, -1]],  // Z
    [[0, 0], [1, 0], [0, 1], [1, 1]]    // O
]


const showTetromino = (minoID, posx, posy, rot) => {
    const tetromino = Tetrominos[minoID];
    for ( let [dx, dy] of tetromino ) {
        // 回転する
        if(rot < 0) {
            for(let r = 0; r >= rot; r--) {
                [dx, dy] = [-dy, dx];
            }
        } else {
            for (let r = 0; r <= rot; r++) {
                [dx, dy] = [dy, -dx];
            }
        }

        // 実際に挿入する
        let x = 24 * (posx + dx);
        let y = 24 * (posy + dy);


        context.drawImage(img, 24 * minoID, 0, 24, 24, x, y, 24, 24);
    }




}

