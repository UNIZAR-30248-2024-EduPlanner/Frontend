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

export const getSubjectsByStudentId = async (student_id) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('subject_id')
      .eq('student_id', student_id);

    if (error) {
      console.error('Error al obtener las asignaturas del estudiante:', error);
      return { data: null, error }; // Retorna el error
    }

    console.log('Asignaturas obtenidas correctamente:', data);
    return { data, error: null }; // Retorna las materias sin error
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err }; // Retorna el error
  }
}

export const matriculateStudent = async (student_nip, subject_code) => {
  try {
    const student = await supabase
      .from('users')
      .select('id')
      .eq('nip', student_nip)
      .eq('role', 'student');

    if (student.error) {
      console.error('Error al obtener el estudiante:', student.error);
      return { data: null, error: student.error }; // Retorna el error
    }

    const subject = await supabase
      .from('subjects')
      .select('id')
      .eq('subject_code', subject_code);

    if (subject.error) {
      console.error('Error al obtener la asignatura:', subject.error);
      return { data: null, error: subject.error }; // Retorna el error
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert([{ student_id: student.data[0].id, subject_id: subject.data[0].id }]);

    if (error) {
      console.error('Error al matricular al estudiante:', error);
      return { data: null, error }; // Retorna el error
    }

    console.log('Estudiante matriculado correctamente:', data);
    return { data, error: null }; // Retorna los datos sin error
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err }; // Retorna el error
  }
}

export const unenrollStudent = async (student_nip, subject_code) => {
  try {
    // Obtener el ID del estudiante
    const student = await supabase
      .from('users')
      .select('id')
      .eq('nip', student_nip)
      .eq('role', 'student');

    if (student.error) {
      console.error('Error al obtener el estudiante:', student.error);
      return { data: null, error: student.error };
    }

    // Obtener el ID de la asignatura
    const subject = await supabase
      .from('subjects')
      .select('id')
      .eq('subject_code', subject_code);

    if (subject.error) {
      console.error('Error al obtener la asignatura:', subject.error);
      return { data: null, error: subject.error };
    }

    // Verificar que el estudiante y la asignatura existan
    if (!student.data.length || !subject.data.length) {
      const errorMsg = "Estudiante o asignatura no encontrados";
      console.error(errorMsg);
      return { data: null, error: errorMsg };
    }

    // Eliminar la inscripción de la tabla enrollments
    const { data, error } = await supabase
      .from('enrollments')
      .delete()
      .match({ student_id: student.data[0].id, subject_id: subject.data[0].id });

    if (error) {
      console.error('Error al desmatricular al estudiante:', error);
      return { data: null, error };
    }

    console.log('Estudiante desmatriculado correctamente:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
};


export const matriculateStudentOnMultipleSubjects = async (student_nip, subjects) => {
  try {
    const student = await supabase
      .from('users')
      .select('id')
      .eq('nip', student_nip)
      .eq('role', 'student');

    if (student.error) {
      console.error('Error al obtener el estudiante:', student.error);
      return { data: null, error: student.error }; // Retorna el error
    }

    const subjectsIds = await Promise.all(subjects.map(async subject => {
      const { data, error } = await supabase
        .from('subjects')
        .select('id')
        .eq('subject_code', subject);

      if (error) {
        console.error('Error al obtener la asignatura:', error);
        return { data: null, error }; // Retorna el error
      }

      return data[0].id;
    }));

    const { data, error } = await supabase
      .from('enrollments')
      .insert(subjectsIds.map(subject_id => {
        return { student_id: student.data[0].id, subject_id };
      }));

    if (error) {
      console.error('Error al matricular al estudiante:', error);
      return { data: null, error }; // Retorna el error
    }

    console.log('Estudiante matriculado correctamente:', data);
    return { data, error: null }; // Retorna los datos sin error
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err }; // Retorna el error
  }
}

export const getStudentIdByNip = async (nip) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('nip', nip)
      .eq('role', 'student');

    if (error) {
      console.error('Error al obtener el ID del estudiante:', error);
      return { data: null, error }; // Retorna el error
    }

    console.log('ID del estudiante obtenido correctamente:', data);
    return { data: data[0].id, error: null }; // Retorna los datos sin error
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err }; // Retorna el error
  }
}
