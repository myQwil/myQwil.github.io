(function($) {
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden")
        })
    }
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible")
        })
    }
    $.fn.reverse = [].reverse
}(jQuery))

$(function(){

  $('select').each(function() {
    if (this.selectedIndex != 0)
    { var select = $(this)
      select.siblings('.price')
        .text(select.find(':selected').data('price'))
      select.siblings('.quant').visible() }
  })

  var cart = ($(window).width() >= 752) ?
      $('.icon-cart') : $('.mobile-cart-page-link .icon-cart')
  var cartColor = cart.css('color')
  
  var cell = 200
  $('.prev').click(function() {
    var aisle = $(this).next('fieldset').find('.items')
    ail = aisle[0]
    var ailWid = ail.offsetWidth
    var scr = ail.scrollLeft
    var num = Math.trunc(ailWid/cell)
    num = (num<1 ? 1 : num) * cell
    var amt = num

    var scrEnd = ail.scrollWidth - ailWid
    
    // remove excess scrolling
    if (scr-num < 0) amt = scr

    var scrl = "-="+amt+"px"
    aisle.scrollTo(scrl, num, {axis:'x'})
    return false
  })

  $('.next').click(function() {
    var aisle = $(this).prev('fieldset').find('.items')
    var ail = aisle[0]
    var ailWid = ail.offsetWidth
    var scr = ail.scrollLeft
    var num = Math.trunc(ailWid/cell)
    num = (num<1 ? 1 : num) * cell
    var amt = num

    var scrEnd = ail.scrollWidth - ailWid

    // remove excess scrolling
    if (num+scr > scrEnd) amt = scrEnd - scr

    var scrl = "+="+amt+"px"
    aisle.scrollTo(scrl, num, {axis:'x'})
    return false
  })

  var isEnd = false
  var timer
  $('.items').mousewheel(function(e) {
    // don't use scrollLeftMax, not supported by chrome
    var end = this.scrollWidth - this.offsetWidth - 2
    if (e.deltaY>0 && this.scrollLeft>0
     || e.deltaY<0 && this.scrollLeft<end)
    { isEnd = false
      clearTimeout(timer); timer=null
      this.scrollLeft -= (e.deltaY * e.deltaFactor) }
    else
    { if (timer == null)
        timer = setTimeout(function() { isEnd=true }, 333)
      return isEnd }
    return (isEnd=false)
  })

  $('.item button').click(function() {
    var cart = $('.cart-count').html()
        cart = (cart) ? parseInt(cart):0
    var quant = $(this).siblings('input[name=quantity]')
    var quantity = quant.val()
        quantity = (quantity) ? parseInt(quantity):0
    var id = $(this).siblings('input[name=id]').val()

    if ($(this).attr('name') == "more")
    { quantity++; cart++
      if (cart<2) $('.cart-count').removeClass('hidden-count')
      quant.val(quantity) }
    if ($(this).attr('name') == "less")
    { if (quantity > 0)
      { quantity--; cart--
        if (!cart) $('.cart-count').addClass('hidden-count')
        quant.val((quantity) ? quantity:null) } }

    $('.cart-count').text(cart)

    var variants = $(this).parent().siblings('.variants')
    if (variants.length)
    { var variant = variants.find('option:selected')
      variant.data('amt', quantity) }

    var data = {}
    data[id] = quantity
    return false
  })

  $('.underline a').click(function() {
    var aisle = $(this).parent().parent().parent().parent()
    var ail = aisle[0]
    var lft = ail.offsetLeft
    var ailWid = ail.offsetWidth
    var scrEnd = ail.scrollWidth - ailWid
    var scrl = ail.scrollLeft

    var line = $(this).parent()[0]
    var linWid = line.offsetWidth
    var neg = false;
    var left, num, amt

    // if there's room for the whole line, try centering it
    if (linWid < ailWid)
    { num = line.offsetLeft + (linWid/2) - (ailWid/2) - lft
      amt = num - scrl }
    else
    { var lgnd = $(this).parent().parent()[0]
      var lgnL = lgnd.offsetLeft - lft
      var lgnR = lgnL + lgnd.offsetWidth
      var tip = scrl + (ailWid/2)

      var linL = line.offsetLeft
      var linR = linL + linWid
      var ailL = lft + scrl
      var ailR = ailL + ailWid

      var isLeft  = (linL <= ailL)
      var isRight = (linR >= ailR)

      // switch between start and end of line
      if (isLeft && linR>ailL) num = lgnL
      else if (isRight && ailR>linL) num = lgnR-ailWid
      else num = (Math.abs(tip-lgnL) < Math.abs(tip-lgnR)) ?
        lgnL : (lgnR-ailWid)
      amt = num - scrl
    }

    if (amt<0) { amt*=-1; neg = true }

    // remove excess scrolling
    if (num > scrEnd) amt = scrEnd - scrl
    else if (num < 0) amt = scrl

    left = (neg?"-=":"+=")+amt+"px"
    aisle.scrollTo(left, 600, {axis:'x'})
    return false
  })

  $('.variants option').hover(function() {
    var images = $(this).parent().siblings('.image')
    var image = images.find('img[data-id='+$(this).val()+']')
    if (image.attr('src').indexOf('no-image') == -1)
    { images.find('img').hide()
      image.show() }
    else
    { images.find('img').hide() 
      images.find('img:first').show() }
  })

  $('.variants').change(function() {
    var quant = $(this).siblings('.quant')
    var varId = quant.find('input[type=hidden]')
    varId.val($(this).val())

    var variant = $(this).find('option:selected')
    var price = $(this).siblings('.price')
    price.text(variant.data('price'))

    var quantity = quant.find('input[name=quantity]')
    quantity.val(variant.data('amt')>0 ? variant.data('amt'):"")
    if (variant.index() == 0) quant.invisible()
    else quant.visible()

    var images = $(this).siblings('.image')
    var image = images.find('img[data-id='+$(this).val()+']')
    if (image.attr('src').indexOf('no-image') == -1)
    { images.find('img').hide()
      image.show() }
    else
    { images.find('img').hide() 
      images.find('img:first').show() }
  })

  $('.item input[type=tel]').change(function(e) {
    var newV = this.value
    var oldV = this.oldvalue
    var id = $(this).siblings('input[name=id]').val()
    var cart = $('.cart-count').html()
    this.value = newV = (newV && newV>=0) ? newV:0

    cart = (cart) ? parseInt(cart):0
    if (cart<2) $('.hidden-count').removeClass('hidden-count')
    cart += newV-oldV
    $('.cart-count').text(cart)

    var variants = $(this).parent().siblings('.variants')
    variants.find('option:selected').data('amt', newV)

    var data = {}
    data[id] = newV
    
    this.oldvalue = this.value
    if (newV==0) this.value = null
  })

  $('.items').scroll(function() { setLegend(this) })
  $(window).resize(function() { setLegends() })
  setLegends()
})

