let {dbConfig} = require('../tool/config_util');
let dbObj = dbConfig['mysql'];
let connection;

void function() {
    let host = dbObj.host;
    let username = dbObj.username;
    let password = dbObj.password;
    let database = dbObj.database;

    let mysql      = require('mysql');
    connection = mysql.createConnection({
        host     : host,
        user     : username,
        password : password,
        database : database
    });
    
    connection.connect((error) => {
        if(error){
            throw error;
        }else{
            console.log('[db] [mysql] connection success!');
        }
    });
    let sql = 'select * from user';
    let param = [];
    connection.query( sql , param , function(error,res){
        if(error){
            throw error;
        }
        return res;
    });
    return connection;
}();

let query = (sql, param) => {
    connection.query( sql , param , function(error,res){
        if(error){
            throw error;
        }
        return res;
    });
}

exports.query = query;