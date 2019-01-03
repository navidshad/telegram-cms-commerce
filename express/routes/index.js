var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) 
{
  let shopName = global.fn.getModuleData('commerce', 'shopName').value || '';
  let description = global.fn.getModuleData('commerce', 'browserDescription').value || '';
  let rules = global.fn.getModuleData('commerce', 'browserRules').value || '';
  
  let detail = {
    title : shopName,
    'description': description.split('\n'),
    'rules': rules.split('\n'),
  };
  res.render('payFactor', detail);
});

router.post('/buyfactor', async (req, res, next) =>
{
  let result = {};
  let body = req.body;
  
  let userid = parseInt(body.userid);
  let factorid = parseInt(body.factorid);
  
  if(isNaN(userid)) userid = 0;
  if(isNaN(factorid)) factorid = 0;
  
  console.log(body);
  
  // check userid
  let usercount = await global.fn.db.user.count({'userid': userid}).exec().then();
  let factor = await global.fn.db.factor.findOne({'number': factorid}).exec().then();
  
  if(!usercount)
  {
    result = {'status':'fail', 'message': 'شماره کاربری در سیستم ثبت نشده است'};
    res.send(result);
  }
  
  else if (!factor)
  {
    result = {'status':'fail', 'message': 'شناسه فاکتور اشتباه است'};
    res.send(result);
  }
  
  else {
    let nextpaylink = await fn.m.commerce.user.factor.getPayLink(factor);
    result = {'status':'success', 'link': nextpaylink};
    res.send(result);
  }
});

module.exports = router;
