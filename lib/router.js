/**
 * Created by bthiru on 11/11/2016.
 */
var _       = require('underscore');
var _s      = require('underscore.string');
var fs      = require('fs');
var yaml    = require('js-yaml');

var router = {
    routes: {},
    generate: function(route, parameters) {
        var url             = this.routes[route].pattern
        var regex           = /(:[a-z]{1,})/g
        var urlParameters   = url.match(regex, route.pattern);

        if (_.isArray(urlParameters)) {
            _.each(parameters, function(value, parameter){
                url = url.replace(':' + parameter, value);
            });
        }

        return url;
    },
    validateRoutes: function(routes) {
        if (routes) {
            _.each(routes, function(route, name){
                var pattern = route.pattern;

                if (_.isUndefined(pattern)) {
                    throw new Error(_s.sprintf('route "%s" is missing the "pattern" attribute', name));
                }

                if (typeof pattern != 'string') {
                    throw new Error(_s.sprintf('the pattern of the route "%s" must be a string (found %s)', name, JSON.stringify(pattern)));
                }
            });

            return true;
        }

        return false;
    },
    load: function(routes) {
        if (this.validateRoutes(routes)) {
            this.routes = _.extend(this.routes, routes);
        }

        return this.routes;
    },
    loadFromFile: function(filePath) {
        this.load(yaml.safeLoad(fs.readFileSync(filePath, 'utf8')))
    },
    resolve: function(request, response) {
        this.request    = request;
        var self        = this;
        var match       = null;

        _.each(this.routes, function(route){
            if (self.match(route, request)) {
                match = route;
            }
        })

        return match;
    },
    match: function(route, request) {
        var self    = this;
        var result  = false;
        var methods = [
            'exact',
            'regex'
        ];

        var matches = _.some(methods, function(method){
            var matchUrl = _s.sprintf('matchBy%s', _s.capitalize(method));

            if (self[matchUrl](route, request) == true && self.matchMethod(route, request) == true && self.matchHost(route, request) == true) {
                route.resolution = method;

                return method;
            }
        });

        return matches;
    },
    matchHost: function(route, request) {
        if (route.host) {
            return route.host == request.headers.host;
        }

        return true;
    },
    matchMethod: function(route, request) {
        if (_.isArray(route.methods) && route.methods.indexOf(request.method) == -1) {
            return false;
        }

        return true;
    },
    matchByExact: function(route, request) {
        return route.pattern == request.url;
    },
    matchByRegex: function(route, request) {
        var result;
        var regex       = /(:[a-z]{1,})/g
        var routeRegex  = route.pattern.replace(regex, "(.*)");
        var parameters  = route.pattern.match(regex, route.pattern);

        if (!parameters) {
            return false;
        }

        route.parameters = {};

        if (result = request.url.match(routeRegex)) {
            delete result['index']
            delete result['input']
            var result = result.splice(1, 3)

            _.each(parameters, function(parameter, index){
                parameter = parameter.replace(':', '');
                var value = result[index];

                if (value) {
                    route.parameters[parameter] = value;
                } else {
                    var msg = _s.sprintf(
                        'matched route with pattern "%s", but an empty parameter was detected (%s), this might mean that you mispelled one of your router, concatenating parameters (ie. /:one:two)',
                        route.pattern,
                        ':' + parameter
                    );
                    throw new Error(msg);
                }
            });

            return true
        }
    }
}

module.exports = router;