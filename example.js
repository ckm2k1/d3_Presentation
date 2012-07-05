function joinChart() {
  var mode;

  function chart(selection) {
    var modes = {};

    // mode can be space-separated, e.g., "enter update"
    mode.split(" ").forEach(function(m) { modes[m] = 1; });

    selection.each(function() {
      var svg = d3.select(this).append("svg")
          .attr("width", 1280)
          .attr("height", 720)
          .attr("class", "join chart")
        .append("g")
          .attr("transform", "translate(880,280)");

      svg.append("path")
          .attr("d", "M0,-139A160,160 0 0 0 0,139A160,160 0 1 1 0,-139")
          .style("fill", "#9e9ac8")
          .style("fill-opacity", "enter" in modes ? null : 0);

      svg.append("path")
          .attr("d", "M0,-139A160,160 0 0 0 0,139A160,160 0 0 0 0,-139")
          .style("fill", "#e377c2")
          .style("fill-opacity", "update" in modes ? null : 0);

      svg.append("path")
          .attr("d", "M0,-139A160,160 0 1 1 0,139A160,160 0 0 0 0,-139")
          .style("fill", "#74c476")
          .style("fill-opacity", "exit" in modes ? null : 0);

      svg.append("text")
          .attr("x", -80)
          .attr("y", -170)
          .style("fill", "#fff")
          .text("Data");

      svg.append("text")
          .attr("x", 80)
          .attr("y", -170)
          .style("fill", "#fff")
          .text("Elements");

      svg.selectAll("path")
          .style("stroke", "#fff")
          .style("stroke-width", "2px");

      svg.selectAll("text")
          .attr("text-anchor", "middle")
          .style("font-size", "24px");
    });
  }

  chart.mode = function(_) {
    if (!arguments.length) return mode;
    mode = _ + "";
    return chart;
  };

  return chart;
}

function barChart() {
  var margin = {top: 80, right: 80, bottom: 200, left: 80},
      width = 1280,
      height = 720;

  var x = d3.scale.linear()
      .range([0, width - margin.left - margin.right]);

  var y = d3.scale.ordinal()
      .rangeRoundBands([height - margin.top - margin.bottom, 0], .2);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickPadding(8);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(0)
      .tickPadding(8);

  function chart(selection) {
    selection.each(function(d) {

      x.domain([0, d3.max(d)]);
      y.domain(d3.range(d.length));

      var svg = d3.select(this).append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "bar chart")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.selectAll(".bar")
          .data(d)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("y", function(d, i) { return y(i); })
          .attr("width", x)
          .attr("height", y.rangeBand());

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + y.rangeExtent()[1] + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .selectAll("text")
          .text(function(d) { return String.fromCharCode(d + 65); });

    });
  }

  return chart;
}

function dotChart() {
  var margin = {top: 80, right: 80, bottom: 200, left: 80},
      width = 1280,
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
}

function timeChart() {
  var margin = {top: 80, right: 80, bottom: 200, left: 80},
      width = 1280,
      height = 720;

  var xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; };

  var x = d3.time.scale();

  var y = d3.scale.linear();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickPadding(8);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("right")
      .tickPadding(8);

  var area = d3.svg.area()
      .x(X)
      .y1(Y);

  var line = d3.svg.line()
      .x(X)
      .y(Y);

  function chart(selection) {
    selection.each(function(data) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) { return [xValue.call(data, d, i), yValue.call(data, d, i)]; });

      x   .domain(d3.extent(data, function(d) { return d[0]; }))
          .range([0, width - margin.left - margin.right]);

      y   .domain([0, d3.max(data, function(d) { return d[1]; })]).nice()
          .range([height - margin.top - margin.bottom, 0]);

      area.y0(y.range()[0]);

      var svg = d3.select(this).append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "time chart")
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("rect")
          .attr("class", "background")
          .attr("width", x.range()[1])
          .attr("height", y.range()[0]);

      svg.append("g")
          .attr("class", "x axis minor")
          .attr("transform", "translate(0," + y.range()[0] + ")")
          .call(xAxis.tickSubdivide(1).tickSize(-y.range()[0]));

      svg.append("g")
          .attr("class", "y axis minor")
          .attr("transform", "translate(" + x.range()[1] + ")")
          .call(yAxis.tickSubdivide(1).tickSize(-x.range()[1]));

      svg.append("g")
          .attr("class", "x axis major")
          .attr("transform", "translate(0," + y.range()[0] + ")")
          .call(xAxis.tickSubdivide(0).tickSize(6));

      svg.append("g")
          .attr("class", "y axis major")
          .attr("transform", "translate(" + x.range()[1] + ")")
          .call(yAxis.tickSubdivide(0).tickSize(6));

      svg.append("path")
          .attr("class", "area")
          .attr("d", area(data));

      svg.append("path")
          .attr("class", "line")
          .attr("d", line(data));
    });
  }

  // The x-accessor for the path generator; x ○ xValue.
  function X(d) {
    return x(d[0]);
  }

  // The x-accessor for the path generator; y ○ yValue.
  function Y(d) {
    return y(d[1]);
  }

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  return chart;
}

