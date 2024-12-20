import * as f from './student.js';
import { supabase } from '../supabaseClient.js';
import { createAcademicEventAndPublish, deleteAcademicEvent } from '../academicEvent/academicEvent.js';
import { deleteCustomAcademicEvent, getFullVisibleAcademicEventsForUser } from '../customAcademicEvent/customAcademicEvent.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const testArrayStudents = [
  {
    name: 'Estudiante 1',
    nip: 1111111,
    pass: 'studentpass1'
  },
  {
    name: 'Estudiante 2',
    nip: 2222222,
    pass: 'studentpass2'
  },
  {
    name: 'Estudiante 3',
    nip: 3333333,
    pass: 'studentpass3'
  }
];

let organizationId = 1;
let subject_id = 323;
let academicEventPublished;
let academicEventPublished2;

describe('Student API Tests', () => {
  // Configuración inicial
  beforeAll(async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayStudents[0].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayStudents[1].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayStudents[2].nip);

    const result = await f.registerArrayStudents(testArrayStudents, organizationId);
    expect(result.error).toBeNull(); // Verifica que no haya error

    //Creamos dos eventos academicos y los publicamos, pero no hay nadie matriculado
    academicEventPublished = await createAcademicEventAndPublish('Evento Académico 2', '2021-12-03', '2021-12-03', 'Grupo A', 1, 'Descripción 2', 'Clase Magistral', 'Clase A', '11:00:00', '12:00:00', subject_id);
    expect(academicEventPublished.error).toBeNull(); // Verificar que no haya error
    academicEventPublished2 = await createAcademicEventAndPublish('Evento Académico 1', '2021-12-03', '2021-12-03', 'Grupo A', 1, 'Descripción 1', 'Clase Magistral', 'Clase A', '10:30:00', '12:00:00', subject_id);
    expect(academicEventPublished2.error).toBeNull(); // Verificar que no haya error
  });

  // Prueba para registrar un array de estudiantes
  it('should register an array of students', async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', 44444);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 55555);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 66666);

    const result = await f.registerArrayStudents([
      {
        name: 'Estudiante 4',
        nip: 44444,
        pass: 'studentpass4'
      },
      {
        name: 'Estudiante 5',
        nip: 55555,
        pass: 'studentpass5'
      },
      {
        name: 'Estudiante 6',
        nip: 66666,
        pass: 'studentpass6'
      }
    ], organizationId);

    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  // Matricular un estudiante en una asignatura
  it('should matriculate a student in a subject', async () => {
    await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', testArrayStudents[0].nip);
    const result = await f.matriculateStudent(testArrayStudents[0].nip, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getStudentIdByNip(testArrayStudents[0].nip);

    const subjects = await f.getSubjectsByStudentId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(1); // Verifica que haya una asignatura

    // Obtenemos los eventos académicos visibles para el usuario
    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    console.log("resultAcademicEvents", resultAcademicEvents);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
    expect(resultAcademicEvents.data.id).toBe(academicEventPublished.data.id); // Verifica que el evento académico sea el esperado
  });

  // Matricular un estudiante en múltiples asignaturas
  it('should matriculate a student in multiple subjects', async () => {
    await supabase
      .from('enrollments')
      .delete()
      .eq('user_id', testArrayStudents[1].nip);
    const result = await f.matriculateStudentOnMultipleSubjects(testArrayStudents[1].nip, [99995, 99996]);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getStudentIdByNip(testArrayStudents[1].nip);

    const subjects = await f.getSubjectsByStudentId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(2); // Verifica que haya una asignatura

    // Obtenemos los eventos académicos visibles para el usuario
    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
  });

  // Obtener las asignaturas de un estudiante
  it('should get the subjects of a student', async () => {
    const studentId = (await f.getStudentIdByNip(testArrayStudents[0].nip));
    const result = await f.getSubjectsByStudentId(studentId.data);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  it('should get students info by subject', async () => {
    const result = await f.getStudentsBySubject(323);
    expect(result).not.toBeNull();
  });

  it('should get students info by subject', async () => {
    const result = await f.getStudentsBySubject(323);
    expect(result).not.toBeNull();
  });

  it('should get subjects info by student', async () => {
    await f.matriculateStudentOnMultipleSubjects(111111, [99995, 99996]);
    const result = await f.getSubjectsInfoByStudent(2346);
    expect(result).not.toBeNull();
  });

  it('should unenroll an student from a subject', async () => {
    const result = await f.unenrollStudent(testArrayStudents[0].nip, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getStudentIdByNip(testArrayStudents[0].nip);

    const subjects = await f.getSubjectsByStudentId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(0); // Verifica que haya una asignatura

    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
    expect(resultAcademicEvents.data.length).toBe(0); // Verifica que haya dos eventos académicos
  });

  it('should unenroll an student from multiple subjects', async () => {
    const result = await f.unenrollStudentFromMultipleSubjects(testArrayStudents[1].nip, [99995, 99996]);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getStudentIdByNip(testArrayStudents[1].nip);

    const subjects = await f.getSubjectsByStudentId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(0); // Verifica que haya una asignatura

    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
    expect(resultAcademicEvents.data.length).toBe(0); // Verifica que no haya eventos academicos
  });



  // Limpiar datos después de las pruebas
  afterAll(async () => {

    await deleteCustomAcademicEvent(academicEventPublished.data[0].id);

    await deleteAcademicEvent(academicEventPublished.data[0].id);
    await deleteAcademicEvent(academicEventPublished2.data[0].id);
    await f.unenrollStudentFromMultipleSubjects(111111, [99995, 99996]);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayStudents[0].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayStudents[1].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayStudents[2].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 44444);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 55555);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 66666);


  });
});
