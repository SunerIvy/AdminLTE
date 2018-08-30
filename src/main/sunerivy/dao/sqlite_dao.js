let baseDao = require('./base_dao');
let connection = baseDao.getConnection();

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
exports.get = get;