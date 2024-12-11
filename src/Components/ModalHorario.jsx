import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import fichaImage from '../assets/ficha.png';
import '../css/Components/ModalHorario.css';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalEditarEvento from './ModalEditarEvento';
import ModalComponent from './ModalComponent';
import { deleteCustomEvent } from '../supabase/customEvent/customEvent';
import { editCustomAcademicEventVisibility } from '../supabase/customAcademicEvent/customAcademicEvent';
import { deleteAcademicEvent } from "../supabase/academicEvent/academicEvent";


const ModalHorario = ({ isOpen, onOpenChange, title, date_start, date_finish, place, group, descripcion, creador, id, date, type }) => {
    const { user } = useAuth();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isConfirmAcademicModalOpen, setConfirmAcademicModalOpen] = useState(false);


    const eliminarEvento = async () => {
        // Lógica para eliminar el evento de la base de datos
        console.log("Evento eliminado");
        if (creador !== user.id) {
            await editCustomAcademicEventVisibility(user.id, id, false);
        } else {
            await deleteCustomEvent(id);
        }
        setConfirmModalOpen(false);
        onOpenChange(false);
        window.location.reload();
    };

    const eliminarEventoAcademico = async () => {
        // Lógica para eliminar el evento de la base de datos
        await deleteAcademicEvent(id);
        setConfirmModalOpen(false);
        onOpenChange(false);
        window.location.reload();
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader style={{ textAlign: "center" }} className="modal-header">{title}</ModalHeader>
                            <hr className="separator" />
                            <ModalBody>
                                <div>
                                    <div className="session-info">
                                        <img src={fichaImage} alt="Ficha" />
                                        <h3>{String(creador) === String(user.id) ? "Ficha del evento" : "Ficha de la sesión"}</h3>
                                    </div>
                                    <p><strong>Hora de inicio:</strong> {date_start}</p>
                                    <p><strong>Hora de finalización:</strong> {date_finish}</p>
                                    <p><strong>Espacio reservado:</strong> {place}</p>
                                    <p><strong>Grupo:</strong> {group}</p>
                                    <p><strong>Descripción:</strong> {descripcion}</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {user.role === "teacher" && (type === "Creado por profesores" || type === "Examen") && (
                                    <Button
                                        color="warning"
                                        onPress={() => {
                                            setConfirmAcademicModalOpen(true);
                                        }}
                                    >
                                        Eliminar evento
                                    </Button>
                                )}
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        setConfirmModalOpen(true);
                                    }}
                                >
                                    Ocultar evento
                                </Button>
                                {user.role === "teacher" && (type === "Creado por profesores" || type === "Examen") && (
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setEditModalOpen(true);
                                            onClose();
                                        }}
                                    >
                                        Modificar
                                    </Button>
                                )}
                                {String(creador) === String(user.id) && (
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setEditModalOpen(true);
                                            onClose();
                                        }}
                                    >
                                        Modificar
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ModalEditarEvento
                isOpen={isEditModalOpen}
                onOpenChange={setEditModalOpen}
                title={title}
                date_start={date_start}
                date_finish={date_finish}
                place={place}
                description={descripcion}
                date={date}
                type={type}
                id={id}
            />

            <ModalComponent
                isOpen={isConfirmModalOpen}
                onOpenChange={setConfirmModalOpen}
                title="Confirmar eliminación"
                texto="¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer."
                onAccept={eliminarEvento}
            />

            <ModalComponent
                isOpen={isConfirmAcademicModalOpen}
                onOpenChange={setConfirmAcademicModalOpen}
                title="Confirmar eliminación"
                texto="¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer y se vera reflejado en todos los integrantes de la asignatura."
                onAccept={eliminarEventoAcademico}
            />
        </>
    );
};

export default ModalHorario;
