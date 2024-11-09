import '../css/Calendario.css'
import FlechaVolver from "../Components/FlechaVolver"
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { Button, Tooltip } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { calcularSolapes, convertirAHorasEnMinutos } from '../Components/Solape';

const Calendario = () => {

    const wFirstCol = 5;
    const wCol = 13.57;

    const firstHour = 8;
    const lastHour = 21;
    const nameDays = ["L", "M", "X", "J", "V", "S", "D"];
    const alturaPorHora = 7; // Altura por hora en vh
    const alturaPorMinuto = 7 / 60; // Altura por minuto en vh

    const horariosAux = [
        {
            start: "8:00", end: "10:00", day: "L",
            name: "Matemáticas II",
        },
        {
            start: "8:00", end: "10:00", day: "L",
            name: "Matemáticas I",
        },
        {
            start: "8:00", end: "10:00", day: "L",
            name: "Programación I",
        },
        {
            start: "8:00", end: "10:00", day: "L",
            name: "Programación I",
        },
        {
            start: "10:00", end: "12:00", day: "L",
            name: "FAE",
        },
        {
            start: "10:00", end: "12:00", day: "L",
            name: "IC",
        },
        {
            start: "10:00", end: "12:00", day: "L",
            name: "Matemáticas II",
        },
        {
            start: "10:00", end: "12:00", day: "L",
            name: "Matemáticas I",
        },
        {
            start: "12:00", end: "13:00", day: "L",
            name: "Matemáticas II",
        },
        {
            start: "13:00", end: "14:00", day: "L",
            name: "Matemáticas II",
        },
    ]
    
    // Función que convierte colores en hexadecimal a RGB
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
    
    // Devuelve 'black' o 'white' para usar como color del texto sobre un color
    // de fondo en hexadecimal <hex>
    function getContrastColor(hex) {
        const { r, g, b } = hexToRgb(hex);
        
        // Calcular la luminancia relativa
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        
        // Decidir el color del texto
        return luminance >= 128 ? 'black' : 'white';
    }

    // Contiene una lista de {name: <name>, color: #XXXXXX}
    const colores = [];

    // Devuelve el color de la asignatura <name> y si no está genera un color aleatorio
    // para esa asignatura y lo guarda en el vector colores
    const getColor = (name) => {
        const elem = colores.find((e) => e.name === name);

        if (elem) {
            return elem.color;
        } else {
            // Genera un color hexadecimal aleatorio
            const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
            
            // Añade el nuevo color al array `colores`
            colores.push({ name, color });
            
            return color;
        }
    }

    // Da formato a los horarios de la semana. Establece el estilo de los 
    // componentes que permite mostrarlos por pantalla
    const procesarHorarios = (h) => {
        const res = [];
    
        h.map((e, idx) => {
            const [hoursStart, minutesStart] = e.start.split(":").map(part => parseInt(part, 10));

            // Imprimir el índice encontrado para depuración
            const dayIndex = nameDays.findIndex((v) => v === e.day);

            // Calcula los solapes del horario con otros horarios
            // <numSolapes> contiene el número de solapes de <e> con otros horarios
            // en su franja horaria
            // <position> indica la posición horizontal en caso de que exista solape
            const [numSolapes, position] = calcularSolapes(h, idx);

            // Color de la asignatura
            const color = getColor(e.name)
    
            const minutosS = convertirAHorasEnMinutos(e.start)
            const minutosE = convertirAHorasEnMinutos(e.end)

            res.push({
                name: e.name,
                start: e.start,
                end: e.end,
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

    const horarios = procesarHorarios(horariosAux)

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

    // Si 0 <= number <= 11, convierte number en un string acorde al mes 
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

    return (
        <div className="calendario">
            <FlechaVolver/>
            <div className="personalizar">
                <Button color="primary">
                    + Personalizar calendario
                </Button>
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
                            width: `${h.width}vw`,
                            color: `${h.textColor}`,
                            backgroundColor: `${h.color}`,
                            borderWidth: "1px",
                            borderColor: "black",
                            overflow: "hidden"
                        }} 
                        key={idx}
                    >
                        <p className="ml-[5px] font-bold"> {h.start} - {h.end} </p>
                        <p className="ml-[5px]"> {h.name} </p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Calendario