const mysql = require('mysql');

class MysqlHelper {
    constructor(mysqlConfig) {
        this.mysqlConfig = mysqlConfig ;
        this.pool = mysql.createPool(this.mysqlConfig) ;
    }

    getConnection () { //从连接池中获得连接

        return new Promise ((resolve , reject)=> {
            this.pool.getConnection(function(err, connection) {
                if (!err) {
                    resolve (connection) ;
                } else {
                    reject (err) ;
                } 
               
            });
        }) ;

    }

    async dbOp(sql, sqlParam) {
        
        const connection = await this.getConnection() ;
        return  new Promise((resolve, reject) => {
            connection.query(sql, sqlParam, (err, result) => {
                if (err) {
                    reject(err) ;
                } else {
                    resolve(result) ;
                }
                this.pool.releaseConnection(connection) ;
            }) ;
        }) ;

    }

    async beginTrans() {

        let connection = await this.getConnection() ;
        return new Promise((resolve, reject) => {
            connection.beginTransaction((err) => {
                if (err) {
                    reject(err) ;
                } else {
                    resolve(connection) ;
                }
            });
        });

    }

    dbOpInTrans(sql, sqlParam, connection) {
        return new Promise( (resolve, reject) => {
            connection.query(sql, sqlParam, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }) ;
    }

    commit(connection) {

        return new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err) {
                    reject(err);
                } 
                this.pool.releaseConnection(connection);
            });
        });
    }

    rollback(connection) {
        return  new Promise((resolve, reject) => {
            connection.rollback((err) => {
                if (err) {
                    reject(err);
                } 
                this.pool.releaseConnection(connection);
            });
        });
    }
    
}

module.exports = MysqlHelper;