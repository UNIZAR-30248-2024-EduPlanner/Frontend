import * as f from './academicEvent.js';
import { getFullVisibleAcademicEventsForUser } from '../customAcademicEvent/customAcademicEvent.js';
import { matriculateStudent, unenrollStudent } from '../student/student.js';
import { supabase } from '../supabaseClient.js';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

let academicEvent;
let academicEventUpdated;
let academicEventPublished;
let academicEventTest;
let userId = 2346;
let userId2 = 2347;
let user1_nip = 111111;
let user2_nip = 222222;
let subject_id = 323;
let subject_code = 99995;


describe('Academic Event API Tests', () => {

  beforeAll(async () => {
    //Matriculamos al estudiante en la materia
    await matriculateStudent(user1_nip, subject_code);
    await matriculateStudent(user2_nip, subject_code);
  });

  it('should create an academic event', async () => {
    academicEvent = await f.createAcademicEvent('Evento Académico 1', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 1', 'Clase Magistral', 'Clase A', '10:00:00', '12:00:00', subject_id);
    expect(academicEvent.error).toBeNull(); // Verificar que no haya error
    expect(academicEvent.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should create and publish an academic event', async () => {

    academicEventPublished = await f.createAcademicEventAndPublish('Evento Académico 2', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 2', 'Problemas', 'Clase A', '11:00:00', '12:00:00', subject_id);
    expect(academicEventPublished.error).toBeNull(); // Verificar que no haya error
    expect(academicEventPublished.data).not.toBeNull(); // Debe haber un evento creado.
    expect(academicEventPublished.data).toHaveLength(1); // Debe haber un evento creado.

    // Verificar que el evento se haya publicado a los usuarios matriculados en la asignatura
    const academicEventUser = await getFullVisibleAcademicEventsForUser(userId);
    expect(academicEventUser.error).toBeNull(); // Verificar que no haya error
    expect(academicEventUser.data).not.toBeNull(); // Debe haber un evento creado

    const academicEventUser2 = await getFullVisibleAcademicEventsForUser(userId2);
    expect(academicEventUser2.error).toBeNull(); // Verificar que no haya error
    expect(academicEventUser2.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should edit academic event', async () => {
    academicEventUpdated = await f.editAcademicEvent(academicEvent.data[0].id, { name: 'Evento Académico 1 Editado' });
    expect(academicEventUpdated.error).toBeNull(); // Verificar que no haya error
    expect(academicEventUpdated.data).not.toBeNull(); // Debe haber un evento creado
    expect(academicEventUpdated.data[0].name).toBe('Evento Académico 1 Editado'); // Verificar que el nombre sea el correcto
  });

  it('should get academic events by subject', async () => {
    const result = await f.getAcademicEventsBySubject(subject_id);
    console.log(result);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber un evento creado
  });

  it('should get academic events by type', async () => {
    const result = await f.getAcademicEventsByType('Clase Magistral');
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).not.toBeNull(); // Debe haber un evento creado
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

  it('should create an academic event with startingDate = endDate with periodicity = 1', async () => {
    academicEventTest = await f.createAcademicEvent('EventoTest', '2021-12-01', '2021-12-01', 'Grupo A', null, 'Descripción 1', 'Clase Magistral', 'Clase A', '7:00:00', '12:00:00', subject_id);
    expect(academicEventTest.error).toBeNull(); // Verificar que no haya error
    expect(academicEventTest.data).not.toBeNull(); // Debe haber un evento creado
    expect(academicEventTest.data[0].periodicity).toBe(1) // Debe haber un evento creado
  });

  it('should not create an academic event if periodicity is not multiple of 7', async () => {
    const result = await f.createAcademicEvent('EventoTest', '2021-12-01', '2021-12-01', 'Grupo A', 2, 'Descripción 1', 'Clase Magistral', 'Clase A', '7:00:00', '12:00:00', subject_id);
    expect(result.error).not.toBeNull();
  });

  it('should not create an academic event if end date is before starting date', async () => {
    const result = await f.createAcademicEvent('EventoTest', '2021-12-02', '2021-12-01', 'Grupo A', 7, 'Descripción 1', 'Clase Magistral', 'Clase A', '7:00:00', '12:00:00', subject_id);
    expect(result.error).not.toBeNull();
  });

  it('should not create an academic event if end time is before starting time', async () => {
    const result = await f.createAcademicEvent('EventoTest', '2021-12-01', '2021-12-01', 'Grupo A', 7, 'Descripción 1', 'Clase Magistral', 'Clase A', '12:00:00', '7:00:00', subject_id);
    expect(result.error).not.toBeNull();
  });

  afterAll(async () => {
    await f.deleteAcademicEvent(academicEventPublished.data[0].id);
    await f.deleteAcademicEvent(academicEventTest.data[0].id);
    await unenrollStudent(user1_nip, subject_code);
    await unenrollStudent(user2_nip, subject_code);
  });
});
