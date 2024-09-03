const express = require('express');
const mongoose = require('mongoose');
const { URI } = require('./environment.js');
const app = express();

const backend_port = 5000;


mongoose.connect(URI)
    .then(() => {
        console.log("DB Connected");
        app.listen(5000, () => {
            console.log(`Tasker backend listening on port ${backend_port}`);
        });
    })
    .catch((err) => {
        console.log(`Backend connection failure\n${err}`);
    });