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
}();

let getConnection = async function(){
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if(error){
                reject(error);
            }else{
                resolve(connection);
            }
        })
    })
}

let query = async function( sql, param ) {
    try{
        let connection = await getConnection();
        return new Promise(function (resolve,reject) {
            connection.query(sql, param, function(res){
                    resolve(res);
                });
        });
    }catch(e){
        console.log(e);
    }
    // return res;
}
  

// let query = (sql, param) => {
//     // let result ;
//     pool.getConnection(function(error, connection){
//         connection.query( sql , param , function(error,res){
//             if(error){
//                 throw error;
//             }else{
//                 return res;
//             }
//         });
//         connection.release();
//     })
//     // return result;
// }

exports.query = query;