import '../css/Calendario.css'
import FlechaVolver from "../Components/FlechaVolver"
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { Button } from '@nextui-org/react'
import { useEffect, useState } from 'react'

const Calendario = () => {

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
            day: "L", // Debe coincidir con el array nameDays
            name: "Programación I",
            color: "#989898"
        },
        {
            start: "12:30",
            end: "13:30",
            day: "M", // Debe coincidir con el array nameDays
            name: "Programación I",
            color: "#989898"
        },
        {
            start: "10:00",
            end: "14:00",
            day: "J", // Debe coincidir con el array nameDays
            name: "Matemáticas II",
            color: "#125478"
        },
        {
            start: "16:00",
            end: "18:30",
            day: "J", // Debe coincidir con el array nameDays
            name: "Matemáticas II",
            color: "#125478"
        },
    ]

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

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Domingo) - 6 (Sábado)
        
        // Calcular el lunes de esta semana
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
        // Array para almacenar solo los números de los días de la semana desde lunes a domingo
        const days = [];

        for (let i = 0; i < 7; i++) {
          const nextDay = new Date(monday);
          nextDay.setDate(monday.getDate() + i);
          days.push(nameDays[i] + nextDay.getDate()); // Solo el número del día
        }
    
        console.log(days)
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
                <h1 className="mes-tit"> Octubre 2024 </h1>
            </div>

            <div className="relative">
                <div className="flex bg-primary text-white text-[1.5rem] items-center font-bold">
                    <div className="first-col">
                        <FaRegArrowAltCircleLeft/>
                        <FaRegArrowAltCircleRight/>
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