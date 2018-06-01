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
        if(effect == undefined) {
            effect = 'fade';
        }
        if($(this).is(':visible')) {
            $(this).hide(effect, giveOptions($(this)), oncomplete);   
        } else {
            $(this).show(effect, giveOptions($(this)), oncomplete);
        }});
}
function giveOptions(el) {
    var option = {};
    var time = parseInt($(el).attr('data-time')) || -1;
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