const express = require('express');
const router = express.Router();
var JFUM = require('jfum');
const bodyParser = require('body-parser');
const DB = require('./linkDB');
const linkDB = DB.db();

/*----------------------------获取分类列表----------------------------------*/
router.get("/get_article_class",(req,res)=>{
	let ReceivedData = req.query;
	if(!ReceivedData['user_id']){
		res.send({code:1,data:{},msg:"user_id为空"})
	}else{
		linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ ReceivedData['user_id'] +";",(err,data)=>{
			if(err){
				res.send({code:1,data:{},msg:"数据库链接失败"})
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
					let active = articleArr.filter((item,index)=>{
						return item['article_class_id']=ReceivedData['article_class_id']
					});
					if(active.length==0){
						res.send({code:0,data:{},msg:"该分类不存在"})
					}else{
						articleArr.forEach((item,index)=>{
							if(item['article_class_id']==ReceivedData['article_class_id']){
								articleArr.splice(index,1);
								next();
							}
						});
					}
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
				let active = articleArr.filter((item,index)=>{
					return item['article_class_id']=ReceivedData['article_class_id']
				});
				if(active.length==0){
						res.send({code:0,data:{},msg:"article_class_id匹配不到"})
				}else{
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
let judge = () => {
	return {
		user_id(req,res,next){
			if(!req.query.user_id){
				res.send({code:1,data:{},msg:"缺少参数user_id"})
			}else if(req.query.user_id==""){
				res.send({code:1,data:{},msg:"user_id为空"})
			}else{
				linkDB.query("SELECT * FROM `user_table` WHERE id='"+req.query.user_id +"' ;",(err,data)=>{
					if(err){
						res.send({code:1,data:{},msg:"数据库链接失败"})
					}else{
						if(data.length>0){
							next()
						}else{
							res.send({code:1,data:{},msg:"该用户不存在"})
						}
					}
				})
			}
		}
	}
}
let judge_fun = judge()
/*----------------------------创建分类----------------------------------*/
//判断用户id是否合法
router.get('/add_article_class',judge_fun.user_id);
//判断是否携带add_article_class参数
router.get("/add_article_class",(req,res,next)=>{
	if(!req.query.article_class_name){
		res.send({code:1,data:{},msg:"缺少参数article_class_name"});
	}else{
		next();
	};
});
//查询该用户数据
router.get("/add_article_class",(req,res,next)=>{
	let ReceivedData = req.query
	linkDB.query("SELECT * FROM `article_table` WHERE user_id="+ReceivedData['user_id']+";",(err,data)=>{
		if(err){
			res.send({code:1,data:{},msg:"数据库链接失败"})
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
					res.send({code:1,data:{},msg:"数据库链接失败"})
				}else{
					res.send({'code':0,data:{},msg:"成功"})
				}
			})
		}
	})
})

router.post("/set_icon",(req,res)=>{
	res.send({code:0})
})
module.exports = router;