function setLegends()
{ $('.items').each(function(i) { setLegend(this) }) }

function setLegend(aisle) {
  var scrWid = $(window).width()
  var lrg=753, med=464

  var ailWid = aisle.offsetWidth
  var ailL = aisle.offsetLeft + aisle.scrollLeft
  var ailR = ailL + ailWid

  var lines = $(aisle).find('.underline')

  var refa, a, aWid, linWid, linL, linR, edge, isLeft, isRight

  var room, cent, sib, sibL, sibR,
      aSib, aSibWid, aSibR, aSibL

  if (scrWid >= lrg) {
    var end = false
    lines.each(function(i) {

      refa = $(this).find('a')[0]
      aWid = refa.offsetWidth
      a = $(refa)

      linWid = this.offsetWidth
      linL = this.offsetLeft
      linR = linL + linWid
      room = linR - ailL

      isLeft  = (linL <= ailL)
      isRight = (linR >= ailR)

      if (i==0)
      { if (isLeft) // if underline is going out of view from the left
        { if (room > (aWid+2)) // if there's enough room for text
          { cent = (linWid-room)/2 // center text in remaining room
            a.css({ 'font-size':'1em' }); a.css({ left: cent }) }
          else // dock to the left edge of the fieldset
          { a.css({ 'font-size': (room<0)?'0.7em':'1em' })
            edge = linL + ((linWid/2) - (refa.offsetWidth/2))
            a.css({ left: ailL - edge + 2 }) } }
        else if (a.is('[style]')) a.removeAttr('style') }
      else
      { aSib = $(lines[i-1]).find('a')[0] // previous anchor
        aSibR = aSib.offsetLeft + aSib.offsetWidth
        if (isLeft)
        { if ((aSibR+9) < (linR-(room/2)-(aWid/2))) // if texts not touching
          { cent = (linWid-room)/2
            a.css({ 'font-size':'1em' }); a.css({ left: cent })
            if (i == lines.length-1) end = true; // last anchor is handled here
            else if (a.text().charAt(0) == '|') a.text(a.text().substr(2)) }
          else // dock to previous anchor
          { a.css({ 'font-size': (linR < aSibR)?'0.7em':'1em' })
            if (a.text().charAt(0) != '|')
              a.text("| "+a.text())
            if (a.text().charAt(a.text().length-1) == '|')
              a.text(a.text().slice(0,-2)) // don't do in reverse
            edge = linL + ((linWid/2) - (refa.offsetWidth/2))
            a.css({ left: aSibR - edge + 3 }) } }
        else if (!isRight  &&  aSibR > linL)
        { if ((aSibR+9) < (linR-(linWid/2)-(aWid/2))) // texts not touching
          { a.css({ 'font-size':'1em' })
            if (a.is('[style]')) a.removeAttr('style')
            if (a.text().charAt(0) == '|')
              a.text(a.text().substr(2)) }
          else // dock to previous anchor
          { a.css({ 'font-size': (linR < aSibR)?'0.7em':'1em' })
            if (a.text().charAt(0) != '|')
              a.text("| "+a.text())
            if (a.text().charAt(a.text().length-1) == '|')
              a.text(a.text().slice(0,-2)) // don't do in reverse
            edge = linL + ((linWid/2) - (refa.offsetWidth/2))
            a.css({ left: aSibR - edge + 3 }) } }
        else
        { if (a.text().charAt(0) == '|')
            a.text(a.text().substr(2))
          if (a.is('[style]')) a.removeAttr('style') } }
    })

    lines.reverse().each(function(i) {

      refa = $(this).find('a')[0]
      aWid = refa.offsetWidth
      a = $(refa)

      linWid = this.offsetWidth
      linL = this.offsetLeft
      linR = linL + linWid
      room = ailR - linL

      isLeft  = (linL <= ailL)
      isRight = (linR >= ailR)

      if (isLeft && isRight)
        a.css({ left: (ailL+(ailWid/2)) - (linL+(linWid/2)) })

      else if (i==0)
      { if (isRight)
        { if (room > (aWid+2))
          { cent = (linWid-room)/-2
            a.css({ 'font-size':'1em' }); a.css({ left: cent }) }
          else
          { a.css({ 'font-size': (room<0)?'0.7em':'1em' })
            edge = linR - ((linWid/2) - (refa.offsetWidth/2))
            a.css({ left: ailR - edge - 2 }) } }
        else if (a.is('[style]') && !end) a.removeAttr('style') }
      else
      { aSib = $(lines[i-1]).find('a')[0] // next anchor
        aSibL = aSib.offsetLeft
        if (isRight)
        { if ((aSibL-9) > (linL+(room/2)+(aWid/2))) // if texts not touching
          { cent = (linWid-room)/-2
            a.css({ 'font-size':'1em' }); a.css({ left: cent })
            if (a.text().charAt(a.text().length-1) == '|')
              a.text(a.text().slice(0,-2)) }
          else // dock to next anchor
          { a.css({ 'font-size': (linL > aSibL)?'0.7em':'1em' })
            if (a.text().charAt(a.text().length-1) != '|')
              a.text(a.text()+" |")
            edge = linR - ((linWid/2) - (refa.offsetWidth/2))
            a.css({ left: aSibL - edge - 3 }) } }
        else if (!isLeft  &&  aSibL < linR)
        { if ((aSibL-9) > (linL+(linWid/2)+(aWid/2))) // texts not touching
          { a.css({ 'font-size':'1em' })
            if (a.is('[style]')) a.removeAttr('style')
            if (a.text().charAt(a.text().length-1) == '|')
              a.text(a.text().slice(0,-2)) }
          else // dock to next anchor
          { a.css({ 'font-size': (linL > aSibL)?'0.7em':'1em' })
            if (a.text().charAt(a.text().length-1) != '|')
              a.text(a.text()+" |")
            edge = linR - ((linWid/2) - (refa.offsetWidth/2))
            a.css({ left: aSibL - edge - 3 }) } }
        else if (a.text().charAt(a.text().length-1) == '|')
          a.text(a.text().slice(0,-2)) }
    })
  } // end large screen

  else lines.each(function(i) {
    var sep = 40
    a = $(this).find('a')[0]
    aWid = a.offsetWidth
    a = $(a)

    if (a.text().charAt(0) == '|') a.text(a.text().substr(2))
    if (a.text().charAt(a.text().length-1) == '|')
      a.text(a.text().slice(0,-2))

    linWid = this.offsetWidth
    linL = this.offsetLeft
    linR = linL + linWid
    edge = (linWid/2) - (aWid/2)

    isLeft  = (linL <= ailL)
    isRight = (linR >= ailR)

    if (isLeft && isRight)
      a.css({ left: (ailL+(ailWid/2)) - (linL+(linWid/2)) })

    else if (isLeft)
    { room = linR - ailL
      if (room > aWid)
      { a.css({ 'font-size':'1em' })
        a.css({ left: (linWid-room)/2 }) }
      else
      { if (scrWid < med) a.css({ left: edge })
        else
        { a.css({ 'font-size': (room<0) ? '0.8em' : '1em' })
          if (i+2 < lines.length)
          { sib = lines[i+1]
            sibR = sib.offsetLeft + sib.offsetWidth
            aSibWid = $(sib).find('a')[0].offsetWidth
            room = sibR - aWid - aSibWid - sep
            if (sibR-ailL > 0  &&  ailL+aWid < room)
              a.css({ left: ailL - (linL+edge) + 2 })
            else a.css({ left: room - (linL+edge+aWid) }) }
          else a.css({ left: ailL - (linL+edge) + 2 })
    } } }

    else if (isRight)
    { room = ailR - linL
      if (room > aWid)
      { a.css({ 'font-size':'1em' })
        a.css({ left: (linWid-room)/-2 }) }
      else
      { if (scrWid < med) a.css({ left: -(edge) })
        else
        { a.css({ 'font-size': (room<0) ? '0.8em' : '1em' })
          if (i-2 >= 0)
          { sib = lines[i-1]
            sibL = sib.offsetLeft
            aSibWid = $(sib).find('a')[0].offsetWidth
            room = sibL + aWid + aSibWid + sep
            if (ailR-sibL > 0  &&  ailR-aWid > room)
              a.css({ left: ailR - (linR-edge) - 2 })
            else a.css({ left: room - (linR-edge-aWid) }) }
          else a.css({ left: ailR - (linR-edge) - 2 })
    } } }

    else if (a.is('[style]')) a.removeAttr('style')
  })
}
