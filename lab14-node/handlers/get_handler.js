const url = require("url");
const fs = require("fs");
const html = fs.readFileSync("./index.html");
let err_handler = require("./err_handler");

module.exports = (req, res, pool) => {
  switch (url.parse(req.url).pathname) {
    case "/":
      {
        res.end(html);
      }
      break;
    case "/api/faculties":
      {
        pool.request().query("select * from faculty", (err, result) => {/*pool для соединения */
          if (err) err_handler(req, res, 500, err.message);
          else {
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify(result.recordset));/*recordset результирующий набор*/
          }
        });
      }
      break;
    case "/api/pulpits":
      {
        pool.request().query("select * from pulpit", (err, result) => {
          if (err) err_handler(req, res, 500, err.message);
          else {
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify(result.recordset));
          }
        });
      }
      break;
    case "/api/subjects":
      {
        pool.request().query("select * from subject", (err, result) => {
          if (err) err_handler(req, res, 500, err.message);
          else {
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify(result.recordset));
          }
        });
      }
      break;
    case "/api/auditoriumstypes":
      {
        pool.request().query("select * from auditorium_type", (err, result) => {
          if (err) err_handler(req, res, 500, err.message);
          else {
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify(result.recordset));
          }
        });
      }
      break;
    case "/api/auditoriums":
      {
        pool.request().query("select * from auditorium", (err, result) => {
          if (err) err_handler(req, res, 500, err.message);
          else {
            res.writeHead(200, {
              "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify(result.recordset));
          }
        });
      }
      break;
    default:
      err_handler(req, res, 400, "Bad request");
      break;
  }
};
