import { supabase } from '../supabaseClient.js';

// Crear visibilidad personalizada para un evento académico y un usuario
export const createCustomAcademicEvent = async (userId, eventId) => {
    const { data, error } = await supabase
        .from('custom_academic_event')
        .insert([{ user_id: userId, event_id: eventId, visible: true }])
        .select();
    console.log(data);
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
    console.log(data);
    return { data, error };
};

// Obtener el contenido completo de los eventos académicos visibles para un usuario
export async function getFullVisibleAcademicEventsForUser(userId) {
    try {
        // 1. Obtener la lista de event_id visibles en custom_academic_event para el userId dado
        const { data: customEvents, error: customEventError } = await supabase
            .from('custom_academic_event')
            .select('event_id')
            .eq('user_id', userId)
            .eq('visible', true);

        if (customEventError) {
            return { data: null, error: customEventError };
        }

        // Verificar si hay eventos visibles
        if (!customEvents || customEvents.length === 0) {
            return { data: [], error: null };
        }

        // Extraer los event_id de los resultados
        const eventIds = customEvents.map(event => event.event_id);

        // 2. Obtener la información completa de cada evento en academic_event
        const { data: academicEvents, error: academicEventError } = await supabase
            .from('academic_event')
            .select('*')
            .in('id', eventIds);

        if (academicEventError) {
            return { data: null, error: academicEventError };
        }

        // Devolver la lista de eventos
        return { data: academicEvents, error: null };

    } catch (error) {
        return { data: null, error };
    }
}


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
    console.log(data);
    return { data, error };
};
