var control = require('control-panel');

module.exports = function reorder_panel(params, control_container, inst_axis){

  var panel_width = 250;



  var panel_1 = control([
    // {type: 'range', label: 'my range', min: 0, max: 100, initial: 20},
    // {type: 'range', label: 'log range', min: 0.1, max: 100, initial: 20, scale: 'log'},
    // {type: 'checkbox', label: 'my checkbox', initial: true},
    // {type: 'color', label: 'my color', format: 'rgb', initial: 'rgb(10,200,0)'},
    // {type: 'button', label: 'Alphabetically', action: function () {
    //   params.animation.run_switch = true;
    // }},
    // {type: 'button', label: 'Cluster', action: function () {
    //   params.animation.run_switch = true;
    // }},
    // {type: 'button', label: 'Rank by Sum', action: function () {
    //   // params.animation.run_switch = true;
    // }},
    // {type: 'button', label: 'Rank by Variance', action: function () {
    //   // params.animation.run_switch = true;
    // }},
    {type: 'select', label: 'select one', options: ['option 1', 'option 2'], initial: 'option 1'},
    // {type: 'multibox', label: 'check many', count: 3, initial: [true, false, true]}
  ],
    {theme: 'light', root:control_container, title: inst_axis + ' Reordering', width:panel_width}
    // {theme: 'light', position: 'top-left'}
  );

};