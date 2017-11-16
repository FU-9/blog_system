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
				console.log('出错了')
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
						console.log("出错了")
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
	if(!ReceivedData['user_id']){
		res.send({code:1,data:{},msg:"user_id为空"})
	}else{
		linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ ReceivedData['user_id'] +";",(err,data)=>{
			if(err){
				console.log("出错了")
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
	}
})

/*----------------------------删除分类列表----------------------------------*/
/*ps:article_class_id匹配不到未作处理*/
{
	let articleArr,ReceivedData;
	router.get("/delete_article_class",(req,res,next)=>{
		ReceivedData = req.query;
		if(!ReceivedData['user_id']){
			res.send({code:1,data:{},msg:"user_id为空"})
		}else if(!ReceivedData['article_class_id']){
			res.send({code:1,data:{},msg:"article_class_id为空"})
		}else{
			linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ ReceivedData['user_id'] +";", (err,data)=>{
				if(err){
					res.send({code:1,data:{},msg:"数据库链接失败"})
				}else{
					articleArr = eval("("+data[0]['article']+')');
					articleArr.forEach((item,index)=>{
						if(item['article_class_id']==ReceivedData['article_class_id']){
							articleArr.splice(index,1);
							next();
						}
					});
				}
			})
		}
	});
	router.get("/delete_article_class",(req,res)=>{
		articleArr = JSON.stringify(articleArr)
		linkDB.query("UPDATE `article_table` SET article=' "+articleArr+" '  WHERE user_id="+ReceivedData['user_id']+";",(err,updata)=>{
			if(err){
				res.send({code:1,data:{},msg:"数据库链接失败"})
			}else{
				res.send({code:0,data:{},msg:"成功"});
			}
		})
	})
}
/*----------------------------新增文章----------------------------------*/
router.get('/add_article',(req,res)=>{
	let ReceivedData = req.query;
	if(!ReceivedData['user_id']){
			res.send({code:1,data:{},msg:"user_id为空"})
	}else if(!ReceivedData['article_class_id']){
		res.send({code:1,data:{},msg:"article_class_id为空"})
	}else if(!ReceivedData['title']){
		res.send({code:1,data:{},msg:"title为空"})
	}else if(!ReceivedData['content']){
		res.send({code:1,data:{},msg:"content为空"})
	}else{
		linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ ReceivedData['user_id'] +";", (err,data)=>{
			if(err){
				res.send({code:1,data:{},msg:"数据库链接失败"})
			}else{
				articleArr = eval("("+data[0]['article']+')');
				articleArr.forEach((item,index)=>{
					if(item['article_class_id']==ReceivedData['article_class_id']){
						item['article_list'].push(
							{
								article_id:item['article_list'].length==0?0:item['article_list'][item['article_list'].length-1]['article_id']+1,
								title:ReceivedData['title'],
								content:ReceivedData['content'],
								look:0
							}
						)
						articleArr = JSON.stringify(articleArr)
						linkDB.query("UPDATE `article_table` SET article=' "+articleArr+" '  WHERE user_id="+ReceivedData['user_id']+";",(err,updata)=>{
							if(err){
								res.send({code:1,data:{},msg:"数据库链接失败"})
							}else{
								res.send({code:0,data:{},msg:"成功"});
							}
						})
					}
				});
			}
		})
	}
})
/*----------------------------获取文章详情----------------------------------*/
router.get('/get_article_detail',(req,res)=>{
	let ReceivedData = req.query;
	if(!ReceivedData['user_id']){
		res.send({code:1,data:{},msg:"user_id为空"});
	}else if(!ReceivedData['article_id']){
		res.send({code:1,data:{},msg:"article_id为空"});
	}else if(!ReceivedData['article_class_id']){
		res.send({code:1,data:{},msg:"article_class_id为空"});
	}else{
		let updateData;
		linkDB.query("SELECT * FROM `article_table` WHERE user_id=" +ReceivedData['user_id'] + ";",(err,data)=>{
			if(err){
				res.send({code:1,data:{},msg:"数据库链接失败"})
			}else{
				articleArr = eval("("+data[0]['article']+')');
				articleArr.forEach((item,index)=>{
					if(item['article_class_id']==ReceivedData['article_class_id']){
						updateData = item;
					}
				});
				updateData['article_list'].forEach((item,index)=>{
					if(item['article_id']==ReceivedData['article_id']){
						item['look']+=1;
						articleArr = JSON.stringify(articleArr)
						linkDB.query("UPDATE `article_table` SET article=' "+articleArr+" '  WHERE user_id="+ReceivedData['user_id']+";",(err,updata)=>{
							if(err){
								res.send({code:1,data:{},msg:"数据库链接失败"})
							}else{
								res.send({code:0,data:item,msg:"成功"})
							}
						})
					}
				})
			}
		})
	}
});
/*----------------------------获取单条分类所有文章列表----------------------------------*/
router.get('/get_artile_class_detail',(req,res)=>{
	let ReceivedData = req.query;
	if(!ReceivedData['user_id']){
		res.send({code:1,data:{},msg:"user_id为空"});
	}else if(!ReceivedData['article_class_id']){
		res.send({code:1,data:{},msg:"article_class_id为空"});
	}else{
		linkDB.query("SELECT * FROM `article_table` WHERE user_id=" +ReceivedData['user_id'] + ";",(err,data)=>{
			if(err){
				res.send({code:1,data:{},msg:"数据库链接失败"})
			}else{
				articleArr = eval("("+data[0]['article']+')');
				articleArr.forEach((item,index)=>{
					if(item['article_class_id']==ReceivedData['article_class_id']){
						res.send({code:0,data:item['article_list'],msg:"成功"})
					}
				});
			}
		})
	}
});
module.exports = router;
