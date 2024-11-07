import { supabase } from '../supabaseClient.js';

// Crear visibilidad personalizada para un evento académico y un usuario
export const createCustomAcademicEvent = async (userId, eventId) => {
    const { data, error } = await supabase
        .from('custom_academic_event')
        .insert([{ user_id: userId, event_id: eventId, visible: true }])
        .select();

    return { data, error };
};

// Editar visibilidad de un evento académico personalizado
export const editCustomAcademicEventVisibility = async (userId, eventId, visible) => {
    const { data, error } = await supabase
        .from('custom_academic_event')
        .update({ visible })
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .select();

    return { data, error };
};

// Obtener el contenido completo de los eventos académicos visibles para un usuario
export const getFullVisibleAcademicEventsForUser = async (userId) => {
    const { data, error } = await supabase
        .from('custom_academic_event')
        .select('event_id, academic_event(*)')  // Selecciona event_id y el contenido completo de academic_event
        .eq('user_id', userId)
        .eq('visible', true);

    if (error) {
        console.error('Error al obtener eventos académicos visibles:', error);
        return { data: null, error };
    }

    // Extraer solo los detalles de los eventos académicos
    const academicEvents = data.map(item => item.academic_event);

    return { data: academicEvents, error: null };
};


// Eliminar la personalización de visibilidad de un evento académico
export const deleteCustomAcademicEvent = async (userId, eventId) => {
    const { data, error } = await supabase
        .from('custom_academic_event')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);

    return { data, error };
};

// Obtener todos los eventos académicos visibles para un usuario
export const getVisibleAcademicEventsForUser = async (userId) => {
    const { data, error } = await supabase
        .from('custom_academic_event')
        .select('event_id')
        .eq('user_id', userId)
        .eq('visible', true);

    return { data, error };
};
