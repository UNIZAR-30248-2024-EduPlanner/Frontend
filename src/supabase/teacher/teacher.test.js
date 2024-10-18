import * as f from './teacher.js';
import { supabase } from '../supabaseClient.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const testArrayTeachers = [
  {
    name: 'Profesor 1',
    nip: 111,
    pass: 'teacherpass1'
  },
  {
    name: 'Profesor 2',
    nip: 222,
    pass: 'teacherpass2'
  },
  {
    name: 'Profesor 3',
    nip: 333,
    pass: 'teacherpass3'
  }
];

let organizationId = 1;
describe('Teacher API Tests', () => {
  // Configuración inicial
  beforeAll(async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayTeachers[0].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayTeachers[1].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayTeachers[2].nip);

    const result = await f.registerArrayTeachers(testArrayTeachers, organizationId);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  // Prueba para registrar un array de profesores
  it('should register an array of teachers', async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', 444);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 555);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 666);
    const result = await f.registerArrayTeachers([
      {
        name: 'Profesor 4',
        nip: 444,
        pass: 'teacherpass4'
      },
      {
        name: 'Profesor 5',
        nip: 555,
        pass: 'teacherpass5'
      },
      {
        name: 'Profesor 6',
        nip: 666,
        pass: 'teacherpass6'
      }
    ], organizationId);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  afterAll(async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayTeachers[0].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayTeachers[1].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayTeachers[2].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 444);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 555);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 666);
  });
});