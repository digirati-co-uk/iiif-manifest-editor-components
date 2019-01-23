const getKey = name =>
  'temporary/' +
  new Date().toISOString().replace(/T.*/, '') +
  '/' +
  encodeURIComponent(name);

const UPDATE_THROTTLING = 250;
const PART_SIZE = 10 * 1024 * 1024;
const PARALLEL_UPLOADS = 1;

if (!window.s3) {
  if (
    process.env.AMZN_S3_IDENTITY_POOL_HASH &&
    process.env.AMZN_S3_REGION &&
    process.env.AMZN_S3_BUCKET
  ) {
    const awsJS = document.createElement('script');
    awsJS.async = false;
    awsJS.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js';
    awsJS.onload = ev => {
      var albumBucketName = process.env.AMZN_S3_BUCKET;
      window.AWS.config.region = process.env.AMZN_S3_REGION; // Region
      window.AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: `${process.env.AMZN_S3_REGION}:${process.env.AMZN_S3_IDENTITY_POOL_HASH}`,
      });
      window.s3 = new AWS.S3({
        apiVersion: '2012-10-17',
        params: {
          Bucket: albumBucketName,
        },
      });
    };
    document.head.appendChild(awsJS);
  } else {
    console.warn(
      'AMZN_S3_IDENTITY_POOL_HASH, AMZN_S3_REGION, AMZN_S3_BUCKET hasn\'t been found in the env, so upload functionality disabled' 
    );
  }
}

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
