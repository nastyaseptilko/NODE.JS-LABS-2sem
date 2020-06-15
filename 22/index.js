const fs = require('fs');
const https = require('https');
const express = require('express');

const cert = {
    // Replace private key and cert with the appropriate names of the credentials you use
    key: fs.readFileSync('./certs/resourcePrivateKey.key', 'utf8'),
    cert: fs.readFileSync('./certs/resourceCert.crt', 'utf8')
};
const app = express();

app.get('/', (request, response) => {
    response.end('<h1>Hello world</h1>')
});

const httpsServer = https.createServer(cert, app);
httpsServer.listen(8081, () => {
    console.log('Listening to https://localhost:8081/');
    console.log('Also available: https://CA_SAA:8081/');
});
/*ПЛАН ДЕЙСТВИЙ:
* 1)генерация приватного ключа CA.
* 2)генерация сертификата CA
* 3)генерация приватного ключа ресурса
* 4)генерация запроса на сертификат для ресурса
* 5)генерация сертификата для ресурса
* 6)mmc-консоль с оснасткой для работы с хранилищем сертификатов
* 7)импорт сертификата CA в хранилище доверенных корневых центров сертификации
* 8)размещение сертификата ресурса и  его секретного ключа в директории приложения
* 9)настройка DNS (hosts)
* 10)настройка прокси-сервера (это только для демонстрации)
*
* Для ЦВС для начала нужно сгенирировать приватный ключ
* Потом должен быть свой сертификат, который сгенирирован с помощью приватного ключа
* Для того чтобы какой-то ресурс получил сертификат он должен сгенирировать запрос и отправить ЦВС,
* запрос генирируется с помощью приватного ключа
* Потом ЦВС проверяет запрос, если все ок, то генерирует сертификат
* */


/*
 * Generate SS certificate with the private key
 * openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out ./selfsigned.crt
 */

/*
 * Generate Private key from CA side
 * openssl genrsa -des3 -out caPrivateKey.key 2048
 *
 * Enter pass phrase for caPrivateKey.key: password
 * Verifying - Enter pass phrase for caPrivateKey.key: password
 */

/*
 * Generate Certificate from CA side
 * openssl req -x509 -new -days 365 -sha256 -key ./caPrivateKey.key -sha256 -out ./caCertificate.crt
 *
 * Enter pass phrase for caPrivateKey.key: password
 *
 * Country Name (2 letter code) [AU]:BY
 * State or Province Name (full name) [Some-State]:Minsk
 * Locality Name (eg, city) []:Minsk
 * Organization Name (eg, company) [Internet Widgits Pty Ltd]:CA-LAB22
 * Organizational Unit Name (eg, section) []:CA-LAB22
 * Common Name (e.g. server FQDN or YOUR name) []:CA-LAB22-MIM
 * Email Address []:
 */

/*
 * Generate Private key from Resource side
 * openssl genrsa -out ./resourcePrivateKey.key 2048
 */

/*
 * Generate Certificate request from Resource side
 * openssl req -new -key ./resourcePrivateKey.key -out ./certRequest.csr -sha256 -config ./certificateConfig.cfg
 */

/*
 * Generate Certificate for a Resource from CA side
 * openssl x509 -req -days 365 -sha256 -in ./certRequest.csr -CA ./caCertificate.crt -CAkey ./caPrivateKey.key -CAcreateserial -out ./resourceCert.crt -extensions v3_req -extfile ./certificateConfig.cfg
 *
 * Enter pass phrase for ./caPrivateKey.key: password
 *
 *  Клиент выдает запрос серверу (Client Hello).
18. Сервер подписывает свой сертификат и высылает клиенту (Server Hello).
19. Клиент проверяет сертификат в центре сертификации, которому доверяет.
20. Клиент сравнивает данные сертификата с информацией центра сертификации.
21. Клиент сообщает серверу, какие ключи шифрования он поддерживает.
22. Сервер выбирает подходящую длину ключа.
23. Клиент генерирует симметричный ключ, шифрует его открытым ключом.
24. Сервер получает симметричный ключ и расшифровывает его.
 */
