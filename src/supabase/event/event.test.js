import * as f from './event.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getUserIdByNIP } from '../user/user.js';
import * as ce from '../customEvent/customEvent.js';
import * as ae from '../academicEvent/academicEvent.js';
import * as cae from '../customAcademicEvent/customAcademicEvent.js';
import { supabase } from '../supabaseClient.js';

let userId;
let customEvent;
let academicEvent;

describe('Event API Tests', () => {
  beforeAll(async () => {
    userId = (await getUserIdByNIP(839899, 1)).data;
    customEvent = await ce.createCustomEvent('Evento 1', 'Descripción 1', 'Grupo A', '2021-12-02', '10:00:00', '12:00:00', userId);
    academicEvent = await ae.createAcademicEventAndPublish('Evento Académico 1', '2021-12-01', '2021-12-01', 'Grupo A', 1, 'Descripción 1', 'Académico', 'Clase 1', '10:00:00', '12:00:00', 12);
    cae.createCustomAcademicEvent(userId, academicEvent.data[0].id);
    cae.createCustomAcademicEvent(userId, customEvent.data[0].id);
  });

  it('should retrieve all events for a user', async () => {
    const result = await f.getAllEventsForUser(userId);
    expect(result.error).toBeNull(); // Verificar que no haya error
    expect(result.data).toHaveLength(2);  // Debe haber 0 eventos creados
  });
  afterAll(async () => {
    await supabase
      .from('custom_event')
      .delete()
      .eq('id', customEvent.data[0].id);

    await supabase
      .from('academic_event')
      .delete()
      .eq('id', academicEvent.data[0].id);

    await supabase
      .from('custom_academic_event')
      .delete()
      .eq('event_id', academicEvent.data[0].id)
      .eq('event_id', customEvent.data[0].id);
  });
});
