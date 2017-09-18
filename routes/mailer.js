/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var mailgun_factory = require('mailgun-js');

module.exports = function(app) {
    app.post('/mailer', function(req, res) {
		var mailcontent = req.body.data;
		
		var api_key = 'key-261b7351382e98c1d80ca19aa37fb84f';
		var domain = 'kagyo-nobolfantw.rhcloud.com';
		var from_who = 'ckmagician@gmail.com';
		
		var mailgun = new mailgun_factory({apiKey: api_key, domain: domain});
		var mail = {
			from: from_who,
			to: from_who,
			subject: 'Nobol Kagyo Notification',
			text: mailcontent
		};
		
		//Invokes the method to send emails given the above data with the helper library
		mailgun.messages().send(mail, function (err, body) {
			if (err) {
				return res.status(500).json({
					success: false,
					data: err
				});
			}
			return res.status(200).json({
				success: true,
				data: []
			});
		});
	});
}