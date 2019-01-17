const getKey = name =>
  'temporary/' +
  new Date().toISOString().replace(/T.*/, '') +
  '/' +
  encodeURIComponent(name);

const UPDATE_THROTTLING = 250;
const PART_SIZE = 10 * 1024 * 1024;
const PARALLEL_UPLOADS = 1;

if (!window.s3) {
  const awsJS = document.createElement('script');
  awsJS.async = false;
  awsJS.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js';
  awsJS.onload = ev => {
    console.log('amazon api loaeded');
    var albumBucketName = 'dlcs-dlcservices-test-ingest';
    window.AWS.config.region = 'eu-west-1'; // Region
    window.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-west-1:4ef2005b-0ce9-40f9-9e24-b5d50e72c0f1',
    });

    window.s3 = new AWS.S3({
      apiVersion: '2012-10-17',
      params: {
        Bucket: albumBucketName,
      },
    });
    console.log('amazon s3 preconfigured');
  };
  document.head.appendChild(awsJS);
}

//TODO: this assumes that the amazon api loaded in the index HTML.
// ATM it is tied to my test dlcs ingest account, it has to change later.

export const bulkUpload = ({
  files,
  onProgress,
  onItemComplete,
  onComplete,
  onError,
}) => {
  const lastUpdate = {};
  const uploaded = [];
  files.forEach(file => {
    const key = getKey(file.name);
    const params = {
      Key: key,
      Body: file,
      ACL: 'public-read',
    };
    const options = {
      partSize: PART_SIZE,
      queueSize: PARALLEL_UPLOADS,
    };
    s3.upload(params, options)
      .on('httpUploadProgress', evt => {
        const percent = parseInt((evt.loaded * 100) / evt.total);
        const epoch = new Date().getTime();
        if (
          epoch - UPDATE_THROTTLING >= (lastUpdate[file.name] || 0) ||
          percent === 100
        ) {
          lastUpdate[file.name] = epoch;
          onProgress(file.name, percent);
        }
      })
      .send((err, data) => {
        if (err) {
          onError(file.name, err.message);
          return;
        }
        uploaded.push(file.name);
        onItemComplete(file.name, data);
        if (files.length === uploaded.length) {
          onComplete();
        }
      });
  });
};
