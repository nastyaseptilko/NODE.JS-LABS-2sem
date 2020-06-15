module.exports = (req, res, err_code, err_mes) => {
    res.writeHead(err_code, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"code": "${err_code}", "err_mes": "${err_mes}"}`);
};