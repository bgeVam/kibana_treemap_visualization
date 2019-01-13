import { draw, draw1 } from './treemap_d3';

var s = document.createElement("style");
s.innerHTML = '#chart {  background: #fff;  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;}.title {    font-weight: bold;    font-size: 24px;    text-align: center;    margin-top: 6px;    margin-bottom: 6px;}text {  pointer-events: none;} .grandparent text {  font-weight: bold;}rect {  fill: none;  stroke: #fff;}rect.parent,.grandparent rect {  stroke-width: 2px;}rect.parent {    pointer-events: none;}.grandparent rect {  fill: orange;}.grandparent:hover rect {  fill: #ee9700;} .children rect.parent, .grandparent rect {  cursor: pointer;} .children rect.parent {  fill: #bbb;  fill-opacity: .5;}.children:hover rect.child {  fill: #bbb;}';
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
  render({visData, response}) {
    this.container.innerHTML = '';
    //this behavior is rather strange:
    response = visData
    console.log(visData)
    console.log(response)

    var chart = document.createElement('div');
    chart.setAttribute("id", "chart");
    chart.style.width='500px';
    this.container.appendChild(chart);
    //var c1 = $('#chart');
    //$('#chart').width(400).height(300);
    //console.log(c1.width())
     // Equivalent to document.getElementById( "foo" )

    
    var opts = {
    title: "", // Title 
    rootname: "TOP", // Name of top-level entity in case data is an array
    format: ",d", // Format as per d3.format (https://github.com/mbostock/d3/wiki/Formatting)
    field: "data", // Object field to treat as data [default: data]
    width: 960, // Width of SVG
    height: 500, // Height of SVG
    margin: { top: 48, right: 0, bottom: 0, left: 0 } // Margin as per D3 convention
    };
    console.log("TEST1")
    draw1(response);
    draw(response);
    console.log("TEST2")


    return new Promise(resolve => {
      resolve('when done rendering');
    });

  }
};
