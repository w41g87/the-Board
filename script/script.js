"use strict";

const interference = [
    "Welcome back Director", 
    "The Transmission/Chitchat was Interrupted/Assisted", 
    "By an unknown Resonance/Consciousness", 
    "The recollection of this event will be Evanescent/Everlasting"
];

const cleanse = [
    "The Hiss is removed/silent from the Astral Plane", 
    "You have proven/beaten the not you", 
    "We like/tolerate you very much", 
    "You are Prepared/Unprepared", 
    "for what comes next", 
    "We will speak again", 
    "in the Future/Expansion", 
    "Good work/victory, Director"
];

const departure = [
    "Another crisis/workday resolved", 
    "But scrutiny is not permitted/enjoyed", 
    "Tell the Sidekick/Pope/Snoop to leave", 
    "Please/Immediately", 
    "Before it is time to begin/become", 
    "the next task/chapter/stage", 
    "We will be with you soon, Jesse/Dylan Faden"
];

const formerQuotes = [
    [
        "Danger @#$ Director @#$ Board @#$ Broken @#$#@ Deeper @#$ Understand?", 
        "Tool @%& Other @!!# New @$#* Forbidden @$*$ Board @#*$", 
        "Given @#$#@ Former @#*# Yours ##%!#@ Necessary @#$* Go"
    ], 
    [
        "Hello #@$% Home", 
        "Alone #@$% Long @%@# Visitor @#$! Happy",
        "Locks @#$#@$ Ancient @#$#@$ Reason @#$#@$ Abalone", 
        "Void @#$@$# Nothing @#$@ Egress"
    ], 
    [
        "Welcome #@$% Speak?", 
        "Tunnel @#%! Open !#$@ Grateful",
        "Neither @#$@# Both @#$@ Hungry?", 
        "Right @#$#@$ Panini @#$@# Former @#$ Board @#$ Abalone"
    ], 
    [
        "# # # // # !? $$ *^^ () ### #", 
        "Inside @#$! Beyond @%@! Nail @#$@ Rescue @%@! House #$@ Son @#%@% Warning", 
        "House $@**@! Listen @#!# Nail @#$@ Leech @#$@ Burn @!$#@ Go"
    ]
];

const boardOnFormer = [
    [
        "The Former/Dissent", 
        "is back/not gone", 
        "It is Previous/Disappointment", 
        "and is not part of the Board/Us", 
        "We Apologize/Deny All Knowledge", 
        "for the inconvenience", 
        "You will see/face the Former", 
        "It is stealing/linking Altered Items", 
        "It builds a Competition/Not Us", 
        "You must espionage/destroy", 
        "when possible/inevitable", 
        "Do not believe/get hyped", 
        "about the Former's lies/ads", 
        "We provide/offer better Bonus Package/Health Plan", 
        "If you leave", 
        "you will be sorry/dead", 
        "and you will never work/exist", 
        "in this Torn/Cosmic Reality again", 
        "Yes"
    ], [
        "You have heard Wrong/Fake News", 
        "The Board is A-OK/Intact", 
        "The Rebel Faction/Dissent is", 
        "Former/Fired", 
        "The Crisis/Purge is over", 
        "This is not a Matter/Worry for you", 
        "You can hang up now, please"
    ]
];

const board = document.getElementById('board');
const canvas = document.getElementById('redraw');
const canvasH = document.getElementById('redraw-hiss');
const dialogue = document.getElementById('dialogue');
const transmission = document.getElementById('transmission');
const murmur = document.getElementById('murmur');
const ring = document.getElementById('ring');
const ambient1 = document.getElementById('ambient1');
const ambient2 = document.getElementById('ambient2');
const hedron = document.getElementById('hedron');
const hiss = document.getElementById('hiss');
const hissB = document.getElementById('hiss-boil');
const speaker = document.getElementById('speaker');
const ctx = canvas.getContext('2d');
const ctxH = canvasH.getContext('2d');

var state = 0;
var isTransmitting = false;
var numBoard = 36;
var numFormer = 11;

var keyBfr = [];
var hissAppeared = false;
var murmurPaused = false;
var lastBoardSound = -1;
var lastFormerSound = -1;
var videoWidth = 1920;
var videoHeight = 1080;
var lastKeyTime = Date.now();
var lastBoardFrame = Date.now();
var lastHissFrame = Date.now();

