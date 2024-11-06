// src/api/customEvent.test.js
import * as f from './customEvent.js';
import {getUserIdByNIP} from '../user/user.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

let userId;
let eventId;
const events = [];

describe('Custom Event API Tests', () => {
    // Setup de datos iniciales
    beforeAll(async () => {
        userId = await getUserIdByNIP(839899);
    });

    afterAll(async () => {
        // Limpiar los datos al final de las pruebas
        await f.deleteCustomEvent(events.data[0].id);
        await f.deleteCustomEvent(events.data[1].id);
    });

    it('should create a new custom event', async () => {
        const result = await f.createCustomEvent('Evento Test', 'Descripción del evento', 'Grupo Test', '10:00:00', '12:00:00', userId);
        expect(result.error).toBeNull();  // Asegúrate de que no haya errores
        expect(result.data).toHaveLength(1);  // El evento debe haber sido creado
        expect(result.data[0].name).toBe('Evento Test');  // Verificar que el nombre del evento es correcto

        eventId = result.data[0].id;  // Guardamos el ID del evento para otras pruebas
    });

    it('should edit an existing custom event', async () => {
        const updates = { name: 'Evento Test Editado', description: 'Descripción editada' };
        const result = await f.editCustomEvent(eventId, updates);
        expect(result.error).toBeNull();  // Asegúrate de que no haya errores

        const updatedEvent = await supabase.from('custom_event').select('*').eq('id', eventId).single();
        expect(updatedEvent.data.name).toBe(updates.name);  // Verificar que el nombre fue actualizado
        expect(updatedEvent.data.description).toBe(updates.description);  // Verificar que la descripción fue actualizada
    });

    it('should delete a custom event', async () => {
        const result = await f.deleteCustomEvent(eventId);
        expect(result.error).toBeNull();  // Asegúrate de que no haya errores

        const deletedEvent = await supabase.from('custom_event').select('*').eq('id', eventId).single();
        expect(deletedEvent.data).toBeNull();  // Verificar que el evento fue eliminado
    });

    it('should retrieve all custom events for a user', async () => {
        // Crear dos eventos para el usuario
        const result1 = await f.createCustomEvent('Evento 1', 'Descripción 1', 'Grupo A', '10:00:00', '12:00:00', userId);
        const result2 = await f.createCustomEvent('Evento 2', 'Descripción 2', 'Grupo B', '10:00:00', '12:00:00', userId);

        expect(result1.error).toBeNull();
        expect(result2.error).toBeNull();

        // Obtener los eventos del usuario
        events = await f.getCustomEventsByUser(userId);
        expect(events.error).toBeNull();  // Asegúrate de que no haya errores
        expect(events.data).toHaveLength(2);  // Debe haber 2 eventos creados
        expect(events.data[0].name).toBe('Evento 1');  // Verificar que el primer evento sea correcto
        expect(events.data[1].name).toBe('Evento 2');  // Verificar que el segundo evento sea correcto
    });
});
