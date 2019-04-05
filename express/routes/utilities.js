var express = require('express');
var router = express.Router();

/* get filde link from telegram */
router.post('/getlink', async (req, res, next) =>
{
    var id = req.body.id;
    global.robot.bot.getFileLink(id)
    .then(link => {
        res.send({'link': link});
    })
    .catch(err => {
        res.send(err);
    });
    
});

// upload a file to a user and return back the resource id
router.post('/uploadtouser', async (req, res, next) =>
{
    var path = req.body.path;
    var userid = req.body.userid;
    var type = req.body.type;

    //send a message to get chat id 
    var message = await global.fn.sendMessage(userid, path).catch((e) => { console.log(e); });
    var chatid = message.chat.id;

    //send file and get res id
    var fileMsg = null;

    if(type == 'ogg') fileMsg = await global.robot.bot.sendVoice(chatid, path).catch((e) => { console.log(e); });
    else fileMsg = await global.robot.bot.sendDocument(chatid, path).catch((e) => { console.log(e); });
    
    var file_id = '';
    if(fileMsg.document) file_id = fileMsg.document.file_id;
    else if(fileMsg.audio) file_id = fileMsg.audio.file_id;
    else if(fileMsg.voice) file_id = fileMsg.voice.file_id;

    //remove messages
    global.robot.bot.deleteMessage(chatid, message.message_id).catch((e) => { console.log(e); });
    global.robot.bot.deleteMessage(chatid, fileMsg.message_id).catch((e) => { console.log(e); });

    //remove messages
    res.send({'file_id': file_id});
});

module.exports = router;