const express = require('express');
const routerAuth = require('./routes/auth');
const PORT = process.env.PORT || 3000;
var cors = require('cors');
const app = express();

app.use(cors())
app.use('/', routerAuth );

app.use(function (req, res, next) {
    const err = new Error('Ошибка 404. Ничего не найдено!');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    })
})

const server = app.listen(PORT, function () {
    console.log('Сервер работает на порту: ' + server.address().port);
})