import '../css/Calendario.css'
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { Button, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { calcularSolapes, convertirAHorasEnMinutos, getAntiContrastColor, getAuxColor, getContrastColor, isInWeek, numberToMonth } from '../Components/CalendarioFunctions.jsx';
import { useDisclosure } from "@nextui-org/react";
import ModalComponent from "../Components/ModalHorario";
import ModalComponentcreate from "../Components/ModalEditarHorarios";
import ModalTareas from '../Components/ModalTareas.jsx';
import { getAllEventsForUser } from '../supabase/event/event.js';
import { useAuth } from "../context/AuthContext";
import { getFullNonVisibleAcademicEventsForUser } from '../supabase/customAcademicEvent/customAcademicEvent.js';
import Logout from '../Components/Logout.jsx';
import { GrNotes } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import constants from '../constants/constants.jsx';
import ModalDesasociarAsignaturas from '../Components/ModalDesasociarAsignaturas.jsx';
import { getSubjectsByStudentId } from '../supabase/student/student.js';
import { getSubjectById } from '../supabase/course/course.js';
import { getUserInfoById } from '../supabase/user/user.js';

const Calendario = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalTareasOpen, setIsModalTareasOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [isOpenGestionarAsignaturas, setIsOpenGestionarAsignaturas] = useState(false);
    const [modalAsignaturasData, setModalAsignaturasData] = useState([]);
    const [userNip, setUserNip] = useState(null);

    // HorariosBD son todos los horarios recuperados de la BD
    const [horariosBD, setHorariosBD] = useState([]);

    // HorariosBD son todos las tareas recuperados de la BD
    const [tareas, setTareas] = useState([]);

    // Horarios son los horarios procesados para la actual semana
    const [horarios, setHorarios] = useState([]);

    // Horarios son los horarios a recuperar
    const [horariosrecu, setHorariosrecu] = useState([]);

    // Dias de la semana requerida
    const [diasSemana, setDiasSemana] = useState([])

    // Primer día de la semana actual
    const [mondayWeek, setMondayWeek] = useState(null)

    // Mes y año actual: <mes> <año>
    const [monthYear, setMonthYear] = useState(null)

    // Contiene una lista de {name: <name>, color: #XXXXXX}
    const [colores, setColores] = useState([]);

    const wFirstCol = 5;
    const wCol = 13.57;

    const firstHour = 8;
    const lastHour = 21;
    const nameDays = ["Lunes ", "Martes ", "Miércoles ", "Jueves ", "Viernes ", "Sábado ", "Domingo "];
    const alturaPorHora = 7; // Altura por hora en vh
    const alturaPorMinuto = 7 / 60; // Altura por minuto en vh

    // const getColor = async (name) => {
    const getColor = async (name, subj_id) => {
        const elem = colores.find((e) => e.name == name);

        if (elem) {
            return elem.color;
        } else {
            const res = await getSubjectById(subj_id);
            if (res.error) return console.error("Error al recuperar la asignatura");
            console.log("res.data", res.data)
            const color = res.data.color;

            // Añade el nuevo color al array `colores`
            setColores((prev) => [...prev, { name, color }]);

            return color;
        }
    }

    // Da formato a los horarios de la semana. Establece el estilo de los 
    // componentes que permite mostrarlos por pantalla
    const procesarHorarios = (h) => {
        const res = [];

        const aux = h.filter((v) => isInWeek(v, mondayWeek, monthYear));

        aux.map(async (e, idx) => {
            console.log(e)
            const [hoursStart, minutesStart] = e.start.split(":").map(part => parseInt(part, 10));

            // Imprimir el índice encontrado para depuración
            const dayIndex = nameDays.findIndex((v) => v === e.day);

            // Calcula los solapes del horario con otros horarios
            // <numSolapes> contiene el número de solapes de <e> con otros horarios
            // en su franja horaria
            // <position> indica la posición horizontal en caso de que exista solape
            const [numSolapes, position] = calcularSolapes(aux, idx);

            // Color de la asignatura
            var color;
            if (e.starting_date && e.end_date) {
                color = await getColor(e.name, e.subject_id);
            } else {
                color = "#000000";
            }

            const minutosS = convertirAHorasEnMinutos(e.start)
            const minutosE = convertirAHorasEnMinutos(e.end)
            
            console.log(e.name)
            res.push({
                name: e.name,
                start: e.start,
                end: e.end,
                description: e.description,
                place: e.place,
                group_name: e.group_name,
                user_id: e.user_id,
                id: e.id,
                date: e.date,
                type: e.type,
                starting_date: e.starting_date,
                height: ((minutosE - minutosS) * alturaPorMinuto).toString() + "vh",
                width: numSolapes == 0 ? wCol : wCol / numSolapes,
                top: ((hoursStart - firstHour + 1) * alturaPorHora + minutesStart * alturaPorMinuto).toString() + "vh",
                left: (wFirstCol + (dayIndex * wCol) + (numSolapes == 0 ? 0 : position * (wCol / numSolapes))).toString() + "vw",
                color: color,
                textColor: getContrastColor(color)
            });
        });

        return res;
    };

    const getHorarios = async () => {
        // Se piden los horarios a la BD
        let horariosRes = await getAllEventsForUser(user.id);
        const horariosRecuperar = await getFullNonVisibleAcademicEventsForUser(user.id);
        if (horariosRes.error) return console.error("ERROR: recuperando los horarios");

        const ListaTareas = horariosRes.data.filter(evento => evento.type === "Entrega");
        setTareas(ListaTareas);
        horariosRes.data = horariosRes.data.filter(evento => evento.type !== "Entrega");
        setHorariosBD(horariosRes.data);

        horariosRes.data.forEach(evento => {
            const fecha = evento.starting_date || evento.date;
            if (fecha) {
                evento.day = obtenerDiaSemana(fecha);
            }

            // Renombrar start_time y end_time a start y end, tomando solo los primeros 5 caracteres
            evento.start = evento.start_time ? evento.start_time.slice(0, 5) : null;
            evento.end = evento.end_time ? evento.end_time.slice(0, 5) : null
        });

        horariosRecuperar.data.forEach(evento => {
            // Renombrar start_time y end_time a start y end, tomando solo los primeros 5 caracteres
            evento.start_time = evento.start_time ? evento.start_time.slice(0, 5) : null;
            evento.end_time = evento.end_time ? evento.end_time.slice(0, 5) : null
        });

        // setHorarios(procesarHorarios(horariosRes.data));
        setHorariosrecu(horariosRecuperar.data);
    }

    // Función que obtiene el día de la semana a partir de una fecha en formato "YYYY-MM-DD"
    const obtenerDiaSemana = (fechaStr) => {
        const diasSemanaAbreviados = ['Domingo ', 'Lunes ', 'Martes ', 'Miércoles ', 'Jueves ', 'Viernes ', 'Sábado '];
        const [anio, mes, dia] = fechaStr.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, dia);
        return diasSemanaAbreviados[fecha.getDay()];
    };

    // Horas visibles en el calendario
    const generateHours = (start, end) => {
        const hours = [];
        for (let hour = start; hour <= end; hour++) {
            hours.push(`${hour}:00`);
        }
        return hours;
    };

    // Llamada para generar la lista de horas entre 8:00 y 21:00
    const hours = generateHours(firstHour, lastHour);

    // Cambia todo lo neceario relacionado con una semana al avanzar o retroceder
    // en el calendario una semana.
    // Si <next> = true avanza una semana
    // Si <next> = false retrocede una semana 
    const changeWeek = (next) => {
        const newMonday = new Date(mondayWeek)
        if (next) {
            newMonday.setDate(newMonday.getDate() + 7);
        } else {
            newMonday.setDate(newMonday.getDate() - 7);
        }
        newMonday.setHours(0, 0, 0, 0); // Establece la hora en 00:00:00
        setMondayWeek(newMonday);

        // Extraemos el mes y año
        const my = numberToMonth(newMonday.getMonth()) + " " + newMonday.getFullYear();
        setMonthYear(my)

        // Array para almacenar solo los números de los días de la semana desde lunes a domingo
        const days = [];

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(newMonday);
            nextDay.setDate(newMonday.getDate() + i);
            days.push(nameDays[i] + nextDay.getDate()); // Solo el número del día
        }

        setDiasSemana(days);
    }

    const getDiasSemana = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Domingo) - 6 (Sábado)

        // Calcular el lunes de esta semana
        const monday = new Date(today);

        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0); // Establece la hora en 00:00:00
        setMondayWeek(monday)

        // Extraemos el mes y año
        setMonthYear(numberToMonth(monday.getMonth()) + " " + monday.getFullYear())

        // Array para almacenar solo los números de los días de la semana desde lunes a domingo
        const days = [];

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            days.push(nameDays[i] + nextDay.getDate()); // Solo el número del día
        }

        setDiasSemana(days);
    }


    useEffect(() => {
        if (user && user.id) {
            getDiasSemana();
            getHorarios();
        }
    }, [user,]);

    useEffect(() => {
        if (mondayWeek && horariosBD) setHorarios(procesarHorarios(horariosBD));
    }, [mondayWeek, horariosBD])


    // Función para abrir el modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Función para manejar la apertura de un modal con datos específicos
    const handleOpenModal = (data) => {
        setModalData(data);
        onOpen();
    };

    const openModalTareas = () => {
        setIsModalTareasOpen(true);
    };

    const closeModalTareas = () => {
        setIsModalTareasOpen(false);
    };
    if (user) {
        console.log(user);
        console.log(user.type === "teacher");
    }

    //Funcion para abrir el modal de gestionar asignaturas
    const openModalGestionarAsignaturas = () => {
        getUserNip();
        obtenerAsignaturasDeUsuario(user.id)
        console.log("Asingaturas de usuario modal :", modalAsignaturasData)
        setIsOpenGestionarAsignaturas(true);
    };

    //Funcion para cerrar el modal de gestionar asignaturas
    const closeModalGestionarAsignaturas = () => {
        setIsOpenGestionarAsignaturas(false);
    };

    const getUserNip = async () => {
        const { data: userData, error: userError } = await getUserInfoById(user.id);
        if (userError) {
            console.error("Error al obtener la información del usuario:", userError);
            return;
        }
        setUserNip(userData.nip);
    }

    // Función para obtener las asignaturas de un estudiante
    const obtenerAsignaturasDeUsuario = async (studentId) => {
        try {
            // Paso 1: Obtener los subject_id asociados al estudiante
            const { data: enrollmentData, error: enrollmentError } = await getSubjectsByStudentId(studentId);

            if (enrollmentError) {
                console.error("Error al obtener las asignaturas del estudiante:", enrollmentError);
                return;
            }

            if (!enrollmentData || enrollmentData.length === 0) {
                console.log("El estudiante no tiene asignaturas asociadas.");
                setModalAsignaturasData([]); // Guardar una lista vacía si no hay asignaturas
                return;
            }

            // Paso 2: Obtener la información completa de cada asignatura
            const subjectPromises = enrollmentData.map(async (enrollment) => {
                const { data: subjectData, error: subjectError } = await getSubjectById(enrollment.subject_id);

                if (subjectError) {
                    console.error(`Error al obtener la información de la asignatura con ID ${enrollment.subject_id}:`, subjectError);
                    return null; // Retornar null si hay un error
                }

                return subjectData;
            });

            // Ejecutar todas las promesas y filtrar valores nulos (errores)
            const subjects = (await Promise.all(subjectPromises)).filter((subject) => subject !== null);
            console.log("Asignaturas cargadas correctamente:", subjects);
            // Paso 3: Guardar las asignaturas en el estado


            if (subjects && subjects.length > 0) {
                console.log("Asignaturas válidas encontradas para el usuario");
                setModalAsignaturasData(subjects);
            } else {
                console.log("No se encontraron asignaturas válidas para el usuario.");
                setModalAsignaturasData([]); // Si no hay asignaturas válidas, mantener el estado vacío
            }


        } catch (err) {
            console.error("Ha ocurrido un error al obtener las asignaturas:", err);
        }
    };

    return (
        <div className="calendario">
            <div className="absolute flex top-[1vh] left-[1vh]">
                <Button color="primary" onClick={openModalTareas}>
                    Ver tareas
                </Button>
                <Button className="ml-[5px]" color="primary" onClick={openModal}>
                    Personalizar calendario
                </Button>
                {user && user.role == "teacher" && (
                    <Button
                        color="primary"
                        onClick={() => navigate(constants.root + "ProfesorMatriculas")}
                        className="ml-[5px]"
                    >
                        Gestionar matrículas
                    </Button>                
                )}

                {user && user.role == "student" && (
                    <Button 
                      color="primary" 
                      onClick={openModalGestionarAsignaturas}
                      className="ml-[5px]"
                    >
                        Gestionar asignaturas
                    </Button>
                )}

            </div>
            <div className="mes-tit flex">
                <h1 className="mes-tit"> {monthYear} </h1>
            </div>
            <Logout/>
            <div className="relative">
                <div className="flex bg-primary text-white text-[1.5rem] items-center font-bold">
                    <div className="first-col">
                        <Tooltip content="Anterior semana">
                            <Button
                                className="text-[2rem] bg-primary text-white min-w-0"
                                size="sm"
                                onClick={() => changeWeek(false)}
                            >
                                <FaRegArrowAltCircleLeft />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Siguiente semana">
                            <Button
                                className="text-[2rem] bg-primary text-white min-w-0"
                                size="sm"
                                onClick={() => changeWeek(true)}
                            >
                                <FaRegArrowAltCircleRight />
                            </Button>
                        </Tooltip>
                    </div>
                    {diasSemana.map((d, idx) => (
                        <p className="d text-center" key={idx}> {d} </p>
                    ))}

                </div>

                <div className="flex-col">
                    {hours.map((h, idx) => (
                        <div className="" key={idx}>
                            <div className="flex">
                                <p className="first-col" key={idx}> {h} </p>
                                {Array.from({ length: 7 }).map((_, idx) => (
                                    <div className="d border-[1px] border-black" key={idx}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {horarios.map((h, idx) => (
                    <div style={{
                        position: 'absolute',
                        top: `${h.top}`,
                        left: `${h.left}`,
                        height: `${h.height}`,
                        width: `${h.width}vw`,
                        color: `${h.textColor}`,
                        background: h.type === "Practicas"
                        ? `repeating-linear-gradient(
                            45deg, 
                            ${h.color}, 
                            ${h.color} 10px, 
                            ${getAuxColor(h.color)} 10px, 
                            ${getAuxColor(h.color)} 20px)`
                        : `${h.color}`,
                        borderWidth: "1px",
                        borderColor: "black",
                        overflow: "hidden"
                    }}
                        key={idx}
                        data-testid={`event-${h.id}`}
                        //onClick={() => console.log(`Start: ${h.start}, End: ${h.end}, Name: ${h.name}`)}
                        onClick={() => handleOpenModal(h)}
                    >
                        <div className="flex items-center">
                            <p className="ml-[5px] font-bold"> {h.start} - {h.end} </p>
                            {h.type === "Examen" && (
                                <div style={{
                                    color: getContrastColor(h.color),
                                    marginLeft: "10px",
                                    fontWeight: "bold"
                                }}>
                                    <GrNotes/>
                                </div>
                            )}
                        </div>
                        <p className="ml-[5px]"> {h.name} </p>
                    </div>
                ))}
            </div>
            <ModalComponent
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={modalData?.name}
                date_start={modalData?.start}
                date_finish={modalData?.end}
                place={modalData?.place || ""}
                group={modalData?.group_name || null}
                descripcion={modalData?.description}
                creador={modalData?.user_id}
                id={modalData?.id}
                date={modalData?.date || modalData?.starting_date}
                type={modalData?.type}
                onAccept={onOpenChange}
            />

            <ModalComponentcreate
                isOpen={isModalOpen}
                onOpenChange={closeModal}
                listaCompletaEventos={horariosrecu}
                listaCompletaEventosVisibles={horariosBD}
            />
            <ModalTareas
                isOpen={isModalTareasOpen}
                onOpenChange={closeModalTareas}
                listaTareas={tareas}
            />

            <ModalDesasociarAsignaturas
                isOpen={isOpenGestionarAsignaturas}
                onOpenChange={closeModalGestionarAsignaturas}
                asignaturas={modalAsignaturasData}
                empty={modalAsignaturasData?.length === 0}
            />
        </div>
    )
}

export default Calendario