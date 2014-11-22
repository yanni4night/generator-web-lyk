var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

<%
if (includeSwig) { %>
    var swig = require('swig');
    app.engine('html', swig.renderFile);
    swig.setDefaults({
        cache: false
    }); <%
} else { %>
    var django = require('django');
    app.engine('html', django.renderFile);
    django.configure({
        template_dirs: path.join(__dirname, 'template')
    }); <%
} %>
app.set('views', path.join(__dirname, 'template'));
app.set('view engine', 'html');

app.use(favicon(__dirname + '/static/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser()); <%
if (includeLess) { %>
app.use(require('less-middleware')(path.join(__dirname))); <%
} %>
app.use(express.static(path.join(__dirname)));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});


module.exports = app;