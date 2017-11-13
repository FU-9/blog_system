const mysql = require('mysql');
module.exports = {
	db(){
		return (
			mysql.createConnection({
				host:'47.95.11.102',
				user:'root',
				password:"zhaowang123",
				database:"FU-9"
			})
		)
	}
}
