import { Box, Progress, Stack, Text } from "@chakra-ui/react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { db } from "../components/firebase";



const CalificacionesAlumnoChart = () => {
  let params = useParams();
  const [alphabets, setAlphabets] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [words, setWords] = useState([]);
  const [user, setUser] = useState('');
  const currentUser = useSelector((state) => state.current);
  // const getRanking = async () => {

  //   const q = doc(db, "ranking", currentUser.uid, word, 'ranking');
  //   const words = await query(q);
  //   words.for
  // }

  const getRanking = async () => {
    try {
      const docRef = query(collection(db, "ranking", params.uid, 'ranking'));
      const docSnap = await getDocs(docRef);
      let _iw = [];
      let _ia = [];
      let _in = [];
      if (docSnap.docs) {
        docSnap.docs.forEach((doc) => {

          const word = doc.data()['word'];
          const data = { word: word, max: doc.data()['max'] * 100 }
          if (isNaN(word)) {
            if (word.length > 1) {
              // setWords(current => [...current, data]);
              _iw.push(data);
            } else {
              // setAlphabets(current => [...current, data]);
              _ia.push(data);
            }

          } else {
            // setNumbers(current => [...current, data]);
            _in.push(data);
          }
        });
      }
      setWords(_iw);
      setNumbers(_in);
      setAlphabets(_ia);

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      // setPredictionsValue([]);
      // setPredictionsMaxValue([]);
    }
  }

  useEffect(() => {

    const u = query(doc(db, "users", params.uid));
    getDoc(u).then((r) => {

      setUser(r.data()['name']);
    });

    getRanking();
    return () => {
      setNumbers([]);
      setAlphabets([]);
      setWords([]);
    }
  }, []);

  return (
    <div className="App">
      <main>

        <Box>
          Calificaciones del alumno: {user}
          <Stack spacing={5} w="50%" mt="8" >
            {alphabets.map((item) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }} key={item.word}>
                <Text fontSize='lg' as='b' mr='2'>{item.word}</Text>
                <Box w='100%'>
                  <Progress colorScheme='red' size='md' value={item.max} bg='white' mr='2' />
                </Box>
                <Text fontSize='lg' as='b' mr='2' color='red'>{item.max}%</Text>
              </Box>
            ))}

            {numbers.map((item) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }} key={item.word}>
                <Text fontSize='lg' as='b' mr='2'>{item.word}</Text>
                <Box w='100%'>
                  <Progress colorScheme='blue' size='md' value={item.max} bg='white' mr='2' />
                </Box>
                <Text fontSize='lg' as='b' mr='2' color='blue'>{item.max}%</Text>
              </Box>
            ))}
            {words.map((item) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }} key={item.word}>
                <Text fontSize='lg' as='b' mr='2'>{item.word}</Text>
                <Box w='100%'>
                  <Progress colorScheme='green' size='md' value={item.max} bg='white' mr='2' />
                </Box>
                <Text fontSize='lg' as='b' mr='2' color='green'>{item.max}%</Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </main>
    </div>
  )
}

export default CalificacionesAlumnoChart;