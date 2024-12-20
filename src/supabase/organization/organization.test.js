// src/api/organization.test.js
import * as f from './organization';
import {loginUser} from '../user/user';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabase } from '../supabaseClient';

// Datos de prueba
const testOrganization = {
    name: 'Org1',
    nip: 123456789,
    pass: 'password'
};

const testCourse = {
    name: 'Curso Test',
    nip: 987654321,
    pass: 'coursepass'
};

const testStudent = {
    name: 'Estudiante Test ',
    nip: 111111111,
    pass: 'studentpass'
};

const failTestStudent = {
    name: 'Estudiante Test Fail',
    nip: 111111111,
    pass: 'studentpass'
};

const testTeacher = {
    name: 'Profesor Test',
    nip: 222222222,
    pass: 'teacherpass'
};

let organizationId;
let courseId;
let studentId;
let teacherId;

describe('Organization API Tests', () => {
    // Configuración inicial
    beforeAll(async () => {

        await supabase
            .from('organization')
            .delete()
            .eq('nip', testOrganization.nip);

        const result = await f.registerOrganization(testOrganization.name, testOrganization.nip, testOrganization.pass);
        expect(result.error).toBeNull(); // Asegúrate de que no haya errores al registrar la organización

        organizationId = await f.getOrganizationIdByName(testOrganization.name);
        expect(organizationId).not.toBeNull(); // Asegúrate de que la organización se creó y se puede obtener su ID
    });

    it('should register a new organization', async () => {
        await supabase
            .from('organization')
            .delete()
            .eq('nip', 987654321);
        const result = await f.registerOrganization('Org2', 987654321, 'password2');
        expect(result.error).toBeNull();
    });

    it('should login organization successfully', async () => {
        const result = await f.loginOrganization(organizationId, testOrganization.nip, testOrganization.pass);
        expect(result.error).toBeNull();
        expect(result.data).toBe(true);
    });

    it('should retrieve all courses for the organization', async () => {
        const createResult = await f.createCourse(testCourse.name, testCourse.nip, testCourse.pass, organizationId);
        expect(createResult.error).toBeNull();

        const courses = await f.getAllCourses(organizationId);
        expect(courses.error).toBeNull();
        expect(courses.data).toHaveLength(1); // Debe haber un curso
        courseId = await f.getUserIdByNIP(testCourse.nip, organizationId); // Obtener ID del curso
        expect(courseId).not.toBeNull();
    });

    it('should create a new student', async () => {
        const result = await f.createStudent(testStudent.name, testStudent.nip, testStudent.pass, organizationId);
        expect(result.error).toBeNull();

        const students = await f.getAllStudents(organizationId);
        expect(students.error).toBeNull();
        expect(students.data).toHaveLength(1); // Debe haber un estudiante
        studentId = await f.getUserIdByNIP(testStudent.nip, organizationId); // Obtener ID del estudiante
        expect(studentId).not.toBeNull();
    });

    it('should create a new student, login, edit the password and login again without problems', async () => {
        const result = await f.createStudent("Oscar Checa Cebolla", 34325, "oscar", organizationId);
        expect(result.error).toBeNull();
        const resultLogin = await loginUser(34325, "oscar", "student", organizationId);
        expect(resultLogin.error).toBeNull();
        const resultEdit = await f.editStudent(await f.getUserIdByNIP(34325, organizationId), { pass: "oscar2" });
        expect(resultEdit.error).toBeNull();
        const resultLogin2 = await loginUser(34325, "oscar2", "student", organizationId,);
        expect(resultLogin2.error).toBeNull();
        await f.eliminateStudent(await f.getUserIdByNIP(34325, organizationId));
    });

    it('should not create a new student with the same NIP', async () => {
        const result = await f.createStudent(failTestStudent.name, failTestStudent.nip, failTestStudent.pass, organizationId);
        expect(result.error).not.toBeNull();
    });

    it('should recieve all student info', async () => {
        const result = await f.getUserInfoByNIP(testStudent.nip, organizationId);
        expect(result.data.id).toBe(studentId);
        expect(result.data.name).toBe(testStudent.name);
        expect(result.data.role).toBe('student');
        expect(result.data.organization_id).toBe(organizationId);
    });

    it('should create a new teacher', async () => {
        const result = await f.createTeacher(testTeacher.name, testTeacher.nip, testTeacher.pass, organizationId);
        expect(result.error).toBeNull();
        const teachers = await f.getAllTeachers(organizationId);
        expect(teachers.error).toBeNull();
        expect(teachers.data).toHaveLength(1); // Debe haber un profesor
        teacherId = await f.getUserIdByNIP(testTeacher.nip, organizationId); // Obtener ID del profesor
        expect(teacherId).not.toBeNull();
    });

    it('should edit the course', async () => {
        const updates = { name: 'Curso Test Modificado' };
        const result = await f.editCourse(courseId, updates);
        expect(result.error).toBeNull();

        const updatedCourse = await f.getAllCourses(organizationId);
        expect(updatedCourse.data[0].name).toBe(updates.name); // Verificar que el nombre fue actualizado
    });

    it('should edit the student', async () => {
        const updates = { name: 'Estudiante Modificado' };
        const result = await f.editStudent(studentId, updates);
        expect(result.error).toBeNull();

        const updatedStudent = await f.getAllStudents(organizationId);
        expect(updatedStudent.data[0].name).toBe(updates.name); // Verificar que el nombre fue actualizado
    });

    it('should edit the teacher', async () => {
        const updates = { name: 'Profesor Modificado' };
        const result = await f.editTeacher(teacherId, updates);
        expect(result.error).toBeNull();

        const updatedTeacher = await f.getAllTeachers(organizationId);
        expect(updatedTeacher.data[0].name).toBe(updates.name); // Verificar que el nombre fue actualizado
    });

    it('should get all organizations', async () => {
        const result = await f.getAllOrganizations();
        expect(result.error).toBeNull();
        //expect(result.data).toHaveLength(5); // Ojo aquí, si se añaden más organizaciones, este número cambiará
    });

    it('should get organization by ID', async () => {
        const result = await f.getOrganizationById(organizationId);
        expect(result.error).toBeNull();
        expect(result.data.name).toBe(testOrganization.name); // Debe ser la misma organización
    });

    // Limpieza de datos al final de las pruebas
    afterAll(async () => {
        // Eliminar curso
        if (courseId) {
            await f.eliminateCourse(courseId);
        }

        // Eliminar estudiante
        if (studentId) {
            await f.eliminateStudent(studentId);
        }

        // Eliminar profesor
        if (teacherId) {
            await f.eliminateTeacher(teacherId);
        }

        await supabase
            .from('organization')
            .delete()
            .eq('nip', testOrganization.nip);

        await supabase
            .from('organization')
            .delete()
            .eq('nip', 987654321);


        // Eliminar organización
        /*
        if (organizationId) {
            await f.eliminateOrganization(organizationId);
        }
        */
    });
});
