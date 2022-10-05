import {
    Box, Button, FormControl, FormLabel, Input, Stack, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useColorModeValue, useDisclosure
} from "@chakra-ui/react";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { registerCommentAnswer } from "../components/comentario";
import { auth, collection, db, onSnapshot, orderBy, query } from "../components/firebase";



const CommentDetail = () => {
    let params = useParams();

    const [subject, setSubject] = useState("");
    const [comment, setComment] = useState("");


    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure()


    const register = () => {
        if (!subject || !comment) alert("Please enter name and comment");
        registerCommentAnswer(params.commentId, subject, comment);
        // alert("Registrado correctamente");
        setSubject("");
        setComment("");
        onClose();
    };

    const [comments, setComments] = useState([]);

    const getAllComments = async () => {
        const q = await query(collection(db, `answers/${params.commentId}/answers`), orderBy("created_at", "desc"));
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
        <div className="App">
            <main>
                {/* <SidebarWithHeader> */}
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    size={"large"}
                    p={8}>
                    <Text>Responder</Text>
                    <FormControl id="asunto">
                        <FormLabel>Asunto</FormLabel>
                        <Input type="text" value={subject}
                            onChange={(e) => setSubject(e.target.value)} />
                    </FormControl>

                    <FormControl id="comment">
                        <FormLabel>Comentario</FormLabel>
                        <Textarea placeholder='Here is a sample placeholder' value={comment}
                            onChange={(e) => setComment(e.target.value)} />
                    </FormControl>


                    {/* <FormControl id="ddd">
                            <FormLabel>Adjuntar</FormLabel>
                            <Input type="file" />
                        </FormControl> */}

                    <Stack spacing={10}>
                        <Button
                            onClick={register}
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Enviar
                        </Button>
                    </Stack>

                </Box>
                <br />
                Respuestas:
                <Box>

                    <TableContainer>
                        <Table variant='simple' bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Sección</Th>
                                    <Th>Alumno</Th>
                                    <Th>Asunto</Th>
                                    <Th>Comentario</Th>
                                    <Th>Fecha</Th>
                                </Tr>
                            </Thead>
                            <Tbody>

                                {comments.map((comment) => (
                                    <Tr key={comment.id}>
                                        <Td>{comment.section}</Td>
                                        <Td>{comment.user_email}</Td>
                                        <Td>{comment.subject}</Td>
                                        <Td>{comment.comment}</Td>
                                        <Td>{comment.created_at}</Td>
                                    </Tr>
                                ))}
                            </Tbody>

                        </Table>
                    </TableContainer>
                </Box>
                {/* </SidebarWithHeader> */}
                <div>

                </div>
            </main>

        </div>
    )
}

export default CommentDetail;