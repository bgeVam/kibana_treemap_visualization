import {
  renderTreeMap
} from './treemap_d3';

/*
var css = `
.treemap {
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
*/

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
    this.container.innerHTML = '';
    var treemap = document.createElement('div');
    treemap.setAttribute("id", "treemap");
    treemap.setAttribute("class", "treemapclass");
    this.container.appendChild(treemap);
    var values = []
    table.rows.forEach(function(entry) {
      values.push(renameRow(entry, table.columns));
    });
    var keyLabels = getKeyLabels(table.columns);
    var data = nestData(values, keyLabels);
    renderTreeMap({}, {
      key: "test",
      values: data
    });
    return new Promise(resolve => {
      resolve('when done rendering');
    });
  }
};

function nestData(values, keyLabels) {
  var data = d3.nest();
  keyLabels.forEach(function(key) {
    data.key(function(d) {
      return d[key];
    })
  });
  data = data.entries(values);
  return data;
}

function renameRow(row, columns) {
  var result = new Object();
  for (const [key, value] of Object.entries(row)) {
    result[getKeyName(key, columns)] = value;
  }
  return result;
}

function getKeyName(key, columns) {
  var result = "";
  columns.forEach(function(entry) {
    if (entry.id == key) {
      if (entry.name == "Count") {
        result = "value";
      } else {
        result = entry.name.split('.')[0];
      }
    }
  });
  return result;
}


function getKeyLabels(columns) {
  var keyLabels = [];
  columns.forEach(function(entry) {
    if (entry.name != "Count") {
      keyLabels.push(entry.name.split('.')[0]);
    }
  });
  return keyLabels;
}