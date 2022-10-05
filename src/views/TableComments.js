import {
  Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { collection, db, onSnapshot, orderBy, query } from "../components/firebase";
import moment from 'moment';


export default function TableComment() {
  const [comments, setComments] = useState([]);

  const getAllComments = async () => {
    const q = await query(collection(db, "comments"), orderBy("created_at", "desc"));
    onSnapshot(q, (querySnapshot) => {
      let allComments = [];
      querySnapshot.forEach((doc) => {
        allComments.push({ ...doc.data(), id: doc.id, created_at: moment(doc.created_at).format("DD/MM/YYYY") });

      });
      setComments(allComments);

    });
  };

  useEffect(() => {
    getAllComments();
  }, []);

  return (
    <>
      <Box>

        <TableContainer>
          <Table variant='simple' bg="white">
            <Thead>
              <Tr>
                <Th>Sección</Th>
                <Th>Alumno</Th>
                <Th>Asunto</Th>
                <Th>Fecha</Th>
                <Th>Estado</Th>
              </Tr>
            </Thead>
            <Tbody>

              {comments.map((comment) => (
                <Tr key={comment.id}>
                  <Td>{comment.section}</Td>
                  <Td>{comment.user_email}</Td>
                  <Td><Link to={`/comments/${comment.id}`} >{comment.subject}</Link></Td>
                  <Td>{comment.created_at}</Td>
                  {/* <Td>{comment.created_at.toDate()}</Td> */}
                  <Td>{comment.state === "nuevo" ? <Text color="green">{comment.state}</Text> : <Text color="red">{comment.state}</Text>}</Td>
                  <Td>
                    <Link to={`/comments/${comment.id}`} >Ver detalle</Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>

          </Table>
        </TableContainer>
      </Box>

    </>


  )
}