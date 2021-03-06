//factor list
let show = async function(userid, injectedText)
{
    let titles = [];
    let factors = await fn.db.factor.find({'userid':userid}).sort('-_id').limit(10).exec().then();
    
    //nothing
    if(factors.length == 0) {
        global.fn.sendMessage(userid, 'اکنون هیچ فاکتوری برای شما ثبت نشده است.');
         return;
    }

    factors.forEach(element => {
        let sym = (element.ispaid) ? fn.mstr.commerce['f_peied'] : fn.mstr.commerce['f_notpaid'];
        titles.push(sym + ' - ' + element.number);
    });
    
    fn.userOper.setSection(userid,  fn.mstr.commerce.btns_user['factor'], true);  
    let mess = (injectedText) ? injectedText : fn.mstr.commerce.btns_user['factor'];
    let back = fn.mstr.category['backtoParent'];
    let remarkup = global.fn.generateKeyboard({'custom': true, 'grid':false, 'list': titles, 'back':back}, false);
    
    global.fn.sendMessage(userid, mess, remarkup);
}

let getNextNumber = async function()
{
    let counter = await fn.db.fnumber.findOne({}).exec().then();
    if(!counter) counter = new fn.db.fnumber({'last': 99});
    
    counter.last++;
    let last = counter.last;
    await counter.save().then();

    return last;
}

let updateItems = async function(items) 
{

    // items.forEach(async item => 
    // {
    //     // item.update = function()
    //     // {
    //         let existItem = null
    //         if(item.type === 'post') 
    //             existItem = await fn.db.post.findOne({'_id': item.id}).exec().then();
            
    //         if(!existItem) {
    //             item.updated = false;
    //             return;
    //         }
    
    //         item.name = existItem.name;
    //         item.price = existItem.price;
    //         item.updated = true;
    //     //}
    // });

    // // return Promise.each(items, (item) => {
        
    // // });
    return items;
}

let create = async function(userid,  items, optionPram)
{
    let option = (optionPram) ? optionPram : {};

    //generate factor Number
    let newNumber = await getNextNumber();

    //update items
    let updatedBagitems = [];
    if(option.noupdate) updatedBagitems = items;
    else updatedBagitems = await updateItems(items);

    //get total amount and titles
    let totalAmount = 0;
    let productPrice = 0;
    let titles = '';
    updatedBagitems.forEach(item => { 
        productPrice += item.price;
        titles += '\n' + item.name;
    });
    
    totalAmount += productPrice;

    //perform coupon
    let totalPerDis = 0;
    let DisResult = await fn.m.commerce.coupon.performCoupon(userid, totalAmount, option.coupon);
    totalPerDis = DisResult.total;
    let removeids = DisResult.usedcoupons.map(item => { return item.id });
    fn.m.commerce.coupon.removeCoupon(removeids);
    
    let finalPrice = (totalPerDis) ? totalPerDis : totalAmount;
    
    // shipping -----------
    let shippingOption = fn.getModuleData('commerce', 'shipping').value;
    let shippingCost = fn.getModuleData('commerce', 'shippingCost').value;
    let shippingLable = `\n 🚚 هزینه ارسال: ${shippingCost} تومان`;
    if(shippingOption == 'true') finalPrice += parseInt(shippingCost);
    // --------------------
    
    //prepare messag
    let mess = '🛍 ' + 'فاکتور شماره ' + newNumber + '\n' +
    '<code>ـــــــــــــــــ' +
    titles + '\n' +
    'ـــــــــــــــــ' + '\n' +
    'قیمت محصولات: ' + productPrice + ' تومان' + '</code>';
    
    mess += (shippingOption == 'true') ? shippingLable + '\n' : '';
    mess += (totalPerDis) ? '💶 ' + 'تخفیف: ' + DisResult.amount + ' تومان'+ '\n' : '';
    
    mess += 'جمع قیمت: ' + finalPrice + ' تومان';
    

    //create
    let newFactor = await new fn.db.factor({
        'number'    : newNumber,
        'userid'    : userid,
        'date'      : fn.time.gettime(),
        'desc'      : mess,
        'products'  : updatedBagitems,
        'amount'    : finalPrice,
    }).save().then();
    
    fn.m.commerce.user.bag.clear(userid);
    
    if(option.show == false) {}
    else showFactor(userid,  {'factor': newFactor});

    // analytic
    let eventCategory = 'commerce';
    let eventAction = `create factor`;
    let eventLabel = `number: ${newNumber} | price: ${finalPrice}`;
    fn.m.analytic.trackEvent(userid, eventCategory, eventAction, eventLabel);
    
    return newFactor;
}

