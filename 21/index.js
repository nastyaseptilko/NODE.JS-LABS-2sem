const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');


//https://habr.com/ru/post/340146/
const basicAuth = require('./auth/basic');
const digestAuth = require('./auth/digest');
const formsRouter = require('./auth/forms');

const config = require('./config');
const auth = {
    basic: {
        name: 'basic',
        middleware: basicAuth
    },
    digest: {
        name: 'digest',
        middleware: digestAuth
    }
};

passport.use(auth.digest.middleware);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();

app.use(bodyParser.json());
app.use(session(config.server.session));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (request, response) => response.redirect('/login'));

app.get('/login', (request, response, next) => {
    if (request.session.logout) { //если вышли , то удаляем заголовок
        delete request.headers['authorization'];
        request.session.logout = false;
    }
    next();
}, passport.authenticate(auth.digest.name), (request, response) => response.redirect('/resource'));

app.get('/logout', (request, response) => {
    request.logout();
    request.session.logout = true;
    response.redirect('/login');
});

app.get('/resource', (request, response) => {
    // TODO: check  header to be sure it is valid
    if (!request.headers['authorization']) {
        response.redirect('/login');
        return;
    }
    response.json(require('./secure/users'));
});

app.use('/forms', formsRouter);

app.use((request, response) => response.status(404));

app.listen(config.server.port, () => {
    console.log(`Listening to http://localhost:${config.server.port}`);
});

/*https://developer.mozilla.org/ru/docs/Web/HTTP/%D0%90%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F
Заголовок HTTP запроса Авторизации включает в себя данные пользователя для проверки подлинности пользовательского агента с сервером
обычно после того, как сервер ответил со статусом 401 Неавторизован и заголовком WWW-Authenticate.

Заголовок HTTP запроса Авторизации включает в себя данные пользователя для проверки подлинности пользовательского агента с сервером
обычно после того, как сервер ответил со статусом 401 Неавторизован и заголовком WWW-Authenticate.
WWW-AuthenticateЗаголовок ответа HTTP определяет метод аутентификации, который должен использоваться для получения доступа к ресурсу.
WWW-AuthenticateЗаголовок отправляется вместе с ответом.401 Unauthorized

Proxy-Authenticate Заголовок ответа HTTP определяет метод аутентификации, который должен использоваться для получения доступа к ресурсу
за прокси-сервером . Он аутентифицирует запрос на прокси-сервере, что позволяет ему передавать запрос дальше.
Proxy-AuthenticateЗаголовок отправляется вместе с .407 Proxy Authentication Required

Proxy-AuthorizationЗаголовок HTTP- запроса содержит учетные данные для аутентификации пользовательского агента на прокси-сервере,
обычно после того, как сервер ответил с состоянием и заголовком.407 Proxy Authentication RequiredProxy-Authenticate


*/