//navigationa
/*document.querySelector("#nav-toggle")
	.addEventListener("click", function () {
		this.classList.toggle("active");
		$('body').addClass("active");
		$('.navigation').addClass("active");
		$('.menuBox').addClass("active");
		$('.menuBox nav').addClass("active");
});*/

$(document).ready(function() {
	if ($("#nav-toggle").length) {
		$("#nav-toggle").on("click", function() {
			$(this).toggleClass("active");
			$("body").addClass("active");
			$(".navigation").toggleClass("active");
			$(".menuBox").addClass("active");
			$(".menuBox nav").addClass("active");
		});
	}
	$(".menuBox .menuBoxOverlay, .menuBox .close").on("click", function() {
		$("#nav-toggle").removeClass("active");
		$("body").removeClass("active");
		$(".navigation").removeClass("active");
		$(".menuBox").removeClass("active");
		$(".menuBox nav").removeClass("active");
	});
	if($(".msgBox").length){
		window.setTimeout(function() {
		    $(".msgBox").slideUp(300, function(){
		        $(this).remove(); 
		    });
		}, 15000);
	}
});

/*$(document).scroll(function () {
	var y = $(this).scrollTop();
	if (y > 180) {
		$('.navigation').removeClass("active");
		$('#nav-toggle').removeClass("active");
	}
});*/


//navigation

/*function goToByScroll(id, scrollFrom){
	id = $.trim(id);
	var tid = id.replace("link", "");
	$('#'+tid).show().addClass('active');
	console.log(tid);
	$('.mainContainer .box:nth-child(2)').animate({
		scrollTop: $("#"+tid)[0].offsetTop-65
	}, 'slow');

	setDidYouKnow(tid);
	
	if (typeof scrollFrom === 'undefined') {
		scrollFrom = null;
	}
	manageLeftSidebar(id, scrollFrom);
}*/

function goToByScroll(id, disable){
    if (typeof disable === 'undefined') {
        disable = true;
    }

	id = $.trim(id);
	var tid = id.replace("link", "");
	$('#'+tid).show().addClass('active');
	// console.log(tid);
	$('.mainContainer .box:nth-child(2)').animate({
		scrollTop: $("#"+tid)[0].offsetTop-65
	}, 'slow');

	setDidYouKnow(tid);
	leftNav(id, disable);
	if(disable){
		ManageEdit(tid);
		scrollCustomOperation(tid);
	}

}

function inhouseScroll(target,params = {}){
	var scroll = (typeof params.scroll == 'undefined') ? true : params.scroll;
	var navigation = (typeof params.nav == 'undefined') ? true : params.nav;
	var overlay = (typeof params.overlay == 'undefined') ? true : params.overlay;

    var id = target.prop('id');
    if(navigation){
		var nav = $(".inHouseBox .container .sideBarBox .navBox");
		nav.children('a').removeClass('disable');
		// target.nextAll('div.pageSection').each(function(){
		// nav.children("a[data-target='"+$(this).attr('id')+"']").addClass('disable');
		// });
		target.nextUntil($('div').not('.skip')).each(function(){
		nav.children("a[data-target='"+$(this).attr('id')+"']").removeClass('disable');
		});
	}
	// console.log(inhouseScroll.caller,target,params);
	if(overlay){
		target.find('div.secOverlayBox').hide();
		target.prevAll('div.secOverlayBox').hide();
		// target.nextAll('div').find('div.secOverlayBox').show();
		// console.log(target,target.nextUntil($('div').not('.skip')));
		target.nextUntil($('div').not('.skip')).find('.secOverlayBox').hide();
	}
    // }
    if(scroll){
		$('html, body').animate({
			scrollTop: target.offset().top - 78
		}, 'slow');
    }else{
    	// console.log('no scroll');
	    target.prevAll('div.pageSection').first().find('div.secOverlayBox').hide();
	    nav.children("a[data-target='"+target.prevAll('div.pageSection').first().attr('id')+"']").removeClass('disable');
    }
    return false;
}

