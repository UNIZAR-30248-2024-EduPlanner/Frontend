import * as f from './academicEvent.js';
import { getFullVisibleAcademicEventsForUser } from '../customAcademicEvent/customAcademicEvent.js';
import { matriculateStudent, unenrollStudent } from '../student/student.js';
import { supabase } from '../supabaseClient.js';
import { describe, beforeAll, afterAll, it, expect } from 'vitest';

let userId;
let nip;
let userId2;
let nip2;
let academicEvent;
let subject_id;
let subject_code;
let academicEventUpdated;
let academicEventPublished;

describe('Academic Event API Tests', () => {

  beforeAll(async () => {
    //TODOS ESTOS VALORES DEBEN EXISTIR EN LA BASE DE DATOS Y SER VÁLIDOS
    userId = 43;
    userId2 = 44;
    nip2 = 819304;
    nip = 839899;
    subject_id = 12;
    subject_code = 20001;
    //Matriculamos al estudiante en la materia
    await matriculateStudent(nip, subject_code);
    await matriculateStudent(nip2, subject_code);
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
    expect(academicEventUser.data).toHaveLength(1); // Debe haber un evento creado
    expect(academicEventUser.data[0].name).toBe('Evento Académico 2'); // Verificar que el nombre sea el correcto

    const academicEventUser2 = await getFullVisibleAcademicEventsForUser(userId2);
    expect(academicEventUser2.error).toBeNull(); // Verificar que no haya error
    expect(academicEventUser2.data).not.toBeNull(); // Debe haber un evento creado
    expect(academicEventUser2.data).toHaveLength(1); // Debe haber un evento creado
    expect(academicEventUser2.data[0].name).toBe('Evento Académico 2'); // Verificar que el nombre sea el correcto
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



  afterAll(async () => {
    await f.deleteAcademicEvent(academicEventPublished.data[0].id);
    await unenrollStudent(nip, subject_code);
    await unenrollStudent(nip2, subject_code);
  });
});
