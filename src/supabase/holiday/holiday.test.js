import * as f from './holiday'; // Asegúrate de que las funciones se importen correctamente
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabaseClient';

// Datos de prueba
const testHoliday = {
    name: 'Día de la Independencia',
    date: '2024-09-16',
    description: 'Celebración nacional',
    recurrent: false,
    organization_id: 1,  
};

const updatedHoliday = {
    name: 'Día de la Independencia Modificado',
    date: '2024-09-16',
    description: 'Celebración nacional con actividades especiales',
    recurrent: true,
};

// Variables para almacenar IDs
let holidayId;
describe('Holiday API Tests', () => {
    // Configuración inicial
    beforeAll(async () => {
        // Asegúrate de limpiar antes de realizar las pruebas
        await supabase
            .from('holiday')
            .delete()
            .eq('name', testHoliday.name);

        // Crear el holiday de prueba
        const result = await f.createHoliday(testHoliday.name, testHoliday.date, testHoliday.description, testHoliday.recurrent, testHoliday.organization_id);
        expect(result.error).toBeNull(); // Verifica que no haya errores al crear el holiday

        // Obtener el ID del holiday creado
        const { data: holidayData } = await supabase
            .from('holiday')
            .select('id')
            .eq('name', testHoliday.name)
            .single();
        holidayId = holidayData.id;
        expect(holidayId).not.toBeNull(); // Asegúrate de que el holiday se haya creado correctamente
    });

    it('should create a new holiday', async () => {
        const result = await f.createHoliday('Día de los Muertos', '2024-11-01', 'Celebración tradicional mexicana', false, testHoliday.organization_id);
        expect(result.error).toBeNull();
    });

    it('should retrieve all holidays for the organization', async () => {
        const { data: holidays, error } = await f.getAllHolidaysByOrganization(testHoliday.organization_id);
        expect(error).toBeNull();
        expect(holidays[0].name).toBe(testHoliday.name); // Verifica el nombre del holiday
        expect(holidays[1].name).toBe('Día de los Muertos'); // Verifica la fecha del holiday
    });

    it('should update a holiday', async () => {
        const result = await f.editHoliday(holidayId, updatedHoliday);
        expect(result.error).toBeNull();

        const { data: updatedHolidayData } = await supabase
            .from('holiday')
            .select('*')
            .eq('id', holidayId)
            .single();
        expect(updatedHolidayData.name).toBe(updatedHoliday.name); // Verifica que el nombre se haya actualizado
        expect(updatedHolidayData.description).toBe(updatedHoliday.description); // Verifica la descripción actualizada
        expect(updatedHolidayData.recurrent).toBe(updatedHoliday.recurrent); // Verifica que se haya marcado como recurrente
    });

    it('should delete a holiday', async () => {
        const result = await f.deleteHolidayByDate(testHoliday.date);
        expect(result.error).toBeNull();

        const { data: deletedHoliday } = await supabase
            .from('holiday')
            .select('*')
            .eq('id', holidayId);
        expect(deletedHoliday).toHaveLength(0); // El holiday debería haberse eliminado
    });

    it('should not create a holiday with missing data', async () => {
        const result = await f.createHoliday('', '', '', false, testHoliday.organization_id);
        expect(result.error).not.toBeNull(); // Debería retornar un error debido a que faltan datos importantes
    });

    // Limpieza de datos al final de las pruebas
    afterAll(async () => {
        // Eliminar holiday
        if (holidayId) {
            await f.deleteHoliday(holidayId);
        }
        await f.deleteHolidayByDate('2024-11-01');
    });
});
