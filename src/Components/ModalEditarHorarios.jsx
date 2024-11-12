import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import '../css/Components/ModalEditarHorario.css';
import { createCustomEvent } from "../supabase/customEvent/customEvent";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";


const ModalEditarHorarios = ({ isOpen, onOpenChange, listaCompletaEventos }) => {
    const { user } = useAuth();


    const [selectedAsignatura, setSelectedAsignatura] = useState(null);
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const [nombreActividad, setNombreActividad] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [espacioReservado, setEspacioReservado] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [error, setError] = useState("");


    const filteredGrupos = Array.from(new Set(
        listaCompletaEventos
            .filter(evento => evento.name === selectedAsignatura)
            .map(evento => evento.group_name)
    ));

    const filteredHorarios = listaCompletaEventos.filter(evento =>
        evento.name === selectedAsignatura && evento.group_name === selectedGrupo
    );

    const obtenerDiaSemana = (fechaStr) => {
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const [anio, mes, dia] = fechaStr.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, dia);
        return diasSemana[fecha.getDay()];
    };

    const handleSubmit = async () => {
        if (nombreActividad && horaInicio && horaFin && fecha) {
            console.log("Nombre de la actividad:", nombreActividad);
            console.log("Hora de inicio:", horaInicio);
            console.log("Hora de finalización:", horaFin);
            console.log("Espacio reservado:", espacioReservado);
            console.log("Descripción:", descripcion);
            console.log("Fecha:", fecha);

            // Llamada a la función para crear el evento
            await createCustomEvent(nombreActividad, descripcion, "", fecha, horaInicio, horaFin, user.id);
        } else {
            setError("Por favor, complete todos los campos obligatorios (nombre, horas y fecha).");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <hr className="separator" />
                        <ModalBody>
                            <div className="tabs-org">
                                <Tabs color="primary" variant="underlined" defaultSelectedKey="Asignatura">
                                    <Tab className="text-center text-xl" key="Asignatura" title="Asignatura">
                                        <hr className="separator" />
                                        <div>
                                            <h4 className="large-bold-title">Seleccionar asignatura</h4>
                                            <CheckboxGroup
                                                label="Asignaturas"
                                                style={{ marginTop: '15px', marginBottom: '10px' }}
                                                value={selectedAsignatura ? [selectedAsignatura] : []}
                                                onChange={(value) => {
                                                    setSelectedAsignatura(value[0]);
                                                    setSelectedGrupo(null); // Reiniciar la selección de grupo al cambiar asignatura
                                                    setSelectedHorarios([]); // Reiniciar selección de horarios
                                                }}
                                            >
                                                {Array.from(new Set(listaCompletaEventos.map(evento => evento.name)))
                                                    .map(subjectId => (
                                                        <Checkbox key={subjectId} value={subjectId}>
                                                            {`${subjectId}`}
                                                        </Checkbox>
                                                    ))}
                                            </CheckboxGroup>
                                        </div>
                                        <div>
                                            <h4 className="large-bold-title">Seleccionar grupo</h4>
                                            <CheckboxGroup
                                                label="Grupos"
                                                style={{ marginTop: '15px', marginBottom: '10px' }}
                                                value={selectedGrupo ? [selectedGrupo] : []}
                                                onChange={(value) => {
                                                    setSelectedGrupo(value[0]);
                                                    setSelectedHorarios([]); // Reiniciar selección de horarios
                                                }}
                                            >
                                                {filteredGrupos.map(grupo => (
                                                    <Checkbox key={grupo} value={grupo}>
                                                        {grupo}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        </div>
                                        <div>
                                            <h4 className="large-bold-title">Seleccionar horario</h4>
                                            <CheckboxGroup
                                                label="Horarios"
                                                value={selectedHorarios}
                                                onChange={setSelectedHorarios}
                                                style={{ marginTop: '15px', marginBottom: '10px' }}
                                            >
                                                {filteredHorarios.map(horario => (
                                                    <Checkbox key={horario.id} value={horario.id}>
                                                        {obtenerDiaSemana(horario.starting_date) + " " + horario.start.slice(0, 5) + "-" + horario.end.slice(0, 5)}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        </div>
                                        <Button color="primary" onPress={() => {
                                            // Lógica para enviar horarios deseados
                                            console.log("Horarios seleccionados:", selectedHorarios);
                                        }}
                                            style={{ marginTop: '10px', marginBottom: '10px' }}
                                        >
                                            Añadir a calendario
                                        </Button>
                                    </Tab>
                                    <Tab className="text-center text-xl" key="Crear evento" title="Crear evento">
                                        <hr className="separator" />
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

                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold">Descripción</h2>
                                            <textarea
                                                className="border p-2 w-full"
                                                placeholder="Ingrese una descripción"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <Button color="primary" onPress={handleSubmit}>
                                            Guardar en el calendario
                                        </Button>
                                    </Tab>
                                </Tabs>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalEditarHorarios;
