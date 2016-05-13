var url = require('url');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	var url_parts = url.parse(req.url);
	res.render("Manager.ejs");
});
module.exports=router;
