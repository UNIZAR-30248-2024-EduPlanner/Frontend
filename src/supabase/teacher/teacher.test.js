import * as f from './teacher.js';
import { supabase } from '../supabaseClient.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createAcademicEventAndPublish, deleteAcademicEvent } from '../academicEvent/academicEvent.js';
import { getFullVisibleAcademicEventsForUser } from '../customAcademicEvent/customAcademicEvent.js';


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
let academicEventPublished;
let academicEventPublished2;
let subject_id = 323;

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

    academicEventPublished = await createAcademicEventAndPublish('Evento Académico 2', '2021-12-04', '2021-12-04', 'Grupo A', 1, 'Descripción 2', 'Clase Magistral', 'Clase A', '9:00:00', '12:15:00', subject_id);
    expect(academicEventPublished.error).toBeNull(); // Verificar que no haya error
    academicEventPublished2 = await createAcademicEventAndPublish('Evento Académico 1', '2021-12-04', '2021-12-04', 'Grupo A', 1, 'Descripción 1', 'Clase Magistral', 'Clase A', '8:30:00', '19:00:00', subject_id);
    expect(academicEventPublished2.error).toBeNull(); // Verificar que no haya error
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

  // Prueba para asignar una asignatura a un profesor
  it('should assign a subject to a teacher', async () => {
    await supabase
      .from('teachings')
      .delete()
      .eq('teacher_id', testArrayTeachers[1].nip);
    const result = await f.assignSubjectToTeacher(testArrayTeachers[1].nip, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getTeacherIdByNip(testArrayTeachers[1].nip);

    const subjects = await f.getSubjectsByTeacherId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(1); // Verifica que haya una asignatura

    // Obtenemos los eventos académicos visibles para el usuario
    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    console.log("resultAcademicEvents", resultAcademicEvents);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
    expect(resultAcademicEvents.data.id).toBe(academicEventPublished.data.id); // Verifica que el evento académico sea el esperado
  });

  // Prueba para asignar múltiples asignaturas a un profesor
  it('should assign multiple subjects to a teacher', async () => {
    await supabase
      .from('teachings')
      .delete()
      .eq('teacher_id', testArrayTeachers[2].nip);
    const result = await f.assingArraySubjectsToTeacher(testArrayTeachers[2].nip, [99995, 99996]);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getTeacherIdByNip(testArrayTeachers[2].nip);
    console.log("userId", userId.data);

    const subjects = await f.getSubjectsByTeacherId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(2); // Verifica que haya una asignatura

    // Obtenemos los eventos académicos visibles para el usuario
    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
  });

  it('should get the teachers of a subject', async () => {
    const result = await f.getTeachersBySubjectCode(99995);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  // Prueba para obtener las asignaturas de un profesor
  it('should get the subjects of a teacher', async () => {
    const teacherId = (await f.getTeacherIdByNip(testArrayTeachers[1].nip));
    expect(teacherId).not.toBeNull(); // Asegúrate de que el profesor exista

    const result = await f.getSubjectsByTeacherId(teacherId.data);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  // Prueba para que un profesor asocie a un estudiante a una asignatura
  it('should let a teacher assign a student to a subject', async () => {
    const result = await f.letTeacherAssociateStudentToSubject(testArrayTeachers[1].nip, 111111, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  it('should let a teacher assign multiple students to a subject', async () => {
    await f.letTeacherUnAssociateStudentFromSubject(testArrayTeachers[1].nip, 111111, 99995);
    const result = await f.letTeacherAssociateArrayStudentsToSubject(testArrayTeachers[1].nip, [111111, 222222], 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  it('should get the students of a subject', async () => {
    const result = await f.getStudentsAssignedToSubject(testArrayTeachers[1].nip, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  it('should let a teacher unassociate a student from a subject', async () => {
    const result = await f.letTeacherUnAssociateStudentFromSubject(testArrayTeachers[1].nip, 111111, 99995);
    await f.letTeacherUnAssociateStudentFromSubject(testArrayTeachers[1].nip, 222222, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error
  });

  it('should unassign a subject from a teacher', async () => {
    const result = await f.unassignSubjectFromTeacher(testArrayTeachers[1].nip, 99995);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getTeacherIdByNip(testArrayTeachers[1].nip);

    const subjects = await f.getSubjectsByTeacherId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(0); // Verifica que haya una asignatura

    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
    expect(resultAcademicEvents.data.length).toBe(0); // Verifica que haya dos eventos académicos
  });

  it('should unassign multiple subjects from a teacher', async () => {
    const result = await f.unassignArraySubjectsFromTeacher(testArrayTeachers[2].nip, [99995, 99996]);
    expect(result.error).toBeNull(); // Verifica que no haya error

    const userId = await f.getTeacherIdByNip(testArrayTeachers[1].nip);

    const subjects = await f.getSubjectsByTeacherId(userId.data);
    expect(subjects.error).toBeNull(); // Verifica que no haya error
    expect(subjects.data.length).toBe(0); // Verifica que haya una asignatura

    const resultAcademicEvents = await getFullVisibleAcademicEventsForUser(userId.data);
    expect(resultAcademicEvents.error).toBeNull(); // Verifica que no haya error
    expect(resultAcademicEvents.data.length).toBe(0); // Verifica que no haya eventos academicos
  });

  afterAll(async () => {
    await supabase
      .from('custom_academic_event')
      .delete()
      .eq('user_id', testArrayTeachers[0].nip);
    await deleteAcademicEvent(academicEventPublished.data[0].id);
    await deleteAcademicEvent(academicEventPublished2.data[0].id);
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