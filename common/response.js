/**
 * Created by zoey on 2015/6/4.
 */

module.exports = {
    /*系统消息定义*/
    OK : 200 ,//操作成功
    FAIL : 400 ,//操作失败

    buildOK : function(data){
        return {status : this.OK , data : data};
    },

    buildError : function(error){
        return {status : this.FAIL , message : error };
    }
};