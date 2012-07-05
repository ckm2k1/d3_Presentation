/*global console:false*/
var circles_obj = (function() {

    var data = (function() {
      var c = [], i=0;
      for (; i < 30; i++) {
        c.push(Math.floor(2 + (Math.random() * 25)));
      }
      return c;
    })();
    console.log(data);
    var h = 300, w = 960;

    var x = function() { return Math.floor(Math.random() * (w-50) + 25); };
    var y = function() { return Math.floor(Math.random() * (h-60)) + 25; };

    //configure the SVG.
    var svg = d3.select('#circles')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

    //Bind the data and set attribs
    svg.selectAll('circles')
        .data(data)
      .enter().append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', function(d) { return d;  })
        .attr('class', 'circle-section')
        .attr('opacity', function() { return Math.random() + 0.15; });


    return svg;

})();