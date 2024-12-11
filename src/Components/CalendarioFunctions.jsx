////////////////////////////////////////////////////////////////////////////////
// SOLAPES
////////////////////////////////////////////////////////////////////////////////

// Función para convertir la hora "HH:MM" en minutos desde la medianoche
export const convertirAHorasEnMinutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
};

// Devuelve true si existen solapes entre h1 y h2, false en caso contrario
export const coincidenHorarios = (h1, h2) => {
    const start1 = convertirAHorasEnMinutos(h1.start);
    const end1 = convertirAHorasEnMinutos(h1.end);
    const start2 = convertirAHorasEnMinutos(h2.start);
    const end2 = convertirAHorasEnMinutos(h2.end);

    if (start1 == end2 || start2 == end1) {
        return false;
    } else if ((start1 >= start2 && start1 <= end2) || 
        (start2 >= start1 && start2 <= end1)) {
        return true;
    } else {
        return false;
    }
}

// Calcula los solapes de todos los horarios en <lista>
export const calcularSolapes = (lista, idx) => {
    let numSolapes = 1;
    let position = 0;

    for (let i = 0; i < lista.length; i++) {
        if (i != idx && lista[idx].day == lista[i].day && coincidenHorarios(lista[idx], lista[i])) {
            numSolapes++;

            if (i < idx) position++;
        }
    }

    return [numSolapes, position];
}

////////////////////////////////////////////////////////////////////////////////
// Colores
////////////////////////////////////////////////////////////////////////////////

// Devuelve el color de la asignatura <name> y si no está genera un color aleatorio
// para esa asignatura y lo guarda en el vector colores
export const randomColor = () => {
    // Genera un color hexadecimal aleatorio
    const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

    return color;
}

// Función que convierte colores en hexadecimal a RGB
export function hexToRgb(hex) {
    // Eliminar el carácter '#' si está presente
    hex = hex.replace(/^#/, '');
    // Convertir los valores hexadecimales a números RGB
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Devuelve 'black' o 'white' para usar como color del texto sobre un color
// de fondo en hexadecimal <hex>
export function getContrastColor(hex) {
    const { r, g, b } = hexToRgb(hex);

    // Calcular la luminancia relativa
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Decidir el color del texto
    return luminance >= 128 ? 'black' : 'white';
}

export function getAntiContrastColor(hex) {
    const { r, g, b } = hexToRgb(hex);

    // Calcular la luminancia relativa
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Decidir el color del texto
    return luminance >= 128 ? 'white' : 'black';
}

export function getAuxColor(hex, percentage = 20) {
    const { r, g, b } = hexToRgb(hex);

    const factor = (100 - percentage) / 100;

    // Oscurece cada componente RGB
    const newR = Math.max(0, Math.floor(r * factor));
    const newG = Math.max(0, Math.floor(g * factor));
    const newB = Math.max(0, Math.floor(b * factor));

    // Convierte de nuevo a hexadecimal
    return rgbToHex(newR, newG, newB);
}

////////////////////////////////////////////////////////////////////////////////
// Horarios
////////////////////////////////////////////////////////////////////////////////

// Si 0 <= number <= 11, convierte number en un string acorde al mes 
export const numberToMonth = (number) => {
    if (number < 0 || number > 11) {
        console.error("number debe ser un número entre 0 y 11");
        return "";
    } else {
        const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ]
        
        return months[number];
    }
}

export const monthToNumber = (month) => {
    // Crear un objeto para mapear nombres de meses a números
    const monthMap = {
        Enero: 0, Febrero: 1, Marzo: 2, Abril: 3,
        Mayo: 4, Junio: 5, Julio: 6, Agosto: 7,
        Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11
    };

    return monthMap[month]
}

const dayToNumber = (day) => {
    const dayMap = {
        L: 0, M: 1, X: 2, J: 3, V: 4, S: 5, D: 6
    };

    return dayMap[day];
}

// h es un horario
// monday es un tipo Date, el lunes de la semana actual
// monthYear es el mes y año de monday
// Devuelve true si el horario está en la semana actual
export const isInWeek = (h, monday) => {

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999); // Establece la hora en 23:59:59.999

    if (h.starting_date && h.end_date) {
        // Si el horario tiene estos dos campos, estamos ante un horario académico

        const firstDate = new Date(h.starting_date)
        firstDate.setHours(0, 0, 0, 0); // Establece la hora en 00:00:00

        const endDate = new Date(h.end_date)
        endDate.setHours(23, 59, 59, 999); // Establece la hora en 23:59:59.999

        if (sunday < firstDate || monday > endDate) {
            // El rango del calendario no se encuentra en la semana
            return false;
        } else {
            while (firstDate <= sunday) {
                if (firstDate >= monday && firstDate <= endDate) {
                    return true;
                } else {
                    firstDate.setDate(firstDate.getDate() + h.periodicity);
                }
            }
            return false;
        }
    } else {
        const date = new Date(h.date);

        return date >= monday && date <= sunday;
    }
}