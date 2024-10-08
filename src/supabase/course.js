// src/api/course.js
import { supabase } from './supabaseClient'; // Asegúrate de tener el cliente Supabase configurado

/**
 * Registra una nuevo curso
 * @param {string} name - Nombre de la curso
 * @param {number} nip - Código único de la curso
 * @param {string} password - Contraseña de la curso
 * @returns {Promise<{ data: any, error: any }>}
 */
export const register = async (name, nip, password) => {
    const { data, error } = await supabase
        .from('Users')
        .insert([{ name, nip, pass: password, role: 'course' }]);
    return { data, error };
};

/**
 * Inicia sesión como curso
 * @param {number} nip - Código único de la curso
 * @param {string} password - Contraseña de la curso
 * @returns {Promise<{ data: any, error: any }>}
 */
export const login = async (nip, password) => {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('nip', nip)
        .eq('pass', password)
        .single();
    return { data, error };
};

/**
 * Obtiene todas las asignaturas de un curso
 * @param {number} courseId - ID del curso
 * @returns {Promise<{ data: any, error: any }>}
 */
export const getAllSubjects = async (courseId) => {
    const { data, error } = await supabase
        .from('Subjects')
        .select('*')
        .eq('course_id', courseId);
    return { data, error };
};

/**
 * Crea una nueva asignatura
 * @param {string} subject_name - Nombre de la asignatura
 * @param {number} subject_code - Código de la asignatura
 * @param {number} course_id - ID del curso al que pertenece
 * @returns {Promise<{ data: any, error: any }>}
 */
export const createSubject = async (subject_name, subject_code, course_id) => {
    const { data, error } = await supabase
        .from('Subjects')
        .insert([{
            subject_name: subject_name,
            subject_code: subject_code,
            course_id: course_id
        }]);
    
    return { data, error };
};

/**
 * Elimina una asignatura de la base de datos
 * @param {number} subjectId - ID de la asignatura a eliminar
 * @returns {Promise<{ data: any, error: any }>}
 */
export const eliminateSubject = async (subjectId) => {
    const { data, error } = await supabase
        .from('Subjects')
        .delete()
        .eq('id', subjectId);
    return { data, error };
};

/**
 * Edita la información de una asignatura
 * @param {number} subjectId - ID de la asignatura a editar
 * @param {Object} subject - Nuevos datos de la asignatura
 * @param {string} subject.subject_name - Nuevo nombre de la asignatura
 * @param {number} subject.subject_code - Nuevo código de la asignatura
 * @returns {Promise<{ data: any, error: any }>}
 */
export const editSubject = async (subjectId, subject) => {
    const { data, error } = await supabase
        .from('Subjects')
        .update(subject)
        .eq('id', subjectId);
    return { data, error };
};

