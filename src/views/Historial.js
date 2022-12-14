import {
    Box, Flex, Select, Spacer, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react';
import { doc, getDoc, getDocs, where } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, collection, db, onSnapshot, query } from "../components/firebase";


const Historial = () => {
    const [user, loading, error] = useAuthState(auth);
    // const [user, loading, error] = useAuthState(userEff);
    const navigate = useNavigate();
    const [section, setSection] = useState(null);

    const getSectionUser = async () => {
        const currentUser = await getDoc(doc(db, "users", user.uid));
        if (currentUser.exists()) {
            setSection(currentUser.data()['section']);
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        getSectionUser();
    }, [user, loading]);


    return (
        <div className="App">
            <main>
                {/* <SidebarWithHeader> */}
                {section != null && <TableHistorial section={section} />}
                {/* </SidebarWithHeader> */}
                <div>
                </div>
            </main>
        </div>
    )
}

function TableHistorial(props) {
    const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    const [section, setSection] = useState('');
    const [sections, setSections] = useState([]);

    const getData = () => {
        return section === "" ? data : users;
    }

    const setSectionData = async (value) => {
        console.log("--->", value);
        setSection(value);
        setUsers([]);
        const filterData = data.filter((item) => {
            return item.section === value;
        });
        setUsers(filterData);

    }

    useEffect(() => {
        const qs = query(collection(db, "sections"));
        let sects = [];
        getDocs(qs).then((onSnapshot) => {
            onSnapshot.forEach((doc) => {
                sects.push(doc.data()['name']);
            })
        }).finally(() => {
            setSections(sects);
        });

        const q = query(
            collection(db, "users"),
            where('section', '==', props.section),
            where('profile', '==', 'alumno'),
            // orderBy("created_at", "desc"),
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {

            let allComments = [];
            querySnapshot.forEach((doc) => {
                allComments.push({ ...doc.data(), id: doc.id });

            });
            setData(allComments);

        });

        return () => unsubscribe()
    }, []);

    return (
        <>
            <Box>
                <Text align="left" fontSize='2xl'>Historial</Text>
            </Box>
            <Box w="200px" bg="white" mb={4}>
                <Select placeholder='Ver todos'
                    onChange={(e) => setSectionData(e.target.value)}
                    value={section}
                >

                    {sections.map((e) => (<option key={e} value={e}>{e}</option>))}
                </Select>
            </Box>
            <Flex>
                <Box>

                    <TableContainer>
                        <Table variant='simple' bg="white">
                            <Thead>
                                <Tr>
                                    <Th>Seccion</Th>
                                    <Th>Nombre</Th>
                                    <Th>Apellido</Th>
                                    <Th>Email</Th>
                                    <Th>Detalle</Th>
                                </Tr>
                            </Thead>
                            <Tbody>

                                {getData().map((user) => (
                                    <Tr key={user.id}>
                                        <Td>{user.section}</Td>
                                        <Td>{user.name}</Td>
                                        <Td>{user.lastname}</Td>
                                        <Td>{user.email}</Td>
                                        <Td><Link to={`/calificaciones/${user.id}`} >ver historial</Link>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>

                        </Table>
                    </TableContainer>
                </Box>

            </Flex>
        </>


    )
}

export default Historial;