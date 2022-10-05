import { Box, Flex, Image } from '@chakra-ui/react'



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
        <Image src='https://media-exp1.licdn.com/dms/image/C4E0BAQHY0YvZlG1qoQ/company-logo_200_200/0/1604777247223?e=2147483647&v=beta&t=g1l9HsGWD9QWAREutNCL4r7Rvdq4pz5bXGFbQrc2BjU' alt='Dan Abramov' />
      </Box>
    </Flex>

  )
}