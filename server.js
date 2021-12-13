const express = require('express')
var fs = require('fs');
const app = express()
const port = 3000

const axios = require('axios');
var FormData = require('form-data');

const cors = require('cors')
app.use(cors());

var bodyParser = require('body-parser')
app.use(bodyParser.json())

const fileUpload = require('express-fileupload');
const e = require('express');
app.use(fileUpload({
    useTempFiles: false
}));



const APP_ID = 'YOUR SENDBIRD APP ID';
const API_TOKEN = 'YOUR SENDBIRD API TOKEN';
const CHANNEL_URL = 'YOUR CHANNEL URL';
const USER_ID = 'YOUR USER ID UPLOADING THIS FILE';

const CHANNEL_TYPE = 'group_channels';
const MESSAGE_TYPE = 'FILE';
const UPLOAD_FOLDER = './uploads';


app.post('/upload', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const file = req.files.file;

    file.mv(UPLOAD_FOLDER + '/' + file.name, (err) => {

        if (!err) {

            var data = new FormData();
            data.append('file', fs.createReadStream(UPLOAD_FOLDER + '/' + file.name));
            data.append('file_name', file.name);
            data.append('message_type', MESSAGE_TYPE);
            data.append('user_id', USER_ID);
        
            var config = {
                method: 'post',
                url: 'https://api-' + APP_ID + '.sendbird.com/v3/' + CHANNEL_TYPE +'/' + CHANNEL_URL +'/messages',
                headers: {
                    'Api-Token': API_TOKEN,
                    ...data.getHeaders()
                },
                data: data
            };
        
            axios(config).then( (response) => {
                console.log(JSON.stringify(response.data));
                res.send('File uploaded');
            })
            .catch((error) => {
                console.log(error);
                res.send('Error uploading file!');
            });

        } else {
            console.log(err);
            res.send('Error uploading file!');

        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

