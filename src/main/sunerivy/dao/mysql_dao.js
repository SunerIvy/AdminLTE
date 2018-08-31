let {dbConfig} = require('../tool/config_util');
let dbObj = dbConfig['mysql'];
let connection;
let pool;

void function() {
    let host = dbObj.host;
    let username = dbObj.username;
    let password = dbObj.password;
    let database = dbObj.database;

    let mysql      = require('mysql');
    pool = mysql.createPool({
        host     : host,
        user     : username,
        password : password,
        database : database
    });

    // connection.connect((error) => {
    //     if(error){
    //         throw error;
    //     }else{
    //         console.log('[db] [mysql] connection success!');
    //     }
    // });
}();

let query = (sql, param) => {
    let result ;
    pool.getConnection(function(error, connection){
        connection.query( sql , param , function(error,res){
            if(error){
                throw error;
            }
            result = res;
        });
        connection.release();
    })
    return result;
}

exports.query = query;