import * as f from './event.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getUserIdByNIP } from '../user/user.js';
import { matriculateStudent, unenrollStudent } from '../student/student.js';
import * as ce from '../customEvent/customEvent.js';
import * as ae from '../academicEvent/academicEvent.js';

let userId;
let subject_id;
let customEvent;
let academicEvent;

describe('Event API Tests', () => {
  beforeAll(async () => {
    subject_id = 12;
    userId = (await getUserIdByNIP(839899, 1)).data;
    await matriculateStudent(839899,20001);
    customEvent = await ce.createCustomEvent('Evento 1', 'Descripción 1', 'Grupo A', '2021-12-02', '10:00:00', '12:00:00', userId);
    academicEvent = await ae.createAcademicEventAndPublish('Evento Académico 1', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 1', 'Académico', 'Clase 1', '10:00:00', '12:00:00', subject_id);
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
    await unenrollStudent(839899,20001);
  });
});
