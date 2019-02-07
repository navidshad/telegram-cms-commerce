var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', async function(req, res, next)
{
  var params = req.params
  var user = await global.fn.db.user.findOne({'userid': params.id}).exec().then();
  let isSubscribe = (user) ? true : false;
  res.send({'isSubscriber': isSubscribe});
});

module.exports = router;
