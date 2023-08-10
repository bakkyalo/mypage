let canvas = document.getElementById("gameCanvas");
let img = new Image();
img.src = "png/block.png";

let context = canvas.getContext("2d");

class Board {

    constructor () {
        this.isGameOvered = false;
        // 盤面を初期化する
        // this.board = [];
        this.board = new Array(22).fill().map( () => new Array(12).fill(-1) );

        for( let j = 0; j <= 21; j++) {
            this.board[j] = [];
            for(let i = 0; i <= 11; i++) {
                // 番兵さんに -1 を入れる
                if(j == 21 || i == 0 || i == 11) this.board[j][i] = -1;
                else this.board[j][i] = 0;
            }
        }
    }


    // 実際に画面に映すのはここだけ
    show() {
        // まずは消す
        context.clearRect(0, 0, 24 * 10, 24 * 20);


        for(let j = 1; j <= 20; j++) {
            for(let i = 1; i <= 10; i++) {

                let alpha = 0.9;    // opacity
                if(this.board[j][i] == 0 ) alpha = 0.2;
                if(this.board[j][i] == -1) alert("そんなことはあり得ない");

                let image_x = 24 * (this.board[j][i]);      // 画像のどの部分を drawImage するか
                let image_y = 0;
                let pos_x =  24 * (i - 1);
                let pos_y = 24 * (j - 1);

                context.globalAlpha = alpha;
                context.drawImage(img, image_x, image_y, 24, 24, pos_x, pos_y, 24, 24);
            }
        }
        // console.log(this.board);
    }

    putMino(mino) {
        if(! mino instanceof Mino) return;
        context.globalAlpha = 0.9;

        if(mino.rot < 0) mino.rot = (mino.rot + 400400) % 4;

        for(let [i, j] of Tetrominos[mino.id]) {
            // まず回転する必要がある
            for(let r = 0; r < mino.rot; r++) {
                [i, j] = [j, -i];   // 多重代入はこうする必要がある
            }

            let x = mino.posx + i;
            let y = mino.posy + j;

            // console.log("x: ", x, "y: ", y);
            if(x <= 0 || x >= 11 || y <= 0 || y >= 21) continue;
            this.board[y][x] = mino.id;

            // 別に draw する必要はない。内部データを変えるだけ
            // context.drawImage(img, image_x, image_y, 24, 24, x, y, 24, 24);
        }
    }

    moveMino(mino, dx, dy) {
        if( ! mino instanceof Mino) return;

        if(mino.rot < 0) mino.rot = (mino.rot + 400400) % 4;


        // 移動先の座標を格納しておく
        let next_pos = [];

        for(let [i, j] of Tetrominos[mino.id]) {
            // まずは回転
            for(let r = 0; r < mino.rot; r++) {
                [i, j] = [j, -i];
            }
            // console.log("i: ", i, "j: ", j);


            // なんかおかしい。this.boad の書き換えが 1 回しか起きていないように見える
            // 消す処理と置く処理は別々にしないとダメなんだぁ～
            let x = mino.posx + i;
            let y = mino.posy + j;
            let nx = x + dx;
            let ny = y + dy;
            next_pos.push([nx, ny]);

            if(x <= 0 || x >= 11 || y <= 0 || y >= 21) continue;
            if(nx <= 0 || nx >= 11 || ny <= 0 || ny >= 21) continue;

            // 消す処理
            this.board[y][x] = 0;
        }

        // 次の場所に置く
        for(let [nx, ny] of next_pos) {
            this.board[ny][nx] = mino.id
        }

        // 最後に mino の座標も変える
        mino.posx += dx;
        mino.posy += dy;
    }

    canMove(mino, dx, dy) {
        if( ! mino instanceof Mino) return;
        if(mino.rot < 0) mino.rot = (mino.rot + 400400) % 4;
        // board をコピーしておく
        let board_tmp = this.board;
        let next_pos = [];

        for(let [i, j] of Tetrominos[mino.id]) {
            // まずは回転
            for(let r = 0; r < mino.rot; r++) {
                [i, j] = [j, -i];
            }

            let x = mino.posx + i;
            let y = mino.posy + j
            let nx = x + dx;
            let ny = y + dy;

            next_pos.push( [nx, ny] );
            // とりあえず消す
            board_tmp[y][x] = 0;
        }

        // 衝突判定
        for(let [nx, ny] of next_pos) {
            if(board_tmp[ny][nx] != 0) return false;
        }

        return true;
    }


    rotateMino(mino, plus_or_minus) {

        // 例に習って次の場所を格納
        let next_pos = [];
        // 回転できるかの判定用に board をコピーしておく
        // let board_tmp = this.board;
        // ↑ これだと参照渡しみたいになるため NG
        // let board_tmp = Object.assign( {}, this.board);
        // let board_tmp = this.board.slice();
        let board_tmp = structuredClone(this.board);
        // board_tmp = Object.assign(this.board.concat();

        for(let [i, j] of Tetrominos[mino.id]) {
            // まずは回転
            for(let r = 0; r < mino.rot; r++) {
                [i, j] = [j, -i];
            }

            let x = mino.posx + i;
            let y = mino.posy + j;

            // 次の x, y はもう一回回転
            [i, j] = (plus_or_minus >= 0) ? [j, -i] : [-j, i];
            let nx = mino.posx + i;
            let ny = mino.posy + j;
            next_pos.push([nx, ny]);

            // 仮に消してみる
            board_tmp[y][x] = 0;
            // this.board[y][x] = 0;
        }

        // 次の場所に回転できるか判定
        for(let [nx, ny] of next_pos) {

            if(board_tmp[ny][nx] != 0) {
                // 回転できないということなので、何もせずに終了
                // console.log("回転できないので終わりです。");
                return false;
            } else {
                // console.log("nx: ", nx, "ny: ", ny, " は ", mino.id, " に変わりました。");
                board_tmp[ny][nx] = mino.id;
            }
            
        }

        // console.log("来ちゃった...//");

        // ここまで来れて回転できることが分かるので、実際に回転させる。
        // tmp を board に入れ直すだけ
        this.board = board_tmp;

        // mino の rot を書き換え
        if(plus_or_minus >= 0) mino.rot++;
        else mino.rot--;
        mino.rot = (mino.rot + 400400) % 4;
    }


