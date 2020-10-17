const handpose = require("@tensorflow-models/handpose");
const tf = require("@tensorflow/tfjs");

let video = document.querySelector("#videoElement");

if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:'true'})
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err)=>{
        console.log("Error from webcam! Need fix!");
    });
}