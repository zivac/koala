var koa = require('koa');
var fs = require('fs');

var app = koa();
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');

app.use(bodyParser());

fs.readdir('controllers', function(err, files) {
    var jsFiles = files.filter(function(filename) {
        return filename.indexOf('.js') == filename.length - 3;
    });
    jsFiles.forEach(function(file) {
        var exports = require('./controllers/' + file);
        for(var controllerName in exports) {
            var controller = exports[controllerName];
            var controllerInstance = new controller;
            var metadata = controller._metadata || {};
            var routeName = metadata.url || '/' + controller.prototype.constructor.name.toLowerCase().replace('controller', '');
            Object.getOwnPropertyNames(controller.prototype).forEach(function(fun) {
                var route = routeName;
                var method = controllerInstance[fun];
                var metadata = method._metadata || {};
                if(metadata.url || fun != 'index') route += metadata.url || ('/' + fun);
                var type = (metadata.type  && router[metadata.type.toLowerCase()])? metadata.type.toLowerCase() : 'all';
                router[type](route, function *() {
                    var params = getParamNames(controller.prototype[fun]).map((param) => {
                        if(param == 'ctx') return this;
                        else return this.request.query[param] || this.request.body[param];
                    })
                    try {
                        var response = controllerInstance[fun].apply(controller.prototype, params);
                        if(response) this.body = response;
                    } catch(err) {
                        this.throw(err);
                    }
                    
                })
            })
        }
    })
    app.use(router.routes());
    app.listen(3000);
})

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
var getParamNames = function(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

