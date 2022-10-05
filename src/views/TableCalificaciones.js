import {
  Box, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react';
import { onSnapshot, orderBy, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { collection, db, query } from "../components/firebase";


export default function TableCalificaciones() {
  const [items, setItems] = useState([]);
  const currentUser = useSelector((state) => state.current);



  useEffect(() => {
    // getAllUsers();
    const q = query(collection(db, "detections"), where('uid', '==', currentUser.uid), orderBy("created_at", "desc"));
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
    <>
      <Box>
        <Text align="left" fontSize='2xl'>Mis Calificaciones</Text>
      </Box>
      <Flex>
        <Box>

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
    </>


  )
}