    // Game Over するかどうかの処理
    judgeGameOver(mino) {
        for(let [i, j] of Tetrominos[mino.id]) {
            // まずは回転
            for(let r = 0; r < mino.rot; r++) {
                [i, j] = [j, -i];
            }

            let x = mino.posx + i;
            let y = mino.posy + j;
            if(this.board[y][x] != 0) {
                return true;
            }
        }
        return false;
    }

    gameOver() {
        console.log("Game Over.");
        this.isGameOvered = true;

        // まずは消す
        context.clearRect(0, 0, 24 * 10, 24 * 20);
        // 硬くする
        context.globalAlpha = 0.99;

        for(let j = 1; j <= 20; j++) {
            for(let i = 1; i <= 10; i++) {
                if(this.board[j][i] != 0) {
                    let image_x = 0;      // 画像のどの部分を drawImage するか
                    let image_y = 0;
                    let pos_x =  24 * (i - 1);
                    let pos_y = 24 * (j - 1);

                    context.drawImage(img, image_x, image_y, 24, 24, pos_x, pos_y, 24, 24);
                }
            }
        }
    }

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


class Mino {
    // ミノの番号, 現在地(x, y), 回転数
    constructor(_id, _posx, _posy, _rot) {
        this.id = _id;
        this.posx = _posx;
        this.posy = _posy;
        this.rot = _rot;

        this.tetromino = Tetrominos[_id];
    }


    // 移動に伴う property と board の書き換え
    move(dx, dy) {
        // 移動前の位置の board を 0 にする
        /*
        for([i, j] of this.tetromino) {
            board[this.posy + j][this.posx + i] = 0;
        }
         */
        // と思ったけどいいのか

        // 移動後の位置をミノ番号 (kind) にする
        this.posx += dx;
        this.posy += dy;

        /*
        for([i, j] of this.tetromino) {
            board[posy + j][dx + i] = this.kind;
        }
         */
    }

    // 動けるかどうか
    canMove(dx, dy) {
        const next_posx = this.posx + dx;
        const next_posy = this.posy + dy;

        // 移動先に何かあったら false
        for(let [i, j] of this.tetromino) {
            if(board[next_posy + j][next_posx + i]) return false;
        }
        return true;
    }
}


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




// 実質 main 関数
window.onload = () => {

    let bd = new Board();
    bd.show();

    context.globalAlpha = 0.9;

    // showTetromino(0, 2, 2, 0);
    // showTetromino(1, 2, 2, 0);
    // showTetromino(2, 6, 2, 2);
    // showTetromino(3, 5, 10, 3);
    // showTetromino(4, 7, 15, 4);
    // showTetromino(5, 2, 10, 4);
    // showTetromino(6, 2, 18, 5);
    // showTetromino(7, 7, 8, 4);
    
    let mino = new Mino(1, 5, 1, 1);
    bd.putMino(mino);
    // bd.putMino(new Mino(1, 3, 2, 1));
    // bd.putMino(new Mino(2, 7, 2, 3));
    // bd.putMino(new Mino(3, 5, 10, 4));
    // bd.putMino(new Mino(4, 7, 15, 5));
    // bd.putMino(new Mino(5, 2, 10, 5));
    // bd.putMino(new Mino(6, 2, 18, 6));
    // bd.putMino(new Mino(7, 7, 8, 5));
    bd.show();

    document.onkeydown = (e) => {
        if(!bd.isGameOvered) {
        // console.log(e);
        switch(e.key) {
            case "s":
                // 動けたら動く
                if(bd.canMove(mino, 0, 1)) {
                    bd.moveMino(mino, 0, 1);
                }
                // 動けなかったら設置して新しいミノを作る, 重なったらゲームオーバー
                else {
                    bd.putMino(mino);
                    bd.show();

                    // random id を生成する
                    const randomID = 1 + Math.floor( Math.random() * 7);
                    mino = new Mino(randomID, 5, 1, 3);

                    // game over か判定する
                    if(bd.judgeGameOver(mino) == true) {
                        bd.gameOver();
                        break;
                    }
                }
                bd.show();
                break;
            case "w":
                if(bd.canMove(mino, 0, -1)) {
                    bd.moveMino(mino, 0, -1);
                    bd.show();
                }
                break;
            case "a":
                if(bd.canMove(mino, -1, 0)) {
                    bd.moveMino(mino, -1, 0);
                    bd.show();
                }
                break;
            case "d":
                if(bd.canMove(mino, 1, 0)) {
                    bd.moveMino(mino, 1, 0);
                    bd.show();
                }
                break;
            case "k":
                bd.rotateMino(mino, -1);
                bd.show();
                break;
            case "m":
                bd.rotateMino(mino, +1);
                bd.show();
                break;
            default:
        }

        }
        debug();
    }



    // debug
    let debug = () => {
        let element = document.getElementById("debugArea");
        element.disabled = true;
        // element.textContent = "";
        element.value = "";
        for(let j = 0; j <= 21; j++) {
            for(let i = 0; i <= 11; i++) {
                if(bd.board[j][i] >= 0) element.value += " ";
                element.value += bd.board[j][i];
            }
            element.value += "\n";
        }
    }

}



