import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import fichaImage from '../assets/ficha.png';
import '../css/Components/ModalHorario.css';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalEditarEvento from './ModalEditarEvento';
import ModalComponent from './ModalComponent'; // Importa el modal de confirmación

const ModalHorario = ({ isOpen, onOpenChange, title, date_start, date_finish, place, group, descripcion, creador }) => {
    const { user } = useAuth();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); // Estado para el modal de confirmación


    const eliminarEvento = () => {
        // Lógica para eliminar el evento de la base de datos
        console.log("Evento eliminado");
        setConfirmModalOpen(false);
        onOpenChange(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="modal-header">{title}</ModalHeader>
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
                                <Button
                                    color="danger"
                                    onPress={() => {
                                        setConfirmModalOpen(true);
                                    }}
                                >
                                    Eliminar del calendario
                                </Button>
                                {String(creador) === String(user.id) && (
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setEditModalOpen(true);
                                            onClose();
                                        }}
                                    >
                                        Modificar evento
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
            />

            <ModalComponent
                isOpen={isConfirmModalOpen}
                onOpenChange={setConfirmModalOpen}
                title="Confirmar eliminación"
                texto="¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer."
                onAccept={eliminarEvento}
            />
        </>
    );
};

export default ModalHorario;
