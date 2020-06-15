const url = require('url');
const sql = require('mssql/msnodesqlv8');
let err_handler = require('./err_handler');

module.exports = (req, res, data, pool) => {
    switch((url.parse(req.url)).pathname) {
        case '/api/faculties': {
            pool.request()
                .input('faculty', sql.NVarChar, data.faculty)
                .input('faculty_name', sql.NVarChar, data.faculty_name)
                .query('insert into faculty(faculty, faculty_name) values(@faculty, @faculty_name)', (err, result) => {
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
                .query('insert into pulpit(pulpit, pulpit_name, faculty) values(@pulpit, @pulpit_name, @faculty)', (err, result) => {
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
                .query('insert into subject(subject, subject_name, pulpit) values(@subject, @subject_name, @pulpit)', (err, result) => {
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
                .query('insert into auditorium_type(auditorium_type, auditorium_typename) values(@auditorium_type, @auditorium_typename)', (err, result) => {
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
                .query('insert into auditorium(auditorium, auditorium_name, auditorium_capacity, auditorium_type) values(@auditorium, @auditorium_name, @auditorium_capacity, @auditorium_type)', (err, result) => {
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