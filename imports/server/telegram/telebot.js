// import { dialogFlow } from "./dialogFlow.js";
import {
    callDialogFlow
} from '../dialogflow/api'
const TeleBot = require('telebot')

const telegramKey = Meteor.settings.TELEGRAM_BOT_API.key;
const bot = new TeleBot(telegramKey)
bot.on('text', (msg) => {
    console.log(`Mensaje de telegram : ${JSON.stringify(msg)}`);
    // Meteor.call("addIncomingMsgFromTelegram", msg.text, 'telegram', msg.from.id, msg.chat.id)
    callDialogFlow(msg.text, msg.chat.id)
        .then(response => msg.reply.text(`Ok ${msg.from.first_name}. Gastaste ${response.parameters.costo} en ${response.parameters.concepto}. Anotado ;)`))
        .catch( err => console.log(`telebot.js L14 >>> ${err}`) )
    // msg.reply.text(`holas soy telebot ${callDF(1)}`)
    // dialogFlow(msg.text, "1234").then(res => {
    //     const speech = res.data.result.fulfillment.speech;
    //     console.log("DF says: ", speech);
    //     msg.reply.text(speech);

    // });
});

// curl \
// -H "Authorization: Bearer 2ba89f715f484628aecbc209e38a7df8" \
// "https://api.dialogflow.com/v1/query?v=20150910&e=TELEGRAM_WELCOME&timezone=Europe/Paris&lang=en&sessionId=1234567890"

bot.on('photo', (msg) => {
    // Meteor.call("addIncomingMsg", msg, )
    let path = bot.getFile(msg.photo[0].file_id, 'file_path');
    path.then(obj => {
        // console.log('FILE PATH : ' + obj.file_path);
        msg.reply.text("Enviaste una linda foto  " + msg.from.first_name + ", el path es : " + obj.file_path);
    });

    console.log('msg object  ', msg);
});

bot.on('voice', (msg) => {
    // Meteor.call("addIncomingMsg", msg, )
    console.log('msg object  ', msg);
    let path = bot.getFile(msg.voice.file_id, 'file_path');
    path.then(obj => console.log('FILE PATH : ' + obj.file_path));
    msg.reply.text("Que linda voz   " + msg.voice.file_id);
});

bot.on('document', (msg) => {
    console.log('msg object  ', msg);

    let path = bot.getFile(msg.document.file_id, 'file_path');
    path.then(obj => {
        msg.reply.text("Enviaste un interesante archivo  " + msg.from.first_name + ", el path es : " + obj.file_path);
    });

});
bot.start();