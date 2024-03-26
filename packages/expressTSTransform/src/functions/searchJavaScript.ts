const fs = require('fs');
const path = require('path');

const searchJavaScript = (carpeta: string, archivosEncontrados: string[] = []): string[] => {
  const archivos = fs.readdirSync(carpeta);

  archivos.forEach((archivo: string) => {
    const rutaArchivo = path.join(carpeta, archivo);
    const stats = fs.statSync(rutaArchivo);

    if (stats.isDirectory()) {
      // Si es una carpeta, realizar una búsqueda recursiva
      searchJavaScript(rutaArchivo, archivosEncontrados);
    } else if (stats.isFile() && archivo.endsWith('.js')) {
      // Si es un archivo JavaScript, almacenarlo en el array
      archivosEncontrados.push(rutaArchivo);
    }
  });

  return archivosEncontrados;
}

export default searchJavaScript;