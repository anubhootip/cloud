const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fileOperations = require('./file-operations');
const fetch = require('node-fetch');

const ROB_APP_START_URL = 'http://54.173.209.76:9000/start';
const BANNER = 'B00934518';
const PROTO_PATH = __dirname + '/computeandstorage.proto';
const { ip } = process.env;

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

const computeandstorage = grpc.loadPackageDefinition(packageDefinition).computeandstorage;

function StoreData(call, callback) {
  const { data } = call.request;
  // create s3 file, save data in it and send back public s3uri
  fileOperations.saveNewFile(data).then(s3uri => {
    console.log('save new file success');
    callback(null, { s3uri });
  })
}
function AppendData(call, callback) {
  const { data } = call.request;
  fileOperations.updateFile(data).then(() => {
    callback(null, {});
  })
}
function DeleteFile(call, callback) {
  const { s3uri } = call.request;
  fileOperations.deleteFile().then(() => {
    callback(null, {});
  })
}

function main() {
  const server = new grpc.Server();
  server.addService(computeandstorage.EC2Operations.service, { StoreData, AppendData, DeleteFile });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();

    fetch(ROB_APP_START_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banner: BANNER, ip })
    }).then((d) => console.log(JSON.stringify(d), 'fetch success'))
      .catch(err => console.log(err, 'fetch failed'));
  });


}

main();
