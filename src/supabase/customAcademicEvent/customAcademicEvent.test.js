import * as f from './customAcademicEvent.js';
import { supabase } from '../supabaseClient.js';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import * as ae from '../academicEvent/academicEvent.js';

let userId;
let academicEvent;
let subject_id;

describe('Custom Academic Event API Tests', () => {
  beforeAll(async () => {
    userId = 43;
    subject_id = 12;
    academicEvent = await ae.createAcademicEvent('Evento Académico 1', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 1', 'Académico', 'Clase A', '10:00:00', '12:00:00', subject_id);
  });

  it('should create a custom academic event', async () => {
    const result = await f.createCustomAcademicEvent(userId, academicEvent.data[0].id);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should edit custom academic event visibility', async () => {
    const result = await f.editCustomAcademicEventVisibility(userId, academicEvent.data[0].id, false);
    expect(result.data[0].visible).toBe(false); // Verificar que la visibilidad sea false
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should get full visible academic events for user', async () => {
    const result = await f.getFullVisibleAcademicEventsForUser(userId);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should delete custom academic event', async () => {
    const result = await f.deleteCustomAcademicEvent(userId, academicEvent.data[0].id);
    expect(result.error).toBeNull(); // Verificar que no haya error

    const { data: deletedEvent } = await supabase
      .from('custom_academic_event')
      .select()
      .eq('user_id', userId)
      .eq('event_id', academicEvent.data[0].id);
    expect(deletedEvent).toHaveLength(0);
  });

  it('should get visible academic events for user', async () => {
    const result = await f.getVisibleAcademicEventsForUser(userId);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber
  });

  afterAll(async () => {
    await supabase
      .from('custom_academic_event')
      .delete()
      .eq('event_id', academicEvent.data[0].id);

    await supabase
      .from('academic_event')
      .delete()
      .eq('id', academicEvent.data[0].id);
  });
}
);


