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
                console.log(`params ????`,response.parameters)
                Chat.insert({
                    msg: `${response.fulfillment.speech}`,
                    origin: 'bot',
                    clientAppId: clientAppId,
                    userSessionId: userSessionId,
                    date: new Date()
                });
                if (response.metadata.endConversation) {
                    
                    Chat.insert({
                        msg: `-------- FIN DE LA CONVERSACIÓN -------`,
                        origin: 'human',
                        clientAppId: clientAppId,
                        userSessionId: userSessionId,
                        date: new Date()
                    });
                    Chat.insert({
                        msg: `Le damos la bienvenida al sistema de reservas de Mit Hotel. ¿Cuál es su nombre?`,
                        origin: 'bot',
                        clientAppId: clientAppId,
                        userSessionId: userSessionId,
                        date: new Date()
                    });
                    // Name
                    const nameIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'obtained-given-name'
                    )
                    const givenName = response.contexts[nameIndex].parameters['given-name']

                    // Sede
                    const sedeIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'obtained-city'
                    )
                    const sede = response.contexts[sedeIndex].parameters['sede']

                    // Pax
                    const paxIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'pax'
                    )
                    const pax = response.contexts[paxIndex].parameters['pax']

                    // Check In
                    const checkInIndex = _.findIndex(
                        response.contexts,
                        (o) => o.name === 'check-in'
                    )
                    const checkIn = response.contexts[checkInIndex].parameters['date']

            
                    // Estadia
                    const nights = response.parameters.estadia
                
                    Reservations.insert({
                    givenName: givenName,
                    sede: sede,
                    pax: Number(pax),
                    checkIn: checkIn,
                    nights: nights,
                    createdAt: new Date()
                    })
        
                }
            })
            .catch( err => console.log(err))
    }
});