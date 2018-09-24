import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';
import {
    Chat,
    Client,
    Expenses,
    Banned
} from './collections.js';
import { callDialogFlow } from '../server/dialogflow/api'

Meteor.methods({
  
    addClientApp(name) {
        check(name, String);
        Client.insert({
            name: name
        });
    },
    addIncomingMsg2(msg, platform, userId, chatId) {
        console.log("incoming @ add incoming>>> ", msg);
        Chat.insert({
            msg: msg,
            origin: 'human',
            platform: platform,
            userId: userId,
            chatId: chatId,
            createdAt: new Date()
        });
    },
    addIncomingMsg(msg, clientAppId, userSessionId) {
        Chat.insert({
            msg: msg,
            origin: 'human',
            clientAppId: clientAppId,
            userSessionId: userSessionId,
            date: new Date()
        });
        callDialogFlow(msg, userSessionId)
            .then((response) => {
                const cost = response.parameters.costo
                const concept = response.parameters.concepto
                Chat.insert({
                    msg: `Gastaste ${cost}. Anotado en ${concept}!`,
                    origin: 'bot',
                    clientAppId: clientAppId,
                    userSessionId: userSessionId,
                    date: new Date()
                });
                Expenses.insert({
                    cost: Number(cost),
                    concept: concept,
                    clientAppId: clientAppId,
                        userSessionId: userSessionId,
                    date: new Date()
                })
            })
            .catch( err => console.log(err))
    }
});