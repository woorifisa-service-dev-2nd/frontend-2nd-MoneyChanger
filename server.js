const express = require('express');
const request = require('request');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const AUTH_KEY = '';

const port = 3000;
app.listen(port, () => console.log(`Server is running at ${port} ...`));
