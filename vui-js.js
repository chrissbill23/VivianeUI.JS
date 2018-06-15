document.addEventListener('DOMContentLoaded', function() {
    var onloadslide = $('.onload-apply').hide();
    eventEffect($(onloadslide));
    $('.onclick-apply').on('click', function() {eventEffect($(this));});
    $('.datadrop-apply').on('click', function() {
        var target = $(this).attr('data-target');
        if(target != undefined) {
            eventEffect(target);
        }
        });
    
    $('.show .actor').hide();
    eventEffect($('.show .curactor'));
    setShows($('.show'));
});

function eventEffect(el, oncomplete) {  
    $(el).each(function() {
        var effect = $(this).attr('data-effect');
        if(effect === "rotate"){
            rotate($(this));
        }
        else {
        if(effect == undefined) {
            effect = 'fade';
        }
        if($(this).is(':visible')) {
            $(this).hide(effect, giveOptions($(this)), oncomplete);   
        } else {
            $(this).show(effect, giveOptions($(this)), oncomplete);
        }
            
        }});
        
}
function giveOptions(el) {
    var option = {};
    var time = parseInt($(el).attr('data-time')) || 0;
    var direction = $(el).attr('data-direction');
    if(direction != null || direction != undefined) {
        option.direction = direction;
    }
    if(time > 0 ) {
        option.duration = time;
    }
    return option;
} 
function timeout(el, next) {
    var curel = $(el).find('.curactor');
    var newCur = next === false ? $(curel).prev('.actor') : $(curel).next('.actor');
    if(newCur.length <= 0) {
        newCur = next === false ? $(el).children('.actor').last() : $(el).children('.actor').first();
    }
    curel.removeClass('curactor');
        eventEffect(curel, function() {
        newCur.addClass('curactor');
        eventEffect(newCur);
        });
}
function setShows(el) {
    $(el).each(function(){      
    var time = parseInt($(this).attr('data-timeout')) || -1;
    if(time > 0) {
        var e = $(this);
        var i = setInterval(function() {
            timeout(e);
        }, time);
    $(e).find('.skip-actor-next').on('click', function(){
       clearInterval(i);
       timeout(e);
       setShows(e);
    });
    $(e).find('.skip-actor-prev').on('click', function(){
       clearInterval(i);
       timeout(e, false);
       setShows(e);
    });
    }
    });
}
/*------------------------------------ ROTATE --------------------------------*/
function rotate(el) {
    var opt = giveOptions(el);
    opt.angle = parseInt($(el).attr('data-angle')) || 0;
    opt.realAngle = parseInt($(el).attr('data-realangle'));
    if(isNaN(opt.realAngle)) {
        $(el).attr('data-realangle', opt.angle);
        opt.realAngle = opt.angle;
    }
    var classVal = $(el).hasClass('onload-apply');
    if($(el).hasClass('onload-apply')) {
        
    if($(el).is(':visible')) {
            $(el).hide();   
        } else {
            $(el).show();
        }
        
    }
    if(opt.direction === "forth") {
        directionedRotate(el, opt);
    } else {
        if(opt.direction === "back") { 
            opt.realAngle = -1 * opt.realAngle;
            if(opt.angle > 0) {
                opt.angle = opt.angle * -1;
            }
            directionedRotate(el, opt);
        } else {
            backforthRotate(el, opt);   
        }
    }
}
function directionedRotate(el, opt) {
        applyRotateStyle(el, opt.angle, opt.duration);
        $(el).attr('data-angle', opt.angle + opt.realAngle);
    
}
function backforthRotate(el, opt) {
    if($(el).css('transform') === 'none' || opt.angle >= 0) {
            applyRotateStyle(el, opt.angle, opt.duration);
    }else {
            applyRotateStyle(el, 0, opt.duration);
    $(el).attr('data-angle', opt.realAngle);
        }
    $(el).attr('data-angle', opt.angle * -1);
    
}
function applyRotateStyle(el, angle, duration) {
    $(el).css('transform','rotate('+angle+'deg)'); 
    $(el).css('-webkit-transform','rotate('+angle+'deg)'); 
    $(el).css('-ms-transform','rotate('+angle+'deg)'); 
    $(el).css('-moz-transform','rotate('+angle+'deg)'); 
    $(el).css('-o-transform','rotate('+angle+'deg)'); 
    $(el).css('transition', (duration/1000)+'s'); 
    $(el).css('-webkit-transition', (duration/1000)+'s');
    $(el).css('-moz-transition', (duration/1000)+'s');
    $(el).css('-o-transition', (duration/1000)+'s');
}
