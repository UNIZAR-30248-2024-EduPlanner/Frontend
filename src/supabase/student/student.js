import { supabase } from '../supabaseClient';
import { getAcademicEventsBySubject } from '../academicEvent/academicEvent';
import { createCustomAcademicEvent, deleteCustomAcademicEvent } from '../customAcademicEvent/customAcademicEvent';

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
      .insert([{ student_id: student.data[0].id, subject_id: subject.data[0].id }]).select();

    if (error) {
      console.error('Error al matricular al estudiante:', error);
      return { data: null, error }; // Retorna el error
    }

    //Ahora añadir todos los eventos academicos de la asignatura al estudiante
    const academicEvents = await getAcademicEventsBySubject(subject.data[0].id);
    if (academicEvents.error) {
      console.error('Error al obtener los eventos academicos de la asignatura:', academicEvents.error);
      return { data: null, error: academicEvents.error }; // Retorna el error
    }

    //Crear un evento personalizado en el alumno para cada evento academico de la asignatura
    for (let event of academicEvents.data) {
      const customEvent = await createCustomAcademicEvent(student.data[0].id, event.id);
      if (customEvent.error) {
        console.error('Error al crear el evento personalizado:', customEvent.error);
        return { data: null, error: customEvent.error }; // Retorna el error
      }
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
      .match({ student_id: student.data[0].id, subject_id: subject.data[0].id }).select();

    if (error) {
      console.error('Error al desmatricular al estudiante:', error);
      return { data: null, error };
    }

    //Ahora hay que eliminar los eventos personalizados de la asignatura al estudiante
    const academicEvents = await getAcademicEventsBySubject(subject.data[0].id);
    if (academicEvents.error) {
      console.error('Error al obtener los eventos academicos de la asignatura:', academicEvents.error);
      return { data: null, error: academicEvents.error }; // Retorna el error
    }

    //Eliminar un evento personalizado en el alumno para cada evento academico de la asignatura
    for (let event of academicEvents.data) {
      const customEvent = await deleteCustomAcademicEvent(student.data[0].id, event.id);
      if (customEvent.error) {
        console.error('Error al eliminar el evento personalizado:', customEvent.error);
        return { data: null, error: customEvent.error }; // Retorna el error
      }
    }

    console.log('Estudiante desmatriculado correctamente:', data);

    return { data, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
};

// Función para matricular a un estudiante en múltiples asignaturas
export const matriculateStudentOnMultipleSubjects = async (student_nip, subjects) => {
  try {
    // Matricular al estudiante en cada asignatura utilizando la función matriculateStudent
    for (const subject of subjects) {
      const result = await matriculateStudent(student_nip, subject);

      if (result.error) {
        console.error(`Error al matricular al estudiante en la asignatura ${subject}:`, result.error);
        return { data: null, error: result.error };
      }
    }
    console.log('Estudiante matriculado correctamente en múltiples asignaturas');
    return { data: `Estudiante matriculado en ${subjects.length} asignaturas`, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error al matricular al estudiante en múltiples asignaturas:', err);
    return { data: null, error: err };
  }
};

export const unenrollStudentFromMultipleSubjects = async (student_nip, subjects) => {
  try {
    // Desmatricular al estudiante de cada asignatura utilizando la función unenrollStudent
    for (const subject of subjects) {
      const result = await unenrollStudent(student_nip, subject);

      if (result.error) {
        console.error(`Error al desmatricular al estudiante de la asignatura ${subject}:`, result.error);
        return { data: null, error: result.error };
      }
    }

    console.log('Estudiante desmatriculado correctamente de múltiples asignaturas');
    return { data: `Estudiante desmatriculado de ${subjects.length} asignaturas`, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error al desmatricular al estudiante de múltiples asignaturas:', err);
    return { data: null, error: err };
  }
};

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

export const getStudentsBySubject = async (subject_id) => {
  try {
    const students = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('subject_id', subject_id);

    const studentsData = await Promise.all(
      students.data.map(async student => {
        const studentData = await supabase
          .from('users')
          .select('nip', 'name', 'email')
          .eq('id', student.student_id).select();

        return studentData.data[0];
      })
    );

    console.log('Estudiantes obtenidos correctamente:', studentsData);

    return {data: studentsData, error: null};

  } catch (err) {
    return {data: null, error: err};

  }
}

export const getSubjectsInfoByStudent = async (student_id) => {
  try {
    const subjects = await supabase
      .from('enrollments')
      .select('subject_id')
      .eq('student_id', student_id);

    console.log('subjects', subjects);

    const subjectsData = await Promise.all(
      subjects.data.map(async subject => {
        const subjectData = await supabase
          .from('subjects')
          .select('subject_code', 'name', 'description')
          .eq('id', subject.subject_id).select();
        return subjectData.data[0];
      })
    );

    console.log('Asignaturas obtenidas correctamente:', subjectsData);
    return { data: subjectsData, error: null };
  } catch (err) {
    console.error('Ha ocurrido un error:', err);
    return { data: null, error: err };
  }
};