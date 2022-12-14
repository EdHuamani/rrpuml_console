import {
  Box, Center, Checkbox, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react';
import { onSnapshot, orderBy, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { collection, db, query } from "../components/firebase";


import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { Link } from 'react-router-dom';

export default function TableCalificaciones() {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const currentUser = useSelector((state) => state.current);
  const [date, setDate] = useState(new Date());
  const [showAll, setShowAll] = useState(true);

  const showAllItems = async (e) => {
    setShowAll(e.target.checked);
  }

  const getData = () => {
    return showAll ? data : items;
  }
  const changeDate = async (iDate) => {
    setItems([]);
    let closeTime = structuredClone(iDate);
    closeTime.setHours(23, 59, 59);
    const filterData = data.filter((item) => {
      return item.created_at.getTime() >= iDate.getTime() && item.created_at.getTime() <= closeTime.getTime();
    });
    setItems(filterData);

    setDate(iDate);
  }


  useEffect(() => {

    const q = query(collection(db, "detections"), where('uid', '==', currentUser.uid), orderBy("created_at", "desc"));
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
      setData(allItems);

    });
    return () => unsubscribe()
  }, []);

  return (
    <>
      <Box>
        <Text align="left" fontSize='2xl'>Mis Calificaciones</Text>
      </Box>
      <Box w="700px" mt="4">
        <Box display="flex" alignItems="center" mb="4">
          <Center h='40px' mx="8">
            <Checkbox isChecked={showAll} onChange={showAllItems} /> Ver todos
          </Center>
          <Box w="180px" mx="8" bg="white">
            <SingleDatepicker
              name="date-input"
              date={date}
              onDateChange={changeDate}
              disabled={showAll}
            />
          </Box>
          <Link to={`/calificaciones-chart/${currentUser.uid}`} ><Text px="4" py="2" rounded={8} bg="green" color="white">Ver Avance</Text></Link>
        </Box>

      </Box>


      <Flex>
        <Box>

          <TableContainer>
            <Table variant='simple' bg="white">
              <Thead>
                <Tr>
                  <Th>Fecha</Th>
                  <Th>Hora</Th>
                  <Th>Tipo Seña</Th>
                  <Th>Máxima Precisión Sesión</Th>
                  <Th>Máxima Precisión histórica</Th>
                </Tr>
              </Thead>
              <Tbody>

                {getData().map((user) => (
                  <Tr key={user.id}>
                    <Td>{moment(user.created_at).format("DD/MM/YYYY")}</Td>
                    <Td>{moment(user.created_at).format("HH:mm")}</Td>
                    {/* <Td>{
                        moment.duration(moment(user.end_date).diff(moment(user.start_date))).minutes()
                      }"</Td> */}
                    <Td>{user.detections[0]}</Td>
                    <Td>{(user.max * 100).toFixed(0)}%</Td>
                    <Td>{(user.max_history * 100).toFixed(0)}%</Td>
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