function initInhouseScroll(linkStr){
	// console.log(initInhouseScroll.caller,linkStr);
	link = linkStr.replace('link','');
	if($('#'+link).length){
		inhouseScroll($('#'+link));
	}
}

$(".btnArea").on('click', function(e) {
	e.preventDefault(); 	
	//goToByScroll($(this).attr("id"));
});

function triggerInput(){
    //$('input').prop('autocomplete', false);
    $('input').attr('autocomplete', 'off');
    $('input').prop('autocorrect', false);
    // $('input').prop('autocapitalize', false);
    $('input').prop('spellcheck', false);
    
    $.each($('.input-effect input'), function(){
        if($(this).val() != ""){
            $(this).addClass("has-content");
        }else{
            $(this).removeClass("has-content");
        }
    });
}

$(document).ready(function () {
	//navigation
	// document.querySelector( "#nav-toggle" ).addEventListener( "click", function() {
	// 	this.classList.toggle( "active" );
	// 	$('.navigation').toggleClass("active");
	// });
	  
	$(document).scroll(function() {
		var y = $(this).scrollTop();
		if (y > 180) {
			$('.navigation').removeClass("active");
			$('#nav-toggle').removeClass("active");
		}    
	});
	//navigation
	
	
	//height function
	var winHeight = $(window).height();
	var boxHeight = winHeight - 65;
	$(".mainContainer").css("height", (winHeight - 65) + "px");
	$(".mainContainer .box").css("height", boxHeight + "px");
	$(".mainContainer .login-left").css("height", (winHeight - 65) + "px");
	$(".mainContainer .login-right").css("height", (winHeight - 95) + "px");
	$(".mainContainer .login-right .login-section").css("height", (winHeight - 165) + "px");
	$(".mainContainer .box .tile").css("min-height", (winHeight - 95) + "px");
	//height function

	var nabHeight = $(".needAssistanceBox").height();
	//console.log(nabHeight);
	$(".helpBox .panelBox .panelBody").css("height", (boxHeight - nabHeight - 150) + "px");
	
	//Income toggleBtn
	$(".silderBtn ul").on('click', 'li.Btn', function(){
    $(".silderBtn ul, .silderBtn ul li").toggleClass("active"); 
    $(".silderBtn ul li").toggleClass("Btn");
    $(".globalList,.indiaList").toggle();
   });   
	//Income toggleBtn
	
    //Bank Upload Statement toggle button
    $(".appropriateBtn ul").on('click', 'li.Btn', function(){
    $(".appropriateOption, .appropriateBtn ul, .appropriateBtn ul li").toggleClass("active"); 
    $(".appropriateBtn ul li").toggleClass("Btn");
    });  
    //Bank Upload Statement toggle button
    

	/*//tiles slider function	
	$(".panel-body ul li").click(function(e) {
	//tiles slider function	
	$(".panel-body ul li").on('click', function(e) {
		console.log($(this).attr("id"));
        var id = $(this).attr("id");
        id = id.replace("x", "xxx");
        console.log(id);
		e.preventDefault(); 	
		goToByScroll(id);
	});*/
		
	//header select box
	$('body').on('click', '.option li', function () {
		var i = $(this).parents('.select').attr('id');
		var v = $(this).children().text();
		var o = $(this).attr('id');
		$('#' + i + ' .selected').attr('id', o);
		$('#' + i + ' .selected').text(v);
	});
	//header select box
	
	//responsive functions
	$(".circleBtnBox.helpBtnBoxTablet").on('click', function () {
		$(".mainContainer").addClass("active");
	});

	$(".circleBtnBox.closeBtnBoxTablet").on('click', function () {
		$(".mainContainer").removeClass("active");
	});

	$(".circleBtnBox.userBtnBoxMobile").on('click', function () {
		$(".mainContainer").addClass("leftActive");
		$(".mainContainer").removeClass("rightActive");
	});
	$(".circleBtnBox.helpBtnBoxMobile").on('click', function () {
		$(".mainContainer").addClass("rightActive");
		$(".mainContainer").removeClass("leftActive");
	});

	$(".circleBtnBox.userCloseBoxMobile,.circleBtnBox.helpCloseBoxMobile").on('click', function () {
		$(".mainContainer").removeClass("rightActive");
		$(".mainContainer").removeClass("leftActive");
	});	
	//responsive functions
	//
	triggerInput();


	$(".menuBox nav ul li.categories").on('click', function( event ) {
		$(".menuBox nav ul li.categories ul").toggle("");	
		$(".menuBox nav ul li.categories a").toggleClass("active");	
	});	
	$("footer .footer-section.productsDropDowns h3").on('click', function( event ) {
		$("footer .footer-section.productsDropDowns").toggleClass("active");	
	});	
	$("footer .footer-section.servicesDropDowns h3").on('click', function( event ) {
		$("footer .footer-section.servicesDropDowns").toggleClass("active");	
	});	
	$("footer .footer-section.companyDropDowns h3").on('click', function( event ) {
		$("footer .footer-section.companyDropDowns").toggleClass("active");	
	});	
	$("footer .footer-section.newsDropDowns h3").on('click', function( event ) {
		$("footer .footer-section.newsDropDowns").toggleClass("active");	
	});		
	$("footer .footer-section.networkDropDowns h3").on('click', function( event ) {
		$("footer .footer-section.networkDropDowns").toggleClass("active");	
	});	

});


