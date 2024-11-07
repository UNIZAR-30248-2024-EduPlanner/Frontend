import { supabase } from '../supabaseClient.js';
import * as f from '../customAcademicEvent/customAcademicEvent.js';


// Crear un evento académico y publicarlo a todos los alumnos y profesores matriculados o que dan clase a esa asignatura

export const createAcademicEventAndPublish = async (name, startingDate, endDate, groupName, periodicity, description, type, place, startTime, endTime, subjectId) => {
    // Primero, creamos el evento académico
    const { data: academicEvent, error: academicEventError } = await createAcademicEvent(name, startingDate, endDate, groupName, periodicity, description, type, place, startTime, endTime, subjectId);

    if (academicEventError) {
        console.error('Error al crear el evento académico:', academicEventError);
        return { data: null, error: academicEventError }; // Retorna el error
    }

    // Obtenemos todos los estudiantes matriculados en la asignatura
    const { data: students, error: studentsError } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('subject_id', subjectId);

    if (studentsError) {
        console.error('Error al obtener los estudiantes matriculados:', studentsError);
        return { data: null, error: studentsError }; // Retorna el error
    }

    // Obtenemos todos los profesores de la asignatura
    const { data: teachers, error: teachersError } = await supabase
        .from('teachings')
        .select('teacher_id')
        .eq('subject_id', subjectId);

    if (teachersError) {
        console.error('Error al obtener los profesores de la asignatura:', teachersError);
        return { data: null, error: teachersError }; // Retorna el error
    }

    // Normalizamos los arrays para unificar el nombre de las claves
    const userIds = [
        ...students.map(student => student.student_id),
        ...teachers.map(teacher => teacher.teacher_id)
    ];

    // Publicamos el evento académico a todos los usuarios relacionados con la asignatura
    for (let userId of userIds) {
        const { error: customAcademicEventError } = await f.createCustomAcademicEvent(userId, academicEvent.id);

        if (customAcademicEventError) {
            console.error('Error al publicar el evento académico para el usuario:', customAcademicEventError);
            return { data: null, error: customAcademicEventError }; // Retorna el error
        }
    }

    return { data: academicEvent, error: null };
};

// Crear un evento académico
export const createAcademicEvent = async (name, startingDate, endDate, groupName, periodicity, description, type, place, startTime, endTime, subjectId) => {
    const { data, error } = await supabase
        .from('academic_event')
        .insert([{
            name,
            starting_date: startingDate,
            end_date: endDate,
            group_name: groupName,
            periodicity,
            description,
            type,
            place,
            start_time: startTime,
            end_time: endTime,
            subject_id: subjectId
        }])
        .select();

    return { data, error };
};

// Editar un evento académico
export const editAcademicEvent = async (eventId, updates) => {
    const { data, error } = await supabase
        .from('academic_event')
        .update(updates)
        .eq('id', eventId)
        .select();

    return { data, error };
};

// Eliminar un evento académico
export const deleteAcademicEvent = async (eventId) => {
    const { data, error } = await supabase
        .from('academic_event')
        .delete()
        .eq('id', eventId);

    return { data, error };
};

// Obtener todos los eventos académicos de una materia
export const getAcademicEventsBySubject = async (subjectId) => {
    const { data, error } = await supabase
        .from('academic_event')
        .select('*')
        .eq('subject_id', subjectId);

    return { data, error };
};
