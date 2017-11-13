const mysql = require('mysql');
//链接数据库
let db = mysql.createConnection({
	host:'47.95.11.102',
	user:'root',
	password:"zhaowang123",
	database:"FU-9"
});