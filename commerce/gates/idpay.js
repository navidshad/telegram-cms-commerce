/*
    IDPay gatway
    help: https://idpay.ir/web-service/v1.1/index.html?javascript#cee8b80267
*/

let rp = require('request-promise');

function getOptions(body, url)
{
    let port = global.config.serverport;
    body.callback = global.config.domain + ':' + port + '/returnback/idpay';

    let rOptions = {
        method: 'POST',
        uri: url,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'x',
            //'X-SANDBOX': 1,
        },
        'body': body,
        // Automatically stringifies the body to JSON
        json: true
    }

    // get idpay module detail
    var idPayApikey = fn.getModuleData(fn.mstr.commerce['modulename'], 'idpayapikey');
    idPayApikey = (idPayApikey) ? idPayApikey.value : '...';

    rOptions.headers["X-API-KEY"] = idPayApikey;

    return rOptions;
}

async function createTransaction(userid, fnumber, amount)
{
    let url = 'https://api.idpay.ir/v1.1/payment';
    let body = {
        'order_id': fnumber,
        'amount': amount,
        'name': userid,
    };

    let option = getOptions(body, url);

    return rp(option)
    .catch((error) => { 
        console.log('idpay error', error); 
        return error;
    });
}

async function verifyTransaction(id, order_id)
{
    let url = 'https://api.idpay.ir/v1.1/payment/verify';
    let body = {
        'id': id,
        'order_id': order_id,
    };

    let option = getOptions(body, url);

    return rp(option).catch((error) => { console.log('idpay error', error); });
}

async function getTransaction(id, fnumber)
{
    let url = 'https://api.idpay.ir/v1.1/payment/inquiry';
    let body = {
        'id': id,
        'order_id': fnumber,
    };

    let option = getOptions(body, url);

    return rp(option).catch((error) => { console.log('idpay error', error); });
}

function createSession(detail, fnumber)
{
    detail.order_id = fnumber;
    return new global.fn.db.idpay(detail).save().then();
}

async function getPaylink(factor)
{
    let session;
    
    let transaction = await createTransaction(factor.userid, factor.number, factor.amount*10);
    if(transaction.id) 
        session = await createSession(transaction, factor.number);

    if(session) return session.link;
    else return null;
}

module.exports = {
    createTransaction,
    verifyTransaction,
    getTransaction,
    getPaylink,
}
