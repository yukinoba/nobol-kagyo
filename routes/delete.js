/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var fs      = require('fs');
var pg		= require('pg');

module.exports = function(app) {
    app.post('/delete-types', function(req, res) {
		var records = req.body.data;
		pg.connect(app.locals.OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}

			// SQL Query > Insert Data
			records.forEach(function(entry) {
				client.query('DELETE FROM types WHERE type_id=$1', [entry["types-type_id"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/delete-kagyos', function(req, res) {
		var records = req.body.data;
		pg.connect(app.locals.OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}

			// SQL Query > Insert Data
			records.forEach(function(entry) {
				client.query('DELETE FROM kagyos WHERE type_id=$1 and kagyo_id=$2', [entry["types-type_id"], entry["kagyos-kagyo_id"]]);
				client.query('DELETE FROM descriptions WHERE kagyo_id=$1', [entry["kagyos-kagyo_id"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/delete-categories', function(req, res) {
		var records = req.body.data;
		pg.connect(app.locals.OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}

			// SQL Query > Insert Data
			records.forEach(function(entry) {
				client.query('DELETE FROM categories WHERE category_id=$1', [entry["categories-category_id"]]);
				client.query('DELETE FROM chapters WHERE category_id=$1', [entry["categories-category_id"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/delete-recipes', function(req, res) {
		var records = req.body.data;
		pg.connect(app.locals.OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}

			// SQL Query > Insert Data
			records.forEach(function(entry) {
				client.query('DELETE FROM menus WHERE recipe_id=$1', [entry["recipes-recipe_id"]]);
				client.query('DELETE FROM recipes WHERE recipe_id=$1 RETURNING recipe_id, name', [entry["recipes-recipe_id"]]);
				client.query('DELETE FROM recipe_detail WHERE recipe_id=$1', [entry["recipes-recipe_id"]]);
				client.query('DELETE FROM material_manufactor WHERE recipe_id=$1', [entry["recipes-recipe_id"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/delete-imagemap', function(req, res) {
		var records = req.body.data;
		pg.connect(app.locals.OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}

			// SQL Query > Insert Data
			records.forEach(function(entry) {
				client.query('DELETE FROM imagemap WHERE map_id=$1', [entry["imagemap-map_id"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/delete-goods', function(req, res) {
		var records = req.body.data;
		pg.connect(app.locals.OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}

			// SQL Query > Insert Data
			records.forEach(function(entry) {
				var merchant_query = client.query('SELECT * FROM merchants WHERE map_id=$1 and anchor_id=$2', [entry["imagemap-map_id"], entry["merchants-anchor_id"]]);
				merchant_query.on('row', function(row_merchant) {
					client.query('DELETE FROM material_seller WHERE material_id=$1 and merchant_id=$2', [entry["material_seller-material_id"], row_merchant["merchant_id"]]);
					client.query('DELETE FROM merchants WHERE merchant_id=$1 and NOT EXISTS (SELECT * FROM material_seller WHERE merchant_id=$1)', [row_merchant["merchant_id"]]);
				});
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
}