/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var fs      = require('fs');
var pg		= require('pg');

module.exports = function(app) {
    app.post('/insert-types', function(req, res) {
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
				client.query('INSERT INTO types (name) VALUES ($1)', [entry["types-name"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/insert-kagyos', function(req, res) {
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
				client.query('INSERT INTO kagyos (type_id, name) VALUES ($1, $2)', [entry["types-type_id"], entry["kagyos-name"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/insert-descriptions', function(req, res) {
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
				client.query('INSERT INTO descriptions (kagyo_id, short_description, long_description) VALUES ($1, $2, $3)', [entry["kagyos-kagyo_id"], entry["descriptions-short_description"], entry["descriptions-long_description"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/insert-categories', function(req, res) {
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
				var query = client.query('INSERT INTO categories (name) VALUES ($1) RETURNING category_id', [entry["categories-name"]]);
				query.on('row', function(row) {
					client.query('INSERT INTO chapters (kagyo_id, category_id, list_order) VALUES($1, $2, $3)', [entry["kagyos-kagyo_id"], row["category_id"], entry["chapters-list_order"]]);
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
	
    app.post('/insert-recipes', function(req, res) {
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
				var query = client.query('INSERT INTO recipes (name, level, quantity) VALUES ($1, $2, $3) RETURNING recipe_id', [entry["recipes-name"], entry["recipes-level"], entry["recipes-quantity"]]);
				query.on('row', function(row_recipe) {
					client.query('INSERT INTO menus (category_id, recipe_id, list_order) VALUES($1, $2, $3)', [entry["categories-category_id"], row_recipe["recipe_id"], entry["menus-list_order"]]);
					
					var details = entry["details"];
					details.forEach(function(detail) {
						var material_query = client.query('WITH create_material AS (INSERT INTO materials (name) SELECT $1 WHERE NOT EXISTS (SELECT * FROM materials WHERE name=$1) RETURNING material_id, name) SELECT material_id FROM ((SELECT material_id FROM materials WHERE name=$1) UNION (SELECT material_id FROM create_material WHERE name=$1)) union_result', [detail["materials-name"]]);
						material_query.on('row', function(row_detail) {
							client.query('INSERT INTO recipe_detail (recipe_id, material_id, needs, list_order) VALUES ($1, $2, $3, $4)', [row_recipe["recipe_id"], row_detail["material_id"], detail["recipe_detail-needs"], detail["recipe_detail-list_order"]]);
						});
					});
					
					client.query('INSERT INTO materials (name) SELECT $1 WHERE NOT EXISTS (SELECT * FROM materials WHERE name=$1)', [entry["recipes-name"]]);
					client.query('INSERT INTO material_manufactor (material_id, recipe_id) SELECT material_id, $1 FROM materials WHERE name=$2', [row_recipe["recipe_id"], entry["recipes-name"]]);
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
	
    app.post('/insert-imagemap', function(req, res) {
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
				client.query('INSERT INTO imagemap (map_id, name, settings) VALUES ($1, $2, $3)', [entry["imagemap-map_id"], entry["imagemap-name"], entry["imagemap-settings"]]);
			});

			// After all data is returned, close connection and return results
			done();
			return res.status(200).json({
				success: true,
				data: []
			});
		});
    });
	
    app.post('/insert-goods', function(req, res) {
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
				var merchant_query = client.query('WITH create_merchant AS (INSERT INTO merchants (name, map_id, anchor_id) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT * FROM merchants WHERE name=$1 and map_id=$2 and anchor_id=$3) RETURNING merchant_id, name, map_id, anchor_id) SELECT merchant_id FROM ((SELECT merchant_id FROM merchants WHERE name=$1 and map_id=$2 and anchor_id=$3) UNION (SELECT merchant_id FROM create_merchant WHERE name=$1 and map_id=$2 and anchor_id=$3)) union_result', [entry["merchants-name"], entry["imagemap-map_id"], entry["merchants-anchor_id"]]);
				merchant_query.on('row', function(row_merchant) {
					var material_query = client.query('WITH create_material AS (INSERT INTO materials (name) SELECT $1 WHERE NOT EXISTS (SELECT * FROM materials WHERE name=$1) RETURNING material_id, name) SELECT material_id FROM ((SELECT material_id FROM materials WHERE name=$1) UNION (SELECT material_id FROM create_material WHERE name=$1)) union_result', [entry["materials-name"]]);
					material_query.on('row', function(row_material) {
						client.query('INSERT INTO material_seller (material_id, merchant_id, list_order, price) VALUES ($1, $2, $3, $4)', [row_material["material_id"], row_merchant["merchant_id"], entry["material_seller-list_order"], entry["material_seller-price"]]);
					});
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
	
    app.post('/insert-from-reference', function(req, res) {
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
				var merchant_query = client.query('WITH create_merchant AS (INSERT INTO merchants (name, map_id, anchor_id) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT * FROM merchants WHERE name=$1 and map_id=$2 and anchor_id=$3) RETURNING merchant_id, name, map_id, anchor_id) SELECT merchant_id FROM ((SELECT merchant_id FROM merchants WHERE name=$1 and map_id=$2 and anchor_id=$3) UNION (SELECT merchant_id FROM create_merchant WHERE name=$1 and map_id=$2 and anchor_id=$3)) union_result', [entry["merchants-name"], entry["imagemap-map_id"], entry["merchants-anchor_id"]]);
				merchant_query.on('row', function(row_merchant) {
					client.query('DELETE FROM material_seller WHERE merchant_id=$1', [row_merchant["merchant_id"]]);
					var reference_query = client.query('SELECT * FROM material_seller WHERE merchant_id=$1', [entry["reference-merchant_id"]]);
					reference_query.on('row', function(row_reference) {
						client.query('INSERT INTO material_seller (material_id, merchant_id, list_order, price) VALUES ($1, $2, $3, $4)', [row_reference["material_id"], row_merchant["merchant_id"], row_reference["list_order"], row_reference["price"]]);
					});
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