var d3 = require("d3");
module.exports = function generate_webgl_to_pix(params){

  var webgl_to_pix = {};
  webgl_to_pix.x = d3.scaleLinear();
  webgl_to_pix.x
    .domain([-0.5, 0.5])
    .range([0, params.viz_dim.heat.width])
    .clamp(true);

  webgl_to_pix.y = d3.scaleLinear();
  webgl_to_pix.y
    .domain([0.5, -0.5])
    .range([0, params.viz_dim.heat.height])
    .clamp(true);

  params.webgl_to_pix = webgl_to_pix;

};