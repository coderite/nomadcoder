const express = require('express');
const wut = require('debug')('wut');
const yep = require('debug')('yap');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('html'));
app.get('/', (req, res) => res.sendFile("index.html"));
wut('ok');
yep('yes');
app.listen(port, () => wut(`listening on port ${port}`));