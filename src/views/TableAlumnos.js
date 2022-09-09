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
  Select
} from '@chakra-ui/react'
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, registerWithEmailAndPassword } from "../components/firebase";


export default function TableAlumnos() {
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
      <>
        <Box>
          <Text align="left" fontSize='2xl'>Alumnos</Text>
        </Box>
        <Box align="left" m="3">
          <Button colorScheme='teal'  onClick={onOpen}>Crear alumno</Button>
        </Box>
        <Flex>

<Box>
<TableContainer>
<Table variant='simple' bg="white">
  <Thead>
    <Tr>
      <Th>Nombre</Th>
      <Th>Apellido</Th>
      <Th>Email</Th>
      <Th>Perfil</Th>
      <Th>Detalle</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Julieta</Td>
      <Td>Perez</Td>
      <Td>jprez@gmail.com</Td>
      <Td>alumno</Td>
      <Td><a href="#">editar</a></Td>
    </Tr>
    <Tr>
      <Td>Mario</Td>
      <Td>Perez</Td>
      <Td>mario@gmail.com</Td>
      <Td>alumno</Td>
      <Td><a href="#">editar</a></Td>
    </Tr>
    <Tr>
      <Td>Andrea</Td>
      <Td>Perez</Td>
      <Td>jprez@gmail.com</Td>
      <Td>alumno</Td>
      <Td><a href="#">editar</a></Td>
    </Tr>
    <Tr>
      <Td>Rosa</Td>
      <Td>Perez</Td>
      <Td>jprez@gmail.com</Td>
      <Td>alumno</Td>
      <Td><a href="#">editar</a></Td>
    </Tr>
  </Tbody>

</Table>
</TableContainer>
</Box>

</Flex>
<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear alumno</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
            <FormControl id="email">
                <FormLabel>Nombre</FormLabel>
                <Input type="text"  value={name}
          onChange={(e) => setName(e.target.value)}/>
              </FormControl>

              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email"  value={email}
          onChange={(e) => setEmail(e.target.value)}/>
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
       
              <FormControl id="ddd">
                <FormLabel>Perfil</FormLabel>
                <Select placeholder='Select option'>
              <option value='option1'>Option 1</option>
              <option value='option2'>Option 2</option>
              <option value='option3'>Option 3</option>
            </Select>
              </FormControl>

              <FormControl id="ddd">
                <FormLabel>Sección</FormLabel>
                <Select placeholder='Select option'>
              <option value='option1'>Option 1</option>
              <option value='option2'>Option 2</option>
            </Select>
              </FormControl>

              <Stack spacing={10}>
               
                <Button
          onClick={register}
          bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Registar
                </Button>
              </Stack>
            </Stack>
          </Box>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant='ghost'>Crear</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>


    )
  }