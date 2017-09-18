/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var fs      = require('fs');

module.exports = function(app) {
    app.get('/editor-types', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-types.html'));
    });
	
	app.get('/editor-kagyos', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-kagyos.html'));
    });
	
	app.get('/editor-categories', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-categories.html'));
    });
	
	app.get('/editor-recipes', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-recipes.html'));
    });
	
	app.get('/editor-merchants', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-merchants.html'));
    });
	
	app.get('/editor-materials', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-materials.html'));
    });
	
    app.get('/editor-maps', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/editor-maps.html'));
    });
}