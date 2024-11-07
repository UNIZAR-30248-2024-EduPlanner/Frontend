import * as f from './academicEvent.js';
import { supabase } from '../supabaseClient.js';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

let userId;
let academicEvent;
let subject_id;
let academicEventUpdated;
let academicEventPublished;

describe('Academic Event API Tests', () => {

  beforeAll(async () => {
    userId = 43;
    subject_id = 12;
  });

  it('should create an academic event', async () => {
    academicEvent = await f.createAcademicEvent('Evento Académico 1', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 1', 'Académico', 'Clase A', '10:00:00', '12:00:00', subject_id);
    expect(academicEvent.error).toBeNull(); // Verificar que no haya error
    expect(academicEvent.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should create and publish an academic event', async () => {
    academicEventPublished = await f.createAcademicEventAndPublish('Evento Académico 2', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 2', 'Académico', 'Clase A', '10:00:00', '12:00:00', subject_id, [userId]);
    expect(academicEventPublished.error).toBeNull(); // Verificar que no haya error
    expect(academicEventPublished.data).not.toBeNull(); // Debe haber un evento creado.
    expect(academicEventPublished.data).toHaveLength(1); // Debe haber un evento creado.
  });

  it('should edit academic event', async () => {
    academicEventUpdated = await f.editAcademicEvent(academicEvent.data[0].id, { name: 'Evento Académico 1 Editado' });
    expect(academicEventUpdated.error).toBeNull(); // Verificar que no haya error
    expect(academicEventUpdated.data).not.toBeNull(); // Debe haber un evento creado
    expect(academicEventUpdated.data[0].name).toBe('Evento Académico 1 Editado'); // Verificar que el nombre sea el correcto
  });

  it('should delete academic event', async () => {
    const result = await f.deleteAcademicEvent(academicEvent.data[0].id);
    expect(result.error).toBeNull(); // Verificar que no haya error

    const { data: deletedEvent } = await supabase
      .from('academic_event')
      .select()
      .eq('id', academicEvent.data[0].id);
    expect(deletedEvent).toHaveLength(0);
  });

  it('should get academic events by subject', async () => {
    const result = await f.getAcademicEventsBySubject(subject_id);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber un evento creado
  });

  afterAll(async () => {
    await supabase
      .from('academic_event')
      .delete()
      .eq('id', academicEventPublished.data[0].id);
  });
});
