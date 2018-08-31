let {dbConfig} = require('../tool/config_util');
let dbType = dbConfig.dbType;

let opDao ;
if("sqlite" == dbType){
    opDao = require('../dao/sqlite_dao');
}else if('mysql' == dbType){
    opDao = require('../dao/mysql_dao');
}

let getConnection = () => {
    return opDao.getConnection();
}

/**
 * query the result
 * @param {String} sql 
 * @param {Array} param 
 */
let query = (sql, param) => {
    return opDao.query(sql, param);
}

exports.getConnection = getConnection;
exports.query = query;