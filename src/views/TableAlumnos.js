import {
  Box, Button, Flex, FormControl,
  FormLabel,
  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure
} from '@chakra-ui/react';
import React, { useEffect, useState } from "react";
import { collection, db, editUser, onSnapshot, orderBy, query, registerWithEmailAndPassword } from "../components/firebase";


export default function TableAlumnos() {
  const [isEdit, setIsEdit] = useState(false);
  const [uid, setUid] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [profile, setProfile] = useState("");
  const [section, setSection] = useState("");
  const [users, setUsers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onEdit = (data) => {

    setUid(data.id);
    setEmail(data.email);
    setLastname(data.lastname);
    setProfile(data.profile);
    setName(data.name);
    setSection(data.section);

    onOpen();
    setIsEdit(true);
  }
  const cleanForm = () => {
    setEmail("");
    setLastname("");
    setProfile("");
    setName("");
    setSection("");
    setPassword("");
  }
  const onCloseModal = () => {
    onClose();
    cleanForm();
  }
  const onOpenCreate = () => {
    setIsEdit(false);
    onOpen();
  }
  const register = () => {
    if (!name) alert("Please enter name");
    if (isEdit) {
      editUser(uid, email, name, lastname, profile, section);
    } else {
      registerWithEmailAndPassword(email, name, lastname, profile, section);
    }
    setIsEdit(false);

    cleanForm();
    onClose();

  };

  const getAllUsers = async () => {

    const q = await query(collection(db, "users"), orderBy("created_at", "desc"));
    onSnapshot(q, (querySnapshot) => {
      let allComments = [];
      querySnapshot.forEach((doc) => {
        allComments.push({ ...doc.data(), id: doc.id });

      });
      setUsers(allComments);

    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <Box>
        <Text align="left" fontSize='2xl'>Alumnos</Text>
      </Box>
      <Box align="left" m="3">
        <Button colorScheme='teal' onClick={onOpenCreate}>Crear alumno</Button>
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

                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>{user.name}</Td>
                    <Td>{user.lastname}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.profile}</Td>
                    <Td><Button onClick={() => onEdit(user)}>Editar</Button></Td>
                  </Tr>
                ))}
              </Tbody>

            </Table>
          </TableContainer>
        </Box>

      </Flex>
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          {isEdit &&
            <ModalHeader>Editar alumno</ModalHeader>
          }
          {!isEdit &&
            <ModalHeader>Crear alumno</ModalHeader>
          }
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input type="text" value={name}
                onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <Input type="text" value={lastname}
                onChange={(e) => setLastname(e.target.value)} />
            </FormControl>
            {!isEdit && <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </FormControl>}


            <FormControl>
              <FormLabel>Perfil</FormLabel>
              <Select placeholder='Select option'
                onChange={(e) => setProfile(e.target.value)} value={profile}>
                <option value='alumno'>Alumno</option>
                <option value='profesor'>Profesor</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Sección</FormLabel>
              <Select placeholder='Select option'
                onChange={(e) => setSection(e.target.value)}
                value={section}
              >
                <option value='A14'>A14</option>
                <option value='A15'>A15</option>
              </Select>
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={register}>
              Guardar
            </Button>
            <Button variant='ghost' onClick={onCloseModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>


  )
}