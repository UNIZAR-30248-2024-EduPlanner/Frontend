// src/api/organization.js
import { supabase } from './supabaseClient';

// Función para registrar una organización
export const registerOrganization = async (name, nip, pass) => {
    const { data, error } = await supabase
        .from('organization')
        .insert([{ name, nip, pass }]);
    return { data, error };
};

// Función para iniciar sesión (login)
export const loginOrganization = async (nip, pass) => {
    const { data, error } = await supabase
        .from('organization')
        .select('*')
        .eq('nip', nip)
        .eq('pass', pass) 
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al iniciar sesión:", error);
        return false; // Error en la consulta
    }

    return !!data; // Devuelve true si hay datos (organización encontrada), false de lo contrario
};

// Función para obtener todos los cursos que posee la organización
export const getAllCourses = async (organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'course');
    
    return { data, error };
};

// Función para crear un curso
export const createCourse = async (name, nip, pass, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass, role: 'course', organization_id: organizationId }]);

    return { data, error };
};

// Función para eliminar un curso
export const eliminateCourse = async (courseId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', courseId)
        .eq('role', 'course');
    
    return { data, error };
};

// Función para editar un curso
export const editCourse = async (courseId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', courseId)
        .eq('role', 'course');
    
    return { data, error };
};

// Función para obtener todos los alumnos de la organización
export const getAllStudents = async (organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'student');
    
    return { data, error };
};

// Función para crear un alumno
export const createStudent = async (name, nip, pass, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass, role: 'student', organization_id: organizationId }]);
    
    return { data, error };
};

// Función para eliminar un alumno
export const eliminateStudent = async (studentId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', studentId)
        .eq('role', 'student');
    
    return { data, error };
};

// Función para editar un alumno
export const editStudent = async (studentId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', studentId)
        .eq('role', 'student');
    
    return { data, error };
};

// Función para obtener todos los profesores de la organización
export const getAllTeachers = async (organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', organizationId)
        .eq('role', 'teacher');
    
    return { data, error };
};

// Función para crear un profesor
export const createTeacher = async (name, nip, pass, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .insert([{ name, nip, pass, role: 'teacher', organization_id: organizationId }]);
    
    return { data, error };
};

// Función para eliminar un profesor
export const eliminateTeacher = async (teacherId) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacherId)
        .eq('role', 'teacher');
    
    return { data, error };
};

// Función para editar un profesor
export const editTeacher = async (teacherId, updates) => {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', teacherId)
        .eq('role', 'teacher');
    
    return { data, error };
};

// Función para obtener el ID de la organización por su NIP
export const getOrganizationIdByNIP = async (nip) => {
    const { data, error } = await supabase
        .from('organization')
        .select('id')
        .eq('nip', nip)
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener el ID de la organización:", error);
        return null; // Retorna null en caso de error
    }

    return data ? data.id : null; // Retorna el ID si se encontró, null si no
};

export const getUserIdByNIP = async (nip, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('id') // Solo seleccionamos el ID
        .eq('nip', nip)
        .eq('organization_id', organizationId) // Comprobar también por ID de organización
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener el ID de usuario:", error);
        return null; // En caso de error, devolver null
    }

    return data ? data.id : null; // Devuelve el ID o null si no se encuentra
};

export const getUserInfoByNIP = async (nip, organizationId) => {
    const { data, error } = await supabase
        .from('users')
        .select('*') // Solo seleccionamos el ID
        .eq('nip', nip)
        .eq('organization_id', organizationId) // Comprobar también por ID de organización
        .single(); // Devuelve solo un resultado

    if (error) {
        console.error("Error al obtener el ID de usuario:", error);
        return null; // En caso de error, devolver null
    }

    return data; // Devuelve el ID o null si no se encuentra
};

// Función para eliminar una organización y sus registros asociados
//TODO
/*
export const eliminateOrganizationAndRelatedData = async (organizationId) => {
    
};
*/

