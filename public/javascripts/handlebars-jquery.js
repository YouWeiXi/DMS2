/**
 * Created by zoey on 2015/6/15.
 */
(function($) {
    var compiled = {};
    $.fn.handlebars = function(template, data) {
        if (template instanceof jQuery) {
            template = $(template).html();
        }
        compiled[template] = Handlebars.compile(template);
        this.html(compiled[template](data));
    };
    Handlebars.registerHelper('compare', function(v1,v2,options){
        if(v1 == v2){
            return options.fn(v1)
        }else{
            return options.inverse(v1);
        }
    });
    Handlebars.registerHelper("list_sub", function(list) {
        if(list.length>2){
            return list[0]+' '+list[1]+' ... '
        }else if(list.length==2){
            return list[0]+' '+list[1]
        }else if(list.length==1){
            return list[0]
        }
    });
})(jQuery);