let getPaied = async function(userid,  fid)
{
    let factor = await fn.db.factor.findOne({'_id': fid}).exec().then();
    if(!factor) return;
    factor.ispaid = true;
    await factor.save().then();

    //add product to myProduct array
    console.log('add product to myProduct array');
    let bag = await fn.m.commerce.user.bag.get(userid);
    factor.products.forEach(product => { bag.boughtItems.push(product) });
    await bag.save().then();

    //show factor
    showFactor(userid,  {'factor': factor});

    //emit success peyment
    fn.eventEmitter.emit('successPeyment', factor);
    fn.m['commerce'].showFactor(null, factor.number, {'alertoadmins': true});
    
    // //send payment messages
    // factor.products.forEach(element => {
    //     //peform specyfic action after peyment according to product type
    //     let types = fn.mstr.commerce.factorTypes;
    //     //bot subscription
    //     if(element.type === types['post']){

    //     }
    // });
    
    //analytic
    fn.m.analytic.trackItem(userid, factor.number, factor.amount);

    // analytic
    let eventCategory = 'commerce';
    let eventAction = `paid factor`;
    let eventLabel = `number: ${factor.number} | price: ${factor.amount}`;
    fn.m.analytic.trackEvent(userid, eventCategory, eventAction, eventLabel);
}

let sendPaymentMessage = async function(userid,  productid)
{
    // let user = await fn.userOper.checkProfile(userid);
    // let product = await fn.db.product.findOne({'_id': productid}).exec().then();
    // fn.m.dynamicProduct.user.showProduct(userid, product, user, {'paidMessageTrigger': true});
}

let showfactorItems = async function(userid,  id)
{
    // let factor = await fn.db.factor.findOne({'_id':id}).exec().then();
    // if(!factor) return;

    // //
    // factor.products.forEach(item => { 
    //     recognizeItemAndShow(userid, item.type, item.id); 
    // });
};

let recognizeItemAndShow = async function(userid, type, productid)
{
        // let type_product = fn.mstr.dynamicProduct['modulename'];
        // let type_advice = fn.mstr.advice['modulename'];

        // //product
        // if(type = type_product) {
        //     let product = await fn.db.product.findOne({'_id':productid}).exec().then();
        //     if(product) fn.m.dynamicProduct.user.showProduct(userid, product);
        // }
        // //advice
}

let showFactor = async function(userid,  option)
{
    let botusername = global.robot.username;
    let factor = null;

    //get factor
    if(option.factor) factor = option.factor;
    else if(option.id) 
        factor = await fn.db.factor.findOne({'_id': option.id}).exec().then();

    if(!factor) return;
    
    //peyment
    let query = fn.mstr.commerce.query;
    let detailArr = [];


    //detail item
    //detailArr.push([ {'text': 'نمایش جزئیات آیتم های فاکتور', 'callback_data': fn_detail} ]);

    //show
    let paidText = (factor.ispaid) ? '✅ ' + 'پرداخت شد' : '🚫 ' + 'پرداخت نشده است.'
    let mess = factor.desc + '\n\n' + paidText;
    mess += '\n\n @' + botusername;

    //gates
    if(!factor.ispaid)
    {
        //controller
        let fn_getpaid = query['commerce'] + '-' + query['user'] + '-' + query['getpaid'] + '-' + factor.id;
        //let fn_delete = query['commerce'] + '-' + query['user'] + '-' + query['deletefactor'] + '-' + factor.id;
        let fn_refresh = query['commerce'] + '-' + query['user'] + '-' + query['refreshLink'] + '-' + factor.id;
        let fn_tutorial = query['commerce'] + '-' + query['user'] + '-' + query['tutorial'];
        
        let testpeymentBtn = {'text': 'پرداخت آزمایشی', 'callback_data': fn_getpaid};
        let refreshBtn = {'text': '🔄دریافت لینک جدید پرداخت', 'callback_data': fn_refresh};
        let tutorialBtn = {'text': '🎬 راهنمای خرید اشتراک', 'callback_data': fn_tutorial};
        //let deleteBtn = {'text': '❌', 'callback_data': fn_delete};
        //let firstRow = [deleteBtn, refreshBtn];

        // test payment
        let testpaymentOption = fn.getModuleData('commerce', 'testpayment');
        let tpoValue = (testpaymentOption) ? testpaymentOption.value : '...';
        let testpayment = (tpoValue == 'true') ? true : false;
        if(testpayment) detailArr.push([testpeymentBtn])

        // tutorial post
        let tutorialPostOption = fn.getModuleData('commerce', 'tutorialPost');
        let tutorialPost = (tutorialPostOption) ? tutorialPostOption.value : null;
        if(tutorialPost != null) detailArr.push([tutorialBtn]);

        // refresh link
        detailArr.push([refreshBtn]);
    }
    
    mess += '\n\n' + fn.mstr['commerce'].mess.gatesNote;
    
    //sned
    let msg = await global.fn.sendMessage(userid, mess, {
        'parse_mode':'HTML',
        "reply_markup" : {"inline_keyboard" : detailArr.reverse()}
    });

    if(!factor.ispaid) getPayLinks(msg, factor, detailArr.reverse());
}

