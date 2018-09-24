let {dbConfig} = require('../tool/config_util');
let dbObj = dbConfig['sqlite'];
let path = dbObj.path;
let fs = require('fs');
var exists = fs.existsSync(path);
if(!exists) {
    console.log("Creating DB file.");
    fs.openSync(path, "w");
}
let sqlite = require('sqlite3').verbose();

var db = new sqlite.Database(path);

let getConnection = function(){
    return new sqlite.Database(path, function(error){
        if(error){
            throw error;
        }else{
            console.log('[db] [sqlite] connection success!');
        }
    })
}
let run = (sql, paramAry) => {
    connection.run(sql, paramAry, function(error){
        if(error) {
            throw error;
        }
    })
}

let get = (sql, paramAry) => {
    let connection = new sqlite.Database(path);
    let res = undefined;
    connection.get(sql, paramAry, function(error, row){
        if(error){
            throw error;
        } else if(row){
            res = row;
        }
    })
    return res;
}

exports.run = run;
exports.query = get;