class Quote {
    constructor(input) {
        if (input) {
            this.lastIndex = -1;
            this.content = input;
            this.length = input.length;
        } else {
            this.lastIndex = -1;
            this.content = [];
            this.length = 0;
        }
    }
    getQuote() {
        while (true){
            var r = Math.random();
            r = r * this.length;
            r = parseInt(r, 10);

            if (this.length == 0) return [];
            else if (r !== this.lastIndex || this.length === 1) {
                this.lastIndex = r;
                return this.content[r];
            }
        }
    }

    add(input) {
        this.content.push(input);
        this.length++;
    }

    clear() {
        this.content = [];
        this.length = 0;
        this.lastIndex = -1
    }
}

// Initializations

var id = {};

var transmissionText = {
    welcome: new Quote(), 
    regular: new Quote(), 
    hissIncantation: new Quote(), 
    hissEncounter: new Quote(), 
    secret: new Quote(), 
    former: new Quote(formerQuotes)
};

var property = {
    isPaused: false, 
    framerate: 30,
    brightness: 1, 
    ringVol: 1, 
    ambientVol: 1, 
    ambientOn: true,
    pauseAmbient: false, 
    transmissionVol: 1,
    freq: 1,
    hissProb: 0.05,
    secretProb: 0.01, 
    formerProb: 0.03, 
    boardConst: false,
    hissConst: false,
    directory: "",
    secret: true, 
    secretPlayed: false
};

// settings methods

