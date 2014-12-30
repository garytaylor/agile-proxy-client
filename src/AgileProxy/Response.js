var _, S;
_ = require('underscore');
S = require('string');
function Response (configObj) {
    this.config = this.processConfig(configObj);
}
_.extend(Response.prototype, {
    asJson: function () {
        return this.snakeCased(this.config);
    },
    processConfig: function (config) {
        var op;
        op = _.clone(config);
        if (op.hasOwnProperty('html')) {
            op.contentType = op.contentType || 'text/html';
            op.content = op.html;
            delete op.html;
        } else if (op.hasOwnProperty('htmlTemplate')) {
            op.contentType = op.contentType || 'text/html';
            op.content = op.htmlTemplate;
            op.isTemplate = true;
            delete op.htmlTemplate;
        } else if (op.hasOwnProperty('json')) {
            op.contentType = op.contentType || 'application/json';
            op.content = JSON.stringify(op.json);
            delete op.json;

        } else if (op.hasOwnProperty('jsonTemplate')) {
            op.contentType = op.contentType || 'application/json';
            op.content = JSON.stringify(op.jsonTemplate);
            op.isTemplate = true;
            delete op.jsonTemplate;

        } else if (op.hasOwnProperty('text')) {
            op.contentType = op.contentType || 'text/plain';
            op.content = op.text;
            delete op.text;
        } else if (op.hasOwnProperty('textTemplate')) {
            op.contentType = op.contentType || 'text/plain';
            op.content = op.textTemplate;
            op.isTemplate = true;
            delete op.textTemplate;
        } else if (op.hasOwnProperty('body')) {
            op.content = op.body;
            delete op.body;
        }
        //To allow a shortcut of 'status' to mean 'statusCode'
        if (op.hasOwnProperty('status')) {
            op.statusCode = op.status;
            delete op.status;
        }
        return op;
    },
    snakeCased: function (obj) {
        var op;
        op = {};
        _.each(obj, function (v, k) {
            op[S(k).underscore()] = v;
        });
        return op;
    }
});
module.exports = Response;

