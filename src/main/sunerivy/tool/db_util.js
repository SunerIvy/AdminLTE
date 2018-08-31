let getConnection = () => {
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
    
    connection.connect((error) => {
        if(error){
            throw error;
        }else{
            console.log('[db] [mysql] connection success!');
        }
    });
    return connection;
}