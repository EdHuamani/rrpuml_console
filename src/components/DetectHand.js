// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen

///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState } from "react";
///////// NEW STUFF ADDED USE STATE
import '@tensorflow/tfjs-backend-webgl';

// import logo from './logo.svg';
import { Box, Button, ButtonGroup, Center, Image, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import * as handpose from "@tensorflow-models/handpose";
import axios from "axios";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
///////// NEW STUFF IMPORTS
import thumbs_up from "./thumbs_up.png";
import victory from "./victory.png";
///////// NEW STUFF IMPORTS

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "./firebase";

function DetectHand() {
  const currentUser = useSelector((state) => state.current);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  const [onCam, setonCam] = useState(false);
  const [predictValue, setpredictValue] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [predictionsValue, setPredictionsValue] = useState([]);
  // const [captureGesto, setcaptureGesto] = useState(false);
  const [detectObject, setdetectObject] = useState(false);
  const images = { thumbs_up: thumbs_up, victory: victory };
  const [isBusy, setIsBusy] = useState(false);
  //  intervalID = 0;
  const [intervalID, setIntervalID] = useState(0);
  // type
  const [type, setType] = useState('alphabet');

  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    var t = typeof window.detectHand;
    console.log("Handpose model loaded.", t);
    //  Loop and detect hands
    setIntervalID(
      setInterval(() => {
        if (!window.detectHand) {
          detect(net);
        };
      }, 300)

    );
  };

  const startRecog = () => {
    setStartDate(new Date());
    setonCam(true);
    runHandpose();
  }



  const nextRecog = () => {

    // Set canvas height and width
    canvasRef.current.width = 0;
    canvasRef.current.height = 0;
    window.detectHand = false;
    setpredictValue('');
    // setonCam(true);
    clearInterval(intervalID);
    runHandpose();
  }



  const offRecog = async () => {
    if (isBusy) {
      return;
    }

    setIsBusy(true);

    setEndDate(new Date())
    canvasRef.current.width = 0;
    canvasRef.current.height = 0;
    setonCam(false);
    clearInterval(intervalID);
    await saveProgress();
    setIsBusy(false);
  }

  const saveProgress = async () => {
    try {
      if (currentUser.profile === 'profesor' || !predictValue) return;
      const created_at = serverTimestamp();
      const data = {
        uid: currentUser.uid,
        start_date: startDate,
        end_date: new Date(),
        detections_length: predictionsValue.length,
        detections: predictionsValue,
        created_at,
        section: currentUser.section,
      };
      console.log(data);
      await addDoc(collection(db, `detections`), data);
      // const ref = `comments/${comment_id}`;

      /// update status
      // await setDoc(doc(db, ref), {
      //   state: "atendido"
      // }, { merge: true });
      alert("Progreso guardado, correctamente");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const sendImage = (image) => {
    if (detectObject) {
      alert("no envia");
      return;
    }
    const Url = `http://localhost:55001/predict/${type}`;
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
        setPredictionsValue(current => [...current, response.data.predict])
        //handle success
      }).catch((error) => {
        console.log(error);
        //handle error
      });
  }


  const detect = async (net) => {

    // Check data is available
    if (detectObject) {
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
        if (confidence > 0.92) {
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





  return (
    <div className="App">
      <Center>

        <RadioGroup defaultValue='alphabet' onChange={
          function (value) {
            setType(value)
          }
        }>
          <Stack spacing={4} direction='row'>

            {[{ id: "alphabet", title: "Abecedario" }, { id: "numbers", title: "Número" }, { id: "words", title: "Palabras" }].map((num) => (
              <Radio key={num.id} colorScheme='green' value={num.id} isDisabled={onCam}>
                {num.title}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Center>
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
          }} />}


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
        top: 650,
        right: 0,
        textAlign: "center",
        height: 70,
      }}>

        <div>
          {predictValue && <Text fontSize='3xl'>Gesto detectado: {predictValue}</Text>}
        </div>
        {!onCam &&
          <ButtonGroup gap='3'>
            <Button onClick={startRecog} colorScheme='teal' size='lg'>
              Empezar reconocimiento
            </Button>
          </ButtonGroup>
        }

        {onCam && <ButtonGroup gap='3'>
          <Button onClick={nextRecog} colorScheme='teal' size='lg'>
            Cotinuar
          </Button>
          <Button onClick={offRecog} colorScheme='yellow' size='lg' display={onCam}>
            Detener
          </Button>
        </ButtonGroup>}

      </Box>

    </div>

  );
}
export default DetectHand;
