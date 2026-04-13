// Funciones de utilidad para el proyecto de Goku

/**
 * Limpia el texto de entrada del usuario
 */
export const formatMessage = (text) => {
    return text.trim();
};

/**
 * Valida que el mensaje no esté vacío y tenga un largo razonable
 */
export const validateInput = (input) => {
    const trimmed = input.trim();
    return trimmed.length > 0 && trimmed.length < 500;
};

/**
 * Genera un saludo dinámico (útil para el Home o inicio de chat)
 */
export const getGokuGreeting = (name = "amigo") => {
    return `¡Hola, soy Goku! ¡Se ve que ${name} ha entrenado muy duro!`;
};

/**
 * Procesa la respuesta de la API para asegurar que siempre haya un texto
 */
export const parseApiResponse = (data) => {
    return data && data.text ? data.text : "¡Rayos! No pude entenderte, ¿puedes repetirlo?";
};