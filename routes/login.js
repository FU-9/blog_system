const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const DB = require('./linkDB');
const linkDB = DB.db();
/*注册 */
router.use('/register',bodyParser.urlencoded({}))
router.post('/register', (req, res, next)=>{
	let ReceivedData = req.body;
	if(!ReceivedData.username){
		 res.send({'code':'1','data':{},'msg':"用户名为空"});
	}else if(!ReceivedData.password){
		res.send({'code':'1','data':{},'msg':"密码为空"});
	}else{
		linkDB.query("SELECT * FROM `user_table` WHERE username='"+ ReceivedData.username +"' ;",(err,data)=>{
			if(err){
				res.send({'code':1,data:{},msg:"数据库链接失败"});
			}else{
				if(data.length===0){
					linkDB.query("INSERT INTO `user_table` (`ID`,`username`,`password`) VALUES(0,'"+ ReceivedData.username +"','"+ ReceivedData.password +"');",(err,data)=>{
						if(err){
							res.send({'code':1,data:{},msg:"数据库链接失败"});
						}else{
							linkDB.query("INSERT INTO `article_table` (`user_id`,`article`) VALUES("+ data.insertId +",'[]');",(err,data)=>{
								if(err){
									res.send({'code':1,data:{},msg:"数据库链接失败"});
								}else{
									res.send({'code':'0','data':{},'msg':"成功"});
								}
							})
			  				
						}
					})
				}else{
					res.send({'code':'1','data':{},'msg':"该用户已被注册"});
				}
			}
		})
	}
});
/*登录*/
router.use('/login',bodyParser.urlencoded({}))
router.post('/login',(req,res)=>{
	let ReceivedData = req.body;
	linkDB.query("SELECT * FROM `user_table` WHERE username='"+ ReceivedData.username +"' ;",(err,data)=>{
		if(err){
			res.send({'code':1,data:{},msg:"数据库链接失败"});
		}else{
			if(data.length===0){
				res.send({'code':'1','data':{},'msg':"该用户名未注册"});
			}else{
				if(ReceivedData.username==data[0].username&&ReceivedData.password==data[0].password){
					res.send({'code':'0','data':{'user_id':data[0]['ID']},'msg':"登录成功"});
				}else{
					res.send({'code':"1",data:{},'msg':"用户名或密码错误"})
				}
			}
		}
	})
})
module.exports = router;
