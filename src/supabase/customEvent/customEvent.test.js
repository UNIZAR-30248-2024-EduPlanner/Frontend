// src/api/customEvent.test.js
import * as f from './customEvent.js';
import { getUserIdByNIP } from '../user/user.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabaseClient.js';

let userId;
let eventId;
const events = [];

describe('Custom Event API Tests', () => {
    // Setup de datos iniciales
    beforeAll(async () => {
        userId = (await getUserIdByNIP(839899, 1)).data;
    });

    it('should create a new custom event', async () => {
        const result = await f.createCustomEvent('Evento Test', 'Descripción del evento', 'Grupo Test', '2021-12-06', '10:00:00', '12:00:00', userId);
        if (!result.data) console.error(result.error);
        expect(result.data).toHaveLength(1); // El evento debe haber sido creado
        expect(result.data[0].name).toBe('Evento Test');  // Verificar que el nombre del evento es correcto
        eventId = result.data[0].id;  // Guardamos el ID del evento para otras pruebas
    });

    it('should edit an existing custom event', async () => {
        const updates = { name: 'Evento Test Editado', description: 'Descripción editada' };
        const result = await f.editCustomEvent(eventId, updates);
        expect(result.error).toBeNull();  // Asegúrate de que no haya errores

        const updatedEvent = await f.getCustomEventById(eventId);
        expect(updatedEvent.data[0].name).toBe(updates.name);  // Verificar que el nombre fue actualizado
        expect(updatedEvent.data[0].description).toBe(updates.description);  // Verificar que la descripción fue actualizada
    });

    it('should delete a custom event', async () => {
        const result = await f.deleteCustomEvent(eventId);
        expect(result.error).toBeNull();  // Asegúrate de que no haya errores
        const deletedEvent = await f.getCustomEventById(eventId);
        expect(deletedEvent.data).toHaveLength(0);  // Verificar que el evento fue eliminado
    });

    it('should retrieve all custom events for a user', async () => {
        let eventsResult = await f.getCustomEventsByUser(userId);
        const eventsNumber = eventsResult.data.length
        // Crear dos eventos para el usuario
        const result1 = await f.createCustomEvent('Evento 1', 'Descripción 1', 'Grupo A', '2021-12-06', '10:00:00', '12:00:00', userId);
        const result2 = await f.createCustomEvent('Evento 2', 'Descripción 2', 'Grupo B', '2021-12-06', '10:00:00', '12:00:00', userId);
        events.push(result1.data[0]);
        events.push(result2.data[0]);
        expect(result1.error).toBeNull();
        expect(result2.error).toBeNull();

        // Obtener los eventos del usuario
        eventsResult = await f.getCustomEventsByUser(userId);
        expect(eventsResult.error).toBeNull(); // Verificar que no haya error
        expect(eventsResult.data).toHaveLength(eventsNumber + 2);  // Debe haber 2 eventos creados
        expect(eventsResult.data[0].name).toBe('Evento 1');  // Verificar que el primer evento sea correcto
        expect(eventsResult.data[1].name).toBe('Evento 2');  // Verificar que el segundo evento sea correcto
    });

    it('should retrieve a custom event by its ID', async () => {
        // Obtener un evento por su ID
        const eventResult = await f.getCustomEventById(events[0].id);
        expect(eventResult.error).toBeNull();  // Verificar que no haya error
        expect(eventResult.data[0].name).toBe('Evento 1');  // Verificar que el evento obtenido sea correcto
    });

    it('should not create a custom event if end time is before start time', async () => {
        // Crear un evento con hora de fin antes de la hora de inicio
        const result = await f.createCustomEvent('Evento Test', 'Descripción del evento', 'Casa', '2021-12-06', '12:00:00', '10:00:00', userId);
        expect(result.error).not.toBeNull();  // Asegúrate de que haya un error
        expect(result.data).toBeNull();  // Asegúrate de que no haya datos
    });


    afterAll(async () => {
        // Verificar que events.data esté definido y tenga al menos un evento
        await supabase
            .from('custom_event')
            .delete()
            .in('id', events.map(event => event.id));
    });

});
