const express = require('express');

const app = express();
const wasmCode = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x87, 0x80, 0x80, 0x80, 0x00, 0x01, 0x60, 0x02, 0x7f,
    0x7f, 0x01, 0x7f, 0x03, 0x84, 0x80, 0x80, 0x80, 0x00,
    0x03, 0x00, 0x00, 0x00, 0x04, 0x84, 0x80, 0x80, 0x80,
    0x00, 0x01, 0x70, 0x00, 0x00, 0x05, 0x83, 0x80, 0x80,
    0x80, 0x00, 0x01, 0x00, 0x01, 0x06, 0x81, 0x80, 0x80,
    0x80, 0x00, 0x00, 0x07, 0x9c, 0x80, 0x80, 0x80, 0x00,
    0x04, 0x06, 0x6d, 0x65, 0x6d, 0x6f, 0x72, 0x79, 0x02,
    0x00, 0x03, 0x73, 0x75, 0x6d, 0x00, 0x00, 0x03, 0x73,
    0x75, 0x62, 0x00, 0x01, 0x03, 0x6d, 0x75, 0x6c, 0x00,
    0x02, 0x0a, 0xa5, 0x80, 0x80, 0x80, 0x00, 0x03, 0x87,
    0x80, 0x80, 0x80, 0x00, 0x00, 0x20, 0x01, 0x20, 0x00,
    0x6a, 0x0b, 0x87, 0x80, 0x80, 0x80, 0x00, 0x00, 0x20,
    0x00, 0x20, 0x01, 0x6b, 0x0b, 0x87, 0x80, 0x80, 0x80,
    0x00, 0x00, 0x20, 0x01, 0x20, 0x00, 0x6c, 0x0b
])
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, {});


app.get('/', (request, response) => {
    response.sendFile('2.html', {root: __dirname});
});

app.get('/wasm', (request, response) => {
    response.sendFile('functions-bin.wasm', {root: __dirname + '/../'});
});

app.get('/:func', (request, response) => {
    if (!wasmInstance.exports[request.params.func]) {
        response.status(404).end();
    } else {
        response.setHeader('Content-Type', 'text/plain');
        response.end(wasmInstance.exports[request.params.func](3, 4).toString());
    }
});

app.listen(3000, () => {
    console.log('Second task: http://localhost:3000');
});