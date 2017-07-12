(function() {
  var svg = document.querySelector('svg');
  var outline = document.querySelector('#outline');
  var waterColor = document.querySelector('#water-color');
  var waves = document.querySelector('#waves');
  var cityLine = document.querySelector('#city-line');
  var skydome = document.querySelector('#skydome');
  var building1 = document.querySelector('#building-1');
  var building2 = document.querySelector('#building-2');
  var building3 = document.querySelector('#building-3');
  var building4 = document.querySelector('#building-4');
  var building5 = document.querySelector('#building-5');
  var building6 = document.querySelector('#building-6');
  var building7 = document.querySelector('#building-7');
  var building8 = document.querySelector('#building-8');
  var cityHall = document.querySelector('#city-hall');
  var cntower = document.querySelector('#cntower');
  var boat1 = document.querySelector('#boat-1');
  var boat2 = document.querySelector('#boat-2');
  var cloud1 = document.querySelector('#cloud-1');
  var cloud2 = document.querySelector('#cloud-2');

  var tl = new TimelineLite();

  tl.to(svg, 0, {opacity: 1});
  tl.to(outline, 1.5, {strokeDashoffset: 0, ease: Power2.easeOut}, 'water');
  tl.from(waterColor, 0.8, {y: 180}, 'water+=0.2');
  tl.from(waves, 0.8, {y: 180}, 'water+=0.2');
  tl.to(cityLine, 0.4, {strokeDashoffset: 0, ease: Power2.easeOut}, 'buildings-=0.4');

  tl.from(skydome, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings-=0.4');
  tl.from(building1, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings-=0.2');
  tl.from(building2, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings');
  tl.from(cntower, 1, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings+=0.2');

  tl.from(building8, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings-=0.4');
  tl.from(building7, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings-=0.2');
  tl.from(building6, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings');
  tl.from(building5, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings+=0.2');
  tl.from(cityHall, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings+=0.4');
  tl.from(building4, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings+=0.6');
  tl.from(building3, 0.8, {y: -100, opacity: 0, ease: Bounce.easeOut}, 'buildings+=0.8');

  tl.from(boat1, 0.8, {opacity: 0, ease: Power2.easeOut}, 'buildings+=0.2');
  tl.from(boat2, 0.8, {opacity: 0, ease: Power2.easeOut}, 'buildings+=0.4');

  tl.from(cloud1, 0.6, {x: -60, opacity: 0, ease: Power2.easeOut}, '-=0.5');
  tl.from(cloud2, 0.6, {x: 60, opacity: 0, ease: Power2.easeOut}, '-=0.8');

})();