function init() {

    canvas.setAttribute('height', 1080);
    canvas.setAttribute('width', 1920);

    canvasH.setAttribute('height', 2048);
    canvasH.setAttribute('width', 2048);

    murmur.addEventListener('ended', queueMurmur, false);
    
    board.addEventListener('ended', queueScene, false);

    board.addEventListener('play', () => {
        function step() {
            var frametime = 1000 / property.framerate;
            if (Date.now() - lastBoardFrame > frametime) {
                ctx.drawImage(board, (1920 - videoWidth) / 2, 0, videoWidth, videoHeight);
                lastBoardFrame = Date.now();
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });

    hiss.addEventListener('play', () => {
        function step() {
            var frametime = 1000 / property.framerate;
            if (Date.now() - lastHissFrame > frametime && property.hissConst && !property.secretPlayed) {
                ctxH.drawImage(hiss, 0, 0, 2048, 2048);
                lastHissFrame = Date.now();
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    })

    // adds secret function
    document.addEventListener('keydown', e => {
        if (state === 2) return;
        console.log('keystroke');
        const currentTime = Date.now();
        if (currentTime - lastKeyTime > 1500) keyBfr = [];
        lastKeyTime = Date.now();

        const charList = 'somethingwonderful';
        
        if (charList.indexOf(e.key.toLowerCase()) === -1) {
            currentKey = null;
            keyBfr = [];
            return;
        } else {
            keyBfr.push(e.key.toLowerCase());
            console.log(keyBfr);
            if (keyBfr.join('') == 'somethingwonderful') {
                dynamite();
                keyBfr = [];
            }
        }

    }, false);

    hedron.addEventListener('click', dynamite);

    // WPE settings listener
    window.wallpaperPropertyListener = {
        setPaused: function(isPaused) {
            console.log("isPause: " + isPaused);
            if (isPaused) {
                property.isPaused = true;
                if (!murmur.ended && !murmur.paused) {
                    murmur.pause();
                    clearTimeout(id.transmission)
                    murmurPaused = true;
                }
                if (property.pauseAmbient || !property.ambientOn) {
                    ambient1.pause();
                    ambient2.pause();
                }
            } else {
                property.isPaused = false;
                if (murmurPaused) {
                    murmur.play();
                    murmurPaused = false;
                }
                if (property.pauseAmbient || !property.ambientOn) {
                    ambient1.play();
                    if (property.ambientOn) ambient2.play();
                }
            }
        },
    
        applyGeneralProperties: function(p) {
            console.log(p);
            if (p.fps) property.framerate = p.fps;
        }, 
    
        applyUserProperties: function(p) {
            console.log(p);
            var restart = false;
            var volumeChange = false;
    
            if (p.constanthiss) {
                property.hissConst = p.constanthiss.value;
                restart = true;
            }
            if (p.constantpresence) {
                property.boardConst = p.constantpresence.value;
                restart = true;
            }
    
            if (p.hotlinefrequencyminutes) property.freq = p.hotlinefrequencyminutes.value;
    
            if (p.transmissionvolume) {
                property.transmissionVol = p.transmissionvolume.value / 100;
                volumeChange = true;
            }
    
            if (p.ambientvolume) {
                property.ambientVol = p.ambientvolume.value / 100;
                volumeChange = true;
            }
    
            if (p.hotlineringvolume) {
                property.ringVol = p.hotlineringvolume.value / 100;
                volumeChange = true;
            }
    
            if (p.alwaysplayambientsound) {
                property.ambientOn = !p.alwaysplayambientsound.value;
                restart = true;
            }
    
            if (p.hissprobability) property.hissProb = p.hissprobability.value / 100;
    
            if (p.secret) property.secret = p.secret.value;
    
            if (p.welcomemessages) transmissionText.welcome = new Quote(parseText(p.welcomemessages.value));
    
            if (p.hissincantation) transmissionText.hissIncantation = new Quote(parseText(p.hissincantation.value));
    
            if (p.regulartransmissions) transmissionText.regular = new Quote(parseText(p.regulartransmissions.value));
    
            if (p.hissencountermessages) transmissionText.hissEncounter = new Quote(parseText(p.hissencountermessages.value));
    
            if (p.ambientsoundplayswhenpaused) property.pauseAmbient = !p.ambientsoundplayswhenpaused.value;
    
            if (volumeChange) adjVolume();
    
            if (restart) {
                state = 0;
                stopAll();
                property.secretPlayed = false;
                setTimeout(intro, 100);
            }
        }
    }
    
}

function reset() {
    
}

function adjVolume() {
    murmur.volume = property.transmissionVol;
    ring.volume = property.ringVol;
    ambient1.volume = property.ambientVol * 0.5;
    ambient2.volume = property.ambientVol * 0.5;
}

// helpers

function parseText(input) {
    let bfr = [];
    let output = [];
    while(true) {
        var i = input.indexOf('>');
        if (i === -1) {
            bfr.push(input);
            output.push(bfr);
            break;
        } else if (i === 0) {
            output.push(bfr);
            bfr = [];
        }
        else bfr.push(input.substring(0, i));

        input = input.substring(i + 1);
    }
    return output;
}

// schedulers

function queueScene(e) {
    if (state === 3) {
        hissAppeared = true;
        fadeIn(ctx, 3);
        entry();
        return;
    }
    console.log('queue scene. state: ' + state);
    switch(state) {
        case 0:
        case 2:
            entry();
            break;
        case 1:
            if (isTransmitting || property.hissConst || property.boardConst) loop();
            else exit();
            break;
        case -1:
            let r = Math.random();
            if (r < property.formerProb && property.secret) id.former = setTimeout(showFormer, 5000);
    }
}

function queueMurmur(e) {
    if (property.isPaused) {
        id.transmission = setTimeout(queueMurmur, 100);
        return;
    }
    console.log("queueMurmur");
    if (!isTransmitting) return;
    var r;
    if (state === 3) {
        do {
            r = Math.random();
            r = r * numFormer + 1;
            r = parseInt(r, 10);
        } while(r === lastFormerSound);
        lastFormerSound = r;
        murmur.src = murmur.src = "audio/transmission_former/" + r + ".ogg";
    } else {
        do {
            r = Math.random();
            r = r * numBoard + 1;
            r = parseInt(r, 10);
        } while(r === lastBoardSound);
        lastBoardSound = r;
        if (property.hissConst && !property.secretPlayed) murmur.src = "audio/transmission_low/" + r + ".ogg";
        else murmur.src = "audio/transmission/" + r + ".ogg";
    }
    murmur.load();
    murmur.play();
}

function queueTransmission() {

    if (isTransmitting || state === 2) return;
    console.log('queue transmission');
    var r = Math.random();
    if (r < 1 / (1.2 * property.freq) && !property.isPaused) {
        if (!property.boardConst) {
            state = 0;
            queueScene(null);
        } else id.transmission = setTimeout((()=>hotline(transmissionText.regular.getQuote())), 100);
    } else id.transmissionQueue = setTimeout(queueTransmission, 5000);

}

// scene methods

function intro() {
    if (property.isPaused) {
        id.intro = setTimeout(intro, 100);
        return;
    }
    console.log("intro started");

    if (property.hissConst) {
        console.log("red filter applied");
        ctx.filter = "hue-rotate(150deg) brightness(0.7) contrast(3)";
        hiss.play();
        hissB.play();
        hissB.hidden = false;
        canvasH.hidden = false;
    }

    if (property.ambientOn) {
        ambient2.currentTime = 25;
        ambient1.loop = true;
        ambient2.loop = true;
        ambient1.play();
        ambient2.play();
    } else {
        ambient1.loop = false;
        ambient2.loop = false;
    }

    var r = Math.random();
    if (r < property.hissProb && !property.hissConst) {
        loadVideo("op_hiss");
        hissAppeared = true;
        id.hissIncursion = setTimeout(()=>hissIncur(transmissionText.hissEncounter.getQuote()), 6000);
    } else {
        loadVideo("op");
        hissAppeared = false;
    }

    board.play();

    state = 1;
    if (property.hissConst) hotline(transmissionText.hissIncantation.getQuote());
    else hotline(transmissionText.welcome.getQuote());
}

function entry() {
    videoWidth = 1920;
    videoHeight = 1080;

    console.log('entry');

    var r = Math.random();
    if (r < property.hissProb && !property.hissConst && state === 0) {
        loadVideo("entry_hiss");
        hissAppeared = true;
        id.hissIncursion = setTimeout(()=>hissIncur(transmissionText.hissEncounter.getQuote()), 12000);
    } else {
        loadVideo("entry");
        hissAppeared = false;
    }
    board.play();

    switch(state) {
        case 0:
            id.transmission = setTimeout((()=>hotline(transmissionText.regular.getQuote())), 5000);
            break;
        case 2:
            transmissionText.secret.clear();
            if (property.hissConst) {
                transmissionText.secret.add(cleanse);
                transmissionText.secret.add(departure);
            } else transmissionText.secret.add(interference);
            id.transmission = setTimeout((()=>hotline(transmissionText.secret.getQuote())), 5000);
            break;
        case 3:
            ambient1.src = "audio/hotline_loop.wav";
            ambient1.load();
            transmissionText.secret = new Quote(boardOnFormer);
            id.transmission = setTimeout((()=>hotline(transmissionText.secret.getQuote())), 5000);
            break;
    }
    
    if (property.ambientOn) {
        ambient1.loop = true;
        ambient2.loop = true;
        ambient2.currentTime = 25;
        ambient1.play();
        ambient2.play();
    } else {
        ambient1.loop = false;
        ambient2.loop = false;
    }

    state = 1;
}

function exit() {
    loadVideo("exit");
    board.play();
    state = -1;
}

function loop() {
    var r = Math.random();
    if (r < property.hissProb && !property.hissConst && !hissAppeared) {
        hissAppeared = true;
        id.hissIncursion = setTimeout(() => {
            hissIncur(transmissionText.hissEncounter.getQuote());
        }, 12000);
        loadVideo("loop_hiss");
    }
    else {
        loadVideo("loop");
        hissAppeared = false;
    }
    board.play();
}


function showHedron() {
    var r = Math.random();
    if (property.secret && r < property.secretProb && !property.secretPlayed) {
        id.hedron = setTimeout( () => {
            hedron.play();
            hedron.hidden = false;
            id.hedron = setTimeout( () => {
                hedron.hidden = true;
                hedron.pause();
            }, 5000);
        }, 5000);
    }
}

function hissIncur(strArr) {
    if (id.transmission) clearTimeout(id.transmission);
    transmission.hidden = true;
    dialogue.innerText = "";
    isTransmitting = false;
    fadeTransmission(murmur, 0.5, property.transmissionVol);
    
    id.transmission = setTimeout(()=> {
        transmit(strArr, 0);
        
    }, 2000);
}

function showFormer() {
    if (property.brightness == 0) {
        clearInterval(id.former);
        stopAll();
        state = 3;
        board.src = "video/former.webm";
        board.load();
        board.play();
        id.transmission = setTimeout(() => {
            hotline(transmissionText.former.getQuote(), 0);
        }, 100);
        setTimeout(() => {
            fadeOut(ctx, 1);
        }, 19000);
        fadeIn(ctx, 3);
    } else if (property.brightness == 1) {
        if (id.transmissionQueue) clearTimeout(id.transmissionQueue);
        fadeOut(ctx, 3);
        id.former = setInterval(showFormer, 100);
    }
}

function stopAll() {
    if (id.transmission) clearTimeout(id.transmission);
    if (id.transmissionQueue) clearTimeout(id.transmissionQueue);
    if (id.hedron) clearTimeout(id.hedron);
    if (id.hissIncursion) clearTimeout(id.hissIncursion);
    if (id.former) clearTimeout(id.former);
    if (id.fadeAudio) clearInterval(id.fadeAudio);
    if (id.fadeVideo) clearInterval(id.fadeVideo);

    console.log("cleared timeouts");
    ctx.filter = "contrast(1) brightness(1)";
    property.brightness = 1;
    transmission.hidden = true;
    canvasH.hidden = true;
    hiss.pause();
    hissB.pause();
    hissB.hidden = true;
    dialogue.innerText = "";
    isTransmitting = false;
    hedron.hidden = true;
    hedron.pause();
    board.pause();
    ambient1.pause();
    ambient2.pause();
    ambient1.currentTime = 0;
    murmur.pause();
    ring.pause();
    ring.currentTime = 0;
}

function dynamite(e) {
    stopAll();

    property.secretPlayed = true;

    state = 2;

    board.src = "video/dynamite.webm";
    board.load();

    murmur.src = "audio/dynamite.ogg";
    murmur.load();

    videoWidth = 1440;
    videoHeight = 1080;

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, 1920, 1080);

    board.play();
    murmur.play();
}

function loadVideo(fileName) {
    board.src = "video/" + fileName + ".webm";
    board.load();
}

function hotline(strArr) {
    if (isTransmitting) return;

    if (state === 3) {
        ambient1.src = "audio/transmission_former/ambient.ogg";
        ambient1.loop = false;
        ambient1.load();
        ring.src = "audio/transmission_former/intro.ogg";
    } else ring.src = "audio/ring.wav";

    if (!property.ambientOn || state === 3) {
        ambient1.pause();
        ambient1.currentTime = 0;
        ambient1.play();
    }
    ring.load();
    ring.play();
    id.transmission = setTimeout(()=>{
        transmit(strArr, 0);
    }, 4500);
    console.log("hotline: " + id.transmission);
    if (!property.hissConst && state !== 3) showHedron();
}

function transmit(strArr, index) {
    //console.log(strArr);

    // disallow a new transmission to be initiated during an existing one
    if (isTransmitting && index == 0) return;

    // paragraph reaches the end
    if (strArr.length == index) {
        // if constant hiss, keep playing the incantation
        if (property.hissConst && !property.secretPlayed) {
            id.transmission = setTimeout(() => {
                transmit(transmissionText.hissIncantation.getQuote(), 0);
            }, 100);
            isTransmitting = false;
            return;
        // else hide transmission and queue new transmissions
        } else {
            transmission.hidden = true;
            dialogue.innerText = "";
            isTransmitting = false;
            if (id.transmissionQueue) clearTimeout(id.transmissionQueue);
            fadeTransmission(murmur, 0.5, property.transmissionVol);
            id.transmissionQueue = setTimeout(queueTransmission, property.freq * 60 * 1000);
        }
    // paragraph still transmitting
    } else {
        const str = strArr[index];
        if (state === 3) speaker.innerText = "FORMER:";
        else speaker.innerText = "THE BOARD:";
        dialogue.innerText = "< " + str + " >";
        id.transmission = setTimeout(()=> {
            transmit(strArr, index + 1);
        }, str.length * 60 + 1000);
    }
    // first sentence
    if (index == 0) {
        if (id.transmissionQueue) clearTimeout(id.transmissionQueue);
        if (property.hissConst) showHedron();
        transmission.hidden = false;
        isTransmitting = true;
        queueMurmur(null);
    }
}

function fadeTransmission(target, time, max) {
    id.fadeAudio = setInterval(() => {
        if (property.isPaused) return;
        // Only fade if past the fade out point or not at zero already
        if (target.volume >= 0.02 * max) target.volume -= 0.01 * max;
        // When volume at zero stop all the intervalling
        if (target.volume <= 0.02 * max) {
            target.pause();
            target.currentTime = 0;
            target.volume = max;
            clearInterval(id.fadeAudio);
        };
    }, time * 10);
}

function fadeOut(target, time) {
    id.fadeVideo = setInterval(() => {
        if (property.isPaused) return;
        if (property.brightness >= 0.02) {
            property.brightness -= 0.01;
            target.filter = "brightness(" + property.brightness + ")";
        }
        else {
            target.filter = "brightness(0)";
            property.brightness = 0;
            clearInterval(id.fadeVideo);
        }
    }, time * 10);
}

function fadeIn(target, time) {
    id.fadeVideo = setInterval(() => {
        if (property.isPaused) return;
        if (property.brightness <= 0.98) {
            property.brightness += 0.01;
            target.filter = "brightness(" + property.brightness + ")";
        }
        else {
            target.filter = "brightness(1)";
            property.brightness = 1;
            clearInterval(id.fadeVideo);
        }
    }, time * 10);
}

init();
