/*  jQupload - jQuery Upload v0.1
 *  jQupload is distributed under the terms of the MIT license
 *  For more information visit http://jqframework.com/jqupload
 *  Copyright (C) 2010  jqframework.com
 * Do not remove this copyright message
 */
$.jQupload={fadeOutTime:3000,callback:{},output:{},init:function(id,obj){if(obj.callback){$.jQupload.callback[id]=obj.callback
}if(obj.output){$.jQupload.output[id]=obj.output
}if(obj.fadeOutTime){$.jQupload.fadeOutTime=obj.fadeOutTime
}},defaultMessage:function(data){alert(data)
},jsonMessage:function(data){eval("data="+data);
$("#"+$.jQupload.output[data.formid.value]).html(data.message).fadeOut($.jQupload.fadeOutTime)
}};
$.fn.extend({jqupload:function(obj){return this.each(function(){var id=this.id;
if(typeof this.id=="object"){id=$(this).attr("id")
}if(!obj) obj={};$.jQupload.init(id,obj)
})
},jqupload_form:function(){return this.each(function(){var id=this.id;
if(typeof this.id=="object"){id=$(this).attr("id")
}var data=$.extend({},{iframe:id+"_iframe"},data);
$("body").append("<iframe name="+data.iframe+' id="'+data.iframe+'"></iframe>');
$("#"+data.iframe).css({position:"absolute",left:"-1000px",top:"-1000px",width:"0px",height:"0px"});
$(this).attr("target",data.iframe).submit(function(){$("#"+data.iframe).load(function(){var data1=$("#"+data.iframe).contents().find("body").html();
if($.jQupload.callback[id]){$.jQupload.callback[id](data1);
}else{if($.jQupload.output[id]){$.jQupload.jsonMessage(data1)
}else{$.jQupload.defaultMessage(data1)
}}$("#"+data.iframe).contents().find("body").html("");
$("#"+data.iframe).unbind("load")
})
});
return true
})
}});