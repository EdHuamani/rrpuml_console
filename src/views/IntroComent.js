import React, { useRef, useState, useEffect } from "react";
import {
  Flex, Image, Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  Select,
  Textarea
} from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, registerWithEmailAndPassword } from "../components/firebase";


export default function IntroComent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const register = () => {
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

    return (
<Flex>
  <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            size={"large"}
            p={8}>
            <Stack >
            <FormControl id="asunto">
                <FormLabel>Asunto</FormLabel>
                <Input type="text"  value={name}
          onChange={(e) => setName(e.target.value)}/>
              </FormControl>

              <FormControl id="email">
                <FormLabel>Comentario</FormLabel>
                <Textarea placeholder='Here is a sample placeholder' />
              </FormControl>
         
       
              <FormControl id="ddd">
                <FormLabel>Adjuntar</FormLabel>
                <Input type="file"/>
              </FormControl>


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
            </Stack>
          </Box>

</Flex>

    )
  }