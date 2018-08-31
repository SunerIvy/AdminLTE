let {dbConfig} = require('../tool/config_util');
let dbObj = dbConfig;

let getConnection = function(){
    let path = dbObj.path;
    let sqlite = require('sqlite3');
    connection = new sqlite.Database(path, function(error){
        if(error){
            throw error;
        }else{
            console.log('[db] [sqlite] connection success!');
        }
    })
    return connection;
}
let run = (sql, paramAry) => {
    connection.run(sql, paramAry, function(error){
        if(error) {
            throw error;
        }
    })
}

let get = (sql, paramAry) => {
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