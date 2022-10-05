import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import TableComment from "./TableComments";

import { registerComment } from "../components/comentario";



const Home = () => {

  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");

  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()


  const register = () => {
    if (!subject || !comment) alert("Please enter name and comment");
    registerComment(subject, comment);
    alert("Registrado correctamente");
    setSubject("");
    setComment("");
    onClose();
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);


  return (
    <div className="App">
      <main>
        {/* <SidebarWithHeader> */}

        <Flex>
          <Button colorScheme='teal' mt={4} onClick={onOpen}>
            Nuevo
          </Button>
        </Flex>
        <br />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Registrar comentario</ModalHeader>
            <ModalCloseButton />
            <ModalBody>


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

            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={register}>Guardar</Button>
              <Button variant='ghost' onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <TableComment />
        {/* </SidebarWithHeader> */}
        <div>

        </div>
      </main>

    </div>
  )
}

export default Home;