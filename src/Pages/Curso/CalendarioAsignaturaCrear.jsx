import '../../css/Curso/CalendarioAsignaturaCrear.css';
import { FaSave, FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { Button, Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { calcularSolapes, convertirAHorasEnMinutos, getAuxColor, getContrastColor, isInWeek, numberToMonth, randomColor } from '../../Components/CalendarioFunctions.jsx';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ModalHorarioCrearEditar from '../../Components/ModalHorarioCrearEditar.jsx';
import constants from '../../constants/constants.jsx';
import { GrNotes } from 'react-icons/gr';

const CalendarioAsignaturaCrear = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [horariosRecu, setHorariosRecu] = useState(location.state?.calendario || []);
    const [horariosConPeriodicos, setHorariosConPeriodicos] = useState([]);
    const [diasSemana, setDiasSemana] = useState([])
    const [gruposExistentes, setGruposExistentes] = useState([]);
    const [mondayWeek, setMondayWeek] = useState(null)
    const [monthYear, setMonthYear] = useState(null)
    const color = localStorage.getItem("color");  // En caso de fallo en el set, el color por defecto será el principal 
    const [idCounter, setIdCounter] = useState(location.state?.calendario?.length+1 || 1);    // Contador para los ids virtuales

    const nombreProvisional = "Nueva asignatura";

    const wFirstCol = 5;
    const wCol = 13.57;

    const firstHour = 8;
    const lastHour = 21;
    const nameDays = ["Lunes ", "Martes ", "Miércoles ", "Jueves ", "Viernes ", "Sábado ", "Domingo "];
    const alturaPorHora = 7; // Altura por hora en vh
    const alturaPorMinuto = 7 / 60; // Altura por minuto en vh

    // const generateRandomColor = () => {
    //     let color;
    //     do {
    //         color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    //     } while (isColorTooLight(color) || isColorSimilarToWhite(color));
    //     return color;
    // };

    // const isColorTooLight = (hex) => {
    //     const { r, g, b } = hexToRgb(hex);
    //     const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    //     return luminance > 200;
    // };

    // const isColorSimilarToWhite = (hex) => {
    //     const { r, g, b } = hexToRgb(hex);
    //     return r > 240 && g > 240 && b > 240;
    // };

    // Da formato a los horarios de la semana. Establece el estilo de los 
    // componentes que permite mostrarlos por pantalla
    const procesarHorarios = (h) => {
        const res = [];

        // Guardar en una lista todas las semanas que se han visitado (mondayWeeks)
        // Para cada semana revisada, se filtran los horarios que pertenecen a esa semana
        // y se procesan para mostrarlos en el calendario
        const aux = h.filter((v) => isInWeek(v, mondayWeek, monthYear));

        aux.map((e, idx) => {
            const [hoursStart, minutesStart] = e.start.split(":").map(part => parseInt(part, 10));
            const dayIndex = nameDays.findIndex((v) => v === e.day);
            const [numSolapes, position] = calcularSolapes(aux, idx);
            const minutosS = convertirAHorasEnMinutos(e.start)
            const minutosE = convertirAHorasEnMinutos(e.end)
    
            res.push({
                name: e.name,
                start: e.start,
                end: e.end,
                description: e.description,
                starting_date: e.starting_date,
                end_date: e.end_date,
                monday: e.monday,
                place: e.place,
                group_name: e.group_name,
                type: e.type,
                periodicity: e.periodicity,
                user_id: e.user_id,
                id: e.id,
                day: e.day,
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

    // Calcular cuántos horarios hay que crear por horario periódico en la vista
    const calcularHorariosPorPeriodico = (starting_date, end_date, periodicity) => {
        const startDate = new Date(starting_date);
        const endDate = new Date(end_date);
    
        // Calcular la diferencia en días entre las dos fechas
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
        // Calcular el número de repeticiones
        const numRepeticiones = Math.floor(diffDays / periodicity) + 1;
    
        return numRepeticiones;
    }


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

    const calculateMondayWeekOfDate = (fechaStr) => {
        const [anio, mes, dia] = fechaStr.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, dia);
        const dayOfWeek = fecha.getDay(); // 0 (Domingo) - 6 (Sábado)

        // Calcular el lunes de la semana de la fecha
        const monday = new Date(fecha);
        monday.setDate(fecha.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        monday.setHours(0, 0, 0, 0);
        return monday; // Formato "YYYY-MM-DD"
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
            // setColor(generateRandomColor());
        }
    }, [user.id]);

    const generaPeriodicos = (horarios) => {
        const res = [];
        horarios
            .map((h) => {
                if (h.periodicity !== "") {
                    const periodicity = parseInt(h.periodicity);
                    const numHorarios = calcularHorariosPorPeriodico(h.starting_date, h.end_date, periodicity);
                    for (let i = 0; i < numHorarios; i++) {
                        const newMonday = new Date(h.monday);
                        const newDate = new Date(h.starting_date);
                        newDate.setDate(newDate.getDate() + periodicity * i)
                        const formattedDate = newDate.toISOString().split('T')[0];
                        newMonday.setDate(newMonday.getDate() + periodicity * i);
                        res.push({
                            name: h.name,
                            start: h.start,
                            id: h.id,
                            end: h.end,
                            description: h.description,
                            starting_date: formattedDate,
                            day: obtenerDiaSemana(formattedDate),
                            monday: newMonday,
                            date: formattedDate,
                            end_date: formattedDate,
                            place: h.place,
                            group_name: h.group_name,
                            type: h.type,
                            periodicity: h.periodicity,
                            subject_id: h.subject_id,
                        });
                }
            } else {
                res.push(h);
            }
        });
        return res;
    }

    useEffect(() => {
        if (mondayWeek && horariosConPeriodicos) setHorarios(procesarHorarios(horariosConPeriodicos));
    }, [mondayWeek, horariosConPeriodicos]);

    useEffect(() => {
        horariosRecu.forEach((h) => h.day = obtenerDiaSemana(h.starting_date));
        if (horariosRecu) setHorariosConPeriodicos(generaPeriodicos(horariosRecu));
    }, [horariosRecu]);

    const findHorarioAndOpenModal = (id) => {
        const horario = horariosRecu.find((h) => h.id === id);
        if (horario) {
            openModal(horario);
        }
    };

    // Función para abrir el modal
    const openModal = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        const calendario = [];
        horariosRecu.forEach((h) => {
            calendario.push({
                name: h.name,
                start: h.start,
                end: h.end,
                description: h.description,
                starting_date: h.starting_date,
                id: h.id,
                day: h.day,
                monday: h.monday,
                date: h.date || h.starting_date,
                end_date: h.end_date,
                place: h.place,
                group_name: h.group_name,
                type: h.type,
                periodicity: h.periodicity,
                subject_id: h.subject_id,
            });
        });

        navigate(constants.root + "CursoCrear/asignaturas", { state: { calendario: calendario } });
    }; 

    const handleSaveHorario = (horario) => {
        if (!horario.id) {
            horario.id = idCounter;
            setIdCounter(idCounter + 1);
        }

        // Calcula el lunes de la semana de la fecha del horario
        horario.monday = calculateMondayWeekOfDate(horario.starting_date);

        const updatedHorarios = horariosRecu.map((h) => 
            h.id === horario.id ? { ...h, ...horario } : h
        );

        if (!updatedHorarios.some((h) => h.id === horario.id)) {
            horario.name = nombreProvisional;
            updatedHorarios.push(horario);
        }

        // Actualiza los grupos existentes
        if (!gruposExistentes.includes(horario.group_name) && horario.group_name !== "") {
            setGruposExistentes([...gruposExistentes, horario.group_name]);
        }

        setHorariosRecu(updatedHorarios);
        setIsModalOpen(false);
    };

    const handleDeleteHorario = (id) => {
        const updatedHorarios = horariosRecu.filter((h) => h.id !== id);
        setHorariosRecu(updatedHorarios);
        setIsModalOpen(false);
    };

    return (
        <div className="calendario">
            <div className="header">
                <div className="flecha">
                <Tooltip content="Atrás">
                    <Button
                    data-testid="save"
                    className="flecha-volver-container"
                    onClick={handleSave}
                    size="lg"
                    >
                    <FaSave className="flecha-volver"/>
                    </Button>
                </Tooltip>
                </div>
                <div className="mes-tit flex">
                    <h1 className="mes-tit"> {monthYear} </h1>
                </div>
                <div className="absolute top-[1vh] right-[1vw]">
                    <Button 
                        onClick={openModal}
                        color="primary"
                    >
                        + Añadir horario
                    </Button>
                </div>
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
                        cursor: 'pointer',
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
                        data-testid={idx}
                        onClick={() => {
                            findHorarioAndOpenModal(h.id);
                        }}>
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
            <ModalHorarioCrearEditar
                isOpen={isModalOpen}
                onOpenChange={closeModal}
                title={"Gestionar horario"}
                initialData={modalData}
                gruposExistentes={gruposExistentes}
                tiposExistentes={["Clase Magistral", "Examen", "Practicas", "Entrega", "Problemas"]}
                onSubmit={handleSaveHorario}
                onDelete={handleDeleteHorario}
            />
        </div>


    )
}

export default CalendarioAsignaturaCrear;