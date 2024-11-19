import { supabase } from '../supabaseClient.js';

// Crear un evento personalizado
export const createCustomEvent = async (name, description, groupName, date, startTime, endTime, userId) => {
    const { data, error } = await supabase
        .from('custom_event')
        .insert([{
            name,
            description,
            place: groupName,
            date: date,
            start_time: startTime,
            end_time: endTime,
            user_id: userId
        }]).select();

    console.log(data);
    return { data, error };
};

// Editar un evento personalizado
export const editCustomEvent = async (eventId, updates) => {
    const { data, error } = await supabase
        .from('custom_event')
        .update(updates)
        .eq('id', eventId);
    console.log(data);
    return { data, error };
};

// Eliminar un evento personalizado
export const deleteCustomEvent = async (eventId) => {
    const { data, error } = await supabase
        .from('custom_event')
        .delete()
        .eq('id', eventId);

    return { data, error };
};

// Obtener todos los eventos personalizados de un usuario
export const getCustomEventsByUser = async (userId) => {
    const { data, error } = await supabase
        .from('custom_event')
        .select('*')
        .eq('user_id', userId);
    console.log(data);
    return { data, error };  // Asegúrate de que ambos se devuelvan
};


// Obtener un evento personalizado por su ID
export const getCustomEventById = async (eventId) => {
    const { data, error } = await supabase
        .from('custom_event')
        .select('*')
        .eq('id', eventId);
    console.log(data);
    return { data, error };
};
