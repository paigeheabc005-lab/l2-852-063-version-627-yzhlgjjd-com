(function(){
  var btn=document.querySelector('[data-menu]');
  var menu=document.querySelector('[data-mobile-nav]');
  if(btn&&menu){btn.addEventListener('click',function(){menu.classList.toggle('open')})}
  var slides=[].slice.call(document.querySelectorAll('.hero-slide'));
  var dots=[].slice.call(document.querySelectorAll('.hero-dot'));
  if(slides.length>1){
    var current=0;
    var show=function(i){slides[current].classList.remove('active');if(dots[current])dots[current].classList.remove('active');current=(i+slides.length)%slides.length;slides[current].classList.add('active');if(dots[current])dots[current].classList.add('active')};
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i)})});
    setInterval(function(){show(current+1)},5200)
  }
  var panel=document.querySelector('[data-filter-panel]');
  if(panel){
    var input=panel.querySelector('[data-search-input]');
    var type=panel.querySelector('[data-type-filter]');
    var region=panel.querySelector('[data-region-filter]');
    var year=panel.querySelector('[data-year-filter]');
    var cards=[].slice.call(document.querySelectorAll('.movie-card'));
    var empty=document.querySelector('[data-empty]');
    var run=function(){
      var q=(input&&input.value||'').trim().toLowerCase();
      var t=type&&type.value||'';
      var r=region&&region.value||'';
      var y=year&&year.value||'';
      var visible=0;
      cards.forEach(function(card){
        var text=(card.getAttribute('data-title')+' '+card.getAttribute('data-tags')+' '+card.getAttribute('data-genre')).toLowerCase();
        var ok=(!q||text.indexOf(q)>-1)&&(!t||card.getAttribute('data-type')===t)&&(!r||card.getAttribute('data-region')===r)&&(!y||card.getAttribute('data-year')===y);
        card.classList.toggle('hidden-card',!ok);
        if(ok)visible++
      });
      if(empty)empty.classList.toggle('show',visible===0)
    };
    [input,type,region,year].forEach(function(el){if(el){el.addEventListener('input',run);el.addEventListener('change',run)}})
  }
})();