import AudioMotionAnalyzer from 'https://cdn.skypack.dev/audiomotion-analyzer?min';

const audioElement = document.getElementById("audio");
const containerElement = document.getElementById("container");
const fileUploadElement = document.getElementById("file-upload");


document.addEventListener( "DOMContentLoaded" , function() {
    // audiomotion
    const audioMotion = new AudioMotionAnalyzer( containerElement, {
        source: audioElement,
        mode: 10,
        height: 480,    // これがないと死ぬ
        width: 640,
        fsElement: containerElement,
        peakLine: true,
        showPeaks: true,
        // showFPS: true,
        showScaleY: true,
        outlineBars: true,
    });

    document.getElementById("version").innerText = AudioMotionAnalyzer.version; // バージョン番号の表示

    // canvas に id を付与
    const canvas = containerElement.querySelector("canvas");
    if( canvas ) {
        canvas.id = "CanvasDrawPanel";
    }

});

fileUploadElement.addEventListener( "change", e => {
    const fileBlob = e.target.files[0];
    if (fileBlob) {
        audioElement.src = URL.createObjectURL( fileBlob );
        audioElement.play();
    }
});