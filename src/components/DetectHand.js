// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen

///////// NEW STUFF ADDED USE STATE
import React, { useEffect, useRef, useState } from "react";
///////// NEW STUFF ADDED USE STATE
import '@tensorflow/tfjs-backend-webgl';

// import logo from './logo.svg';
import { Box, Button, ButtonGroup, Center, Image, Progress, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import * as handpose from "@tensorflow-models/handpose";
import axios from "axios";
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "./utilities";
///////// NEW STUFF IMPORTS
///////// NEW STUFF IMPORTS

import { addDoc, collection, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "./firebase";

function DetectHand() {
  const currentUser = useSelector((state) => state.current);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK

  const [onCam, setonCam] = useState(false);
  const [predictValue, setpredictValue] = useState('');
  const [startDate, setStartDate] = useState(null);

  const [predictionsValue, setPredictionsValue] = useState([]);
  const [predictionsMaxValue, setPredictionsMaxValue] = useState([]);
  // const [captureGesto, setcaptureGesto] = useState(false);


  const [isBusy, setIsBusy] = useState(false);
  const [isPredictBusy, setIsPredictBusy] = useState(false);

  const [photoTemporary, setPhotoTemporary] = useState(null);
  // const [activePrediction, setActivePrediction] = useState(false);

  // type
  const [type, setType] = useState('alphabet');
  const [word, setWord] = useState('A');
  const [count, setCount] = useState(0);

  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const words = [
    "Yo",
    "Tú",
    "Mío",
    "Hombre",
    "Mujer",
    "¿Quién?",
    "Perú",
    "Casa",
    "Nombre",
    "Amigo"
  ];
  const getWords = type === "alphabet" ? alphabet : type === "numbers" ? numbers : words;
  // const net = handpose.load();
  var t = typeof window.detectHand;
  var tt = typeof window.activePrediction;

  useEffect(() => {

  }, []);
  ///////// NEW STUFF ADDED STATE HOOK


  const runHandpose = async () => {
    console.log("1_____> runHandpose");
    const net = await handpose.load();
    var t = typeof window.detectHand;
    console.log("Handpose model loaded.", t);
    //  Loop and detect hands
    // if (!onCam) return;
    setInterval(() => {
      console.log("3 ----> interval");

      if (!window.detectHand && window.activePrediction) {
        detect(net);
      }
    }, 1000)
    // window.intervalid = setInterval(async () => {
    //   console.log("----------------------------->", window.intervalid, new Date());
    //   if (!window.detectHand) {
    //     await detect(net);
    //   };
    // }, 300)

  };

  const startRecog = async () => {
    console.log("start ==>", type, word)
    window.detectHand = false;
    setStartDate(new Date());
    setonCam(true);
    runHandpose();
    // setActivePrediction(true);
    window.activePrediction = true;
  }



  const nextRecog = async () => {
    console.log("nextRecog --------->")
    // Set canvas height and width
    setpredictValue('');

    // setTimeout(() => {
    canvasRef.current.width = 0;
    canvasRef.current.height = 0;
    window.detectHand = false;
    // await runHandpose();
    // setActivePrediction(true);
    window.activePrediction = true;
    // }, 2000)

  }



  const offRecog = async () => {
    console.log("offfffff", isBusy)
    setIsPredictBusy(false);
    // if (isBusy) {
    //   return;
    // }

    setIsBusy(true);
    window.activePrediction = false;

    canvasRef.current.width = 0;
    canvasRef.current.height = 0;
    setonCam(false);
    // clearInterval(window.intervalid);

    try {
      await saveProgress();
      for (var i = 1;i < 300;i++) {
        clearInterval(i);
      }
    }
    finally {
      setpredictValue('');
      setIsBusy(false);
    }

  }

  const saveProgress = async () => {
    try {
      if (currentUser.profile === 'profesor' || !predictionsValue.length) return;
      const created_at = serverTimestamp();
      // const docRef = collection(db, "ranking", currentUser.uid, 'ranking');
      const docRef = query(collection(db, "ranking", currentUser.uid, 'ranking'), where("word", "==", word), limit(1));
      // const docSnap = await query(docRef, where("word", "==", word));
      const docSnap = await getDocs(docRef);
      let ranking = 0;
      // if (docSnap.docs) {
      //   ranking = docSnap[0].data()['max'];
      // }
      if (docSnap.docs) {
        docSnap.docs.forEach((doc) => {
          ranking = doc.data()['max'];
        });
      }
      const maxSession = Math.max(...predictionsMaxValue);
      const maxHistory = ranking === 0 ? ranking : ranking < maxSession ? maxSession : ranking;
      const data = {
        uid: currentUser.uid,
        start_date: startDate,
        end_date: new Date(),
        detections_length: predictionsValue.length,
        detections: predictionsValue,
        max: maxSession,
        min: Math.min(...predictionsMaxValue),
        max_history: maxHistory,
        created_at,
        section: currentUser.section,
      };
      console.log(data);
      await addDoc(collection(db, `detections`), data);
      // update ranking
      if (ranking < maxSession) {
        console.log('updating ranking');
        await setDoc(docRef, { max: maxSession, word: word, created_at: created_at });
      }

      alert("Progreso guardado, correctamente");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setPredictionsValue([]);
      setPredictionsMaxValue([]);
    }
  };

  const sendImage = async (image) => {
    console.log("5 -------> sendImage")

    try {
      window.activePrediction = false;
      // await new Promise(r => setTimeout(r, 5000));

      const Url = `https://api-wiiwtnrtuq-uc.a.run.app/${type}`;
      console.info(Url);
      const data = {
        "file": image
      }
      const response = await axios.post(Url, data, {
        // timeout: 2000,
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      console.log(`[PREDICT:${response.data.predict} === WORD: ${word}]`)
      if (response.data.predict.trim() === word.trim() && response.data.score > 0.80) {
        // clearInterval(window.intervalid);

        setpredictValue(response.data.predict);
        setPredictionsValue(current => [...current, response.data.predict])
        setPredictionsMaxValue(current => [...current, response.data.score])
      } else {
        nextRecog();
      }
    } catch (error) {
      console.log(error);
      nextRecog();
    } finally {
      console.log("6 --------> sendImage finally")
      setIsPredictBusy(false);

    }
  }


  const detect = async (net) => {
    console.log("4 -----> detect");


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
          window.detectHand = true;
          setIsPredictBusy(true);
          setPhotoTemporary(imageSrc);
          ///////// NEW STUFF ADDED GESTURE HANDLING

          // Draw mesh
          const ctx = canvasRef.current.getContext("2d");
          drawHand(hand, ctx);
          await sendImage(imageSrc);
        } else {
          console.log("no pass", confidence);
        }
      }


    }
  };





  return (
    <div className="App">
      <Center>
        <RadioGroup value={type} onChange={
          async function (value) {

            if (value === "alphabet") {
              console.log("alphabet==>", alphabet[0]);
              await setWord(alphabet[0])
            }
            if (value === "numbers") {
              await setWord(numbers[0])
            }
            if (value === "words") {
              setWord(words[0])
            }

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
      <Center>
        <RadioGroup value={word} onChange={
          function (value) {
            setWord(value)
          }
        }>
          <Stack spacing={4} direction='row'>

            {getWords.map((item) => (
              <Radio key={item} colorScheme='green' value={item} isDisabled={onCam}>
                {item}
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
      {isPredictBusy && <div style={{
        left: 0,
        right: 0,
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        width: 692,
        height: 520,
      }}>
        <Image height="520px" src={photoTemporary} alt='' />
        <Progress size='sm' isIndeterminate />
      </div>}


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
      <Box style={{

        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        top: 680,
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
          {predictValue && <Button onClick={nextRecog} colorScheme='teal' size='lg'>
            Continuar
          </Button>}
          <Button onClick={offRecog} colorScheme='yellow' size='lg' display={onCam} disabled={isPredictBusy}>
            Detener
          </Button>
        </ButtonGroup>}

      </Box>

    </div>

  );
}
export default DetectHand;
