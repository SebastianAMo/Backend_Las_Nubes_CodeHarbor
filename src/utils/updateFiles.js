const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

async function updateOneFile(archivo, campo, currentInfo) {
  if (archivo?.path) {
    if (currentInfo[campo] && archivo.path !== currentInfo[campo]) {
      await unlinkAsync(currentInfo[campo]);
    }
    return { [campo]: archivo.path };
  }
  return {};
}

async function updateFiles(Files, currentInfo) {
  let actualizaciones = {};

  if (!Files) {
    return actualizaciones;
  }

  for (const [campo, archivo] of Object.entries(Files)) {
    console.log(currentInfo[campo]);
    if (archivo?.[0]) {
      if (currentInfo[campo] && archivo[0].path !== currentInfo[campo]) {
        await unlinkAsync(currentInfo[campo]);
      }
      actualizaciones[campo] = archivo[0].path;
    }
  }

  return actualizaciones;
}

module.exports = {
  updateFiles,
  updateOneFile,
};