const express = require('express');
const router = express.Router();
const DB = require('./linkDB');
const linkDB = DB.db();
/*----------------------------创建分类----------------------------------*/
router.get("/add_article_class",(req,res)=>{
	let ReceivedData = req.query;
	if(ReceivedData['user_id']==""){
		res.send({'code':1,data:{},msg:"用户id为空"})
	}else if(ReceivedData['article_class_name']==""){
		res.send({'code':1,data:{},msg:"article_class_name为空"})
	}else{
		linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ReceivedData['user_id']+";",(err,data)=>{
			if(err){
				res.send({'code':1,data:{},msg:"数据库链接失败"});
			}else{
				let articleArr = eval("("+data[0]['article']+')');
				articleArr.push({
					'article_class_id':articleArr.length===0?0:articleArr[articleArr.length-1]['article_class_id']+1,
					'article_class_name':ReceivedData['article_class_name'],
					'icon_url':ReceivedData['icon_url']?ReceivedData['icon_url']:null,
					'article_list':[]
				});
				articleArr = JSON.stringify(articleArr)
				linkDB.query("UPDATE `article_table` SET article=' "+articleArr+" '  WHERE user_id="+ReceivedData['user_id']+";",(err,uploadData)=>{
					if(err){
						res.send({'code':1,data:{},msg:"数据库链接失败"});
					}else{
						res.send({'code':0,data:{},msg:"成功"})
					}
				})
			}
		})
	}
})
/*----------------------------获取分类列表----------------------------------*/
router.get("/get_article_class",(req,res)=>{
	let ReceivedData = req.query;
	linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ ReceivedData['user_id'] +";",(err,data)=>{
		if(err){
			res.send({'code':1,data:{},msg:"数据库链接失败"});
		}else{
			let articleArr = eval("("+data[0]['article']+')');
			if(articleArr.length===0){
				res.send({code:0,data:[],msg:"成功"})
			}else{
				let backData = [];
				articleArr.forEach((item,index)=>{
					backData.push({
						icon_url:item['icon_url'],
						article_class_name:item['article_class_name'],
						article_class_id:item['article_class_id']
					})
				})
				res.send({code:0,data:[...backData],msg:"成功"})
			}
		}
	})
})

module.exports = router;
