var express = require('express');
var router = express.Router();

router.post('/nextpay', async (req, res, next) =>
{
    console.log('a request to nextpay callback', req.body);
    var body = req.body;
    if(!body.trans_id || !body.order_id) {
        res.send('اطلاعات محصول اشتباه است.');
        return;
    }

    //get nextpay session
    var nextpaySession = await global.fn.db.nextpay
    .findOne({ 'order_id'  : body.order_id, 'trans_id'  : body.trans_id }).exec().then();
    
    //no session found
    if(!nextpaySession) {
        res.send('در ذخیره سازی اطلاعات محصول، قبل از پرداخت مشکلی پیش آماده است. لطفا اطلاعات زیر را به بخش پشتیبانی ربات ارسال کنید. \n' + body);
        return;
    }

    //get nextpay api key
    var nextpayapikey = fn.getModuleData(fn.mstr.commerce['modulename'], 'nextpayapikey');
    nextpayapikey = (nextpayapikey) ? nextpayapikey.value : '...';

    //validate purchase
    var validate = await global.fn.m.commerce.gates.nextpay
        .VerifyPayment(body.trans_id, body.order_id, nextpaySession.amount, nextpayapikey);
    //console.log('validate', validate);
    var code = validate[0].PaymentVerificationResult.code; 

    //not purched
    if(code !== 0){
        res.send('مشکل در پرداخت، شماره خطا: ' + code);
        return;
    }
    
    //seccess payment
    var factor = await global.fn.db.factor.findOne({'number':body.order_id}).exec().then();
    global.fn.m.commerce.user.factor.getPaied(factor.userid, factor.id);
    res.send('پرداخت با موفقیت انجام شد.');
});

router.get('/nextpay', async (req, res, next) =>
{
    console.log('a request to nextpay callback');
    res.send('باید از درگاه بانکی به این صفحه منتقل شوید.');
});

router.post('/idpay', async (req, res, next) =>
{
    console.log('a request to idpay callback', req.body);
    let body = req.body;
    if(!body.status || !body.track_id) {
        res.send('اطلاعات محصول اشتباه است.');
        return;
    }

    //get idpay session
    var session = await global.fn.db.idpay.findOne({'id'  : body.id}).exec().then();
    
    //no session found
    if(!session) {
        res.send('در ذخیره سازی اطلاعات محصول، قبل از پرداخت مشکلی پیش آماده است. لطفا اطلاعات زیر را به بخش پشتیبانی ربات ارسال کنید. \n' + body);
        return;
    }

    // varify transaction
    let result = await global.fn.m.commerce.gates.idpay.verifyTransaction(body.id, body.order_id);

    if(!result || result.status != 100)
    {
        res.send('مشکل در پرداخت، شماره خطا: ' + result);
        return;
    }
    
    //seccess payment
    var factor = await global.fn.db.factor.findOne({'number':body.order_id}).exec().then();
    global.fn.m.commerce.user.factor.getPaied(factor.userid, factor.id);
    res.send('پرداخت با موفقیت انجام شد.');
});

router.get('/idpay', async (req, res, next) =>
{
    console.log('a request to idpay callback');
    res.send('باید از درگاه بانکی به این صفحه منتقل شوید.');
});
module.exports = router;
