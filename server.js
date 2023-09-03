const express = require('express');
const dbConnect = require('./dbConnect');
const app = express();
require('dotenv').config();
const router = require('./routers/router')

const PORT = process.env.PUBLIC_PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

dbConnect();

app.use('/auth', router);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});