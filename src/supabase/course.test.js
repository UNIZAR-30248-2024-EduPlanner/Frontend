import * as f from './course.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from './supabaseClient.js';


const testCourse = {
  name: 'Curso Test',
  nip: 888888,
  pass: 'coursepass'
};


const testSubject = {
  subject_name: 'Subject Test',
  subject_code: 888888
};

let organization_id = 1;
let course_id;
let subjectId;

describe('Course API Tests', () => {
  beforeAll(async () => {
    // Intenta eliminar el curso de prueba si existe
    await supabase
      .from('users')
      .delete()
      .eq('nip', testCourse.nip)
      .eq('role', 'course');

    // Intenta eliminar la asignatura de prueba si existe
    await supabase
      .from('subjects')
      .delete()
      .eq('subject_code', testSubject.subject_code);

    const result = await f.registerCourse(testCourse.name, testCourse.nip, testCourse.pass, organization_id);
    expect(result.error).toBeNull();

    course_id = await f.getCourseIdByNIP(testCourse.nip);
    expect(course_id).not.toBeNull();
  });


  it('should register a new course', async () => {
    const result = await f.registerCourse('Curso Test 2', 111111111, 'password2', organization_id);
    expect(result.error).toBeNull();
  });

  it('should login course successfully', async () => {
    const result = await f.loginCourse(testCourse.nip, testCourse.pass);
    expect(result).toBe(true);
  });

  it('should retrieve all subjects for the course', async () => {
    const createResult = await f.createSubject(testSubject.subject_name, testSubject.subject_code, course_id);
    expect(createResult.error).toBeNull();

    const subjects = await f.getAllSubjects(course_id);
    expect(subjects.error).toBeNull();
    expect(subjects.data).toHaveLength(1);
    subjectId = await f.getSubjectIdByCode(testSubject.subject_code);
    expect(subjectId).not.toBeNull();
  });

  it('should edit a subject', async () => {
    console.log('subjectId', subjectId);
    const result = await f.editSubject(subjectId, { subject_name: 'Subject Test 2' });
    expect(result.error).toBeNull();
  });

  it('should delete a subject', async () => {
    const result = await f.eliminateSubject(subjectId);
    expect(result.error).toBeNull();
  });

  afterAll(async () => {
    if (course_id) {
      await f.eliminateCourse(course_id);
    }
    if (subjectId) {
      await f.eliminateSubject(subjectId);
    }
  });

});