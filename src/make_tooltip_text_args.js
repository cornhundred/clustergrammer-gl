var m3 = require('./mat3_transform');

module.exports = function make_tooltip_text_args(regl, params, zoom_function){

  // prevent text from getting too large when zooming
  params.text_scale.row = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  var total_zoom = params.zoom_data.y.total_zoom;

  // smaller scale_text -> larger text
  var inst_depth = 0.01;
  var scale_text = 40; //params.text_zoom.row.scaled_num * params.text_scale.row(total_zoom);

  // scale_text is applying a zoom to x and y
  // needs to be scaled by scale_text

  var vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform float scale_text;
      uniform float heat_size;
      varying float x_position;
      varying float y_position;
      uniform float inst_depth;

      void main () {

        // the x position is constant for all row labels
        //-----------------------------------------------
        x_position =  position.x;

        // the y position varies for all row labels
        //-----------------------------------------------
        y_position = -position.y;

        gl_Position =
                      vec4(
                           x_position,
                           y_position,
                           inst_depth,
                           scale_text);
      }`;

  var frag_arg =  `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;

  var args = {
    vert: vert_arg,
    frag: frag_arg,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells'),
    uniforms: {
      scale_text: scale_text,
      inst_depth: inst_depth,
      heat_size: params.heat_size.y,
    },
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      // func: 'greater',
      range: [0, 1]
    },
  };

  return args;

};