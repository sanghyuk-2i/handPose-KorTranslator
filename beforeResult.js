const handpose = require("@tensorflow-models/handpose");
const tf = require("@tensorflow/tfjs-core");
require("@tensorflow/tfjs-backend-webgl");

const video = document.getElementById("videoElement");
const canvas = document.getElementById("handPrint");

let checkCameraActive,
    fingerPoint = {
        thumb: [0, 1, 2, 3, 4],
        indexFinger: [0, 5, 6, 7, 8],
        middleFinger: [0, 9, 10, 11, 12],
        ringFinger: [0, 13, 14, 15, 16],
        pinky: [0, 17, 18, 19, 20],
    };

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

const runCamera = () => {
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({faceingMode: "user", audio:false, video:{width: 500, height: 375}})
        .then((stream) => {
            video.srcObject = stream;
            checkCameraActive = 'true'
        })
        .catch((err)=>{
            checkCameraActive = 'false'
            console.log(`Error from webcam! Need fix! : ${err}`);
        });
    }
}

const loadHandpose = async () => {
    const model = await handpose.load();
    runCamera();
    console.log("Loaded HandPose");
    setInterval(() => {
        findHand(model);
    }, 100);
}

const findHand = async (model) => {
    if(checkCameraActive){
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
  
        canvas.width = videoWidth;
        canvas.height = videoHeight;
  
        video.width = videoWidth;
        video.height = videoHeight;
  
        const hand = await model.estimateHands(video);
        console.log(hand);

        const ctx = canvas.getContext('2d');
        canvasHandPoint(ctx, hand);
    }
}

const canvasHandPoint = (ctx, prediction) => {
    if(prediction.length > 0){
        prediction.forEach((predict) => {
            const landmark = predict.landmarks;
            fillHandPoint(ctx, landmark);
        })
    }
}

const fillHandPoint = (ctx, landmark) => {
    for(let i = 0; i < landmark.length; i++){
        const x = landmark[i][0];
        const y = landmark[i][1];

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);
        ctx.fill();
    }
}

loadHandpose();
