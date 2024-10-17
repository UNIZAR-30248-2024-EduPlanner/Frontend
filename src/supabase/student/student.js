import { supabase } from '../supabaseClient';

export const registerArrayStudents = async (students, organization_id) => {
  try {
    const studentsWithOrgId = students.map(student => {
      return {
        ...student,
        role: 'student',
        organization_id,
      };
    });

    const { data, error } = await supabase
      .from('users')
      .insert(studentsWithOrgId);

    if (error) {
      console.error('Error al insertar los estudiantes:', error);
      return { data: null, error }; // Retorna el error
    }

    console.log('Estudiantes insertados correctamente:', studentsWithOrgId);
    return { data, error: null }; // Retorna los datos insertados sin error
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err }; // Retorna el error
  }
}
