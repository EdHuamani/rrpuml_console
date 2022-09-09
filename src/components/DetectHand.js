// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen

///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState, useEffect } from "react";
///////// NEW STUFF ADDED USE STATE
import { Buffer } from "buffer";
import FormData from 'form-data'

// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
import { Button, ButtonGroup , Box, Image, Text} from '@chakra-ui/react'
import axios from "axios";
///////// NEW STUFF IMPORTS
import * as fp from "fingerpose";
import victory from "./victory.png";
import thumbs_up from "./thumbs_up.png";
///////// NEW STUFF IMPORTS

function DetectHand() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  const [onCam, setonCam] = useState(false);
  const [predictValue, setpredictValue] = useState('');
  // const [captureGesto, setcaptureGesto] = useState(false);
  const [detectObject, setdetectObject] = useState(false);
  const images = { thumbs_up: thumbs_up, victory: victory };
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
    if (!window.detectHand){
      detect(net);
    };
    }, 10);
  };


  const sendImage = (image) => {
    if (detectObject){
      alert("no envia");
      return;
    }
    const Url = 'http://127.0.0.1:5000/predict';
    const data = {
      "file": image
    }
      axios.post(Url, data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
          console.log(response.data.predict);
          setpredictValue(response.data.predict);
        //handle success
      }).catch((error) => {
        console.log(error);
        //handle error
      });
  }


  const detect = async (net) => {

    // Check data is available
    if (detectObject){
      return;
    }

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        let confidence = hand[0]?.handInViewConfidence;
        if (confidence > 0.92){
          const imageSrc = webcamRef.current.getScreenshot();
          sendImage(imageSrc);
        } else {
          console.log("no pass", confidence);
        }
        window.detectHand = true;
        }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };



  const startRecog = () => {
    setonCam(true);
    runHandpose();
  }

  const offRecog = () => {
    setonCam(false);
  }


  return (
    <div className="App">
        
        {!onCam &&
        <Box bg='gray' w='100%' p={5} color='white' style={{
            left: 0,
            right: 0,
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            width: 720,
            height: 520,
        }}>
        <Image m="auto" mt={"90px"} height="250px" src='/assets/image/hand-recognition.png' alt='' />
        </Box>
        }


        {onCam &&
          <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            left: 0,
            right: 0,
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            width: 720,
            height: 520,
          }}/>}


        <canvas
          ref={canvasRef}
          id="mycanvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 720,
            height: 520,
          }}
        />
        {/* NEW STUFF */}
        {emoji !== null ? (
          <img
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 70,
            }}
          />
        ) : (
          ""
        )}

        {/* NEW STUFF */}
        <Box style={{
              
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              bottom: 550,
              right: 0,
              textAlign: "center",
              height: 70,
            }}>

              <div>
              {predictValue && <Text fontSize='3xl'>Gesto detectado: {predictValue}</Text>}
              </div>
          <ButtonGroup gap='3'>
            <Button onClick={startRecog} colorScheme='teal' size='lg'>
                Empezar reconocimiento
            </Button>

            <Button onClick={offRecog}  colorScheme='yellow' size='lg' disabled={!onCam}>
                Detener
            </Button>
          </ButtonGroup>
        </Box>

   
      </div>
  
  );
}

export default DetectHand;
