import '../css/Calendario.css'
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { calcularSolapes, convertirAHorasEnMinutos, getContrastColor, isInWeek, numberToMonth } from '../Components/CalendarioFunctions.jsx';
import { useDisclosure } from "@nextui-org/react";
import ModalComponent from "../Components/ModalHorario";
import ModalComponentcreate from "../Components/ModalEditarHorarios";
import { getAllEventsForUser } from '../supabase/event/event.js';
import { useAuth } from "../context/AuthContext";
import { getFullNonVisibleAcademicEventsForUser } from '../supabase/customAcademicEvent/customAcademicEvent.js';
import Logout from '../Components/Logout.jsx';
import { useNavigate } from 'react-router-dom';
import constants from '../constants/constants.jsx';

const Calendario = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // HorariosBD son todos los horarios recuperados de la BD
    const [horariosBD, setHorariosBD] = useState([]);

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
    const nameDays = ["L", "M", "X", "J", "V", "S", "D"];
    const alturaPorHora = 7; // Altura por hora en vh
    const alturaPorMinuto = 7 / 60; // Altura por minuto en vh

    // const getAllItems = async () => {
    //     console.log(user)
    //     const horariosAux = await getAllEventsForUser(user.id)
    //     if (horariosAux.error) sethorariosAux(horariosAux.data)
    //     else sethorariosAux(horariosAux.data)
    // }

    // Devuelve el color de la asignatura <name> y si no está genera un color aleatorio
    // para esa asignatura y lo guarda en el vector colores

    const getColor = (name) => {
        const elem = colores.find((e) => e.name == name);

        if (elem) {
            return elem.color;
        } else {
            // Genera un color hexadecimal aleatorio
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

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

        aux.map((e, idx) => {

            const [hoursStart, minutesStart] = e.start.split(":").map(part => parseInt(part, 10));

            // Imprimir el índice encontrado para depuración
            const dayIndex = nameDays.findIndex((v) => v === e.day);

            // Calcula los solapes del horario con otros horarios
            // <numSolapes> contiene el número de solapes de <e> con otros horarios
            // en su franja horaria
            // <position> indica la posición horizontal en caso de que exista solape
            const [numSolapes, position] = calcularSolapes(aux, idx);

            // Color de la asignatura
            const color = getColor(e.name)

            const minutosS = convertirAHorasEnMinutos(e.start)
            const minutosE = convertirAHorasEnMinutos(e.end)

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
        const horariosRes = await getAllEventsForUser(user.id);
        const horariosRecuperar = await getFullNonVisibleAcademicEventsForUser(user.id);
        if (horariosRes.error) return console.error("ERROR: recuperando los horarios");

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

    /*const horariosAux = [
        {
            id: "test1", name: "Matemáticas II", starting_date: "2024-11-4", end_date: null, group_name: "Grupo D", periodicity: null, description: "srvwwe", start: "8:00", end: "10:00", subject_id: "1", type: null, place: "Aula B.1",
        },
        {
            id: "test2", name: "Matemáticas I", starting_date: "2024-11-4", end_date: null, group_name: "Grupo A", periodicity: null, description: "srvwwe", start: "8:00", end: "10:00", subject_id: "2", type: null, place: "Aula A.11",
        },
        {
            id: "test3", name: "Programación I", starting_date: "2024-11-4", end_date: null, group_name: "Grupo E", periodicity: null, description: "srvwwe", start: "8:00", end: "10:00", subject_id: "3", type: null, place: "Laboratorio C.3",
        },
        {
            id: "test4", name: "Programación I", starting_date: "2024-11-4", end_date: null, group_name: "Grupo E", periodicity: null, description: "srvwwe", start: "8:00", end: "10:00", subject_id: "4", type: null, place: "Laboratorio C.3",
        },
        {
            id: "test5", name: "FAE", starting_date: "2024-11-4", end_date: null, group_name: "Grupo F", periodicity: null, description: null, start: "10:00", end: "12:00", subject_id: "5", type: null, place: "Aula D.4",
        },
        {
            id: "test6", name: "IC", starting_date: "2024-11-4", end_date: null, group_name: "Grupo G", periodicity: null, description: null, start: "10:00", end: "12:00", subject_id: "6", type: null, place: "Aula E.5",
        },
        {
            id: "test7", name: "Matemáticas II", starting_date: "2024-11-4", end_date: null, group_name: "Grupo D", periodicity: null, description: null, start: "10:00", end: "12:00", subject_id: "37", type: null, place: "Aula B.1",
        },
        {
            id: "test8", name: "Matemáticas I", starting_date: "2024-11-4", end_date: null, group_name: "Grupo A", periodicity: null, description: null, start: "10:00", end: "12:00", subject_id: "8", type: null, place: "Aula A.11",
        },
        {
            id: "test9", name: "Matemáticas II", starting_date: "2024-11-4", end_date: null, group_name: "Grupo D", periodicity: null, description: null, start: "12:00", end: "13:00", subject_id: "9", type: null, place: "Aula B.1",
        },
        {
            id: "test10", name: "Matemáticas II", starting_date: "2024-11-4", end_date: null, group_name: "Grupo D", periodicity: null, description: null, start: "13:00", end: "14:00", subject_id: "11", type: null, place: "Aula B.1",
        }
    ]; */

    // Función que obtiene el día de la semana a partir de una fecha en formato "YYYY-MM-DD"
    const obtenerDiaSemana = (fechaStr) => {
        const diasSemanaAbreviados = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
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
        setMonthYear(numberToMonth(newMonday.getMonth()) + " " + newMonday.getFullYear())

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

    if (user) {
        console.log(user);
        console.log(user.type === "teacher");
    }

    return (
        <div className="calendario">
            <Logout />
            <div className="personalizar flex">
                <Button color="primary" onClick={openModal}>
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

                    // <Dropdown>
                    //     <DropdownTrigger>
                    //       <Button 
                    //         variant="bordered" 
                    //       >
                    //         Open Menu
                    //       </Button>
                    //     </DropdownTrigger>
                    //     <DropdownMenu aria-label="Static Actions">
                    //       <DropdownItem key="new">New file</DropdownItem>
                    //       <DropdownItem key="copy">Copy link</DropdownItem>
                    //       <DropdownItem key="edit">Edit file</DropdownItem>
                    //       <DropdownItem key="delete" className="text-danger" color="danger">
                    //         Delete file
                    //       </DropdownItem>
                    //     </DropdownMenu>
                    // </Dropdown>
                )}
            </div>
            <div className="mes-tit flex">
                <h1 className="mes-tit"> {monthYear} </h1>
            </div>
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
                        backgroundColor: `${h.color}`,
                        borderWidth: "1px",
                        borderColor: "black",
                        overflow: "hidden"
                    }}
                        key={idx}
                        //onClick={() => console.log(`Start: ${h.start}, End: ${h.end}, Name: ${h.name}`)}
                        onClick={() => handleOpenModal(h)}
                    >
                        <p className="ml-[5px] font-bold"> {h.start} - {h.end} </p>
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
                date={modalData?.date}
                onAccept={onOpenChange}
            />

            <ModalComponentcreate
                isOpen={isModalOpen}
                onOpenChange={closeModal}
                listaCompletaEventos={horariosrecu}
                listaCompletaEventosVisibles={horariosBD}
            />
        </div>


    )
}

export default Calendario