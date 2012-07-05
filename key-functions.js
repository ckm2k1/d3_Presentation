/*global console:false*/
var key_function = (function() {
var d = (function() {
  var c = []
  , i = 0
  for (; i < 50; i++) {
    //Generate random radius
    rad = Math.floor(2 + (Math.random() * 25));
    c.push(rad);
  }
  return c;
})();
var h = 720, w = 960;

var x = function() { return Math.floor(Math.random() * (w-50)) + 25; };
var y = function() { return Math.floor(Math.random() * (h-60)) + 25; };

//configure the SVG.
var svg = d3.select('#key-animation')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

//Handle update.
var circles = svg.selectAll('circle')
    .data(d)
  .enter()
  .append('circle')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', function(d) { return d; })
    .attr('class', 'circle-section')
    .attr('opacity', function() { return Math.random() + 0.15; })


function animateTransition(d) {
  for(var i=0; i < d.length; i++) { d[i] = Math.floor((Math.random() * 25) + 5); }
  circles
  .data(d)
    .transition()
      .duration(2000)
      .delay(function(d, i) { return i * 10; })
      .attr('cx', x)
      .attr('cy', y)
      .attr('r', function(d) { return d; })
      .style('fill', function() { return '#'+Math.floor(Math.random()*16777215)
                                            .toString(16); });
  }

//Handle enter selection and set intial attributes.
return { 'svg' : svg, 'data' : d, 'at' : animateTransition };
})();
var inval = setInterval("key_function.at(key_function.data)", 2000);