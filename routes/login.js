var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	db.query("INSERT INTO `user_table` (`ID`,`username`,`password`) VALUES(0,'zw1','zhaowang123');",(err,data)=>{
	if(err){
		console.log('出错了')
	}else{
		console.log(data)
	}
})
  res.send('respond with a resource');
});

module.exports = router;
