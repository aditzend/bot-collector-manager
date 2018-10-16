

    addIncomingMsgFromTelegram(msg, platform, userId, chatId, clientAppId = Meteor.settings.DEFAULT_CLIENT_APP_ID) {
        console.log("incoming @ add incoming>>> ", msg);
        // incomingMsgs.push({
        //     msg: msg,
        //     origin: "human",
        //     platform: platform,
        //     clientAppId: clientAppId,
        //     userSessionId: chatId
        // });

        // Chat.insert({
        //     msg: msg,
        //     origin: 'human',
        //     platform: platform,

        //     clientAppId: clientAppId,
        //     userSessionId: chatId,
        //     date: new Date()
        // });

        // promise

        let callDialogFlow = new Promise((resolve, reject) => {
            const method = "POST";
            const url = "https://api.dialogflow.com/v1/query?v=20150910";
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Meteor.settings.DF_CLIENT_ACESS_TOKEN}`
                },
                data: {
                    "contexts": [
                        ""
                    ],
                    "lang": "es",
                    "query": msg,
                    "sessionId": chatId,
                    "timezone": "America/New_York"
                }
            };
            const res = HTTP.call(method, url, options);
            resolve(res.data.result);
            reject('ERROR llamando a callDialogFlow')
        }, 400);

        callDialogFlow.then((response) => {
            // Chat.insert({
            //     msg: response.fulfillment.speech,
            //     origin: 'bot',
            //     clientAppId: clientAppId,
            //     userSessionId: chatId,
            //     date: new Date()
            // });
            const cost = response.parameters.costo
            const concept = response.parameters.concepto
            //    Expenses.insert({
            //        cost: Number(cost),
            //        concept: concept,
            //        clientAppId: clientAppId,
            //         userSessionId: userSessionId,
            //        date: new Date()
            //    })
            console.log("response from DF ", response);
            return response.fulfillment.speech
        });


    }
})