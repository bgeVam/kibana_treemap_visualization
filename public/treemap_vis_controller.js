import {
  renderTreeMap
} from './treemap_d3';

export default class TreemapVisualizationController {
  constructor(el, vis) {
    this.vis = vis;
    this.el = el;
  }

  destroy() {
    this.el.innerHTML = '';
  }

  render(table, status) {
    this.destroy();
    var treemap = document.createElement('div');
    treemap.setAttribute("id", "treemap");
    treemap.setAttribute("class", "treemapclass");
    this.el.appendChild(treemap);
    var values = [];
    table.rows.forEach(function(entry) {
      values.push(renameRow(entry, table.columns));
    });
    var keyLabels = getKeyLabels(table.columns);
    var data = nestData(values, keyLabels);
    // we reduce the data, labels and columns as we don't want a level in the tree with a single child
    keyLabels = reduceLabelsAndColumns(data, keyLabels, table.columns);
    data = reduceLevels(data);
    var parent = $('#treemap').closest('.visualization');
    renderTreeMap({
      childLabels: keyLabels,
      vis: this.vis,
      table: table,
      width: parent.width(),
      height: parent.height()
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

function reduceLevels(data) {
  if (data.length == 1) {
    if (data[0].values) {
      return reduceLevels(data[0].values);
    } else {
      return data;
    }
  } else {
    return data;
  }
}

function reduceLabelsAndColumns(data, labels, columns) {
  if (data.length == 1) {
    if (data[0].values) {
      labels.shift();
      columns.shift();
      return reduceLabelsAndColumns(data[0].values, labels, columns);
    } else {
      return labels;
    }
  } else {
    return labels;
  }
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
        result = entry.name;
      }
    }
  });
  return result;
}

function getKeyLabels(columns) {
  var keyLabels = [];
  columns.forEach(function(entry) {
    if (entry.name != "Count") {
      keyLabels.push(entry.name);
    }
  });
  return keyLabels;
}