async function getPayLinks(msg, factor, detailArr)
{
    let idpayIsActive = false;
    let nextpayIsActive = false;

    // get gates activation status
    try {
        let getway_idpay = fn.getModuleData('commerce', 'getway_idpay');    
        let getway_idpayValue = (getway_idpay) ? getway_idpay.value : '...';
        idpayIsActive = (getway_idpayValue == 'true') ? true : false;
        
        let getway_nextpay = fn.getModuleData('commerce', 'getway_nextpay');
        let getway_nextpayValue = (getway_nextpay) ? getway_nextpay.value : '...';
        nextpayIsActive = (getway_nextpayValue == 'true') ? true : false;
        
    } catch (error) {
        
    }

    // get idpay link
    if(idpayIsActive)
    {
        let idPayLink = await fn.m.commerce.gates.idpay.getPaylink(factor);
        if(idPayLink) addPayButtons('✅ پرداخت با درگاه شماره 1', idPayLink, detailArr, msg, true);
    }

    // get nextpay link
    if(nextpayIsActive)
    {
        let price = factor.amount;
        let nextpaylink = await fn.m.commerce.gates.nextpay.getPaylink(factor.number, price);
        if(nextpaylink) addPayButtons('✅ پرداخت با درگاه شماره 2', nextpaylink, detailArr, msg, false);
    }
}

function addPayButtons(lable, link, detailArr, msg, first)
{
    let gateRow = [{'text': lable, 'url': link}];

    newDetailArr = [];
    
    // order gates by custom
    if(first)
    {
        detailArr.push(gateRow);
        newDetailArr = detailArr;
    }
    else {
        let thereIsGateOne = false;
        if(detailArr[detailArr.length-1][0].text == '✅ پرداخت با درگاه شماره 1')
            thereIsGateOne = true;
        else detailArr.push(gateRow);

        for (let i = 0; i < detailArr.length; i++) 
        {
            const oldRow = detailArr[i];
            newDetailArr.push(oldRow);

            if(thereIsGateOne && i == detailArr.length-2) 
                newDetailArr.push(gateRow);
        }

        newDetailArr = newDetailArr.reverse();
    }

    fn.editMessageReplyMarkup(
        {"inline_keyboard" : newDetailArr}, 
        {
            'chat_id'   : msg.chat.id,
            'message_id': msg.message_id,
        }
    );
}

let routting = function(message, speratedSection, user)
{
    let text = message.text;

    //show list
    if(text === fn.mstr.commerce.btns_user['factor']) show(message.from.id);

    //show a factor
    else {
        let fnumber = null; 
        try {
            fnumber = parseInt(text.split(' - ')[1]);
        } catch (error) {
            
        }
        
        if(!fnumber) {show(message.from.id,  fn.mstr.commerce.mess['notafactor']); return;}

        fn.db.factor.findOne({'number': fnumber}).exec((e, factor) => {
            if(factor) showFactor(message.from.id,  {'factor': factor});
            else show(message.from.id,  fn.mstr.commerce.mess['notafactor']);
        });
    }
}

global.fn.eventEmitter.on('successPeyment', async (factor) => 
{
    let user = await global.fn.userOper.checkProfile(factor.userid);

    //++successPeyment of user
    let index = null;
    user.datas.forEach((data, i) => {
        if(data.name === 'successPeyment') 
            index = i;
    });

    //add if sp doesn't exist
    if(index === null)
    {
        user.datas.push({'name': 'successPeyment', 'value': 0});
        index = user.datas.length-1;
    }

    //++
    let counter = parseInt(user.datas[index].value);
    counter += 1;
    user.datas[index].value = counter;

    //save
    await user.save().then();
    //emit after
    global.fn.eventEmitter.emit('affterSuccessPeyment', factor);
});

module.exports = { routting, show, showFactor, create, showfactorItems, getPaied }