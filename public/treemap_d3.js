var defaults = {
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  rootname: "TOP",
  format: ",d",
  width: 960,
  height: 500
};

export function renderTreeMap(o, data) {
  var root,
    opts = $.extend(true, {}, defaults, o),
    formatNumber = d3.format(opts.format),
    rname = opts.rootname,
    margin = opts.margin,
    theight = 36 + 16;
  $('#treemap').width(opts.width).height(opts.height);
  var width = opts.width - margin.left - margin.right,
    height = opts.height - margin.top - margin.bottom - theight,
    transitioning;
  var color = d3.scale.category10();

  var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

  var treemap = d3.layout.treemap()
    .children(function(d, depth) {
      return depth ? null : d._children;
    })
    .sort(function(a, b) {
      return a.value - b.value;
    })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

  var svg = d3.select("#treemap").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");

  if (data instanceof Array) {
    root = {
      key: rname,
      values: data
    };
  } else {
    root = data;
  }
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);

  $(".children rect.parent").hover(
    function(event) {
      // Highlight child by occluding the others
      $(this).parent().siblings().css("fill-opacity", "0.7");
      $(this).parent().siblings().children().children().css("fill-opacity", "0.5");
    },
    function(event) {
      // Reset highlight
      $(this).parent().siblings().css("fill-opacity", "0.1");
      $(this).parent().siblings().children().children().css("fill-opacity", "1");
    }
  );

  if (window.parent !== window) {
    var myheight = document.documentElement.scrollHeight || document.body.scrollHeight;
    window.parent.postMessage({
      height: myheight
    }, '*');
  }

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  function accumulate(d) {
    return (d._children = d.values) ?
      d.value = d.values.reduce(function(p, v) {
        return p + accumulate(v);
      }, 0) :
      d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d._children) {
      treemap.nodes({
        _children: d._children
      });
      d._children.forEach(function(c) {
        if (c.values) {
          var depth = getDepth(d, 0);
          c.label = o.childLabels[depth];
        }
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function getDepth(d, depth) {
    if (d.parent) {
      depth = depth + 1;
      return getDepth(d.parent, depth);
    }
    return depth;
  }

  function display(d) {
    var g1 = svg.insert("g", ".grandparent")
      .datum(d)
      .attr("class", "depth");
    var g = g1.selectAll("g")
      .data(d._children)
      .enter().append("g");
    g.filter(function(d) {
        return d._children;
      })
      .classed("children", true)
      .on("click", childClicked);
    var children = g.selectAll(".child")
      .data(function(d) {
        return d._children || [d];
      })
      .enter().append("g");

    children.append("rect")
      .attr("class", "child")
      .call(rect);

    children.append("text")
      .attr("class", "ctext")
      .text(function(d) {
        return d.key;
      })
      .call(text2);

    g.append("rect")
      .attr("class", "parent")
      .call(rect);
    var t = g.append("text")
      .attr("class", "ptext")
      .attr("dy", ".75em")

    t.append("tspan")
      .text(function(d) {
        return d.key;
      });
    t.call(text);

    g.selectAll(".parent")
      .append("title")
      .text(function(d) {
        return getTooltipText(d);
      });

    g.selectAll("rect")
      .style("fill", function(d) {
        d.color = color(d.key);
        return d.color;
      });

    g.selectAll(".child")
      .style("fill", function(d) {
        var values = [];
        d.parent.values.forEach(function(entry) {
          values.push(entry.area);
        });
        var shadingRate = 1 - (d.area / values[values.length - 1] + 0.2);
        return shadeColor2(d.parent.color ? d.parent.color : d.color, shadingRate);
      });

    function shadeColor2(color, percent) {
      var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
      return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    function childClicked(d) {
      console.log("child clicked, add filter where " + d.label + " = " + d.key)
      var index = o.childLabels.indexOf(d.label);
      var bucketAgg = o.table.columns[index].aggConfig;
      if (o.table.rows.length > 1) {
        const filter = bucketAgg.createFilter(d.key);
        var queryFilter = o.vis.API.queryFilter;
        queryFilter.addFilters(filter);
      }
      return transition(d);
    }

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;
      var g2 = display(d),
        t1 = g1.transition().duration(750),
        t2 = g2.transition().duration(750);
      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) {
        return a.depth - b.depth;
      });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll(".ptext").call(text).style("fill-opacity", 0);
      t1.selectAll(".ctext").call(text2).style("fill-opacity", 0);
      t2.selectAll(".ptext").call(text).style("fill-opacity", 1);
      t2.selectAll(".ctext").call(text2).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function getTooltipText(d) {
    return "field      " + "     value \n" +
      d.label + "     " + d.key + "   " + formatNumber(d.value) + "\n";
  }

  function text(text) {
    text.selectAll("tspan")
      .attr("x", function(d) {
        return x(d.x) + 6;
      })
    text.attr("x", function(d) {
        return x(d.x) + 6;
      })
      .attr("y", function(d) {
        return y(d.y) + 6;
      });
  }

  function text2(text) {
    text.attr("x", function(d) {
        return x(d.x + d.dx) - this.getComputedTextLength() - 6;
      })
      .attr("y", function(d) {
        return y(d.y + d.dy) - 6;
      });
  }

  function rect(rect) {
    rect.attr("x", function(d) {
        return x(d.x);
      })
      .attr("y", function(d) {
        return y(d.y);
      })
      .attr("width", function(d) {
        return x(d.x + d.dx) - x(d.x);
      })
      .attr("height", function(d) {
        return y(d.y + d.dy) - y(d.y);
      });
  }

  function name(d) {
    return d.parent ?
      name(d.parent) + " / " + d.key + " (" + formatNumber(d.value) + ")" :
      d.key + " (" + formatNumber(d.value) + ")";
  }
}