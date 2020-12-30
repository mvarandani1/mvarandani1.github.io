var DEBUG = false;
//var APP_BASE_PATH = window.location.protocol + '//www.squarecapital.co.in/';
var APP_BASE_PATH = '';
var API_BASE_PATH = APP_BASE_PATH+'Api/';
//var S3_BASE_PATH = APP_BASE_PATH+'public/';
var S3_BASE_PATH = $('meta[name="cloudfront"]').attr('value');
var ELIGIBILITY_API_BASE_PATH = APP_BASE_PATH+'eligibility/';
var APPLICATION_ID_PREFIX = 'SQC00';
var DIGIO_ENV = 'production';
var BIZCONSTITUTION = 3; //For Propreitorship (In Work Tile For Default showing 100% In Percentage Holding For Business)
var BIZHOLDING = 100; //Default Value in Work Tile If Propreitorship Is Selected
var TOOLS_PATH = APP_BASE_PATH + 'tools/';
// var APP_VERSION = '1.8.4';
var CONFIG_IDLE_TIMEOUT=60; //seconds
var EVENT_TRACKING = true;

if(!DEBUG){
    if(!window.console) window.console = {};
    var methods = ["log", "debug", "warn", "info"];
    for(var i=0; i < methods.length; i++){
        console[methods[i]] = function(){};
    }
}

var reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|\/?$)/;
function environment(){
    var path = reg.exec(window.location.href)[1].replace(/\/$/, "");
    return APP_BASE_PATH + path;
}
SalariedDoc = [3, 7, 8, 9, 11, 20, 21, 22, 38, 55, 58, 66, 84, ];
SelfEmployedDoc = [10, 12, 13, 47, 48, 76, 77, 78, 89, 90, 91, 79, 80, 81, 82, 83, ];
NRIDoc = [44, 45, 62, 63, 64, 65, 68, 69, 70, 72, 73, 74, 75, 86, 92];
CommonDoc = [1, 2, 4, 5, 6, 14, 15, 16, 17, 18, 19, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40, 41, 42, 43, 46, 49, 50, 51, 56, 57, 59, 60, 61, 67, 71, 85, 87, 88, ];
RelationshipDoc = [52, 53, 54];