function colorChart() {

  function chart(selection) {
    selection.each(function(d) {

      var palette = d3.select(this).selectAll(".palette")
          .data(d)
        .enter().append("div")
          .attr("class", "color palette");

      palette.append("div")
          .attr("class", "label")
          .text(function(d) { return "d3.scale." + d; });

      var swatch = palette.selectAll(".swatch")
          .data(function(d) { return d3.scale[d]().range(); })
        .enter().append("div")
          .attr("class", "swatch")
          .style("background", String);
    });
  }

  return chart;
}

function streamChart() {
  var n = 20, // number of layers
      m = 200, // number of samples per layer
      stack = d3.layout.stack().offset("wiggle");

  var w = 1280,
      h = 560;

  var x = d3.scale.linear()
      .domain([0, m - 1])
      .range([0, w]);

  var y = d3.scale.linear()
      .range([h, 80]);

  var area = d3.svg.area()
      .interpolate("basis")
      .x(function(d) { return x(d.x); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y + d.y0); });

  function chart(selection) {
    selection.each(function() {

      var data = stack(layers(n, m));

      y.domain([
        d3.min(data, function(d) { return d3.min(d, function(d) { return d.y0; })}),
        d3.max(data, function(d) { return d3.max(d, function(d) { return d.y + d.y0; })})
      ]);

      var svg = d3.select(this).append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("class", "stream chart");

      svg.selectAll("path")
          .data(data)
        .enter().append("path")
          .attr("class", "area")
          .attr("d", area)
          .style("fill-opacity", function() { return Math.random() * .8 + .2; });
    });
  }

  // Inspired by Lee Byron's test data generator.
  function layers(n, m, o) {
    if (arguments.length < 3) o = 0;
    function bump(a) {
      var x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
      for (var i = 0; i < m; i++) {
        var w = (i / m - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }
    return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(index);
    });
  }

  function index(d, i) {
    return {x: i, y: Math.max(0, d)};
  }

  return chart;
}

function interpolateChart() {
  var width = 1280,
      height = 720;

  var n = 36,
      random = d3.random.normal(height / 2, 20),
      data = d3.range(n).map(random);

  var x = d3.scale.linear()
      .domain([0, n - 1])
      .range([0, width]);

  var area = d3.svg.area()
      .x(function(d, i) { return x(i); })
      .y0(height)
      .y1(Number)

  function chart(selection) {
    selection.each(function(d) {

      var svg = d3.select(this).selectAll("svg")
          .data([null]);

      var svgEnter = svg.enter().append("svg")
          .datum(data)
          .attr("class", "interpolate chart")
          .attr("width", width)
          .attr("height", height)
          .on("mousemove", mousemove);

      svgEnter.append("rect")
          .attr("class", "background")
          .attr("width", width)
          .attr("height", height)
          .style("pointer-events", "all");

      svgEnter.append("path")
          .attr("class", "area");

      svgEnter.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("r", 6);

      svg.selectAll("circle")
          .attr("cx", function(d, i) { return x(i); })
          .attr("cy", Number);

      svg.select("path")
          .attr("d", area);
    });
  }

  function mousemove(d) {
    var m = d3.mouse(this),
        i = Math.floor(x.invert(m[0]));
    d[i] = m[1] % height; // XXX webkit-transform-3d
    var svg = d3.select(this);
    svg.selectAll("circle").data(d).attr("cy", Number);
    svg.select("path").attr("d", area);
  }

  return d3.rebind(chart, area, "interpolate");
}
