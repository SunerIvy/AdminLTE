let sqliteDao = require('../dao/sqlite_dao');
let mysqlDao = require('../dao/mysql_dao');
let baseDao = require('../dao/base_dao');

let dbType = baseDao.dbType;

/**
 * query the result
 * @param {String} sql 
 * @param {Array} param 
 */
let query = (sql, param) => {
    if('sqlite' == dbType){
        return sqliteDao.get(sql, param);
    } else if('mysql' == dbType){
        
    }
}

