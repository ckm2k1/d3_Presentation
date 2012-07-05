/*global d3:false*/
var axis = (function() {

  var h = 500, w = 960, margin_right = 20, margin_left = 20;

  var svg = d3.select('#axis')
            .append('svg')
            .attr('width', w)
            .attr('height', h);

var y = d3.scale.linear()
    .domain([0, 45])
    .range([0, 410]);

var x = d3.scale.linear()
    .domain([0, 45])
    .range([0, 410]);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  svg.append("g")
      .attr("transform", "translate(100 40)")
      .attr("class", "y axis")
      .call(yAxis);

  svg.append("g")
      .attr("transform", "translate(100 40)")
      .attr("class", "x axis")
      .call(xAxis);
})();