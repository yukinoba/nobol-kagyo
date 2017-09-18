/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var fs      = require('fs');

module.exports = function(app) {
    app.get('/sellermap', function(req, res) {
		res.render('sellermap.html', { mapId: req.query.map, anchorId: req.query.pin });
    });
	
    app.get('/editor-sellers', function(req, res) {
		res.render('editor-sellers.html', { mapId: req.query.map });
    });
}