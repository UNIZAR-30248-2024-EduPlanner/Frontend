import * as f from './course.js';
import * as fo from '../organization/organization.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabaseClient.js';

const testCourse = {
  name: 'Curso Test',
  nip: 888888,
  pass: 'coursepass',
};

const failTestCourse = {
  name: 'Curso Test Fail',
  nip: 888888,
  pass: 'coursepass',
};

const testArrayCourses = [
  {
    name: 'Curso Test 3',
    nip: 3033333,
    pass: 'coursepass1',
  },
  {
    name: 'Curso Test 4',
    nip: 4044444,
    pass: 'coursepass2',
  },
  {
    name: 'Curso Test 5',
    nip: 5055555,
    pass: 'coursepass3',
  },
];

const testSubject = {
  name: 'Subject Test',
  subject_code: 66688,
  color: '#000000',
};

const testArraySubjects = [
  {
    name: 'Subject Test 2',
    subject_code: 66689,
    color: '#000000',
  },
  {
    name: 'Subject Test 3',
    subject_code: 66690,
    color: '#000000',
  },
];

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

    course_id = (await f.getCourseIdByNIP(testCourse.nip)).data;
    expect(course_id).not.toBeNull();
  });

  it('should register a new course', async () => {
    const result = await f.registerCourse('Curso Test 2', 1111111111, 'password2', organization_id);
    expect(result.error).toBeNull();

    const localCourseId = (await f.getCourseIdByNIP(1111111111)).data;
    console.log('Local Course ID: ', localCourseId);

    await supabase
      .from('users')
      .delete()
      .eq('nip', 1111111111);
  });

  it('should not register a course with an existing NIP', async () => {
    const result = await f.registerCourse(failTestCourse.name, failTestCourse.nip, failTestCourse.pass, organization_id);
    expect(result.error).not.toBeNull();
  });

  it('should not regiser a course with the same NIP as the organization who belongs', async () => {
    const result = await f.registerCourse('Curso Test 3', (await fo.getOrganizationById(organization_id)).data.nip, failTestCourse.pass, organization_id);
    expect(result.error).not.toBeNull();
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
    expect(result.data).toBe(true); // Cambiado a result.data
  });

  it('should login course successfully', async () => {
    const result = await f.loginCourse(testCourse.nip, testCourse.pass);
    expect(result.data).toBe(true); // Cambiado a result.data
  });

  it('should retrieve all subjects for the course', async () => {
    const createResult = await f.createSubject(testSubject.name, testSubject.subject_code, '#000000', course_id);
    expect(createResult.error).toBeNull();

    const subjects = await f.getAllSubjects(course_id);
    expect(subjects.error).toBeNull();
    expect(subjects.data).toHaveLength(1);
    subjectId = (await f.getSubjectIdByCode(testSubject.subject_code)).data;
    expect(subjectId).not.toBeNull();
  });

  it('should create a new subject', async () => {
    const result = await f.createSubject('Subject Test 4', 789123, '#000000', course_id);
    expect(result.error).toBeNull();
  });

  it('should not create a subject with an existing subject code', async () => {
    const result = await f.createSubject('Subject Test 5', 789123, '#000000', course_id);
    expect(result.error).not.toBeNull();
  });

  it('should not create a subject with an invalid course ID', async () => {
    const result = await f.createSubject('Subject Test 6', 7894, '#000000', 999999999);
    expect(result.error).not.toBeNull();
  });

  it('should edit a subject', async () => {
    const result = await f.editSubject(subjectId, { name: 'Subject Test 2' });
    expect(result.error).toBeNull();
  });

  it('should not change the subject code to an existing one', async () => {
    const result = await f.editSubject(subjectId, { subject_code: 789123 });
    expect(result.error).not.toBeNull();
  });

  it('should get all info of a subject by ID', async () => {
    const result = await f.getSubjectById(subjectId);
    expect(result.error).toBeNull();
  });

  it('should delete a subject', async () => {
    const result = await f.eliminateSubject(subjectId);
    expect(result.error).toBeNull();
  });

  it('should register array of subjects', async () => {
    await supabase
      .from('subjects')
      .delete()
      .eq('subject_code', testArraySubjects[0].subject_code);

    await supabase
      .from('subjects')
      .delete()
      .eq('subject_code', testArraySubjects[1].subject_code);

    const result = await f.registerArraySubject(testArraySubjects, course_id);
    expect(result.data).toBe(true);
  });

  it('should assign a subject to a student', async () => {
    const result = await f.assignSubjectToStudent(111111, testArraySubjects[0].subject_code, 1);
    expect(result.error).toBeNull();
  });

  it('should assign a subject to a teacher', async () => {
    const result = await f.assignSubjectToTeacher(2002, testArraySubjects[0].subject_code, 1);
    expect(result.error).toBeNull();
  });

  it('should assign a subject to multiple students', async () => {
    const result = await f.assignSubjectToStudents([111111, 222222], testArraySubjects[1].subject_code, 1);
    expect(result.error).toBeNull();
  });

  it('should assign a subject to multiple teachers', async () => {
    const result = await f.assignSubjectToTeachers([2002, 839995], testArraySubjects[1].subject_code, 1);
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

    await supabase
      .from('subjects')
      .delete()
      .eq('subject_code', testArraySubjects[0].subject_code);

    await supabase
      .from('subjects')
      .delete()
      .eq('subject_code', testArraySubjects[1].subject_code);

    if (course_id) {
      await fo.eliminateCourse(course_id);
    }

    if (subjectId) {
      await f.eliminateSubject(subjectId);
    }
  });
});
