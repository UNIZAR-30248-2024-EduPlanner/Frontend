import { Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import ModalComponent from "../../Components/ModalHorario";
import ModalComponentcreate from "../../Components/ModalEditarHorarios";
import { useState } from "react";

const AlumnoMenu = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Datos de prueba para el modal
    const listaEventos = [
        {
            id: "1",
            subject_code: "30000",
            name: "Programación 1",
            start_time: "18:00",
            end_time: "20:00",
            place: "Aula A.11",
            group: "412",
            descripcion: "Sesión de prácticas",
            subject_id: "10000"
        },
        {
            id: "2",
            name: "Estudiar GSOFT",
            start_time: "13:00",
            end_time: "16:00",
            place: "Biblioteca",
            descripcion: "Estudiar GSOFT para sacar un 10.",
            user_id: "44"
        }
    ];

    // Lista completa de eventos
    const listaCompletaEventos = [
        { id: "horario1", name: "Matematicas I", starting_date: "2024-11-4", end_date: null, group_name: "Grupo A", periodicity: null, description: null, start_time: "10:00:00", end_time: "12:00:00", subject_id: "1", type: null, place: "Aula A.11" },
        { id: "horario2", name: "Matematicas I", starting_date: "2024-11-5", end_date: null, group_name: "Grupo A", periodicity: null, description: null, start_time: "14:00:00", end_time: "16:00:00", subject_id: "1", type: null, place: "Aula A.11" },
        { id: "horario3", name: "Matematicas I", starting_date: "2024-11-6", end_date: null, group_name: "Grupo A", periodicity: null, description: null, start_time: "09:00:00", end_time: "11:00:00", subject_id: "1", type: null, place: "Aula A.11" },
        { id: "horario4", name: "Matematicas I", starting_date: "2024-11-4", end_date: null, group_name: "Grupo B", periodicity: null, description: null, start_time: "12:00:00", end_time: "14:00:00", subject_id: "1", type: null, place: "Aula A.11" },
        { id: "horario5", name: "Matematicas I", starting_date: "2024-11-5", end_date: null, group_name: "Grupo B", periodicity: null, description: null, start_time: "16:00:00", end_time: "18:00:00", subject_id: "1", type: null, place: "Aula A.11" },
        { id: "horario6", name: "Matematicas I", starting_date: "2024-11-6", end_date: null, group_name: "Grupo B", periodicity: null, description: null, start_time: "11:00:00", end_time: "13:00:00", subject_id: "1", type: null, place: "Aula A.11" },
        { id: "horario7", name: "Fisica y electronica", starting_date: "2024-11-7", end_date: null, group_name: "Grupo C", periodicity: null, description: null, start_time: "09:00:00", end_time: "11:00:00", subject_id: "2", type: null, place: "Aula A.11" },
        { id: "horario8", name: "Fisica y electronica", starting_date: "2024-11-7", end_date: null, group_name: "Grupo C", periodicity: null, description: null, start_time: "11:00:00", end_time: "13:00:00", subject_id: "2", type: null, place: "Aula A.11" },
        { id: "horario9", name: "Fisica y electronica", starting_date: "2024-11-8", end_date: null, group_name: "Grupo C", periodicity: null, description: null, start_time: "10:00:00", end_time: "12:00:00", subject_id: "2", type: null, place: "Aula A.11" }
    ];

    // Función para abrir el modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Función para manejar la apertura de un modal con datos específicos
    const handleOpenModal = (data) => {
        setModalData(data);
        onOpen();
    };

    return (
        <div>
            <div>
                <Button size="lg" onClick={openModal}>
                    Abrir editar horario
                </Button>
            </div>
            <div className="flex justify-center items-center h-screen">
                <Button size="lg" onClick={() => handleOpenModal(listaCompletaEventos[0])}>
                    Abrir Modal horario prueba
                </Button>

                <Button size="lg" onClick={() => handleOpenModal(listaEventos[1])}>
                    Abrir Modal personal prueba
                </Button>

                <ModalComponent
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    title={modalData?.name}
                    date_start={modalData?.start_time}
                    date_finish={modalData?.end_time}
                    place={modalData?.place || ""}
                    group={modalData?.group_name || null}
                    descripcion={modalData?.description}
                    creador={modalData?.subject_id || modalData?.user_id}
                    onAccept={onOpenChange}
                />

                <ModalComponentcreate
                    isOpen={isModalOpen}
                    onOpenChange={closeModal}
                    listaCompletaEventos={listaCompletaEventos} ç
                />
            </div>
        </div>
    );
};

export default AlumnoMenu;



