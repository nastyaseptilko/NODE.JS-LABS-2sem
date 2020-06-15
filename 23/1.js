const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const md5File = require('md5-file');
//1- запускаем, потом 2
const app = express();

app.use(bodyParser.json());

let server = crypto.createDiffieHellman(1024);
let prime = server.getPrime();

let serverKey;
let serverPublicKey;

let sessionKey;

app.get('/', (req, res) => {
  //создание сеансового ключа, они одинаковые и у клиента и у сервера, создаются с помощью диффи хелмана
  //с помощью этого ключа можем шифровать теск и рассшифровывать на сервере (2.джс)
  serverKey = crypto.createDiffieHellman(prime);
  serverPublicKey = serverKey.generateKeys('base64');

  res.json({ prime: JSON.stringify(prime), publicKey: serverPublicKey });
});

app.post('/session', (req, res) => {
  const { publicKey } = req.body;
  if (!publicKey) {
    res.status(409).json({ message: 'Exchange secrets first' });
  } else {
    sessionKey = serverKey.computeSecret(publicKey, 'base64');
    console.log(sessionKey.toString())
    res.json({message: 'ok'});
  }
})

app.get('/resource', (req, res) => {
  if (!sessionKey) {
    res.status(409).json({ message: 'Exchange secrets first' });
  } else {
    const txt = 'Septilko Nastya FIT 3-5';
    const cipher = crypto.createCipher('aes256', sessionKey.toString());
    const encrypted = cipher.update(txt, 'utf8', 'hex') + cipher.final('hex');

    res.json({ txt: encrypted });
  }
});

app.get('/verified-resource', (req, res) => {
  if (!sessionKey) {
    res.status(409).json({ message: 'Exchange secrets first' });
  } else {
    const hash = md5File.sync('file.txt');
    const txt = 'Septilko Nastya FIT 3-5';
    res.json({ txt, ver: (hash + sessionKey.toString()).hashCode() })
  }
});

app.listen(5000, () => {
  console.log('Server started');
});


String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) {
    return hash;
  }
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
