import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import '../css/Components/ModalEditarHorario.css';
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { useState } from "react";


const ModalEditarHorarios = ({ isOpen, onOpenChange }) => {
    const { user } = useAuth();

    // Listas de ejemplo
    const asignaturas = [
        { id: "asignatura1", nombre: "Programación 1" },
        { id: "asignatura2", nombre: "Matemáticas" },
    ];

    const grupos = [
        { id: "grupo1", nombre: "Grupo A", asignatura: "asignatura1" },
        { id: "grupo2", nombre: "Grupo B", asignatura: "asignatura1" },
        { id: "grupo3", nombre: "Grupo C", asignatura: "asignatura2" },
    ];

    const horarios = [
        { id: "horario1", nombre: "Lunes 10:00 - 12:00", grupo: "grupo1" },
        { id: "horario2", nombre: "Martes 14:00 - 16:00", grupo: "grupo1" },
        { id: "horario3", nombre: "Miércoles 09:00 - 11:00", grupo: "grupo1" },
        { id: "horario4", nombre: "Lunes 12:00 - 14:00", grupo: "grupo2" },
        { id: "horario5", nombre: "Martes 16:00 - 18:00", grupo: "grupo2" },
        { id: "horario6", nombre: "Miércoles 11:00 - 13:00", grupo: "grupo2" },
        { id: "horario7", nombre: "Jueves 09:00 - 11:00", grupo: "grupo3" },
        { id: "horario8", nombre: "Jueves 11:00 - 13:00", grupo: "grupo3" },
        { id: "horario9", nombre: "Viernes 10:00 - 12:00", grupo: "grupo3" },
    ];

    const [selectedAsignatura, setSelectedAsignatura] = useState(null);
    const [selectedGrupo, setSelectedGrupo] = useState(null);
    const [selectedHorarios, setSelectedHorarios] = useState([]);
    const [nombreActividad, setNombreActividad] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [espacioReservado, setEspacioReservado] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const filteredGrupos = grupos.filter(grupo => grupo.asignatura === selectedAsignatura);
    const filteredHorarios = horarios.filter(horario => horario.grupo === selectedGrupo);

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
                                                value={selectedAsignatura ? [selectedAsignatura] : []}
                                                onChange={(value) => {
                                                    setSelectedAsignatura(value[0]);
                                                    setSelectedGrupo(null); // Reiniciar la selección de grupo al cambiar asignatura
                                                }}
                                            >
                                                {asignaturas.map(asignatura => (
                                                    <Checkbox key={asignatura.id} value={asignatura.id}>
                                                        {asignatura.nombre}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        </div>
                                        <div>
                                            <h4 className="large-bold-title">Seleccionar grupo</h4>
                                            <CheckboxGroup
                                                label="Grupos"
                                                value={selectedGrupo ? [selectedGrupo] : []}
                                                onChange={(value) => setSelectedGrupo(value[0])}
                                            >
                                                {filteredGrupos.map(grupo => (
                                                    <Checkbox key={grupo.id} value={grupo.id}>
                                                        {grupo.nombre}
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
                                            >
                                                {filteredHorarios.map(horario => (
                                                    <Checkbox key={horario.id} value={horario.id}>
                                                        {horario.nombre}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        </div>
                                        <Button color="primary" onPress={() => {
                                            // Lógica para enviar horarios deseados
                                            /**
                                             * 
                                             * Mantiene los seleccionados en las pestañas deseleccionadas.
                                             * Consultar al grupo si se quiere asi o se cambia
                                             */
                                            console.log("Horarios seleccionados:", selectedHorarios);
                                        }}>
                                            Añadir a calendario
                                        </Button>
                                    </Tab>
                                    <Tab className="text-center text-xl" key="Crear evento" title="Crear evento">
                                        <hr className="separator" />

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

                                        <Button color="primary" onPress={() => {
                                            // Lógica para enviar horarios deseados
                                            console.log("Nombre de la actividad:", nombreActividad);
                                            console.log("Hora de inicio:", horaInicio);
                                            console.log("Hora de finalización:", horaFin);
                                            console.log("Espacio reservado:", espacioReservado);
                                            console.log("Descripción:", descripcion);
                                        }}>
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
