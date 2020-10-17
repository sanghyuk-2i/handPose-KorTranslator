const handpose = require("@tensorflow-models/handpose");
const tf = require("@tensorflow/tfjs-core");
require("@tensorflow/tfjs-backend-webgl");

const video = document.getElementById("videoElement");
const canvas = document.getElementById("handPrint");

const state = {
    backend: "webgl",
};

const ctx = canvas.getContext('2d');
let checkCameraActive;

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

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

loadHandpose();
