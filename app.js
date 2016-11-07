var koa = require('koa');
var fs = require('fs');

var app = new koa();
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use(async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
        error: true,
        message: err.message
    }
  }
});

var models = {};
var schema = {};

var prepareObject = function(objectString) {
    return objectString.split(',').map(param => 'public ' + param.trim() + ';').join("\n");
}

var objectExp = /\{(.*)\}/g;
var arrayExp = /\[([^\]]+)\]|Array\<(.*)\>|(.*)\[\]/g;;

var getSchema = function(code) {
    var schema = {};
    var regExp = /^ *(public|private|_) *(\w+)(?: *(=|:) *(.+?)(?:;|=)(?: *(.+?);|\s)?)?/gm;
    var match = null;
    while(match = regExp.exec(code)) {
        if(match[3] == ':') {
            var type = match[4].trim();
            var objectMatch = objectExp.exec(type);
            objectExp.lastIndex = 0;
            if(objectMatch && objectMatch[0] == type) {
                schema[match[2]] = getSchema(prepareObject(objectMatch[1]))
            } else {
                var array = schema, index = match[2];
                while(true) {
                    var arrayMatch = arrayExp.exec(type);
                    arrayExp.lastIndex = 0;
                    if(arrayMatch && arrayMatch[0] == type) {
                        type = arrayMatch[1] || arrayMatch[2] || arrayMatch[3];
                        array[index] = [];
                        array = array[index];
                        index = 0;
                    } else {
                        array[index] = objectMatch? getSchema(prepareObject(objectMatch[1])) : { type: type }
                        break;
                    }
                }
                
            }
        } else {
            schema[match[2]] = { type: 'any' }
        }
    }
    return schema;
}

//parsing models
fs.readdir('models', function(err, files) {
    var tsFiles = files.filter(function(filename) {
        return filename.indexOf('.ts') == filename.length - 3;
    });
    
    tsFiles.forEach(function(tsFile) {
        var jsFile = tsFile.replace('.ts', '.js');
        if (files.indexOf(jsFile) == -1) return;
        var exports = require('./models/'+jsFile);
        for(var modelName in exports) {
            models[modelName] = exports[modelName];
            schema[modelName] = {};
        }
        fs.readFile('models/'+tsFile, 'utf-8', function(err, code) {
            schema[modelName] = getSchema(code);
            console.log(schema[modelName]);
        });
    })
})

//parsing controllers
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
                if(fun[0] == '_') return;
                var route = routeName;
                var method = controllerInstance[fun];
                var metadata = method._metadata || {};
                if(metadata.url || fun != 'index') route += metadata.url || ('/' + fun);
                var type = (metadata.type  && router[metadata.type.toLowerCase()])? metadata.type.toLowerCase() : 'all';
                router[type](route, async function (ctx) {
                    var params = getParamNames(controller.prototype[fun]).map((param) => {
                        if(param == 'ctx') return ctx;
                        else return ctx.request.query[param] || ctx.request.body[param];
                    })
                    try {
                        var response = await controllerInstance[fun].apply(controller.prototype, params);
                        if(response) ctx.body = response;
                    } catch(err) {
                        ctx.throw(err);
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

