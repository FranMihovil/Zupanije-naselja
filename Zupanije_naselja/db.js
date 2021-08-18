const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb+srv://froncek:froncek@cluster0.n6mpc.mongodb.net/ZupanijeDatabase?retryWrites=true&w=majority'

function connect(url) {
    return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => client.db())
}

module.exports = async function () {
    return  await connect(uri)
}
