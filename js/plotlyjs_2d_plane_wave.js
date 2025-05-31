// --- 定数と初期値 ---
const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = -5;
const Y_MAX = 5;
const NUM_POINTS = 100; // X_RANGE, Y_RANGE の点数

// スライダー要素と値表示要素の取得
const omegaSlider = document.getElementById('omega-slider-js');
const k1Slider = document.getElementById('k1-slider-js');
const k2Slider = document.getElementById('k2-slider-js');
// const timeSlider = document.getElementById('time-slider-js');

const omegaValueSpan = document.getElementById('omega-value');
const k1ValueSpan = document.getElementById('k1-value');
const k2ValueSpan = document.getElementById('k2-value');
// const timeValueSpan = document.getElementById('time-value');

const playButton = document.getElementById('play-button');
const stopButton = document.getElementById('stop-button');

// 現在のパラメータ値
let currentOmega = parseFloat(omegaSlider.value);
let currentK1 = parseFloat(k1Slider.value);
let currentK2 = parseFloat(k2Slider.value);
// let currentTimeIndex = parseInt(timeSlider.value);
let currentTime = 0; // 時刻を0から開始し、連続的に増加させる


let animationFrameId = null; // requestAnimationFrame のID
let lastTimestamp = 0; // 前のフレームのタイムスタンプ


let animationInterval = null; // アニメーションのインターバルID
const animationSpeed = 50; // msごとのフレーム更新
const timeStepIncrement = 0.1; // 各フレームで時刻を増やす量

// Plotlyグラフのコンテナ要素
const graphDiv = document.getElementById('plane-wave-graph');

// --- メッシュグリッドの生成 (NumPyのnp.meshgridに相当) ---
function createMeshgrid(xMin, xMax, yMin, yMax, numPoints) {
    const xStep = (xMax - xMin) / (numPoints - 1);
    const yStep = (yMax - yMin) / (numPoints - 1);

    const xRange = Array.from({length: numPoints}, (_, i) => xMin + xStep * i);
    const yRange = Array.from({length: numPoints}, (_, i) => yMin + yStep * i);

    const X = [];
    const Y = [];
    for (let i = 0; i < numPoints; i++) {
        X.push(xRange); // Xは行ごとに同じ値
        Y.push(Array(numPoints).fill(yRange[i])); // Yは列ごとに同じ値
    }
    return { X, Y };
}

const { X, Y } = createMeshgrid(X_MIN, X_MAX, Y_MIN, Y_MAX, NUM_POINTS);

// --- 平面波のZ値を計算する関数 (NumPyのnp.cosに相当) ---
function generateSurfaceData(omega, k1, k2, t) {
    const Z = [];
    for (let i = 0; i < NUM_POINTS; i++) {
        const row = [];
        for (let j = 0; j < NUM_POINTS; j++) {
            row.push(Math.cos(omega * t - k1 * X[i][j] - k2 * Y[i][j]));
        }
        Z.push(row);
    }
    return Z;
}


// --- グラフの初期描画と更新関数 ---
function updateGraph() {
    const Z = generateSurfaceData(currentOmega, currentK1, currentK2, currentTime);

    // タイトル文字列を生成
    let titleString = `u(t, x₁, x₂) = cos(`;
    if (currentOmega !== 0) {
        titleString += `${currentOmega.toFixed(1)}t`;
    }
    if (currentK1 !== 0) {
        titleString += `${currentK1 < 0 ? ' + ' : ' - '}${Math.abs(currentK1).toFixed(1)}x₁`;
    }
    if (currentK2 !== 0) {
        titleString += `${currentK2 < 0 ? ' + ' : ' - '}${Math.abs(currentK2).toFixed(1)}x₂`;
    }
    titleString += `) | t = ${currentTime.toFixed(2)}`;
    // もし全ての係数が0で、引数が空になった場合の調整
    if (titleString === `u(t, x₁, x₂) = cos() | t = ${currentTime.toFixed(1)}`) {
        titleString = `u(t, x₁, x₂) = cos(0) | t = ${currentTime.toFixed(1)}`;
    }


    const layout = {
        title: {
            text: titleString,
            font: { size: 16 , color: '#333' },
        },
        scene: {
            xaxis: { title: {text: 'x₁'} },
            yaxis: { title: {text: 'x₂'} },
            zaxis: { title: {text: 'u'}, range: [-2.0, 2.0] },
        },
        margin: { l: 0, r: 0, b: 0, t: 80 },
        autosize: true, // コンテナサイズに合わせて自動調整
        uirevision: 'static'
    };

    const data = [{
        z: Z,
        x: X,
        y: Y,
        type: 'surface',
        colorscale: 'Viridis',
        cmin: -1,
        cmax: 1
    }];

    const config = {
        responsive: true, // レスポンシブ対応
        displayModeBar: true, // モードバーを表示
        displaylogo: true, // Plotlyロゴ非表示
        // modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'editInChartStudio', 'zoom2d', 'select2d', 'pan2d', 'lasso2d', 'autoScale2d', 'resetScale2d'], // 不要なボタンを削除
    }

    // グラフがまだ存在しない場合は新規作成、存在する場合は更新
    if (graphDiv.data) {
        Plotly.react(graphDiv, data, layout, config);
    } else {
        Plotly.newPlot(graphDiv, data, layout, config);
    }


    // スライダーの値表示を更新
    omegaValueSpan.textContent = currentOmega.toFixed(1);
    k1ValueSpan.textContent = currentK1.toFixed(1);
    k2ValueSpan.textContent = currentK2.toFixed(1);
}

// --- アニメーションループ関数 ---
function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp; // Initialize lastTimestamp on first call

    // Calculate elapsed time in seconds since the last frame
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert ms to seconds
    lastTimestamp = timestamp;

    currentTime += deltaTime; // Increment currentTime by actual elapsed time

    updateGraph(); // Update the graph with the new time

    animationFrameId = requestAnimationFrame(animate); // Request the next frame
}

// --- アニメーション制御関数 ---
function startAnimation() {
    if (!animationFrameId) { // Prevent multiple animation loops
        lastTimestamp = performance.now(); // Reset lastTimestamp for accurate delta time
        animationFrameId = requestAnimationFrame(animate);
    }
}

function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        lastTimestamp = 0; // Reset for next start
    }
}


// --- イベントリスナーの設定 ---

// スライダーの値変更時にグラフを更新
omegaSlider.addEventListener('input', (e) => {
    currentOmega = parseFloat(e.target.value);
    // stopAnimation(); // スライダー操作中はアニメーションを停止
    updateGraph();
});

k1Slider.addEventListener('input', (e) => {
    currentK1 = parseFloat(e.target.value);
    // stopAnimation();
    updateGraph();
});

k2Slider.addEventListener('input', (e) => {
    currentK2 = parseFloat(e.target.value);
    // stopAnimation();
    updateGraph();
});


// Play/Stopボタン
playButton.addEventListener('click', startAnimation);
stopButton.addEventListener('click', stopAnimation);

// 初期描画
window.addEventListener('DOMContentLoaded', () => {
    updateGraph();
    // 初期アニメーション再生が必要な場合は、ここで startAnimation(); を呼び出す
    // startAnimation(); // 必要であればコメントアウトを外す
});