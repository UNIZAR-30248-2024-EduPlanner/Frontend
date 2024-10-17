import "../css/Components/Lista.css"
import { Input, Button } from "@nextui-org/react";
import { FaMagnifyingGlass, FaCirclePlus } from "react-icons/fa6";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import constants from "../constants/constants";
import { useEffect, useState } from "react";
import Cargando from "./Cargando";
import { eliminateCourse, eliminateStudent, eliminateTeacher } from "../supabase/organization/organization";
import { eliminateSubject } from "../supabase/course/course";

//import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

const Lista = ({ lista, setLista, type, creator }) => {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [filteredList, setFilteredList] = useState([])
    const [loading, setLoading] = useState(true)
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // // Filtrar la lista en base al término de búsqueda (nombre o NIP)
    // const filteredList = lista.filter(item => {
    //     const searchTerm = search.toLowerCase();
    //     return (
    //         item.name.toLowerCase().includes(searchTerm) || // Busca por nombre
    //         (item.nip && item.nip.toString().includes(searchTerm)) // Busca por NIP si está disponible
    //     );
    // });

    useEffect(() => {
        const newList = lista.filter(item => {
            const searchTerm = search.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) || // Busca por nombre
                (item.nip.toString().includes(searchTerm)) // Busca por NIP si está disponible
            )
        })

        setFilteredList(newList)
    }, [search])

    useEffect(() => {
        setLoading(false)
    }, [lista])


    const borrar = async (id) => {
        console.log(id)
        console.log(type)
        // Si llega aquí, se ejecuta la petición para crear la organización
        if (type == "profesores") {
            // Llamada a la API para eliminar un profesor
            const res = await eliminateTeacher(id)
            console.log(res)
        } else if (type == "alumnos") {
            // Llamada a la API para eliminar un alumno
            const res = await eliminateStudent(id)
            console.log(res)
        } else if (type == "cursos") {
            // Llamada a la API para eliminar un curso
            await eliminateCourse(id)
        } else if (type == "asignaturas") {
            // Llamada a la API para eliminar un curso
            await eliminateSubject(id)
        }

        // Filtrar la lista para eliminar el elemento borrado sin recargar la página
        setLista((prevList) => prevList.filter((item) => item.id !== id))
        setFilteredList((prevList) => prevList.filter((item) => item.id !== id));
    };
    return (
        <>
            <div className="busqueda">
                <Input
                    size="lg"
                    placeholder={"Búsqueda de " + type}
                    startContent={<FaMagnifyingGlass />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="lista">
                {loading ? (
                    <Cargando />
                ) : filteredList.length > 0 ? (
                    <>
                        {filteredList.map((item, index) => (
                            <div className="lista-item" key={index}>
                                <p className="lista-text">
                                    {item.name}
                                </p>
                                <div className="lista-iconos">
                                    <Button
                                        className="edit"
                                        size="lg"
                                        onClick={() => navigate(constants.root + creator + "Modificar/" + type + "/" + item.id + "/" + item.name + "/" + (type === "asignaturas" ? item.subject_code : item.nip))}
                                    >
                                        <FaRegEdit />
                                    </Button>
                                    <Button className="trash" size="lg" onClick={() => borrar(item.id)}>
                                        <FaRegTrashAlt />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {lista.map((item, index) => (
                            <div className="lista-item" key={index}>
                                <p className="lista-text">
                                    {item.name}
                                </p>
                                <div className="lista-iconos">
                                    <Button
                                        className="edit"
                                        size="lg"
                                        onClick={() => navigate(constants.root + creator + "Modificar/" + type + "/" + item.id + "/" + item.name + "/" + (type === "asignaturas" ? item.subject_code : item.nip))}
                                    >
                                        <FaRegEdit />
                                    </Button>
                                    <Button className="trash" size="lg" onClick={() => borrar(item.id)}>
                                        <FaRegTrashAlt />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div
                className="create-button"
                onClick={
                    () => navigate(constants.root + creator + "Crear/" + type)}>
                <FaCirclePlus />
            </div>
        </>
    )
}

export default Lista