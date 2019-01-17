import {
  renderTreeMap
} from './treemap_d3';

var css = `
#chart {
  background: #fff;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.title {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    margin-top: 6px;
    margin-bottom: 6px;
}
text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

div.treemap rect {
  fill: none;
  stroke: #fff;
}

div.treemap rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

div.treemap rect.parent {
    pointer-events: none;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
}

.children:hover rect.child {
  fill: #bbb;
}
`;

var s = document.createElement("style");
s.innerHTML = css;
document.getElementsByTagName("head")[0].appendChild(s);

export default class TreemapVisualizationController {
  constructor(el, vis) {
    this.vis = vis;
    this.el = el;
    this.container = document.createElement('div');
    this.container.className = 'myvis-container-div';
    this.el.appendChild(this.container);
  }

  destroy() {
    this.el.innerHTML = '';
  }

  render(table, status) {
    //const config = this.props.vis.params.metric;
    //const isPercentageMode = config.percentageMode;
    //const min = config.colorsRange[0].from;
    //const max = _.last(config.colorsRange).to;
    //const colors = this._getColors();
    //const labels = this._getLabels();
    const metrics = [];

    let bucketAgg;
    let bucketColumnId;
    let rowHeaderIndex;
    console.log(table)
    
  }


  ronder(visData, status) {
    console.log(visData)
    console.log(status)
    this.container.innerHTML = '';
    /*
    var treemap = document.createElement('div');
    treemap.setAttribute("id", "treemap");
    treemap.setAttribute("class", "treemapclass");
    this.container.appendChild(treemap);
    var data = response.elastic;
    data.aggregations.key = "Patients";
    var nestedData = nestData(data.aggregations, 0, []);
    renderTreeMap({
      title: "Rehabilitation Data"
    }, {
      key: data.aggregations.key,
      values: nestedData.values
    });
    */
    return new Promise(resolve => {
      resolve('when done rendering');
    });
  }
};

function nestData(data, iterationLevel, childs) {
  var result = new Object();
  result.key = data.key;
  var nextLevel = getNextLevel(Object.keys(data));
  if (nextLevel) {
    iterationLevel++;
    childs.push({
      [getChildName(iterationLevel)]: data.key
    });
    var values = [];
    data[nextLevel].buckets.forEach(function(entry) {
      values.push(nestData(entry, iterationLevel, childs));
    });
    result.values = values;
  } else {
    result.value = data.doc_count;
    childs.forEach(function(entry) {
      var propertyName = Object.keys(entry)[0];
      result[propertyName] = entry[propertyName]
    });
  }
  return result;
}

function getNextLevel(array) {
  var result = [];
  array.forEach(function(entry) {
    if (!isNaN(parseFloat(entry)) && isFinite(entry)) {
      result.push(entry)
    }
  });
  return result[0];
}

function getChildName(iterationLevel) {
  var childname = "";
  for (var i = 0; i < iterationLevel; i++) {
    childname += "child_";
  }
}