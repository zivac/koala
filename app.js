var koa = require('koa');
var fs = require('fs');

var app = koa();
var router = require('koa-router')();

fs.readdir('controllers', function(err, files) {
    var jsFiles = files.filter(function(filename) {
        return filename.indexOf('.js') == filename.length - 3;
    });
    jsFiles.forEach(function(file) {
        var exports = require('./controllers/' + file);
        for(var controllerName in exports) {
            var controller = exports[controllerName];
            var controllerInstance = new controller;
            var routeName = controller.prototype.constructor.name.toLowerCase().replace('controller', '');
            Object.getOwnPropertyNames(controller.prototype).forEach(function(fun) {
                var route = '/' + routeName;
                if(fun != 'index') route += '/' + fun;
                router.all(route, function *(next) {
                    yield next;
                    controllerInstance[fun].apply(this, []);
                })
            })
        }
    })
    app.use(router.routes());
    app.listen(3000);
})

