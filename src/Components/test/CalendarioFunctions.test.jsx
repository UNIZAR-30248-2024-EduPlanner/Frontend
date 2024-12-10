import { describe, expect, it } from 'vitest';
import { 
    convertirAHorasEnMinutos, 
    numberToMonth, 
    monthToNumber, 
    calcularSolapes, 
    coincidenHorarios, 
    getContrastColor, 
    getAntiContrastColor,
    hexToRgb,
    getAuxColor, 
    isInWeek } from '../CalendarioFunctions';

describe('CalendarioFunctions', () => {
    describe('convertirAHorasEnMinutos', () => {
        it('should convert 08:30 into 510 minutes', () => {
            const minutos = convertirAHorasEnMinutos("08:30");
            expect(minutos).toBe(510);
        });

        it('should convert 00:00 into 0 minutes', () => {
            const minutos = convertirAHorasEnMinutos("00:00");
            expect(minutos).toBe(0);
        });

        it('should convert 23:59 into 1439 minutes', () => {
            const minutos = convertirAHorasEnMinutos("23:59");
            expect(minutos).toBe(1439);
        });
    });

    describe('coincidenHorarios', () => {
        it('should return true if the schedules overlap', () => {
            const h1 = { start: "08:00", end: "10:00" };
            const h2 = { start: "09:00", end: "11:00" };
            const result = coincidenHorarios(h1, h2);
            expect(result).toBe(true);
        });

        it('should return false if the schedules do not overlap', () => {
            const h1 = { start: "08:00", end: "10:00" };
            const h2 = { start: "10:00", end: "12:00" };
            const result = coincidenHorarios(h1, h2);
            expect(result).toBe(false);
        });

        it('should return false if the schedules are consecutive', () => {
            const h1 = { start: "08:00", end: "09:00" };
            const h2 = { start: "09:00", end: "10:00" };
            const result = coincidenHorarios(h1, h2);
            expect(result).toBe(false);
        });
    });

    describe('calcularSolapes', () => {
        it('should correctly calculate overlaps', () => {
            const lista = [
                { start: "08:00", end: "09:00", day: "L" },
                { start: "08:30", end: "09:30", day: "L" },
                { start: "09:00", end: "10:00", day: "L" },
                { start: "10:00", end: "11:00", day: "L" }
            ];
            const [numSolapes, position] = calcularSolapes(lista, 1);
            expect(numSolapes).toBe(3);
            expect(position).toBe(1);
        });

        it('should return 1 overlap if there are no overlaps', () => {
            const lista = [
                { start: "08:00", end: "09:00", day: "L" },
                { start: "09:00", end: "10:00", day: "L" },
                { start: "10:00", end: "11:00", day: "L" }
            ];
            const [numSolapes, position] = calcularSolapes(lista, 1);
            expect(numSolapes).toBe(1);
            expect(position).toBe(0);
        });

        it('should correctly calculate overlaps on different days', () => {
            const lista = [
                { start: "08:00", end: "09:00", day: "L" },
                { start: "08:30", end: "09:30", day: "M" },
                { start: "09:00", end: "10:00", day: "L" },
                { start: "10:00", end: "11:00", day: "L" }
            ];
            const [numSolapes, position] = calcularSolapes(lista, 1);
            expect(numSolapes).toBe(1);
            expect(position).toBe(0);
        });
    });

    describe('getContrastColors', () => {
        it('should return white', () => {
            expect(getContrastColor("#165912")).toBe('white');
        });

        it('should return black', () => {
            expect(getContrastColor("#e4a2f1")).toBe('black');
        });
    });

    describe('getAntiContrastColors', () => {
        it('should return black', () => {
            expect(getAntiContrastColor("#165912")).toBe('black');
        });

        it('should return white', () => {
            expect(getAntiContrastColor("#e4a2f1")).toBe('white');
        });
    });

    describe('hexToRgb', () => {
        it('should convert hexadecimal to rgb format', () => {
            expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
        });
    });

    describe('getAuxColor', () => {
        it('should darken the color by the default percentage', () => {
            expect(getAuxColor("#ff0000")).toBe("#cc0000");
        });
    
        it('should darken the color by 50%', () => {
            expect(getAuxColor("#00ff00", 50)).toBe("#007f00");
        });
    
        it('should darken the color by 10%', () => {
            expect(getAuxColor("#0000ff", 10)).toBe("#0000e5");
        });
    
        it('should handle black color correctly', () => {
            expect(getAuxColor("#000000")).toBe("#000000");
        });
    
        it('should handle white color correctly', () => {
            expect(getAuxColor("#ffffff")).toBe("#cccccc");
        });
    });

    describe('isInWeek', () => {
        const monday = new Date(2024, 11, 2, 0, 0, 0, 0);

        it('should return error when incorrect periodicity', () => {
            const horario = {
                starting_date: new Date(2024, 11, 31, 0, 0, 0, 0),
                end_date: new Date(2024, 11, 5, 23, 59, 59, 59),
                periodicity: 0
            }
            expect(isInWeek(horario, monday)).toBe(false);
        });

        it('should return error when incorrect starting date', () => {
            const horario = {
                starting_date: null,
                end_date: new Date(2024, 11, 5, 23, 59, 59, 59),
                periodicity: 7
            }
            expect(isInWeek(horario, monday)).toBe(false);
        });

        it('should return error when incorrect end date', () => {
            const horario = {
                starting_date: new Date(2024, 11, 2, 23, 59, 59, 59),
                end_date: null,
                periodicity: 7
            }
            expect(isInWeek(horario, monday)).toBe(false);
        });

        it('should return isInWeek', () => {
            const horario = {
                starting_date: new Date(2024, 11, 5, 0, 0, 0, 0),
                end_date: new Date(2024, 11, 31, 23, 59, 59, 59),
                periodicity: 7
            }
            expect(isInWeek(horario, monday)).toBe(true);
        });

        it('should return NOT isInWeek', () => {
            const horario = {
                starting_date: new Date(2024, 10, 28, 0, 0, 0, 0),
                end_date: new Date(2024, 11, 31, 23, 59, 59, 59),
                periodicity: 14
            }
            expect(isInWeek(horario, monday)).toBe(false);
        });
    });

    describe('convert numbers to months and viceversa', () => {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
            "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        it('should return error when incorrect month number', () => {
            expect(numberToMonth(-1)).toBe("");
            expect(numberToMonth(12)).toBe("");
        });

        it('should return correct month number', () => {
            for (let i = 0; i < meses.length; i++) {
                expect(monthToNumber(meses[i])).toBe(i);
            }
        });

        it('should return correct month', () => {
            for (let i = 0; i < meses.length; i++) {
                expect(numberToMonth(i)).toBe(meses[i]);
            }
        })
    });
});
