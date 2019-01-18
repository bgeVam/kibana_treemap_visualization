import {
  renderTreeMap
} from './treemap_d3';

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
    var values = [];
    table.rows.forEach(function(entry) {
      values.push(renameRow(entry, table.columns));
    });
    var keyLabels = getKeyLabels(table.columns);
    var data = nestData(values, keyLabels);
    renderTreeMap({
      childLabels: keyLabels,
      vis: this.vis,
      table: table
    }, {
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