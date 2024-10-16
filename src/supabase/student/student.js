import { supabase } from '../supabaseClient';

export const registerArrayStudents = async (students, organization_id) => {
  try {

    const studentsWithOrgId = students.map(student => {
      return {
        ...student,
        role: 'student',
        organization_id
      }
    }, organization_id);

    const { error } = await supabase
      .from('users')
      .insert(studentsWithOrgId);

    if (error) {
      console.error('Error al insertar los estudiantes:', error);
      return false;
    }

    console.log('Estudiantes insertados correctamente:', studentsWithOrgId);
    return true;
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
  }
}

