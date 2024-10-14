// src/supabase/testOrganization.js
import * as f from './organization';
import { describe, it, beforeAll, expect } from 'vitest'; // Importar de vitest

describe('Funciones de Organización', () => {
    const testOrganization = {
        name: 'EINA',
        nip: 4878,
        password: '123456'
    };

    beforeAll(async () => {
        const { data, error } = await f.register(testOrganization.name, testOrganization.nip, testOrganization.password);

        if (error) {
            console.error('Detalles del error:', error);
            const errorMessage = (typeof error === 'object' && error.message) ? error.message : JSON.stringify(error);
            throw new Error(`Error al registrar la organización: ${errorMessage}`);
        }

        console.log(data);
    });

    it('Iniciar sesión como organización', async () => {
        const { data, error } = await f.login(testOrganization.nip, testOrganization.password);
        expect(error).toBeNull();
        expect(data).toHaveProperty('id');
    });

    /*
    it('Obtener todos los cursos de la organización', async () => {
        const { data, error } = await f.getAllCourses(organizationId);
        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
    });

    it('Crear un nuevo curso', async () => {
        const courseName = 'Curso de Prueba';
        const courseUserId = 1;

        const { data, error } = await f.createCourse(courseName, organizationId, courseUserId);
        expect(error).toBeNull();
        expect(data).toHaveProperty('id');
    });
    */

    // Más pruebas aquí...
});
