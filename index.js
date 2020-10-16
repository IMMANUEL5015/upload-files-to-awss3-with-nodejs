require('dotenv').config();
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});

const upload = multer(storage).single('image');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
});

app.post('/upload', upload, (req, res) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.file.originalname}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).send(data);
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});