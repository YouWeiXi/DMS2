var currPage=1;
var length=5;//每页12条
/**
 *
 * @param size 总页数 index 当前坐标
 * @param callbackName 回调函数的名称 字符串
 * @param target 默认是.pagination
 */
function page(size,callbackName,target){
	var page=Math.ceil(size/length);//页数
    var str='';
	if(page<=1){
		str='<li class="active"><a href="#" onclick="'+callbackName+'(1)">1</a></li>';
	}else if(page<9){
		if(currPage>1){
			str='<li><a href="#!" onclick="'+callbackName+'('+(currPage-1)+')">上一页</a></li>';
		}
		for (var i=0; i<page; i++){
			if(i+1==currPage){
				str+='<li class="active"><a href="#!" onclick="'+callbackName+'('+currPage+')">'+currPage+'</a></li>';
			}else{
                str+='<li><a href="#!" onclick="'+callbackName+'('+(i+1)+')">'+(i+1)+'</a></li>';
			}
		}
		if(currPage<page){
			str+='<li><a href="#!" onclick="'+callbackName+'('+(currPage+1)+')">下一页</a></li>';
		}
	}else{
		if(currPage>1){
            str='<li><a href="#!" onclick="'+callbackName+'('+(currPage-1)+')">上一页</a></li>';
		}
		if(currPage==1){
            str='<li class="active"><a href="#!" onclick="'+callbackName+'(1)">1</a></li>';
		}else{
            str='<l><a href="#!" onclick="'+callbackName+'(1)">1</a></li>';
		}
		if(currPage==2){
            str='<li class="active"><a href="#!" onclick="'+callbackName+'(2)">2</a></li>';
		}else{
            str='<li><a href="#!" onclick="'+callbackName+'(2)">2</a></li>';
		}
		if(currPage==1||currPage==2||currPage==(page-1)||currPage==page){
			str+='<li><span>....</span></li>';
		}else{
			if(currPage==3){
				str+='<li><a href="#!" onclick="'+callbackName+'(3)">3</a></li>';
                str+='<li><span>....</span></li>';
			}else if(currPage==(page-2)){
                str+='<li><span>....</span></li>';
				str+='<li><a href="#!" class="active">'+(page-2)+'</a>';
			}else{
                str+='<li><span>....</span></li>';
				str+='<li class="active"><a href="#!" onclick="'+callbackName+'('+currPage+')">'+currPage+'</a></li>';
                str+='<li><span>....</span></li>';
			}
		}
		if(currPage==(page-1)){
			str+='<li class="active"><a href="#!">'+(page-1)+'</a></li>';
		}else{
			str+='<li><a href="#!" onclick="'+callbackName+'('+(page-1)+')">'+(page-1)+'</a></li>';
		}
		if(currPage==page){
			str+='<li class="active"><a href="#!" >'+page+'</a></li>';
		}else{
			str+='<li><a href="#!" onclick="'+callbackName+'('+page+')">'+page+'</a></li>';
		}
		if(currPage<page){
            str+='<li><a href="#!" onclick="'+callbackName+'('+(currPage+1)+')">下一页</a></li>';
		}
	}
    str+='<div class="clear"> </div>'
    if(target){
        $(target).html(str);
    }else{
        $(".pagination").html(str);
    }
}