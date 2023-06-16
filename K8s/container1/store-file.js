const fs = require('fs');

module.exports = async (body) => {
  let res;
  const promise = new Promise(r => res = r);
  let { isPass, json = {} } = {};
  try {
    const { file, data } = JSON.parse(body);
    const filePath = '/app/Anubhooti_PV_dir/' + file;
    if (!file) {

      json = {
        file: null, error: "Invalid JSON input."
      }
      res({ isPass, json });
    } else {


      fs.writeFile(filePath, data, (error) => {

        if (error) {
          console.log('error->>>>>>>>', error, '>>>>>', path);
          json = {
            file,
            error: "Error while storing the file to the storage."
          }
        } else {
          isPass = true;
          json = {
            file,
            message: "Success."
          }
        }

        res({ isPass, json });
      })
    }
  } catch {

  }

  return promise;
}