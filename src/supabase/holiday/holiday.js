import { supabase } from '../supabaseClient.js';

// Crear un nuevo feriado
export const createHoliday = async (name, date, description, recurrent, organizationId) => {
    const { data, error } = await supabase
        .from('holiday')
        .insert([{ name, date, description, recurrent, organization_id: organizationId }]);
    
    return { data, error };
};

// Editar un feriado existente
export const editHoliday = async (holidayId, updates) => {
    const { data, error } = await supabase
        .from('holiday')
        .update(updates)
        .eq('id', holidayId);
    
    return { data, error };
};

// Eliminar un feriado por su ID
export const deleteHoliday = async (holidayId) => {
    const { data, error } = await supabase
        .from('holiday')
        .delete()
        .eq('id', holidayId);

    return { data, error };
};

// Eliminar un feriado por su fecha
export const deleteHolidayByDate = async (date) => {
    const { data, error } = await supabase
        .from('holiday')
        .delete()
        .eq('date', date);

    return { data, error };
};

// Obtener todos los feriados de una organización
export const getAllHolidaysByOrganization = async (organizationId) => {
    const { data, error } = await supabase
        .from('holiday')
        .select('*')
        .eq('organization_id', organizationId);

    return { data, error };
};
