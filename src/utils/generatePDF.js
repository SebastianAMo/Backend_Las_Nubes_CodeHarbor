const PDFDocument = require('pdfkit');

function agregarDatos(doc, clave, valor) {
  if (Array.isArray(valor)) {
    doc.fontSize(14).text(clave, { underline: true });
    valor.forEach((item) => {
      Object.keys(item).forEach((subClave) => {
        doc.fontSize(12).text(`${subClave}: ${item[subClave]}`, { indent: 20 });
      });
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(14).text(clave, { underline: true });
    if (valor === undefined || valor === null) valor = 'No disponible';
    doc.fontSize(12).text(valor.toString(), { indent: 20 });
  }
  doc.moveDown(1.0);
}

async function generatePDF(datos, tituloDocumento) {
  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  // Agregar el título del documento
  if (tituloDocumento) {
    doc.fontSize(18).text(tituloDocumento, { align: 'center' });
    doc.moveDown(2.0);
  }

  // Iterar sobre cada propiedad del objeto JSON
  Object.keys(datos).forEach((clave) => {
    const valor = datos[clave];
    agregarDatos(doc, clave, valor);
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
  });
}

module.exports = {
  generatePDF,
};
