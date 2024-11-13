import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import ModalComponent from './ModalComponent';
import { editCustomEvent } from '../supabase/customEvent/customEvent';

const ModalEditarEvento = ({ isOpen, onOpenChange, title, date_start, date_finish, place, description, date, id }) => {
    const { user } = useAuth();
    const [nombreActividad, setNombreActividad] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [espacioReservado, setEspacioReservado] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setNombreActividad(title);
            setHoraInicio(date_start);
            setHoraFin(date_finish);
            setEspacioReservado(place);
            setDescripcion(description);
            setFecha(date);
        }
    }, [isOpen, title, date_start, date_finish, place, description]);

    const modificarEvento = async () => {
        if (nombreActividad && horaInicio && horaFin && fecha) {
            console.log("Nombre de la actividad:", nombreActividad);
            console.log("Hora de inicio:", horaInicio);
            console.log("Hora de finalización:", horaFin);
            console.log("Espacio reservado:", espacioReservado);
            console.log("Descripción:", descripcion);
            console.log("ID del evento:", id);
            console.log("Fecha:", fecha);
            const updates = { name: nombreActividad.toString(), start_time: horaInicio, end_time: horaFin, place: espacioReservado.toString(), description: descripcion.toString(), date: fecha };
            // Lógica para modificar el evento
            await editCustomEvent(id, updates);
            setConfirmModalOpen(false); // Cierra el modal de confirmación
            onOpenChange(false); // Cierra el modal de edición 
            window.location.reload();
        } else {
            setError("Por favor, complete todos los campos obligatorios (nombre, horas y fecha).");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
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
                                {/* Mensaje de error en color secundario */}
                                {error && (
                                    <p style={{ color: "var(--color-second)", textAlign: "center" }}>
                                        {error}
                                    </p>
                                )}
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
                                    <h2 className="text-2xl font-bold">Fecha y Hora</h2>
                                    <div>
                                        <label className="block text-lg font-semibold">Fecha</label>
                                        <input
                                            type="date"
                                            className="border p-2 mb-4"
                                            value={fecha}
                                            onChange={(e) => setFecha(e.target.value)}
                                        />
                                    </div>
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
