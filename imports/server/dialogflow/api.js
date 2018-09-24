

function test(a) {
    return new Promise( (resolve, reject) => {
        resolve(
            'resolved promise'
        )
        reject(
            'rejected'
        )
    })
}

function callDialogFlow(msg, chatId) {
    return new Promise( (resolve, reject) => {
        const method = "POST"
        const url = "https://api.dialogflow.com/v1/query?v=20150910"
        const options = {
            headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${Meteor.settings.DF_CLIENT_API}`
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
        }
        const res = HTTP.call(method, url, options)
        resolve(res.data.result)
        reject('ERROR llamando a callDialogFlow')
    }, 400)
}

export {
    test,
    callDialogFlow
}