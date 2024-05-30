const AWS = require('aws-sdk')

const uploadToS3= (data, filename) =>
{
    const BUCKET_NAME = 'chatappbucket321';


    let s3bucket = new AWS.S3({
        accessKeyId:  process.env.I_Am_USER,
        secretAccessKey:  process.env.I_Am_USER_KEY
        // Bucket: BUCKET_NAME
    })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err){
                    console.log('Something went wrong', err)
                    reject(err)
                }
                else{
                    resolve(s3response.Location);
                }
            })
        })
        
}

module.exports = {
    uploadToS3
}