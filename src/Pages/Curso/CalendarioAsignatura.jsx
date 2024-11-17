import '../../css/Curso/CalendarioAsignatura.css'
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { Button, Tooltip } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'


const CalendarioAsignatura = () => {
    const navigate = useNavigate();

    const { id } = useParams()
    const { nombre } = useParams()
    const { nip } = useParams()    

    const [color, setColor] = useState('#4051B5');  // En caso de fallo en el set, el color por defecto será el principal 
    useEffect(() => {
        const generateRandomColor = () => {
            let color;
            do {
                color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            } while (isColorTooLight(color) || isColorSimilarToWhite(color));
            return color;
        };

        const isColorTooLight = (hex) => {
            const { r, g, b } = hexToRgb(hex);
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luminance > 200;
        };

        const isColorSimilarToWhite = (hex) => {
            const { r, g, b } = hexToRgb(hex);
            return r > 240 && g > 240 && b > 240;
        };

        setColor(generateRandomColor());
    }, []);

    const wFirstCol = 5;
    const wCol = 13.57;

    const firstHour = 8;
    const lastHour = 21;
    const nameDays = ["L", "M", "X", "J", "V", "S", "D"];
    const alturaPorHora = 7; // Altura por hora en vh
    const alturaPorMinuto = 7 / 60; // Altura por minuto en vh
    

    function hexToRgb(hex) {
        // Eliminar el carácter '#' si está presente
        hex = hex.replace(/^#/, '');
        // Convertir los valores hexadecimales a números RGB
        let bigint = parseInt(hex, 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
    
        return { r, g, b };
    }
    
    function getContrastColor(hex) {
        const { r, g, b } = hexToRgb(hex);
        
        // Calcular la luminancia relativa
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        // Decidir el color del texto
        return luminance >= 128 ? 'black' : 'white';
    }

    // Horarios de la semana actual
    const procesarHorarios = (h) => {
        const res = [];
    
        h.map((e) => {
            const [hoursStart, minutesStart] = e.start.split(":").map(part => parseInt(part, 10));
            const [hoursEnd, minutesEnd] = e.end.split(":").map(part => parseInt(part, 10));
            const acc = minutesStart > minutesEnd ? 1 : 0;
    
            // Imprimir el índice encontrado para depuración
            const dayIndex = nameDays.findIndex((v) => v === e.day);
    
            res.push({
                name: e.name,
                start: e.start,
                end: e.end,
                height: ((hoursEnd - hoursStart - acc) * alturaPorHora + Math.abs(minutesEnd - minutesStart) * alturaPorMinuto).toString() + "vh",
                top: ((hoursStart - firstHour + 1) * alturaPorHora + minutesStart * alturaPorMinuto).toString() + "vh",
                left: (wFirstCol + (dayIndex * wCol)).toString() + "vw",
                color: e.color,
                textColor: getContrastColor(e.color)
            });
        });
    
        return res;
    };
    
    const horariosAux = [
        {
            start: "9:30",
            end: "11:00",
            day: "V",
            name: nombre,
            color: color
        },
        {
            start: "12:30",
            end: "13:30",
            day: "M",
            name: nombre,
            color: color
        },
        {
            start: "15:00",
            end: "16:30",
            day: "X",
            name: nombre,
            color: color
        }
    ]

    // Convierte tiempo en formato HH:MM a minutos
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Filtrar horarios para incluir solo aquellos con días válidos y horas dentro del rango permitido
    const filteredHorariosAux = horariosAux.filter(horario => {
        const startHour = firstHour * 60;
        const endHour = lastHour * 60;
        const startMinutes = timeToMinutes(horario.start);
        const endMinutes = timeToMinutes(horario.end);
        return nameDays.includes(horario.day) && startMinutes >= startHour && endMinutes <= endHour;
    });

    const horarios = procesarHorarios(filteredHorariosAux);

    // Horas visibles en el calendario
    const generateHours = (start, end) => {
        const hours = [];
        for (let hour = start; hour <= end; hour++) {
            hours.push(`${hour}:00`);
        }
        return hours;
    };
    
    // Llamada para generar la lista de horas entre 8:00 y 21:00
    const hours = generateHours(8, 21);


    // Dias de la semana requerida
    const [diasSemana, setDiasSemana] = useState([])

    // Primer día de la semana actual
    const [mondayWeek, setMondayWeek] = useState(null)

    // Mes actual
    const [monthYear, setMonthYear] = useState(null)

    const changeWeek = (next) => {
        const newMonday = new Date(mondayWeek)
        if (next) {
            newMonday.setDate(newMonday.getDate() + 7);
        } else {
            newMonday.setDate(newMonday.getDate() - 7);
        }
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

    const numberToMonth = (number) => {
        if (number < 0 || number > 11) {
            console.error("number debe ser un número entre 0 y 11");
        } else {
            const month = 
                number === 0 ? "Enero" :
                number === 1 ? "Febrero" :
                number === 2 ? "Marzo" :
                number === 3 ? "Abril" :
                number === 4 ? "Mayo" :
                number === 5 ? "Junio" :
                number === 6 ? "Julio" :
                number === 7 ? "Agosto" :
                number === 8 ? "Septiembre" :
                number === 9 ? "Octubre" :
                number === 10 ? "Noviembre" : "Diciembre";
            return month;
        }
    }

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Domingo) - 6 (Sábado)

        // Calcular el lunes de esta semana
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
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
      }, []);

    const handleSave = () => {
        navigate(constants.root + "CursoModificar", { state: { horarios: filteredHorariosAux } });
    };

    return (
        <div className="calendario">
            <div className="header">
                <div className="flecha">
                <Tooltip content="Atrás">
                    <Button
                    className="flecha-volver-container"
                    onClick={handleSave}
                    size="lg"
                    >
                    <FaArrowLeft className="flecha-volver"/>
                    </Button>
                </Tooltip>
                </div>
                <div className="mes-tit flex">
                    <h1 className="mes-tit"> {monthYear} </h1>
                </div>
                <div className="personalizar">
                    <Button className="bg-secondary text-primary">
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
                                <FaRegArrowAltCircleLeft/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Siguiente semana">
                            <Button 
                              className="text-[2rem] bg-primary text-white min-w-0" 
                              size="sm"
                              onClick={() => changeWeek(true)}
                            >
                                <FaRegArrowAltCircleRight/>
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
                            width: `${wCol}vw`,
                            color: `${h.textColor}`,
                            backgroundColor: `${h.color}`,
                            borderWidth: "1px",
                            borderColor: "black",
                            overflow: "hidden",
                            cursor: "pointer"
                        }} 
                        key={idx}
                        onClick={() => console.log(h)}
                    >
                        <p className="ml-[5px] font-bold"> {h.start} - {h.end} </p>
                        <p className="ml-[5px]"> {h.name} </p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default CalendarioAsignatura