'use strict';

const Confidence = require('confidence');
const Config = require('./config');
const Meta = require('./meta');


let internals = {
    criteria: {
        env: process.env.NODE_ENV
    }
};

internals.manifest = {
    $meta: 'App manifest document',
    server: {
        connections: {
            router: {
                stripTrailingSlash: true,
                isCaseSensitive: false
            },
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web']
    }],
    registrations: [

        // Cookie authentication
        {
            plugin: 'hapi-auth-cookie'
        },

        //  Crumb
        {
            plugin: {
                register: 'crumb',
                options: {
                    cookieOptions: {
                        isSecure: false
                    }
                }
            }
        },
       
        // Static file and directory handlers
        {
            plugin: 'inert'
        },

        // Templates rendering support 
        {
            plugin: 'vision'
        },

        // Swagger support 
        {
            plugin: 'hapi-swagger'
        },

        // Views loader 
        {
            plugin: {
                register: 'visionary',
                options: {
                    engines: {
                        hbs: 'handlebars'
                    },
                    path: './app/templates',
                    layoutPath: './app/templates/layouts',
                    helpersPath: './app/templates/helpers',
                    partialsPath: './app/templates/partials',
                    layout: 'default'
                }
            }
        },

        //credentials view loader
        {
            plugin: 'hapi-context-credentials'   
        },

       // Mysql connector
        {
            plugin: {
                register: './lib/mysql',
                options: Config.get('/mysql')
            }
        },

        //  Logging connector 
        {
            plugin: {
                register: 'good',
                options: Config.get('/good')
            }
        },

        // Flash Plugin
        {
            plugin: {
                register: './lib/flash'
            }
        },

        // Hapi cookie jar
        {
            plugin: {
                register: 'yar',
                options: Config.get('/yarCookie')
            }
        },

        //  Authentication strategy
        {
            plugin: {
                register: './lib/auth',
                options: Config.get('/authCookie')
            }
        },

        //  App context decorator
        {
            plugin: {
                register: './lib/context',
                options: {
                    meta: Meta.get('/')
                }
            }
        },

        //  Core routes
        {
            plugin: './app/routes/core.js'
        },

        //  Auth routes
        {
            plugin: './app/routes/auth.js',
            options: {
                select: ['web'] //Restricted availability of the plugin to 'web' server only
            }
        },

        //  Dashboard routes
        {
            plugin: './app/routes/dashboard.js'
        },

        //  Profile routes
        {
            plugin: './app/routes/profiles.js'
        },

         //  Erroreport routes

        {
            plugin: './app/routes/errorReport.js'
        },

        // User rotes
        {
            plugin: './app/routes/users.js'   
        }
    ]
};

internals.store = new Confidence.Store(internals.manifest);

exports.get = function(key) {
    return internals.store.get(key, internals.criteria);
};
exports.meta = function(key) {
    return internals.store.meta(key, internals.criteria);
};
