// Función para convertir la hora "HH:MM" en minutos desde la medianoche
export const convertirAHorasEnMinutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
};


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
