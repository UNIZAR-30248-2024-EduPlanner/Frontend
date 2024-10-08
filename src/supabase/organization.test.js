// src/supabase/testOrganization.js
import * as f from './organization';


describe('Funciones de Organización', () => {
    let organizationId;
    const testOrganization = {
        name: 'Organización de Prueba',
        nip: 4000,
        password: 'testpassword123'
    };

    beforeAll(async () => {
        const { data, error } = await f.register(testOrganization.name, testOrganization.nip, testOrganization.password);
        if (error) {
            throw new Error(`Error al registrar la organización: ${error.message}`);
        }
        print(data);
        //organizationId = data[0].id; // Asumimos que se devuelve un array de datos
    });
    

    test('Iniciar sesión como organización', async () => {
        const { data, error } = await f.login(testOrganization.nip, testOrganization.password);
        expect(error).toBeNull();
        expect(data).toHaveProperty('id');
    });

    /*
    test('Obtener todos los cursos de la organización', async () => {
        const { data, error } = await f.getAllCourses(organizationId);
        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
    });

    test('Crear un nuevo curso', async () => {
        const courseName = 'Curso de Prueba';
        const courseUserId = 1; 

        const { data, error } = await f.createCourse(courseName, organizationId, courseUserId);
        expect(error).toBeNull();
        expect(data).toHaveProperty('id');
    });
    */

    // Más pruebas aquí...
});
