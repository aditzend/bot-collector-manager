import {
    Meteor
} from 'meteor/meteor';
import {
    check
} from 'meteor/check';
import {
    Chat,
    Client,
    Reservations,
    Applications,
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
                // console.log(`params ????`,response.parameters)
                console.log(`contexts ???`, response.contexts)

                Chat.insert({
                    msg: `${response.fulfillment.speech}`,
                    origin: 'bot',
                    clientAppId: clientAppId,
                    userSessionId: userSessionId,
                    date: new Date()
                });
               
                if (response.metadata.endConversation) {
                    //  console.log(`params ????`,response.parameters)
                    //  console.log(`EOC contexts : `, response.contexts)
                    Chat.insert({
                        msg: `-------- FIN DE LA CONVERSACIÓN -------`,
                        origin: 'human',
                        clientAppId: clientAppId,
                        userSessionId: userSessionId,
                        date: new Date()
                    });
                    Chat.insert({
                        msg: `Le damos la bienvenida al sistema de otorgamiento de Mit Credit. ¿Cuál es su nombre?`,
                        origin: 'bot',
                        clientAppId: clientAppId,
                        userSessionId: userSessionId,
                        date: new Date()
                    });
                    // Name
                    const nameIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === ''
                    )
                    const givenName = response.contexts[nameIndex].parameters['given-name']

                    // Sede
                    const amountIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'obtained-amount'
                    )
                    const amount = response.contexts[amountIndex].parameters['amount']

                    // Pax
                    const payGradeIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'obtained-monthly-salary'
                    )
                    const payGrade = response.contexts[payGradeIndex].parameters['rango-salario']

                    // Check In
                    const seniorityIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'obtained-seniority'
                    )
                    const seniority = response.contexts[seniorityIndex].parameters['seniority']

            
                    // Estadia
                    const branch = response.parameters.sucursal

                    // console.log(`givenName: ${givenName}, amount: ${amount}, `);
                
                    Applications.insert({
                    givenName: givenName,
                    amount: Number(amount),
                    payGrade: payGrade,
                    seniority: seniority,
                    branch: branch,
                    createdAt: new Date()
                    })
        
                }
            })
            .catch( err => console.log(err))
    }
});