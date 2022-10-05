import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";

import { Box, Grid, GridItem, Image, Radio, RadioGroup, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

const Aprender = () => {
  const [user, loading, error] = useAuthState(auth);
  const [alphabet, setAlphabet] = useState('A');
  const [number, setNumber] = useState('1');
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);


  return (
    <div className="App">
      <main>
        <Tabs>
          <TabList>
            <Tab>Abecedario</Tab>
            <Tab>Números</Tab>
            <Tab>Palabras</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns='repeat(5, 1fr)' columns={[1, 2]} gap={4}>
                <GridItem colSpan={2} h='10' >
                  <RadioGroup defaultValue='1' spacing={4} isInline
                    onChange={
                      function (value) {
                        setAlphabet(value)
                      }
                    }
                  >
                    <Stack spacing={4} >
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((num) => (
                        <Radio colorScheme='green' value={num}>
                          {num}
                        </Radio>
                      ))}
                    </Stack>

                  </RadioGroup>

                </GridItem>
                <GridItem colStart={4} colEnd={6} h='10' bg='papayawhip' >
                  <Box boxSize='sm'>
                    <Image src={`/assets/alphabet/${alphabet}.jpg`} />
                  </Box>
                </GridItem>
              </Grid>
            </TabPanel>
            <TabPanel>

              <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                <GridItem colSpan={2} h='10' >
                  <RadioGroup defaultValue='1'
                    onChange={
                      function (value) {
                        setNumber(value)
                      }
                    }
                  >

                    <Stack spacing={4} >
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                        <Radio colorScheme='green' value={num}>
                          {num}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>

                </GridItem>
                <GridItem colStart={4} colEnd={6} h='10' bg='papayawhip' >
                  <Box boxSize='sm'>
                    <Image src={`/assets/numbers/${number}.jpg`} />
                  </Box>
                </GridItem>
              </Grid>
            </TabPanel>
            <TabPanel>

              <Grid templateColumns='repeat(5, 1fr)' gap={4}>
                <GridItem colSpan={2} h='10' >
                  <RadioGroup defaultValue='1'>

                    <Stack spacing={5}>
                      {['Hola', 'Hasta luego'].map((num) => (
                        <Radio colorScheme='green' value={num}>
                          {num}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>

                </GridItem>
                <GridItem colStart={4} colEnd={6} h='10' bg='papayawhip' >
                  <Box boxSize='sm'>
                    <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
                  </Box>
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </main>
    </div>
  )
}

export default Aprender;