import {
  Box, CloseButton, Drawer,
  DrawerContent, Flex, HStack, Icon, IconButton, Image, Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList, Text, useColorModeValue, useDisclosure, VStack
} from '@chakra-ui/react';
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FiBell,
  FiChevronDown, FiCompass, FiEdit3, FiHome, FiMenu, FiMessageSquare, FiTrendingUp, FiUser, FiUsers, FiVideo
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link as RouteLink, Outlet, useNavigate } from "react-router-dom";
import { auth, logout } from "../components/firebase";


const LinkItems = [
  { name: 'Inicio', icon: FiHome, path: '/', allowAccess: ['alumno', 'profesor'] },
  { name: 'Reconocimiento', icon: FiVideo, path: '/reconocimiento', allowAccess: ['alumno', 'profesor'] },
  { name: 'Historial', icon: FiCompass, path: '/historial', allowAccess: ['profesor'] },
  { name: 'Mis calificaciones', icon: FiEdit3, path: '/mis-calificaciones', allowAccess: ['alumno'] },
  { name: 'Aprender seña', icon: FiTrendingUp, path: '/aprender', allowAccess: ['alumno'] },
  { name: 'Mis alumnos', icon: FiUsers, path: '/alumnos', allowAccess: ['profesor'] },
  { name: 'Comentarios', icon: FiMessageSquare, path: '/comentarios', allowAccess: ['alumno', 'profesor'] },
  // { name: 'Cerrar sesión', icon: FiSettings },
];

// var getLinks = LinkItems.filter((p) => p.allowAccess.includes('alumno'));

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [name, setName] = useState("");
  // const [profile, setProfile] = useState("");
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  // const currentUser = useSelector(selectUser);
  const currentUser = useSelector((state) => state.current);


  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading]);


  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        profile={currentUser.profile}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} name={currentUser.name} profile={currentUser.profile} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* {children} */}
        <Outlet />
      </Box>
    </Box>
  );
}


const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image height="75px" src='https://media-exp1.licdn.com/dms/image/C4E0BAQHY0YvZlG1qoQ/company-logo_200_200/0/1604777247223?e=2147483647&v=beta&t=g1l9HsGWD9QWAREutNCL4r7Rvdq4pz5bXGFbQrc2BjU' alt='Asociación de sordos región Lima' />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.filter((p) => p.allowAccess.includes(rest.profile)).map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, path, children, ...rest }) => {
  return (
    <RouteLink to={path} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </RouteLink>
  );
};
const MobileNav = ({ onOpen, name, profile, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        margin="auto"
        fontSize="lg"
        fontFamily="monospace"
        fontWeight="bold">
        Sistema Web para el reconocimiento de LSP
      </Text>

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Logo
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                {/* <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                /> */}
                <Icon as={FiUser} h={7} w={7} alignSelf={'center'} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{name}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {profile}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={logout}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};