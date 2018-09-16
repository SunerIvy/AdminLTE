let opDao = require('../main/sunerivy/dao/base_dao');

let getUserByLoginName = async (loginName) => {
    let sql = 'select * from t_user where login_name = ?';
    return await opDao.query(sql, [loginName]);
}