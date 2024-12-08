import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import ModalComponent from './ModalComponent';
import { editCustomEvent } from '../supabase/customEvent/customEvent';
import { editAcademicEvent } from "../supabase/academicEvent/academicEvent";


const ModalEditarEvento = ({ isOpen, onOpenChange, title, date_start, date_finish, place, description, date, id, type }) => {
    const { user } = useAuth();
    const [nombreActividad, setNombreActividad] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [espacioReservado, setEspacioReservado] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [isConfirmAcademicModalOpen, setConfirmAcademicModalOpen] = useState(false);
    const [isConfirmTareaModalOpen, setConfirmTareaModalOpen] = useState(false);
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
        const horaInicioMinima = "08:00";
        const horaFinalMaxima = "21:00";

        if (!nombreActividad || !horaInicio || !horaFin || !fecha) {
            setError("Por favor, complete todos los campos obligatorios (nombre, horas y fecha).");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (horaInicio < horaInicioMinima) {
            setError("La hora de inicio debe ser después de las 08:00.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (horaFin > horaFinalMaxima) {
            setError("La hora de finalización debe ser antes de las 21:00.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (horaInicio >= horaFin) {
            setError("La hora de inicio debe ser anterior a la hora de finalización.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        console.log("Nombre de la actividad:", nombreActividad);
        console.log("Hora de inicio:", horaInicio);
        console.log("Hora de finalización:", horaFin);
        console.log("Espacio reservado:", espacioReservado);
        console.log("Descripción:", descripcion);
        console.log("ID del evento:", id);
        console.log("Fecha:", fecha);

        const updates = {
            name: nombreActividad.toString(),
            start_time: horaInicio,
            end_time: horaFin,
            place: espacioReservado.toString(),
            description: descripcion.toString(),
            date: fecha,
        };

        await editCustomEvent(id, updates);
        setConfirmModalOpen(false);
        onOpenChange(false);
        window.location.reload();
    };

    const modificarTarea = async () => {


        if (!descripcion || !horaFin || !fecha) {
            setError("Por favor, complete todos los campos obligatorios (nombre, hora y fecha).");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const updates = {
            start_time: horaFin,
            end_time: horaFin,
            description: descripcion.toString(),
            starting_date: fecha,
            end_date: fecha
        };
        console.log(updates);

        await editAcademicEvent(id, updates);
        setConfirmModalOpen(false);
        onOpenChange(false);
        window.location.reload();
    };

    const modificarEventoAcademico = async () => {
        const horaInicioMinima = "08:00";
        const horaFinalMaxima = "21:00";

        if (!descripcion || !horaInicio || !horaFin || !fecha) {
            setError("Por favor, complete todos los campos obligatorios (nombre, horas y fecha).");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (horaInicio < horaInicioMinima) {
            setError("La hora de inicio debe ser después de las 08:00.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (horaFin > horaFinalMaxima) {
            setError("La hora de finalización debe ser antes de las 21:00.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (horaInicio >= horaFin) {
            setError("La hora de inicio debe ser anterior a la hora de finalización.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        console.log("Hora de inicio:", horaInicio);
        console.log("Hora de finalización:", horaFin);
        console.log("Espacio reservado:", espacioReservado);
        console.log("Descripción:", descripcion);
        console.log("ID del evento:", id);
        console.log("Variables");

        const updates = {
            start_time: horaInicio,
            end_time: horaFin,
            place: espacioReservado.toString(),
            description: descripcion.toString(),
            starting_date: fecha,
            end_date: fecha
        };
        console.log(updates);

        await editAcademicEvent(id, updates);
        setConfirmModalOpen(false);
        onOpenChange(false);
        window.location.reload();
    };

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} style={{ transform: "scale(0.95)", overflow: "auto", width: "90%", maxWidth: "600px", margin: "auto" }}>
                <ModalContent style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-center text-xl">
                                {"Modificar evento"}
                            </ModalHeader>
                            <hr className="separator" style={{ width: "100%", margin: "10px 0", border: "1px solid #ccc" }} />
                            <ModalBody style={{ transform: "scale(0.9)", maxHeight: "80vh", overflow: "auto", padding: "20px" }}>
                                {type !== "tarea" && (
                                    <>
                                        {/* Mensaje de error en color secundario */}
                                        {error && (
                                            <p style={{ color: "var(--color-second)", textAlign: "center" }}>
                                                {error}
                                            </p>
                                        )}

                                        {/* Campos dependientes del tipo */}
                                        {type !== "Creado por profesores" && type !== "Examen" && (
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
                                        )}

                                        {(type === "Creado por profesores" || type === "Examen") && (
                                            <div className="mb-4">
                                                <h2 className="text-2xl font-bold">Nombre de la actividad</h2>
                                                <textarea
                                                    className="border p-2 w-full"
                                                    placeholder="Ingrese el nombre de la actividad"
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
                                                ></textarea>
                                            </div>
                                        )}

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
                                            <div className="flex space-x-4">
                                                <div>
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

                                        {type !== "Creado por profesores" && type !== "Examen" && (
                                            <div className="mb-4">
                                                <h2 className="text-2xl font-bold">Descripción</h2>
                                                <textarea
                                                    className="border p-2 w-full"
                                                    placeholder="Ingrese una descripción"
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
                                                ></textarea>
                                            </div>
                                        )}
                                    </>
                                )}
                                {/* Configuración específica para tareas */}
                                {type === "tarea" && (
                                    <>
                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold">Nombre de la actividad:</h2>
                                            <textarea
                                                className="border p-2 w-full"
                                                placeholder="Ingrese la descripción de la tarea"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold">Fecha límite</h2>
                                            <input
                                                type="date"
                                                className="border p-2 w-full"
                                                value={fecha}
                                                onChange={(e) => setFecha(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold">Hora límite</h2>
                                            <input
                                                type="time"
                                                className="border p-2 w-full"
                                                value={horaFin}
                                                onChange={(e) => setHoraFin(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {type === "Creado por profesores" || type === "Examen" ? (
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            console.log("Este evento no se puede modificar");
                                            setConfirmAcademicModalOpen(true)
                                        }}
                                    >
                                        Guardar cambios
                                    </Button>
                                ) : type === "tarea" ? (
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            console.log("Guardando tarea");
                                            setConfirmTareaModalOpen(true)
                                        }}
                                    >
                                        Guardar tarea
                                    </Button>
                                ) : (
                                    <Button
                                        color="primary"
                                        onPress={() => setConfirmModalOpen(true)}
                                    >
                                        Guardar en el calendario
                                    </Button>
                                )}
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

            <ModalComponent
                isOpen={isConfirmAcademicModalOpen}
                onOpenChange={setConfirmAcademicModalOpen}
                title="Confirmar modificación"
                texto="¿Estás seguro de que quieres modificar este evento?. Esta acción no se puede deshacer y se vera reflejado en todos los integrantes de la asignatura."
                onAccept={modificarEventoAcademico}
            />

            <ModalComponent
                isOpen={isConfirmTareaModalOpen}
                onOpenChange={setConfirmTareaModalOpen}
                title="Confirmar modificación"
                texto="¿Estás seguro de que quieres modificar esta tarea?. Esta acción no se puede deshacer y se vera reflejado en todos los integrantes de la asignatura."
                onAccept={modificarTarea}
            />
        </>
    );
};

export default ModalEditarEvento;

