let dbUtl = require('../main/sunerivy/dao/base_dao');

async function getData(){
    let row = await dbUtl.query('select * from t_user');
    console.log(row);
}

getData();

// let dbConfig = require('../resource/db.json');
// let dbObj = dbConfig['mysql'];
// let host = dbObj.host;
// let username = dbObj.username;
// let password = dbObj.password;
// let database = dbObj.database;
// let mysql      = require('mysql');
// connection = mysql.createConnection({
//     host     : host,
//     user     : username,
//     password : password,
//     database : database
// });

// connection.connect((error) => {
//     if(error){
//         throw error;
//     }else{
//         console.log('[db] [mysql] connection success!');
//     }
// });
// let sql = 'select * from user';
// let param = [];
// connection.query( sql , param , function(error,res){
//     if(error){
//         throw error;
//     }
//     return res;
// });
// console.log(connection);