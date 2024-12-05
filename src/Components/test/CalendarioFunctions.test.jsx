import { describe, expect, it } from 'vitest';
import { convertirAHorasEnMinutos, coincidenHorarios, calcularSolapes, getContrastColor, monthToNumber, numberToMonth, isInWeek } from '../CalendarioFunctions';

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

    describe('isInWeek', () => {
        const monday = new Date(2024, 11, 2, 0, 0, 0, 0);

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
