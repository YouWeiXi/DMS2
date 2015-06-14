/**
 * Created by zoey on 2015/6/11.
 */
module.exports = function (config, mongoose) {

    var connect = function () {
        var options = {
            server: {
                socketOptions: { keepAlive: 1 }
            },
            auto_reconnect:true
        }
        mongoose.connect(config.mongodb.url, options)
    }
    connect()

    // Error handler
    mongoose.connection.on('error', function (err) {
        console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err)
    })

    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
        connect()
    })

}
