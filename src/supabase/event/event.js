import { getFullVisibleAcademicEventsForUser } from '../customAcademicEvent/customAcademicEvent.js';
import { getCustomEventsByUser } from '../customEvent/customEvent.js';

// Función que obtiene todos los eventos visibles para un usuario y sus eventos personalizados
export const getAllEventsForUser = async (userId) => {
    // Obtener eventos académicos visibles para el usuario
    const { data: academicEvents, error: academicError } = await getFullVisibleAcademicEventsForUser(userId);
    if (academicError) {
        console.error('Error al obtener eventos académicos:', academicError);
        return { data: null, error: academicError };
    }

    // Obtener eventos personalizados del usuario
    const { data: customEvents, error: customError } = await getCustomEventsByUser(userId);
    if (customError) {
        console.error('Error al obtener eventos personalizados:', customError);
        return { data: null, error: customError };
    }

    // Estructura de los campos estándar con valores null
    const baseAcademicEventFields = {
        name: null,
        starting_date: null,
        end_date: null,
        group_name: null,
        periodicity: null,
        description: null,
        start_time: null,
        end_time: null,
        subject_id: null,
    };

    const baseCustomEventFields = {
        name: null,
        description: null,
        group_name: null,
        start_time: null,
        end_time: null,
        user_id: null,
    };

    // Unificar todos los eventos en un solo array, completando los campos faltantes con null
    const allEvents = [
        ...academicEvents.map(event => ({ ...baseCustomEventFields, ...event })), // Eventos académicos con campos de custom_event en null
        ...customEvents.map(event => ({ ...baseAcademicEventFields, ...event })),  // Eventos personalizados con campos de academic_event en null
    ];

    console.log(`Eventos para el usuario ${userId}:`, allEvents);
    return { data: allEvents, error: null };
};