//dob select box
/*$('.dob').datepicker({
	dateFormat: 'dd/mm/yy',
	changeMonth: true,
	changeYear: true,
	yearRange: '-100:+0',
	maxDate: '-1d'		
});*/
//dob select box

//datepicker select box
/*$('.from').datepicker({
	autoclose: true,
	minViewMode: 1,
	format: 'mm/yyyy'
	
});*/
//datepicker select box
  

/*$(document).on('click', '.carousel-3d-slide.current', function() {
	$(".carousel-3d-slide.current .offerTile").toggleClass("active");
});*/

$(document).on('focusout', '.input-effect input', function(){
	if($(this).val() != ""){
		if(($(this).attr('type') == 'number') && $(this).attr('data-maxlength') !== undefined ){
			$(this).val($(this).val().substring(0, $(this).attr('data-maxlength')));
		}
		$(this).addClass("has-content");
	}else{
		$(this).removeClass("has-content");
	}
});

/*new Vue({
el: '#planSlider',
data: {
	slides: 3
},
components: {
	'carousel-3d': Carousel3d.Carousel3d,
	'slide': Carousel3d.Slide
	}
});*/



//OTP inupt box
/*$(function() {
	$('#first,#second,#third,#fourth').on('keyup', function(e) {
		var val = this.value;
		this.value = ''; // unset first
		this.value = val; // re-set next
		if ($(this).val().length >= $(this).attr('maxlength')) {
			$(this).parent().parent().parent().parent().next('div').find('input').focus();
		}
		else if ($(this).val().length === 0) {
			$(this).parent().parent().parent().parent().prev('div').find('input').focus();
		}    
	});
});*/
//OTP inupt box Finish

//how it works
$(function () {
	function updateProductTour(element) {
		var activeStep = element.index();
		var activeStepTop = element.attr("data-top");
		var activeStepLeft = element.attr("data-left");
		$(".screenshots img, .detailed-screenshots img").removeClass("active");
		$(".screenshots img:eq(" + activeStep + "), .detailed-screenshots img:eq(" + activeStep + ")").addClass("active");
		$(".detailed-screenshots img:eq(" + activeStep + ")").parent().css({
			"top": activeStepTop + "%",
			"left": activeStepLeft + "%"
		});
		if (window.mixpanel) {
			mixpanel.track("RE Process Step Shown", {
				"Step": activeStep + 1
			});
		}
	}
	$(".marketing-product-tour li").on("show.bs.collapse", function () {
		updateProductTour($(this));
	});
	updateProductTour($(".marketing-product-tour li:first-child"));
});
//how it works

String.prototype.toTitleCase = function(){
	return this.replace(/\w\S*/g, function(text){return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()});
};