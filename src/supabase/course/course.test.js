import * as f from './course.js';
import * as fo from '../organization/organization.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabaseClient.js';


const testCourse = {
  name: 'Curso Test',
  nip: 888888,
  pass: 'coursepass'
};

const testArrayCourses = [
  {
    name: 'Curso Test 3',
    nip: 3033333,
    pass: 'coursepass1'
  },
  {
    name: 'Curso Test 4',
    nip: 4044444,
    pass: 'coursepass2'
  },
  {
    name: 'Curso Test 5',
    nip: 5055555,
    pass: 'coursepass3'
  }
];


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
    const result = await f.registerCourse('Curso Test 2', 1111111111, 'password2', organization_id);
    expect(result.error).toBeNull();
    const localCourseId = await f.getCourseIdByNIP(1111111111, organization_id);
    console.log("Local Course ID: ", localCourseId);
    await supabase
      .from('users')
      .delete()
      .eq('nip', 1111111111);
  });

  it('should register an array of courses', async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayCourses[0].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayCourses[1].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayCourses[2].nip);
    const result = await f.registerArrayCourses(testArrayCourses, organization_id);
    expect(result).toBe(true);
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
    const result = await f.editSubject(subjectId, { subject_name: 'Subject Test 2' });
    expect(result.error).toBeNull();
  });

  it('should delete a subject', async () => {
    const result = await f.eliminateSubject(subjectId);
    expect(result.error).toBeNull();
  });

  afterAll(async () => {
    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayCourses[0].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayCourses[1].nip);

    await supabase
      .from('users')
      .delete()
      .eq('nip', testArrayCourses[2].nip);


    if (course_id) {
      await fo.eliminateCourse(course_id);
    }
    if (subjectId) {
      await f.eliminateSubject(subjectId);
    }
  });

});