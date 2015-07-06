/**
 * Created by zoey on 2015/6/4.
 */
var path = require('path');
exports.config = {
    port: 5000,
    upload_dir: path.join(__dirname, 'public', 'user_data'),
    mongodb: {
        url: 'mongodb://127.0.0.1:27017/fairs',
        productUrl:'mongodb://127.0.0.1:27017/fairs_product'
    }
};



