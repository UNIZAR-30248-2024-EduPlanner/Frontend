import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react'

const ModalTareas = ({ isOpen, onOpenChange, listaTareas }) => {
    const { user } = useAuth();

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent style={{ transform: "scale(0.95)", overflow: "visible" }}>
                {(onClose) => (
                    <>
                        <ModalBody style={{ transform: "scale(0.9)", maxHeight: "100vh", overflow: "visible", overflowY: "auto" }}>
                            <div className="tabs-org">
                                {listaTareas.map((tarea) => (
                                    <div
                                        key={tarea.id}
                                        className="task-card"
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "10px",
                                            marginBottom: "10px",
                                            borderRadius: "8px",
                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <h3>{tarea.name}</h3>
                                        <p><strong>Grupo:</strong> {tarea.group_name}</p>
                                        <p><strong>Tarea:</strong> {tarea.description}</p>
                                        <p>
                                            <strong>Fecha de entrega:</strong> {tarea.end_date || "No definida"}
                                        </p>
                                        <p>
                                            <strong>Hora limite:</strong> {tarea.end_time || "No definida"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal >
    );
};

export default ModalTareas;
