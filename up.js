(function($){
/** OPCIONES POR DEFECTO **/
$.fn.up.opc_default = {
	cssa:{
		"border-bottom-style":"dashed",
		"border-bottom-width":"1px",
		"text-decoration":"none",
		"white-space":"nowrap"
	},		
	cssup:{
		"border":"1px solid #333333",
		"padding":"4px",
		"background-color":"white"
	},
	slide:true,
	aclick:function(){return false;},
	off:function(s){return s.is(".off");}
};
/** FUNCION BASICA **/
$.fn.up=function(_opc){
	var opc={};
	$.extend(true,opc,$.fn.up.opc_default,_opc);
	return this.each(function(){
		var a=$(this).clone();
		a.css(opc.cssa);
		a.click(opc.aclick);

		var div=$("<div class='up' style='position:absolute;z-index:999;'></div>");
		div.css(opc.cssup);
		div.append(opc.inc(this));
		if (opc.slide) {div.hide();}
		else {div.css("left","-99999px");}

		var span=$("<span class='up'></span>");
		span.append(a);
		span.append(div);
		span.hover(function () {
			var o=$(this);
			if (opc.off(o)) {return;}
			var d=o.find("div.up");
			var l=o.position().left;
			var t=o.position().top+o.height();
			d.css("top",t+"px");
			d.css("left",l+"px");
			if (opc.slide && d.is(":hidden")) {d.stop(true,true).slideDown("slow");}
		},
		function () {
			var o=$(this);
			if (opc.off(o)) {return;}
			var d=o.find("div.up:visible");
			if (opc.slide) {d.stop(true,true).slideUp("slow");}
			else {d.css("left","-99999px");}
		});
		span.click(opc.click);
		span.mouseleave(opc.leave);

		$(this).replaceWith(span);
	});
};

/** UP PARA IMAGENES **/
$.fn.upimg=function(){
	return this.each(function(){
		$(this).up({
			cssup:{"line-height":"0px"},
			inc:function(_a) {
				var a=$(_a);
				var c=a.clone().css("white-space","nowrap").hide();
				a.parent().append(c);
				var w=c.width()-10;
				c.remove();
				return $("<img class='imgup' style='border-style:hidden;padding:0px;' width='"+w+"px' src='"+_a.href+"'/>");
			},
			aclick:function(){$(this).closest("span.up").trigger("click");return null;},
			click:function () {
				var o=$(this);
				var div=o.find("div.up:visible");
				if (div.length==0) {return false;}
				div.stop(true,true);
				o.addClass("off");
				var d=div.clone();
				o.append(d);
				o.css("cursor","default");
				div.hide();
				var i=d.find("img");
				i.removeAttr("width");
				d.draggable();
				i.resizable({alsoResize:'div.big'});
				d.addClass("big");
				i.css("cursor","move");
				return false;
			},
			leave:function(){
				var o=$(this);
				o.find("div.big").not(".ui-draggable-dragging").not(".fijado").fadeOut("slow",function(){
					var s=$(this).closest("span.up");
					$(this).remove();
					s.css("cursor","se-resize");
					s.removeClass("off");
				});
			},
			off:function(s){
				return (s.is(".off") || s.find("div.big").length>0);
			}
		});
	});
};

/** UP PARA REDORDUCTOR GOEAR **/
$.fn.upgoear=function(){
	return this.each(function(){
		$(this).up({
			cssup:{"line-height":"0px"},
			inc:function(a) {
				var id=a.href.replace(/http\:\/\/www.goear.com\/listen\/([^\/]+)\/.*/,"$1");
				return $('<object width="353" height="132"><embed src="http://www.goear.com/files/external.swf?file='+id+'" type="application/x-shockwave-flash" wmode="transparent" quality="high" width="353" height="132"></embed></object>');
			},
			slide:false
		});
	});
};


/** EFECTOS MOSTRAS/OCULTAR **/
$.fn.upshow=function(){
	return this.each(function(){
		$(this).mouseover().addClass("off").find("div.up").dblclick(function(){
			$(this).closest("span.up").removeClass("off");
		});
	});
};
$.fn.upshowbig=function(){
	return this.each(function(){
	$(this).mouseover().addClass("off").click().find("div.big").addClass("fijado").dblclick(function(){
			$(this).closest("span.up").removeClass("off");
			$(this).removeClass("fijado")
		});
	});
};

/** INICIALIZA TODOS LOS UPs POSIBLES **/
$.up=function() {
	$("a.up,a[name='up']").each(function() {
		var t=$(this);
		if (this.href.indexOf("http://www.goear.com/listen")==0) {t.addClass("goearup");}
		else if (/.*\.(jpeg|jpg|gif|png|bmp)$/.test(this.href)) {t.addClass("imgup");}
	})
	$("a[name='imgup']").addClass("imgup");
	$("a.imgup").upimg();
	$("a.goearup").upgoear();
}

})(jQuery);
