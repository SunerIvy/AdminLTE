// //  jQuery 3 -->
window.$ = window.jQuery = require('../../bower_components/jquery/dist/jquery');
// //  jQuery UI 1.11.4 -->
require("../../bower_components/jquery-ui/jquery-ui.min.js");
//  Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
$.widget.bridge('uibutton', $.ui.button);
//  Bootstrap 3.3.7 -->
require("../../bower_components/bootstrap/dist/js/bootstrap.min.js");
//  Morris.js charts -->
require("../../bower_components/raphael/raphael.min.js");
require("../../bower_components/morris.js/morris.min.js");
//  Sparkline -->
require("../../bower_components/jquery-sparkline/dist/jquery.sparkline.min.js");
//  jvectormap -->
require("../../plugins/jvectormap/jquery-jvectormap-1.2.2.min.js");
require("../../plugins/jvectormap/jquery-jvectormap-world-mill-en.js");
//  jQuery Knob Chart -->
require("../../bower_components/jquery-knob/dist/jquery.knob.min.js");
//  daterangepicker -->
require("../../bower_components/moment/min/moment.min.js");
require("../../bower_components/bootstrap-daterangepicker/daterangepicker.js");
//  datepicker -->
require("../../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js");
//  Bootstrap WYSIHTML5 -->
require("../../plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.js");
//  Slimscroll -->
require("../../bower_components/jquery-slimscroll/jquery.slimscroll.min.js");
//  FastClick -->
require("../../bower_components/fastclick/lib/fastclick.js");
//  AdminLTE dashboard demo (This is only for demo purposes) -->
require("../../dist/js/pages/dashboard.js");
//  AdminLTE App -->
require("../../dist/js/adminlte.js");

//  AdminLTE for demo purposes -->
require("../../dist/js/demo.js");