/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
module.exports = function(app) {
    app.get('/asciimo', function(req, res) {
		var link = "http://i.imgur.com/kmbjB.png";
		res.send("<html><body><img src='" + link + "'></body></html>");
    });
}