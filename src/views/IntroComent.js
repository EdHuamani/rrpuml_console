import {
  Box, Button, Flex, FormControl,
  FormLabel,
  Input,
  Modal,
  Stack, Textarea, useColorModeValue
} from '@chakra-ui/react';
import React, { useState } from "react";
import { registerComment } from "../components/comentario";



export default function IntroComent() {
  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");


  const register = () => {
    if (!subject || !comment) alert("Please enter name and comment");
    registerComment(subject, comment);
    alert("Registrado correctamente");
    setSubject("");
    setComment("");
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
        </Stack>

      </Box>

    </Flex>

  )
}