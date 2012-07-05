/*global d3:false*/

var full_chart = function() {

    var margin = {top: 80, right: 80, bottom: 200, left: 80},
        width = 960,
        height = 720;

    var x = d3.scale.linear()
        .range([0, width - margin.left - margin.right]);

    var y = d3.scale.linear()
        .range([height - margin.top - margin.bottom, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickPadding(8);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickPadding(8);

    function chart(selection) {
      selection.each(function(d) {

        pad(x.domain(d3.extent(d, xValue)), 40);
        pad(y.domain(d3.extent(d, yValue)), 40);

        var svg = d3.select(this).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "dot chart")
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll(".dot")
            .data(d)
          .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return x(d.x); })
            .attr("cy", function(d) { return y(d.y); })
            .attr("r", 12);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y.range()[0] + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

      });
    }

    function pad(scale, k) {
      var range = scale.range();
      if (range[0] > range[1]) k *= -1;
      return scale.domain([range[0] - k, range[1] + k].map(scale.invert)).nice();
    }

    function xValue(d) {
      return d.x;
    }

    function yValue(d) {
      return d.y;
    }

    return chart;
};