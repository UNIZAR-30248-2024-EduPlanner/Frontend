import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import fichaImage from '../assets/ficha.png';
import '../css/Components/ModalHorario.css';
import { useAuth } from "../context/AuthContext";

const ModalHorario = ({ isOpen, onOpenChange, title, date_start, date_finish, place, group, descripcion, creador }) => {
    const { user } = useAuth();
    console.log(user.id);
    console.log(creador);
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="modal-header">
                            {title}
                        </ModalHeader>
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
                                    // Llamar a eliminar del calendario en la base de datos
                                    /** onDelete(); // Ejecutar la función de eliminación
                                    onClose(); // Cerrar el modal */
                                }}
                            >
                                Eliminar del calendario
                            </Button>
                            {String(creador) === String(user.id) && (
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        // Lógica para modificar el evento
                                        //onClose(); // Cerrar el modal si es necesario
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
    );
};

export default ModalHorario;
