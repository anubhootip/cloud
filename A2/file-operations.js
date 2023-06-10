const AWS = require('aws-sdk');

const { sessionToken, accessKeyId, secretAccessKey, region } = process.env;
const bucketName = 'grpca2bucket';
const fileName = 'A2.txt';
console.log(accessKeyId, secretAccessKey, region);
AWS.config.update({ sessionToken, accessKeyId, secretAccessKey, region });
const s3 = new AWS.S3();

module.exports = {
  saveNewFile: async (body) => {
    let response;
    const promise = new Promise((res) => response = res);
    let fileURI;
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: body
    };

    s3.upload(params, (err) => {
      if (err) {
        console.error(err);
      } else {
        fileURI = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
        console.log('File created successfully', fileURI);
        response(fileURI);
      }
    });
    return promise;
  },
  updateFile: async (body) => {
    let response;
    const promise = new Promise((res) => response = res);
    const getObjectParams = {
      Bucket: bucketName,
      Key: fileName
    };

    // Retrieve the existing file content
    s3.getObject(getObjectParams, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const existingContent = data.Body.toString();

      // Append new content
      const newContent = existingContent + body;

      // Define the parameters for the S3 `putObject` operation to update the file
      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: newContent
      };

      // Update the file content in S3
      s3.upload(uploadParams, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log('File updated successfully');
          response();
        }
      });
    });

    return promise;
  },
  deleteFile: async () => {
    let response;
    const promise = new Promise((res) => response = res);
    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log('File deleted successfully');
        response();
      }
    });

    return promise;
  }
}
