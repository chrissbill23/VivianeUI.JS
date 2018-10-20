document.addEventListener('DOMContentLoaded', function() {
  loadEffects($('body'));
  loadAsync();
});
var listeners = {
  show: '.show-spectator'
}
var eventsNames = {
  showStarted: 'ShowStarted',
  actorOnStage: 'ActorOnStage'
};
function sendEvents(sender, targets, event, async = true) {
  var time = async ? 400 : 0;
  setTimeout(function () {
    var evt = new CustomEvent(event, {
      detail: {
        index: $(sender).index()
      }
    });
    document.querySelectorAll(targets).forEach(function (value, key) {
      value.dispatchEvent(evt);
    });
  }, time);
}
function loadEffects(element) {
  if(element === undefined || element === null) {
    throw new Error('Element requested');
  }
  element = $(element).find('*').addBack();
  var onloadslide = $(element).filter('.onload-apply').hide();
  eventEffect($(onloadslide));
  $(element).filter('.onclick-apply').on('click', function() {eventEffect($(this));});
  $(element).filter('.onmouseover-apply').on('mouseover', function() {eventEffect($(this));});
  $(element).filter('.datadrop-apply').on('click', function() {
    var target = $(this).attr('data-target');
    if(target != undefined) {
      eventEffect(target);
    }
  });

  $(element).filter('.show .actor').hide();
  $(element).filter('.show').each(function () {
    $(this).addClass('effects-loaded');
    var id = $(this).attr('id');
    var lst = `${listeners.show}[data-show='#${id}']`;
    setShows($(this).find('.curactor'), lst);
    sendEvents($(this), `${listeners.show}[data-show='#${id}']`, eventsNames.showStarted)
    var parent = $(this);
    $(this).find('.skip-actor-next').on('click', function(){
      clearTimeout(parseInt($(parent).attr('data-curId')));
      timeout($(parent).find('.curactor'), lst);
    });
    $(this).find('.skip-actor-prev').on('click', function(){
      clearTimeout(parseInt($(parent).attr('data-curId')));
      timeout($(parent).find('.curactor'),lst, false);
    });
    $(this).find('.skip-index').on('click', function(){
      clearTimeout(parseInt($(parent).attr('data-curId')));
      var subject = $(this).attr('data-obs');
      timeout($(parent).find('.curactor'),lst, false, subject);
    });
  });
}
function loadAsync() {
  var checkAndSet = function () {
    var els = $('.async-apply').not('.async-loaded').not('.effects-loaded');
    if(els.length > 0) {
      loadEffects(els);
      els.addClass('async-loaded');
    }
  }
  var id = setInterval(checkAndSet, 100);
  var id2 = setTimeout(function(){
    clearInterval(id);
  }, 10000);
}
function eventEffect(el, oncomplete) {
    $(el).each(function() {
        var effect = $(this).attr('data-effect');
        if(effect === 'rotate'){
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
/*******SHOW**********/
function timeout(el,lst, next, index) {
    var newCur;
    if(index === undefined) {
      newCur = next === false ? $(el).prev('.actor').first() : $(el).next('.actor').first();
      if(newCur.length <= 0) {
        newCur = next === false ? $(el).parent().children('.actor').last() : $(el).parent().children('.actor').first();
      }
    } else {
      newCur = $(el).parent().children(`.actor:eq(${index})`);
    }
    el.removeClass('curactor');
     eventEffect(el, function() {
        newCur.addClass('curactor');
        setShows(newCur, lst);
     });
}
function setShows(el, lst) {
        var duration = parseInt($(el).attr('data-stageduration')) || 5000;
        eventEffect(el);
        var code = setTimeout(function() {
            timeout(el, lst);
            sendEvents(el, lst, eventsNames.actorOnStage, false);
        }, duration);
        $(el).parent('.show').attr('data-curId', code);
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
    if($(el).hasClass('onload-apply')) {
        
    if($(el).is(':visible')) {
            $(el).hide();   
        } else {
            $(el).show();
        }
        
    }
    if(opt.direction === 'forth') {
        directionedRotate(el, opt);
    } else {
        if(opt.direction === 'back') {
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
