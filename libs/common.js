var qs = require('qs'),
    merge = require('merge');


module.exports.mergeParams = function (request, response, next) {
    if (typeof request === 'object') {
        request.mergeParams = merge(request.query, qs.parse(qs.stringify(request.body)));
    }
    if (typeof next === 'function') {
        next();
    }
};

module.exports.ejsRenderWarp = function (request, response, next) {
    if (typeof request === 'object') {
        response.__render = response.render
        response.render = function (template, data, opts) {
            data = data || {};

            if (data['_warp']) {
                data._include = template;
                template = data['_warp'];
            }else{
                data._include = null;
            }

            response.__render(template, data, opts);
        }
    }
    if (typeof next === 'function') {
        next();
    }
};

/**
 * 랜덤한 문자열 만들어준다!
 * @param length 길이.
 * @returns {string} 랜덤한 문자!
 */
String.random = function (length) {
    if (length == undefined) length = 6;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < parseInt(length); i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

/**
 * 객체에서 원하는 key 값들로 이루어진 값을 꺼내는것!
 * @param object
 * @param keyNames
 * @returns {*}
 */
Object.permit = function (object, keyNames) {
    var result = {};
    var key = "";
    var lessOne = false;
    for (var i = 0; i < keyNames.length; i++) {
        key = keyNames[i];
        if (key in object) {
            result[key] = object[key];
            lessOne = true;
        }
    }
    if (lessOne) {
        return result;
    } else {
        return null;
    }
};

Object.forbid = function (object, keyNames) {
    var key = "";
    for (var i = 0; i < keyNames.length; i++) {
        key = keyNames[i];
        if (key in object) {
            delete object[key];
        }
    }
    return object;
};

Object.append = function (objectA, objectB) {
    if (objectA instanceof Array && objectB instanceof Array) {
        for (var i = 0; i < objectB.length; i++) {
            objectA.push(objectB[i]);
        }
    } else {
        for (var attrname in objectB) {
            objectA[attrname] = objectB[attrname];
        }
    }
}

