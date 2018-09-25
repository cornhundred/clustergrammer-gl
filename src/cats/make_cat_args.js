var m3 = require('./../draws/mat3_transform');
var color_to_rgba = require('./../colors/color_to_rgba');

module.exports = function make_cat_args(regl, params, inst_axis, cat_index){

  var cat_index_name = 'cat-' + String(cat_index);

  // console.log('generalizing mat_size')
  /*

  Hacking Categories Plan
  ------------------------
  Make a buffer of vec4's that will pass rgba data for the different category
  colors. Then pass this as an attribute (or varying?) to the fragment shader.

  */

  // var inst_rgba = color_to_rgba('#ff0000', 0.5);
  var inst_rgba = color_to_rgba('purple', 0.95);

  // var color_names = _.keys(olor_table);

  var num_labels = params['num_'+inst_axis];

  // category tiles have fixed heights
  var cat_height;
  // category widths depend on the number of labels
  var cat_width;
  var mat_size;
  var top_shift_triangles;
  cat_height = 0.04;
  if (inst_axis === 'col'){
    mat_size = params.heat_size.x;
    top_shift_triangles = params.viz_dim.mat_size.y;
    cat_width = (mat_size/0.5)/num_labels;

  } else {
    mat_size = params.heat_size.y;
    top_shift_triangles = params.viz_dim.mat_size.x;
    cat_width = (params.heat_size.y/0.5)/num_labels;
  }

  var zoom_function = function(context){
    return context.view;
  };

  var shift_cat = 0.025 * (cat_index + 1);
  var top_offset = -top_shift_triangles - cat_height + shift_cat;


  /////////////////////////////////
  // Label Color Buffer
  /////////////////////////////////

  var color_arr = [];
  for (var i = 0; i < num_labels; i++){

    var inst_cat = params.network[inst_axis + '_nodes'][i][cat_index_name];
    // console.log(inst_cat)

    /*
      Added fallback color
    */
    var inst_color;
    if ('cat_colors' in params.network){

      if (cat_index_name in params.network.cat_colors[inst_axis]){
        try {
          inst_color = params.network.cat_colors[inst_axis][cat_index_name][inst_cat];
        }
        catch(err){
          // get random colors from color dictionary
          inst_color = 'white';
        }
      } else {
        // get random colors from color dictionary
        inst_color = 'white';
      }

    } else {

      // get random colors from color dictionary
      inst_color = 'white';
    }

    color_arr[i] = color_to_rgba(inst_color, 1);
  }

  const color_buffer = regl.buffer({
    length: num_labels,
    // 'type': 'vec4',
    'usage': 'dynamic'
  })

  color_buffer(color_arr);

  params.color_arr = color_arr;

  /////////////////////////////////
  // Rotation and Scaling
  /////////////////////////////////

  var scale_y = m3.scaling(2, 1);

  var rotation_radians;
  if (inst_axis === 'row'){
    rotation_radians = 0;
  } else if (inst_axis === 'col'){
    rotation_radians = Math.PI/2;
  }

  var mat_rotate = m3.rotation(rotation_radians);

  var args = {

    vert: `
      precision highp float;
      attribute vec2 ini_position;
      attribute vec2 cat_pos_att_inst;
      attribute vec2 cat_pos_att_new;
      attribute vec4 color_att;
      uniform float interp_uni;
      uniform bool run_animation;


      uniform mat3 mat_rotate;
      uniform mat3 scale_y;
      uniform mat4 zoom;
      uniform float top_offset;

      varying vec3 new_position;
      varying vec3 vec_translate;
      varying vec2 cat_pos;

      // pass varying variable to fragment from vector
      varying vec4 color_vary;

      void main () {

        new_position = vec3(ini_position, 0);

        // interpolate between the two positions using the interpolate uniform
        if (run_animation == true){
          cat_pos = mix(cat_pos_att_inst, cat_pos_att_new, interp_uni);
        } else {
          cat_pos = cat_pos_att_inst;
        }

        vec_translate = vec3(top_offset, cat_pos[0], 0);

        // rotate translated triangles
        new_position = mat_rotate * ( new_position + vec_translate ) ;

        // depth is being set to 0.45
        gl_Position = zoom * vec4( vec2(new_position), 0.45, 1);

        // pass attribute (in vert) to varying in frag
        color_vary = color_att;

      }
    `,

    frag: `

      precision mediump float;
      uniform vec4 triangle_color;

      // use the varying being passed from the vertex shader
      varying vec4 color_vary;

      // color triangle red
      void main () {

        // gl_FragColor = vec4(0.6, 0.6, 0.6, opacity_vary);

        // defining the triangle color using a uniform
        // gl_FragColor = triangle_color;

        // define the triangle color using a varying
        gl_FragColor = color_vary;
      }

    `,

    // passing a fixed value for the triangle position
    attributes: {
      ini_position: [
        [cat_height,  cat_width/2],
        [cat_height/2,  cat_width/2],
        [cat_height, -cat_width/2],

        [cat_height/2,  -cat_width/2],
        [cat_height,  -cat_width/2],
        [cat_height/2, cat_width/2],
      ],

      cat_pos_att_inst: {
        buffer: regl.buffer(params.cat_arrs.inst[inst_axis][cat_index]),
        divisor: 1
      },

      cat_pos_att_new: {
        buffer: regl.buffer(params.cat_arrs.new[inst_axis][cat_index]),
        divisor: 1
      },

      // pass color buffer
      color_att: {
        buffer: color_buffer,
        divisor: 1
      },

    },

    uniforms: {
      zoom: zoom_function,
      mat_rotate: mat_rotate,
      scale_y: scale_y,
      top_offset: top_offset,
      triangle_color: inst_rgba,
      interp_uni: (ctx, props) => Math.max(0, Math.min(1, props.interp_prop)),
      run_animation: regl.prop('run_animation')
    },

    count: 6,
    instances: num_labels,
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