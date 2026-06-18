function initPlayer(source){
  var video=document.getElementById('movie-video');
  var mask=document.querySelector('.player-mask');
  var btn=document.querySelector('[data-play]');
  if(!video||!source)return;
  var started=false;
  var attach=function(){
    if(video.dataset.ready)return;
    video.dataset.ready='1';
    if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=source;video.load()}
    else if(window.Hls&&Hls.isSupported()){var hls=new Hls({enableWorker:true,lowLatencyMode:true});hls.loadSource(source);hls.attachMedia(video)}
    else{video.src=source;video.load()}
  };
  var play=function(){
    attach();
    if(mask)mask.classList.add('is-hidden');
    video.controls=true;
    var p=video.play();
    if(p&&p.catch){p.catch(function(){})}
    started=true;
  };
  if(mask)mask.addEventListener('click',play);
  if(btn)btn.addEventListener('click',play);
  video.addEventListener('click',function(){if(!started)play()});
}