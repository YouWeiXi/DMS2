/**
 * Created by zoey on 2015/6/4.
 */
var path = require('path');
exports.config = {
  port: 5000,
  upload_dir: path.join(__dirname, 'public', 'user_data'),
  mongodb: {
    url: 'mongodb://123.57.75.184:15515/fairs',
    productUrl:'mongodb://123.57.75.184:15515/fairs_product'
  }
};



