const express = require('express');
const app = express();
const wut = require('debug')('wut');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// some constants
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// app.use(express.static('html'));
app.get('/', (req, res) => {
    res.render('pages/index');
});

const WebSocket = require('ws');

const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@miniTicker');

ws.on('message', function incoming(data) {
    let ticker = JSON.parse(data);
    console.log(ticker.type + ' ' + ticker.s + ' ' + ticker.c);
});

app.listen(port, () => wut(`listening on port ${port}`));