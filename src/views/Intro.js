import { Flex, Image, Box } from '@chakra-ui/react'



export default function Intro() {
    return (
<Flex>
  <Box>
  <p>Nuestra asociación se encuentra organizada tal y como lo dispone la legislación peruana, contamos con personería jurídica y nos encontramos registrada
       en los registros públicos correspondientes. Está compuesta, por personas con discapacidad auditiva y tenemos como objetivo primordial promover la integración social 
       y el ejercicio de derechos de las personas con discapacidad (con énfasis en la auditiva) en los ámbitos culturales, laborales, educativos y legales. </p>
       

       <p> Para este propósito hemos desarrollado un conjunto de servicios que nos permiten: Identificar a las y los postulantes acordes con el perfil requerido.
     Coayuvar en los procesos de selección de personas con discapacidad para evaluaciones  accesibles y no discriminatorias.
     Asesorar para la realización de ajustes razonables en los puestos de trabajo para las personas con discapacidad.   </p>  
  </Box>

  <Box boxSize='sm'>
  <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
</Box>
</Flex>

    )
  }