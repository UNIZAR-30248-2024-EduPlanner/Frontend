import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import ModalComponent from "./ModalComponent";
import { deleteAcademicEvent } from "../supabase/academicEvent/academicEvent";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import ModalEditarEvento from "./ModalEditarEvento";

const ModalTareas = ({ isOpen, onOpenChange, listaTareas }) => {
    const { user } = useAuth();
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null); // Almacena la tarea seleccionada

    const listaOrdenada = [...listaTareas].sort((a, b) => {
        const fechaA = new Date(`${a.end_date}T${a.end_time || "00:00"}`);
        const fechaB = new Date(`${b.end_date}T${b.end_time || "00:00"}`);
        return fechaA - fechaB;
    });

    const eliminarTarea = async () => {
        if (!selectedTask) return;
        try {
            await deleteAcademicEvent(selectedTask.id);
            console.log(`Tarea con ID ${selectedTask.id} eliminada`);
            setConfirmModalOpen(false);
            onOpenChange(false);
            window.location.reload();
        } catch (error) {
            console.error("Error eliminando la tarea:", error);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent style={{ transform: "scale(0.95)", overflow: "visible" }}>
                    {(onClose) => (
                        <ModalBody
                            style={{
                                transform: "scale(0.9)",
                                maxHeight: "100vh",
                                overflow: "visible",
                                overflowY: "auto",
                            }}
                        >
                            <div className="tabs-org">
                                {listaOrdenada.map((tarea) => (
                                    <div
                                        key={tarea.id}
                                        className="task-card"
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                            position: "relative",
                                        }}
                                    >
                                        <h3>{tarea.name}</h3>
                                        <p><strong>Grupo:</strong> {tarea.group_name}</p>
                                        <p><strong>Tarea:</strong> {tarea.description}</p>
                                        <p>
                                            <strong>Fecha de entrega:</strong> {tarea.end_date || "No definida"}
                                        </p>
                                        <p>
                                            <strong>Hora límite:</strong> {tarea.end_time.substring(0, 5) || "No definida"}
                                        </p>
                                        {user.role === "teacher" && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTask(tarea);
                                                        setEditModalOpen(true);
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        right: "30px",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                    }}
                                                    title="Editar tarea"
                                                >
                                                    <FaRegEdit />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedTask(tarea);
                                                        setConfirmModalOpen(true);
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        right: "10px",
                                                        background: "none",
                                                        border: "none",
                                                        cursor: "pointer",
                                                        fontSize: "16px",
                                                        color: "#ff5c5c",
                                                    }}
                                                    title="Eliminar tarea"
                                                >
                                                    <FaRegTrashAlt />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal de confirmación */}
            <ModalComponent
                isOpen={isConfirmModalOpen}
                onOpenChange={setConfirmModalOpen}
                title="Confirmar eliminación"
                texto="¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer y se verá reflejada en todos los integrantes de la asignatura."
                onAccept={eliminarTarea}
            />

            {/* Modal de edición */}
            {selectedTask && (
                <ModalEditarEvento
                    isOpen={isEditModalOpen}
                    onOpenChange={setEditModalOpen}
                    title=""
                    date_start={selectedTask.start_time}
                    date_finish={selectedTask.end_time}
                    place=""
                    description={selectedTask.description}
                    date={selectedTask.end_date}
                    type="tarea"
                    id={selectedTask.id}
                />
            )}
        </>
    );
};

export default ModalTareas;

