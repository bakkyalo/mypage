// ボタンの定義
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");

stopButton.style.display = "none";


// ここに addEventListener 書くのキモくね？
// Play button が押された時の操作
playButton.addEventListener("click", function() {
    playButton.style.display = "none";
    stopButton.style.display = "inline-block";

    // プルダウンメニュー操作
    const selectedMusic = document.getElementById("selectMusic").value;
    const jsonURL = `./json/${selectedMusic}.json`;
    // console.log(jsonURL);
    
    // JSON の楽譜を取り出す
    // fetch("./json/mondschein3.json")
    // fetch("./json/skyhigh.json")
    fetch(jsonURL)
        .then( response => {
            if(!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then( json => {
            const rightHandScore = json.rightHandScore;
            const leftHandScore = json.leftHandScore;
            const tempo = json.tempo;
            
            const piano = new Tone.Sampler({
                urls: {
                    A0: "A0.mp3",
                    C1: "C1.mp3",
                    "D#1": "Ds1.mp3",
                    "F#1": "Fs1.mp3",
                    A1: "A1.mp3",
                    C2: "C2.mp3",
                    "D#2": "Ds2.mp3",
                    "F#2": "Fs2.mp3",
                    A2: "A2.mp3",
                    C3: "C3.mp3",
                    "D#3": "Ds3.mp3",
                    "F#3": "Fs3.mp3",
                    A3: "A3.mp3",
                    C4: "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                    A4: "A4.mp3",
                    C5: "C5.mp3",
                    "D#5": "Ds5.mp3",
                    "F#5": "Fs5.mp3",
                    A5: "A5.mp3",
                    C6: "C6.mp3",
                    "D#6": "Ds6.mp3",
                    "F#6": "Fs6.mp3",
                    A6: "A6.mp3",
                    C7: "C7.mp3",
                    "D#7": "Ds7.mp3",
                    "F#7": "Fs7.mp3",
                    A7: "A7.mp3",
                    C8: "C8.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/", 
                onload: () => {
                
                    // 右手
                    const rightHandPart = new Tone.Part(((time, note) => {
                        piano.triggerAttackRelease(note.note, note.duration, time, note.velocity);
                    
                        // 鍵盤に反映させる
                        // 単音の場合
                        if(!(note.note instanceof Array)) {
                            const keyElem = document.getElementsByClassName(note.note)[0];
                            const computedStyle = window.getComputedStyle(keyElem);
                            let previousBGColor = computedStyle.backgroundColor;
                            if (note.note.includes("#") || note.note.includes("b")) {
                                previousBGColor = "black";
                                keyElem.style.backgroundColor = "#2ab8c8";
                            } else {
                                previousBGColor = "white";
                                keyElem.style.backgroundColor = "#51dff2";
                            }
                        
                        
                            const noteLengthInSeconds = Tone.Time(note.duration).toSeconds();
                            setTimeout( () => {
                                keyElem.style.backgroundColor = previousBGColor;
                            }, noteLengthInSeconds * 1000);
                        }
                        // 和音の場合
                        else {
                            for (let i = 0; i < note.note.length; i++) {
                                const keyElem = document.getElementsByClassName(note.note[i])[0];
                                const computedStyle = window.getComputedStyle(keyElem);
                                let previousBGColor = computedStyle.backgroundColor;
                                if (note.note[i].includes("#") || note.note[i].includes("b")) {
                                    previousBGColor = "black";
                                    keyElem.style.backgroundColor = "#2ab8c8";
                                } else {
                                    previousBGColor = "white";
                                    keyElem.style.backgroundColor = "#51dff2";
                                }
                            
                            
                                // duration も配列かどうかで分かれる
                                if (!(note.duration instanceof Array)) {
                                    const noteLengthInSeconds = Tone.Time(note.duration).toSeconds();
                                    setTimeout( () => {
                                        keyElem.style.backgroundColor = previousBGColor;
                                    }, noteLengthInSeconds * 1000);
                                }
                                else {
                                    const noteLengthInSeconds = Tone.Time(note.duration[i]).toSeconds();
                                    setTimeout( () => {
                                        keyElem.style.backgroundColor = previousBGColor;
                                    }, noteLengthInSeconds * 1000);
                                }
                            
                            }
                        }
                    }), rightHandScore).start();
                
                
                    // 左手
                    const leftHandPart = new Tone.Part(((time, note) => {
                        piano.triggerAttackRelease(note.note, note.duration, time, note.velocity);
                    
                        // 鍵盤に反映させる
                        // 単音の場合
                        if(!(note.note instanceof Array)) {
                            const keyElem = document.getElementsByClassName(note.note)[0];
                            const computedStyle = window.getComputedStyle(keyElem);
                            let previousBGColor = computedStyle.backgroundColor;
                            if (note.note.includes("#") || note.note.includes("b")) {
                                previousBGColor = "black";
                                keyElem.style.backgroundColor = "#6ec578";
                            } else {
                                previousBGColor = "white";
                                keyElem.style.backgroundColor = "#92eca2";
                            }
                        
                        
                            const noteLengthInSeconds = Tone.Time(note.duration).toSeconds();
                            setTimeout( () => {
                                keyElem.style.backgroundColor = previousBGColor;
                            }, noteLengthInSeconds * 1000);
                        }
                        // 和音の場合
                        else {
                            for (let i = 0; i < note.note.length; i++) {
                                const keyElem = document.getElementsByClassName(note.note[i])[0];
                                const computedStyle = window.getComputedStyle(keyElem);
                                let previousBGColor = computedStyle.backgroundColor;
                                if (note.note[i].includes("#") || note.note[i].includes("b")) {
                                    previousBGColor = "black";
                                    keyElem.style.backgroundColor = "#6ec578";
                                } else {
                                    previousBGColor = "white";
                                    keyElem.style.backgroundColor = "#92eca2";
                                }
                            
                            
                                // duration も配列かどうかで分かれる
                                if (!(note.duration instanceof Array)) {
                                    const noteLengthInSeconds = Tone.Time(note.duration).toSeconds();
                                    setTimeout( () => {
                                        keyElem.style.backgroundColor = previousBGColor;
                                    }, noteLengthInSeconds * 1000);
                                }
                                else {
                                    const noteLengthInSeconds = Tone.Time(note.duration[i]).toSeconds();
                                    setTimeout( () => {
                                        keyElem.style.backgroundColor = previousBGColor;
                                    }, noteLengthInSeconds * 1000);
                                }
                            
                            }
                        }
                    }), leftHandScore).start();

                    Tone.Transport.start();
                }
            
            }).toDestination();
        
            Tone.Transport.bpm.value = tempo;
        
        })
            
        .catch( error => {
            console.error("Fetch Error:", error);
        });

    })

stopButton.addEventListener("click", function() {
    stopButton.style.display = "none";
    playButton.style.display = "inline-block";

    Tone.Transport.stop();
    Tone.Transport.cancel();

});
// const data = JSON.parse(rawData);

