// src/api/course.js
import { supabase } from './supabaseClient';

// Función para iniciar sesión (login) de un curso
export const loginCourse = async (nip, pass) => {
    const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('nip', nip)
        .eq('pass', pass) // Considera que almacenar contraseñas en texto plano no es seguro
        .eq('role', 'course') // Asegúrate de que sea un curso
        .single();

    if (error) {
        console.error("Error al iniciar sesión en el curso:", error);
        return false; // Error en la consulta
    }

    return !!data; // Devuelve true si hay datos (curso encontrado), false de lo contrario
};

// Función para registrar un nuevo curso
export const registerCourse = async (name, nip, pass, organization_id) => {
    const { data, error } = await supabase
        .from('Users')
        .insert([
            {
                name,
                nip,
                pass, // Almacena la contraseña de forma segura en producción
                role: 'course',
                organization_id, // Relación con la organización a la que pertenece
            },
        ]);

    if (error) {
        console.error("Error al registrar el curso:", error);
        return false; // Error en la inserción
    }

    return !!data; // Devuelve true si se registró con éxito, false en caso contrario
};

// Función para obtener todas las asignaturas que posee un curso
export const getAllSubjects = async (courseId) => {
    const { data, error } = await supabase
        .from('Subjects')
        .select('*')
        .eq('course_id', courseId);
    
    return { data, error };
};

// Función para crear una asignatura
export const createSubject = async (subjectName, subjectCode, courseId) => {
    const { data, error } = await supabase
        .from('Subjects')
        .insert([{ subject_name: subjectName, subject_code: subjectCode, course_id: courseId }]);
    
    return { data, error };
};

// Función para eliminar una asignatura
export const eliminateSubject = async (subjectId) => {
    const { data, error } = await supabase
        .from('Subjects')
        .delete()
        .eq('id', subjectId);
    
    return { data, error };
};

// Función para editar una asignatura
export const editSubject = async (subjectId, updates) => {
    const { data, error } = await supabase
        .from('Subjects')
        .update(updates)
        .eq('id', subjectId);
    
    return { data, error };
};
