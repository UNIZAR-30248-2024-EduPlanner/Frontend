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

// Para el Modal
import {useDisclosure} from "@nextui-org/react";
import ModalComponent from "./ModalComponent";

const Lista = ({ lista, setLista, type, creator }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedItemId, setSelectedItemId] = useState(null); // Nuevo estado para almacenar el ID seleccionado

    useEffect(() => {
        const newList = lista.filter(item => {
            const searchTerm = search.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) || // Busca por nombre
                (item.nip.toString().includes(searchTerm)) // Busca por NIP si está disponible
            );
        });

        setFilteredList(newList);
    }, [search]);

    useEffect(() => {
        setLoading(false);
    }, [lista]);

    // Función para borrar el elemento seleccionado
    const borrar = async (id) => {
        console.log(id);
        console.log(type);

        if (type == "profesores") {
            await eliminateTeacher(id);
        } else if (type == "alumnos") {
            await eliminateStudent(id);
        } else if (type == "cursos") {
            await eliminateCourse(id);
        } else if (type == "asignaturas") {
            await eliminateSubject(id);
        }

        // Filtrar la lista para eliminar el elemento sin recargar la página
        setLista((prevList) => prevList.filter((item) => item.id !== id));
        setFilteredList((prevList) => prevList.filter((item) => item.id !== id));
    };

    // Función para manejar la apertura del modal y setear el ID seleccionado
    const handleOpenModal = (id) => {
        setSelectedItemId(id); // Guardar el ID del elemento que se quiere eliminar
        onOpen(); // Abrir el modal
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
                                <p className="lista-text">{item.name}</p>
                                <div className="lista-iconos">
                                    <Button
                                        className="edit"
                                        size="lg"
                                        onClick={() =>
                                            navigate(
                                                constants.root + creator + "Modificar/" + type + "/" + item.id + "/" + item.name + "/" + (type === "asignaturas" ? item.subject_code : item.nip)
                                            )
                                        }
                                    >
                                        <FaRegEdit />
                                    </Button>
                                    <Button className="trash" size="lg" onClick={() => handleOpenModal(item.id)}>
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
                                <p className="lista-text">{item.name}</p>
                                <div className="lista-iconos">
                                    <Button
                                        className="edit"
                                        size="lg"
                                        onClick={() =>
                                            navigate(
                                                constants.root + creator + "Modificar/" + type + "/" + item.id + "/" + item.name + "/" + (type === "asignaturas" ? item.subject_code : item.nip)
                                            )
                                        }
                                    >
                                        <FaRegEdit />
                                    </Button>
                                    <Button className="trash" size="lg" onClick={() => handleOpenModal(item.id)}>
                                        <FaRegTrashAlt />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Pasar el ID seleccionado y la función borrar al modal */}
            <ModalComponent
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="Confirmar eliminación"
                texto="¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer."
                onAccept={() => {
                    borrar(selectedItemId); // Ejecutar borrar con el ID seleccionado
                }}
            />
            <div className="create-button" onClick={() => navigate(constants.root + creator + "Crear/" + type)}>
                <FaCirclePlus />
            </div>
        </>
    );
};

export default Lista;
