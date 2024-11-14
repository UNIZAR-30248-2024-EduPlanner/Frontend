import * as f from './event.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { matriculateStudent, unenrollStudent } from '../student/student.js';
import * as ce from '../customEvent/customEvent.js';
import * as ae from '../academicEvent/academicEvent.js';

let userId = 2346;
let userNIP = 111111;
let subject_code = 99995;
let subject_id = 323;
let customEvent;
let academicEvent;

describe('Event API Tests', () => {
  beforeAll(async () => {
    await matriculateStudent(userNIP, subject_code);
    customEvent = await ce.createCustomEvent('Evento 1', 'Descripción 1', 'Grupo A', '2021-12-02', '10:00:00', '12:00:00', userId);
    academicEvent = await ae.createAcademicEventAndPublish('Evento Académico 1', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 1', 'Clase Magistral', 'Clase 1', '10:00:00', '12:00:00', subject_id);
  });

  it('should retrieve all events for a user', async () => {
    const result = await f.getAllEventsForUser(userId);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).toHaveLength(2);  // Debe haber 0 eventos creados
    console.log("Todos los eventos resultantes", result);
  });

  afterAll(async () => {
    await ce.deleteCustomEvent(customEvent.data[0].id);
    await ae.deleteAcademicEvent(academicEvent.data[0].id);
    await unenrollStudent(userNIP, subject_code);
  });
});
