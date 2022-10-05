import { Box, Flex, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { doc, getDoc, onSnapshot, orderBy, where } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, db, query } from "../components/firebase";


const Calificaciones = () => {
  let params = useParams();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {

    const u = query(doc(db, "users", params.uid));
    getDoc(u).then((r) => {

      setUser(r.data()['name']);
    });


    const q = query(collection(db, "detections"), where('uid', '==', params.uid), orderBy("created_at", "desc"));
    // const res = await getDocs(q);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let allItems = [];

      querySnapshot.forEach((doc) => {
        allItems.push({
          ...doc.data(), id: doc.id,
          created_at: doc.data()['created_at'].toDate(),
          start_date: doc.data()['start_date'].toDate(),
          end_date: doc.data()['end_date'].toDate(),
        });

      });
      setItems(allItems);

    });
    return () => unsubscribe()
  }, []);

  return (
    <div className="App">
      <main>


        <Flex>
          <Box>
            Calificaciones del alumno: {user}

            <TableContainer>
              <Table variant='simple' bg="white">
                <Thead>
                  <Tr>
                    <Th>Fecha</Th>
                    <Th>Tiempo</Th>
                    <Th>Señas Correctas</Th>
                  </Tr>
                </Thead>
                <Tbody>

                  {items.map((user) => (
                    <Tr key={user.id}>
                      <Td>{moment(user.created_at).format("DD/MM/YYYY HH:mm")}</Td>
                      <Td>{
                        moment.duration(moment(user.end_date).diff(moment(user.start_date))).minutes()
                      }"</Td>
                      <Td>{user.detections_length}</Td>
                    </Tr>
                  ))}
                </Tbody>

              </Table>
            </TableContainer>
          </Box>

        </Flex>
      </main>
    </div>
  )
}

export default Calificaciones;