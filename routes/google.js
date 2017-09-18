/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var fs      = require('fs');

module.exports = function(app) {
    app.get('/google379d90ecf5cfab65.html', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./views/google379d90ecf5cfab65.html'));
    });
}