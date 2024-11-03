import { Button } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import ModalComponent from "../../Components/ModalHorario";
import ModalComponentcreate from "../../Components/ModalEditarHorarios";
import { useState } from "react";

const AlumnoMenu = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // Funciones para abrir y cerrar los modales
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Datos de prueba para el modal
    const asignatura_prueba = {
        id: "1",
        subject_code: "30000",
        name: "Programación 1",
        date_start: "18:00",
        date_finish: "20:00",
        place: "Aula A.11",
        group: "412",
        descripcion: "Sesión de prácticas",
        subject_id: "10000"
    };

    const personal_prueba = {
        id: "2",
        name: "Estudiar GSOFT",
        date_start: "13:00",
        date_finish: "16:00",
        place: "Biblioteca",
        descripcion: "Estudiar GSOFT para sacar un 10.",
        user_id: "44"
    };

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
                <Button size="lg" onClick={() => handleOpenModal(asignatura_prueba)}>
                    Abrir Modal horario prueba
                </Button>

                <Button size="lg" onClick={() => handleOpenModal(personal_prueba)}>
                    Abrir Modal personal prueba
                </Button>

                <ModalComponent
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    title={modalData ? `${modalData.subject_code ? modalData.subject_code + " - " : ""}${modalData.name}` : ""}
                    date_start={modalData?.date_start}
                    date_finish={modalData?.date_finish}
                    place={modalData?.place || ""}
                    group={modalData?.group || null}
                    descripcion={modalData?.descripcion}
                    creador={modalData?.subject_id || modalData?.user_id}
                    onAccept={onOpenChange}  // Si onOpenChange controla el cierre
                />

                <ModalComponentcreate
                    isOpen={isModalOpen}
                    onOpenChange={closeModal}  // Cambiado para asegurar que funcione
                />
            </div>
        </div>
    );
};

export default AlumnoMenu;


