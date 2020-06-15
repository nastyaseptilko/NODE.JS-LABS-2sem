const url = require('url');
const sql = require('mssql/msnodesqlv8');
let err_handler = require('./err_handler');

module.exports = (req, res, data, pool) => {
    switch((url.parse(req.url)).pathname) {
        case '/api/faculties': {
            pool.request()
                .input('faculty', sql.NVarChar, data.faculty)
                .input('faculty_name', sql.NVarChar, data.faculty_name)
                .query('update faculty set faculty_name = @faculty_name where faculty = @faculty', (err, result) => {
                    if(err)
                        err_handler(req, res, 500, err.message);
                    else{
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(data));
                    }
                });
        } break;
        case '/api/pulpits': {
            pool.request()
                .input('pulpit', sql.NVarChar, data.pulpit)
                .input('pulpit_name', sql.NVarChar, data.pulpit_name)
                .input('faculty', sql.NVarChar, data.faculty)
                .query('update pulpit set pulpit_name = @pulpit_name, faculty = @faculty where pulpit = @pulpit', (err, result) => {
                    if(err)
                        err_handler(req, res, 500, err.message);
                    else{
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(data));
                    }
                });
        } break;
        case '/api/subjects': {
            pool.request()
                .input('subject', sql.NVarChar, data.subject)
                .input('subject_name', sql.NVarChar, data.subject_name)
                .input('pulpit', sql.NVarChar, data.pulpit)
                .query('update subject set subject_name = @subject_name, pulpit = @pulpit where subject = @subject', (err, result) => {
                    if(err)
                        err_handler(req, res, 500, err.message);
                    else{
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(data));
                    }
                });
        } break;
        case '/api/auditoriumstypes': {
            pool.request()
                .input('auditorium_type', sql.NVarChar, data.auditorium_type)
                .input('auditorium_typename', sql.NVarChar, data.auditorium_typename)
                .query('update auditorium_type set auditorium_typename = @auditorium_typename where auditorium_type = @auditorium_type', (err, result) => {
                    if(err)
                        err_handler(req, res, 500, err.message);
                    else{
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(data));
                    }
                });
        } break;
        case '/api/auditoriums': {
            pool.request()
                .input('auditorium', sql.NVarChar, data.auditorium)
                .input('auditorium_name', sql.NVarChar, data.auditorium_name)
                .input('auditorium_capacity', sql.Int, data.auditorium_capacity)
                .input('auditorium_type', sql.NVarChar, data.auditorium_type)
                .query('update auditorium set auditorium_name = @auditorium_name, auditorium_capacity = @auditorium_capacity, auditorium_type = @auditorium_type where auditorium = @auditorium', (err, result) => {
                    if(err)
                        err_handler(req, res, 500, err.message);
                    else{
                        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        res.end(JSON.stringify(data));
                    }
                });
        } break;
        default: err_handler(req, res, 400, 'Bad request'); break;
    }
};