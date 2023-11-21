const PDFDocument = require('pdfkit');

async function generatePDF(datos) {
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        // El evento 'end' se emite cuando se termina de escribir el documento
    });

    // Agregar contenido al documento
    doc.fontSize(12).text('Informe de Usuarios', { underline: true });
    datos.forEach((dato, index) => {
        doc.text(`${index + 1}. ${dato.nombre}, Edad: ${dato.edad}`, { indent: 20 });
    });

    doc.end();

    // Esperar a que el documento termine y devolver el buffer
    return new Promise((resolve) => {
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
    });
}

module.exports = {
generatePDF
};
