const http = require("http");
const mssql = require("mssql/msnodesqlv8");
const { parse } = require("querystring");
const get_handler = require("./handlers/get_handler");
const post_handler = require("./handlers/post_handler");
const put_handler = require("./handlers/put_handler");
const delete_handler = require("./handlers/delete_handler");
const err_handler = require("./handlers/err_handler");

let callGet_Pulpits = (f,_cd)=>{
  const cd = _cd?_cd:(err,result)=>{
    console.log('default cd')
  }
  const rq = new mssql.Request()
  rq.input('f', mssql.NChar(10), f);
  rq.execute('get_pulpits', (err,result)=>{
    processing_result(err,result);
    cd(err,result)
  })
  rq.on('info', message =>{console.log('info:', message)})
};

let processing_result = (err,result)=>{
  if(err) console.log('processing_result err', err);
  else{
    console.log('Count string:', result.rowsAffected[0]);
    for(let i = 0; i< result.rowsAffected[0]; i++){
      let str = '---';
      for(key in result.recordset[i]){
        str += `${key} =  ${result.recordset[i][key]}`;
        console.log(str)
      }
    }
  }
}

h = (err, result)=>{
  if(err)console.log('error ',err);
  else console.log(' Успешно' , result.rowsAffected[0]);
  process.exit(0);
}

let request_handler = (req, res, pool) => {
  switch (req.method) {
    case "GET":
      get_handler(req, res, pool);
      if (req.url==='/proc')//
      {
        console.log(' connect ')
        callGet_Pulpits('ИДиП  ',h);
      }//////////////////////////////
      break;
    case "POST":
    {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        post_handler(req, res, JSON.parse(body), pool);
      });
    }
      break;
    case "PUT":
    {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        put_handler(req, res, JSON.parse(body), pool);
      });
    }
      break;
    case "DELETE":
      delete_handler(req, res, pool);
      break;
    default:
      err_handler(req, res, 501, "This method is not supported");
      break;
  }
};

const config = {
  user: "Admin_User",
  password: "password",
  server: "DESKTOP-2CC1V4D\\SQLEXPRESS",
  database: "lab14node",
  options: {
    encrypt: false,   enableArithAbort: true
  },
  pool: {
        max:10, min:0, softIdleTimeoutMillis:5000, idleTimeoutMillis: 10000
    }

};

let server = http.createServer();
server.listen(3000);
server.on("request", (req, res) => {
  const pool = new mssql.ConnectionPool(config, err => {
    if (err) {
      console.log("Database connection failed: ", err.code);
      err_handler(req, res, 500, err.message);
    } else {
      console.log("Database connection success");
      request_handler(req, res, pool);
      console.log(' connect ')
      //callGet_Pulpits('ИДиП  ',h);
    }
  });
});

console.log("Server running at http://localhost:3000/");
