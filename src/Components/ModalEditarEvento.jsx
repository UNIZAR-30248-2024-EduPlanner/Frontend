import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import ModalComponent from './ModalComponent'; // Importa el modal de confirmación

const ModalEditarEvento = ({ isOpen, onOpenChange, title, date_start, date_finish, place, description }) => {
    const { user } = useAuth();
    const [nombreActividad, setNombreActividad] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [espacioReservado, setEspacioReservado] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false); // Estado para el modal de confirmación

    useEffect(() => {
        if (isOpen) {
            setNombreActividad(title);
            setHoraInicio(date_start);
            setHoraFin(date_finish);
            setEspacioReservado(place);
            setDescripcion(description);
        }
    }, [isOpen, title, date_start, date_finish, place, description]);

    const modificarEvento = () => {
        console.log("Nombre de la actividad:", nombreActividad);
        console.log("Hora de inicio:", horaInicio);
        console.log("Hora de finalización:", horaFin);
        console.log("Espacio reservado:", espacioReservado);
        console.log("Descripción:", descripcion);
        // Lógica para modificar el evento
        setConfirmModalOpen(false); // Cierra el modal de confirmación
        onOpenChange(false); // Cierra el modal de edición
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="modal-header">
                                {"Modificar evento"}
                            </ModalHeader>
                            <hr className="separator" />
                            <ModalBody>
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold">Nombre de la actividad:</h2>
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Ingrese el nombre de la actividad"
                                        value={nombreActividad}
                                        onChange={(e) => setNombreActividad(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold">Hora</h2>
                                    <div className="flex">
                                        <div className="mr-2">
                                            <label className="block text-lg font-semibold">Hora de inicio</label>
                                            <input
                                                type="time"
                                                className="border p-2"
                                                value={horaInicio}
                                                onChange={(e) => setHoraInicio(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-lg font-semibold">Hora de finalización</label>
                                            <input
                                                type="time"
                                                className="border p-2"
                                                value={horaFin}
                                                onChange={(e) => setHoraFin(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold">Lugar</h2>
                                    <input
                                        type="text"
                                        className="border p-2 w-full"
                                        placeholder="Ingrese el espacio reservado"
                                        value={espacioReservado}
                                        onChange={(e) => setEspacioReservado(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold">Descripción</h2>
                                    <textarea
                                        className="border p-2 w-full"
                                        placeholder="Ingrese una descripción"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                    ></textarea>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="primary"
                                    onPress={() => setConfirmModalOpen(true)}
                                >
                                    Guardar en el calendario
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal de confirmación */}
            <ModalComponent
                isOpen={isConfirmModalOpen}
                onOpenChange={setConfirmModalOpen}
                title="Confirmar modificación"
                texto="¿Estás seguro de que quieres modificar este evento?"
                onAccept={modificarEvento}
            />
        </>
    );
};

export default ModalEditarEvento;
