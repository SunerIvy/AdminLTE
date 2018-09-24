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

let getConnection = async function() {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if(error){
                reject(error);
            }else{
                resolve(connection);
            }
        })
    })

    // return await promiseConnection;
}

let query = async function( sql, values ) {
    try{
        let connection = await getConnection();
        
        return new Promise((resolve, reject) => {
            connection.query(sql, values, ( err, rows) => {

                if ( err ) {
                  reject( err )
                } else {
                  resolve( rows )
                }
                // 结束会话
                connection.release()
            });
        })
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