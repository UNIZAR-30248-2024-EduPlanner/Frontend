import { Modal, ModalContent, ModalBody, Button, ModalHeader } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";
import '../css/Components/ModalEditarHorario.css';
import { createCustomEvent } from "../supabase/customEvent/customEvent";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { useEffect, useState } from 'react'
import { editCustomAcademicEventVisibility } from '../supabase/customAcademicEvent/customAcademicEvent';
import { createAcademicEventAndPublish } from '../supabase/academicEvent/academicEvent';

const ModalEditarHorarios = ({ isOpen, onOpenChange, listaCompletaEventos, listaCompletaEventosVisibles }) => {
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
    const [error2, setError2] = useState("");
    const [tipo, setTipo] = useState("personal");
    const [categoria, setCategoria] = useState("Examen");
    const [selectedAsignaturaId, setSelectedAsignaturaId] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    let combinedList = [...listaCompletaEventos, ...listaCompletaEventosVisibles];
    let tarea = false;
    combinedList = combinedList.filter(evento => !evento.date);

    const uniqueAsignaturas = Array.from(
        new Set(combinedList.map(evento => evento.name + evento.subject_id))
    ).map(uniqueKey => combinedList.find(evento => evento.name + evento.subject_id === uniqueKey));

    useEffect(() => {
        if (uniqueAsignaturas.length > 0 && !selectedAsignaturaId) {
            setSelectedAsignaturaId(uniqueAsignaturas[0]?.subject_id);
            setSelectedAsignatura(uniqueAsignaturas[0]?.name || "");
        }
    }, [uniqueAsignaturas, selectedAsignaturaId]);

    console.log(listaCompletaEventos);
    console.log(user);


    const filteredGrupos = Array.from(new Set(
        listaCompletaEventos
            .filter(evento => evento.name === selectedAsignatura)
            .map(evento => evento.group_name)
    ));

    const filteredGruposFull = Array.from(
        new Set([
            "General",
            ...combinedList
                .filter(evento => evento.name === selectedAsignatura)
                .map(evento => evento.group_name)
        ])
    );

    useEffect(() => {
        if (filteredGruposFull.length > 0 && !selectedGrupo && initialLoad) {
            setSelectedGrupo(filteredGruposFull[0]);
            setInitialLoad(false);
        }
    }, [filteredGruposFull, selectedGrupo, initialLoad]);

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
        const horaInicioMinima = "08:00";
        const horaFinalMaxima = "21:00";
        let grupo;
        if (selectedGrupo === null) { grupo = "General" } else { grupo = selectedGrupo; }
        console.log("Tipo de evento:", tipo);
        console.log("Tarea:", tarea);

        if (tipo === "academico") {
            if (!selectedAsignatura || !grupo) {
                setError("Escoga una asignatura y un grupo para crear el evento y publicarlo.");
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            if (!horaInicio || !horaFin || !fecha) {
                setError("Por favor, complete todos los campos obligatorios ( horas y fecha).");
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
            await createAcademicEventAndPublish(selectedAsignatura, fecha, fecha, grupo, 0, nombreActividad, categoria, espacioReservado, horaInicio, horaFin, selectedAsignaturaId);
        } else if (tarea === true) {
            console.log("Creando tarea...", selectedAsignatura, fecha, fecha, grupo, 0, descripcion, "Entrega", espacioReservado, horaFin, horaFin, selectedAsignaturaId);

            if (!descripcion || !horaFin || !fecha) {
                setError2("Por favor, complete todos los campos obligatorios (tarea, hora limite y fecha).");
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            await createAcademicEventAndPublish(selectedAsignatura, fecha, fecha, grupo, 0, descripcion, "Entrega", espacioReservado, horaFin, horaFin, selectedAsignaturaId);
        } else {
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
            await createCustomEvent(nombreActividad, descripcion, espacioReservado, fecha, horaInicio, horaFin, user.id);
        }

        window.location.reload();
    };


    const handleSubmitadd = async () => {
        if (selectedHorarios.length > 0) {
            console.log("Horarios seleccionados:", selectedHorarios);
            // Lógica para enviar horarios deseados
            for (const evento of selectedHorarios) {
                try {
                    console.log(user.id, evento);
                    await editCustomAcademicEventVisibility(user.id, evento, true);
                } catch (error) {
                    console.error(`Error al editar visibilidad para el evento ${evento.id}:`, error);
                }
            }
            window.location.reload();
        } else {
            setError("Por favor, seleccione al menos un horario.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" >
            <ModalContent style={{ transform: "scale(0.95)", overflow: "visible" }}>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-center justify-center text-primary text-3xl">
                            {"Personalizar calendario"}
                        </ModalHeader>
                        <hr className="separator" style={{ width: "100%", margin: "0px 0px", border: "1px solid #ccc" }} />
                        <ModalBody className="mt-0" style={{ transform: "scale(0.9)", maxHeight: "100vh", overflow: "visible", overflowY: "auto" }}>
                            <div className="tabs-org mt-0">
                                <Tabs color="primary" variant="underlined" defaultSelectedKey="Asignatura">
                                    <Tab className="text-start text-xl w-full" key="Asignatura" title="Asignatura">
                                        <hr className="separator mt-0 mb-[20px] w-full" />
                                        <div className="mb-[20px]">
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
                                        <div className="mb-[20px]">
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
                                        <div className="mb-[20px]">
                                            <h4 className="large-bold-title">Seleccionar horario</h4>
                                            <CheckboxGroup
                                                label="Horarios"
                                                value={selectedHorarios}
                                                onChange={setSelectedHorarios}
                                                style={{ marginTop: '15px', marginBottom: '10px' }}
                                            >
                                                {filteredHorarios.map(horario => (
                                                    <Checkbox key={horario.id} value={horario.id}>
                                                        {obtenerDiaSemana(horario.starting_date) + " " + horario.start_time.slice(0, 5) + "-" + horario.end_time.slice(0, 5)}
                                                    </Checkbox>
                                                ))}
                                            </CheckboxGroup>
                                        </div>
                                        <div className="flex justify-center">
                                            <Button color="primary" onPress={handleSubmitadd}
                                                style={{ marginTop: '10px', marginBottom: '10px' }}
                                                className="text-[1.1rem]"
                                            >
                                                Añadir a calendario
                                            </Button>
                                        </div>
                                    </Tab>
                                    <Tab className="text-start text-xl w-full" key="Crear evento" title="Crear evento">
                                        <hr className="separator mt-0 mb-[20px] w-full" />
                                    {/* Mensaje de error en color secundario */}
                                        {error && (
                                            <p style={{ color: "var(--color-second)", textAlign: "center" }}>
                                                {error}
                                            </p>
                                        )}
                                        {/* Solo visible para el rol "teacher" */}
                                        {user?.role === "teacher" && (
                                            <>
                                                <div className="mb-[20px]">
                                                    <h2 className="text-2xl font-bold mb-[5px]">Tipo</h2>
                                                    <select
                                                        value={tipo}
                                                        onChange={(e) => setTipo(e.target.value)}
                                                        className="w-full p-2 border rounded-md"
                                                    >
                                                        <option value="personal">Personal</option>
                                                        <option value="academico">Académico</option>
                                                    </select>
                                                </div>

                                                {/* Mostrar asignatura y grupo solo si el tipo es académico */}
                                                {tipo === "academico" && (
                                                    <>
                                                        <div className="mb-[20px]">
                                                            <h2 className="text-2xl font-bold mb-[5px]">Categoria</h2>
                                                            <select
                                                                value={categoria}
                                                                onChange={(e) => setCategoria(e.target.value)}
                                                                className="w-full p-2 border rounded-md"
                                                            >
                                                                <option value="Examen">Examen</option>
                                                                <option value="Creado por profesores">Evento extra</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-[20px]">
                                                            <h2 className="text-2xl font-bold mb-[5px]">Asignatura</h2>
                                                            <select
                                                                value={selectedAsignaturaId}
                                                                onChange={(e) => {
                                                                    const selectedId = e.target.value;
                                                                    const selectedOption = combinedList.find(evento => evento.subject_id === parseInt(selectedId)); setSelectedAsignaturaId(e.target.value);
                                                                    setSelectedAsignatura(selectedOption?.name || "");
                                                                    setSelectedGrupo(null);
                                                                }}
                                                                className="w-full p-2 border rounded-md"
                                                            >
                                                                <option value="" disabled>
                                                                    Seleccione la asignatura
                                                                </option>
                                                                {uniqueAsignaturas.map(asignatura => (
                                                                    <option key={asignatura.name + asignatura.subject_id} value={asignatura.subject_id}>
                                                                        {asignatura.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="mb-[20px]">
                                                            <h2 className="text-2xl font-bold mb-[5px]">Grupo</h2>
                                                            <select
                                                                value={selectedGrupo || filteredGruposFull[0]}
                                                                onChange={(e) => {
                                                                    const grupoSeleccionado = e.target.value;
                                                                    console.log("Grupo seleccionado:", grupoSeleccionado);
                                                                    setSelectedGrupo(grupoSeleccionado);
                                                                }}
                                                                className="w-full p-2 border rounded-md"
                                                            >
                                                                <option value="" disabled>
                                                                    Seleccione el grupo
                                                                </option>
                                                                {filteredGruposFull.map(grupo => (
                                                                    <option key={grupo} value={grupo}>
                                                                        {grupo}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        <div className="mb-[20px]">
                                            <h2 className="text-2xl font-bold mb-[5px]">Nombre de la actividad:</h2>
                                            <input
                                                type="text"
                                                className="border p-2 w-full"
                                                placeholder="Ingrese el nombre de la actividad"
                                                value={nombreActividad}
                                                onChange={(e) => setNombreActividad(e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-[20px]">
                                            <h2 className="text-2xl font-bold mb-[5px]">Fecha y Hora</h2>
                                            <div>
                                                <label className="block text-lg text-black font-semibold">Fecha</label>
                                                <input
                                                    type="date"
                                                    className="border p-2 mb-4"
                                                    value={fecha}
                                                    onChange={(e) => setFecha(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex">
                                                <div>
                                                    <label className="block text-lg text-black font-semibold">Hora de inicio</label>
                                                    <input
                                                        type="time"
                                                        className="border p-2"
                                                        value={horaInicio}
                                                        onChange={(e) => setHoraInicio(e.target.value)}
                                                    />
                                                </div>
                                                <div className="ml-[20px]">
                                                    <label className="block text-lg text-black font-semibold">Hora de finalización</label>
                                                    <input
                                                        type="time"
                                                        className="border p-2"
                                                        value={horaFin}
                                                        onChange={(e) => setHoraFin(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-[20px]">
                                            <h2 className="text-2xl font-bold mb-[5px]">Lugar</h2>
                                            <input
                                                type="text"
                                                className="border p-2 w-full"
                                                placeholder="Ingrese el espacio reservado"
                                                value={espacioReservado}
                                                onChange={(e) => setEspacioReservado(e.target.value)}
                                            />
                                        </div>
                                        {tipo !== "academico" && (
                                            <div className="mb-[20px]">
                                                <h2 className="text-2xl font-bold mb-[5px]">Descripción</h2>
                                                <textarea
                                                    className="border p-2 w-full"
                                                    placeholder="Ingrese una descripción"
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
                                                ></textarea>
                                            </div>
                                        )}
                                        <div className="flex justify-center">
                                            <Button className="text-[1.1rem]" color="primary" onPress={handleSubmit}>
                                                Guardar evento
                                            </Button>
                                        </div>
                                    </Tab>
                                    {/* Solo visible para el rol "teacher" */}
                                    {user?.role === "teacher" && (
                                        <Tab className="text-start text-xl w-full" key="Crear tarea" title="Crear tarea">
                                            <hr className="separator mt-0 mb-[20px] w-full" />
                                            {/* Mensaje de error en color secundario */}
                                            {error && (
                                                <p style={{ color: "var(--color-second)", textAlign: "center" }}>
                                                    {error2}
                                                </p>
                                            )}
                                            <div className="mb-[20px]">
                                                <h2 className="text-2xl font-bold mb-[5px]">Asignatura</h2>
                                                <select
                                                    value={selectedAsignaturaId}
                                                    onChange={(e) => {
                                                        const selectedId = e.target.value;
                                                        const selectedOption = combinedList.find(evento => evento.subject_id === parseInt(selectedId)); setSelectedAsignaturaId(e.target.value);
                                                        setSelectedAsignatura(selectedOption?.name || "");
                                                        setSelectedGrupo(null);
                                                    }}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="" disabled>
                                                        Seleccione la asignatura
                                                    </option>
                                                    {uniqueAsignaturas.map(asignatura => (
                                                        <option key={asignatura.name + asignatura.subject_id} value={asignatura.subject_id}>
                                                            {asignatura.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-[20px]">
                                                <h2 className="text-2xl font-bold mb-[5px]">Grupo</h2>
                                                <select
                                                    value={selectedGrupo || filteredGruposFull[0]}
                                                    onChange={(e) => {
                                                        const grupoSeleccionado = e.target.value;
                                                        console.log("Grupo seleccionado:", grupoSeleccionado);
                                                        setSelectedGrupo(grupoSeleccionado);
                                                    }}
                                                    className="w-full p-2 border rounded-md"
                                                >
                                                    <option value="" disabled>
                                                        Seleccione el grupo
                                                    </option>
                                                    {filteredGruposFull.map(grupo => (
                                                        <option key={grupo} value={grupo}>
                                                            {grupo}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-[20px]">
                                                <h2 className="text-2xl font-bold mb-[5px]">Fecha y Hora</h2>
                                                <div>
                                                    <label className="block text-lg text-black font-bold">Fecha</label>
                                                    <input
                                                        type="date"
                                                        className="border p-2 mb-[5px]"
                                                        value={fecha}
                                                        onChange={(e) => setFecha(e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-lg text-black font-bold">Hora Limite</label>
                                                    <input
                                                        type="time"
                                                        className="border p-2"
                                                        value={horaFin}
                                                        onChange={(e) => setHoraFin(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-[20px]">
                                                <h2 className="text-2xl font-bold mb-[5px]">Tarea</h2>
                                                <textarea
                                                    className="border p-2 w-full"
                                                    placeholder="Ingrese la tarea"
                                                    value={descripcion}
                                                    onChange={(e) => setDescripcion(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-center">
                                                <Button color="primary"
                                                    onPress={() => {
                                                        tarea = true;
                                                        setTipo("");
                                                        handleSubmit();
                                                    }}
                                                    className="text-[1.1rem]"
                                                >
                                                    Guardar tarea
                                                </Button>

                                            </div>
                                        </Tab>
                                    )}
                                </Tabs>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal >
    );
};

export default ModalEditarHorarios;
