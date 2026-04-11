export const GAS_URL = 'https://script.google.com/macros/s/AKfycbyZIMeXflZsiKgdr29eGtckPlIE6h1nAmZExvXVpMkJMWUAx-FMuYyaOkzynlinNvW6/exec';

/**
 * Función universal para comunicarse de forma segura con el API de Google Apps Script.
 * Utiliza promesas para una mejor integración con hooks asíncronos en React.
 * 
 * @param {string} action - Nombre real de la función (doPost) en el backend (ej: 'obtenerMisDatosConEmail')
 * @param {Array} params - Array de parámetros que espera la función.
 * @returns {Promise<any>}
 */
export async function callGAS(action, params = []) {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      // 'text/plain' es requerido por Google Apps Script doPost para evitar problemas de CORS preflight request
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, params })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`[callGAS] API Falló en acción '${action}':`, error);
    throw error;
  }
}
