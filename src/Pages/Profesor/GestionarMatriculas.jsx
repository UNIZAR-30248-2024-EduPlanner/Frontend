import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getSubjectById } from "../../supabase/course/course";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import { FaCirclePlus, FaMagnifyingGlass } from "react-icons/fa6";
import constants from "../../constants/constants";
import { FaRegTrashAlt } from "react-icons/fa";
import ModalComponent from "../../Components/ModalComponent";
import { getStudentsBySubject } from "../../supabase/student/student";

const GestionarMatriculas = () => {
    const { id } = useParams(); // id de la asignatura
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [subject, setSubject] = useState(null)
    const [alumnos, setAlumnos] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedItemId, setSelectedItemId] = useState(null); // Nuevo estado para almacenar el ID seleccionado
    
    const recuperarAlumnos = async () => {
        const sub = await getSubjectById(id);
        if (sub.error) return console.error(sub.error);

        setSubject(sub.data);

        const als = await getStudentsBySubject(id);
        setAlumnos(als.data);
    }

    // Función para borrar el elemento seleccionado
    const borrar = async (nip) => {
        // Filtrar la lista para eliminar el elemento sin recargar la página
        setAlumnos((prevList) => prevList.filter((item) => item.nip !== nip));
        setFilteredList((prevList) => prevList.filter((item) => item.nip !== nip));

        // TODO: llamada a la API para desmatricular al alumno
    };

    // Función para manejar la apertura del modal y setear el ID seleccionado
    const handleOpenModal = (nip) => {
        setSelectedItemId(nip); // Guardar el ID del elemento que se quiere eliminar
        onOpen(); // Abrir el modal
    };    

    useEffect(() => {
        recuperarAlumnos();
    }, []);

    useEffect(() => {
        const newList = alumnos.filter(item => {
            const searchTerm = search.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) || // Busca por nombre
                (item.nip.toString().includes(searchTerm)) // Busca por NIP si está disponible
            );
        });

        setFilteredList(newList);
    }, [search]);


    return (
        <div className="flex flex-col items-center">
            <h1 className="tit"> 
                Alumnos de {subject && subject.name && subject.name} 
            </h1>
            <div className="busqueda-asig flex justify-center">
                <Input
                    className=""
                    size="lg"
                    placeholder={"Búsqueda de asignaturas"}
                    startContent={<FaMagnifyingGlass />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="lista">
                {filteredList.length > 0 ? (
                    <>
                        {filteredList.map((item, index) => (
                            <div 
                              className="lista-item cursor-auto" 
                              key={index}
                            >
                                <p className="lista-text">
                                    {item.nip} - {item.name}
                                </p>
                                <div className="lista-iconos">
                                    <Button className="trash" size="lg" onClick={() => handleOpenModal(item.nip)}>
                                        <FaRegTrashAlt />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {alumnos.map((item, index) => (
                            <div 
                              className="lista-item cursor-auto" 
                              key={index}
                            >
                                <p className="lista-text">
                                    {item.nip} - {item.name}
                                </p>
                                <div className="lista-iconos">
                                    <Button className="trash" size="lg" onClick={() => handleOpenModal(item.nip)}>
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
                texto="¿Estás seguro de que quieres desmatricular este alumno de la asignatura?"
                onAccept={() => {
                    borrar(selectedItemId); // Ejecutar borrar con el ID seleccionado
                }}
            />
            <div 
              className="create-button text-primary"
              onClick={() => navigate(constants.root + "MatricularAlumnos/" + id)}
            >
                <FaCirclePlus />
            </div>

        </div>
    )
}

export default GestionarMatriculas