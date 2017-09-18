#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var path 	= require('path');
var parser	= require('body-parser');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
        self.port      = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 0.0.0.0 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 0.0.0.0');
            self.ipaddress = "0.0.0.0";
        };
		
		self.OPENSHIFT_POSTGRESQL_DB_URL = 'postgresql://'
			+ process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME
			+ ':'
			+ process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD
			+ '@'
			+ process.env.POSTGRESQL_SERVICE_HOST
			+ ':'
			+ process.env.POSTGRESQL_SERVICE_PORT
			+ '/kagyo';
		console.warn(self.OPENSHIFT_POSTGRESQL_DB_URL);
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./views/index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

	
    /**
     *  Create the routing table entries + handlers for the application.
     */
	 self.recursiveRoutes = function(folderName) {
		fs.readdirSync(folderName).forEach(function(file) {
			var fullName = path.join(folderName, file);
			var stat = fs.lstatSync(fullName);

			if (stat.isDirectory()) {
				recursiveRoutes(fullName);
			} else if ((/\.js$/).test(file.toLowerCase())) {
				require('./' + fullName)(self.app);
				console.log("require('" + fullName + "')");
			}
		});
	 }


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express();
		
		// HTTP POST body parser
		self.app.use(parser.json()); // support json encoded bodies
		self.app.use(parser.urlencoded({
			extended: true
		})); // support encoded bodies

        //  Add handlers for the app (from the routes).
		self.recursiveRoutes('routes');
		
		// Static resources
		self.app.use(express.static('public'));
		
		self.app.set('views', __dirname + '/views');
		self.app.engine('html', require('ejs').renderFile);
		
		//  Handle 404
		self.app.use(function(req, res) {
			res.setHeader('Content-Type', 'text/html');
			res.send(fs.readFileSync('./views/404.html'));
		});
		  
		//  Handle 500
		self.app.use(function(error, req, res, next) {
			res.setHeader('Content-Type', 'text/html');
			res.send(fs.readFileSync('./views/500.html'));
		});
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        // self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

