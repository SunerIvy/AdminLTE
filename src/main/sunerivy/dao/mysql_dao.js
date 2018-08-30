let baseDao = require('./base_dao');
let connection = baseDao.getConnection();

let query = (sql, param) => {
    connection.query( sql , param , function(error,res){
        connection.release();
        if(error){
            reject(error);
            return;
        }
        resolve(res);
    });
}

exports.query = query;