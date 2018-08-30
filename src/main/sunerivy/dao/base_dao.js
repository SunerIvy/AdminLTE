let dbConfig = require('../../../resource/db.json');
let dbType = dbConfig.dbType;
let dbObj = dbConfig[dbType];

let connection;
let getConnection = function(){
    if('sqlite' == dbType){
        let path = dbObj.path;
        let sqlite = require('sqlite3');
        connection = new sqlite.Database(path, function(e){
            if(e) {
                throw e;
            }
        })
    }else if('mysql' == dbType){
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
        
        connection.connect();
    }

    return connection;
}

exports.getConnection = getConnection;