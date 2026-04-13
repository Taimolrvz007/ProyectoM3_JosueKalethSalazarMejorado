import { describe, it, expect } from 'vitest';
import { formatMessage, validateInput, getGokuGreeting, parseApiResponse } from '../src/utils.js';

describe('Pruebas de Utilidades - Proyecto Goku', () => {
    
    it('debe limpiar los espacios en blanco innecesarios', () => {
        expect(formatMessage('   ¡Hola Goku!   ')).toBe('¡Hola Goku!');
    });

    it('debe validar que el input sea correcto', () => {
        expect(validateInput('')).toBe(false);
        expect(validateInput('Kamehameha')).toBe(true);
    });

    it('debe generar el saludo icónico de Goku correctamente', () => {
        expect(getGokuGreeting('Kaleth')).toContain('¡Hola, soy Goku!');
        expect(getGokuGreeting('Kaleth')).toContain('Kaleth');
    });

    it('debe manejar respuestas de API vacías o nulas', () => {
        const errorData = {};
        expect(parseApiResponse(errorData)).toBe("¡Rayos! No pude entenderte, ¿puedes repetirlo?");
    });
});