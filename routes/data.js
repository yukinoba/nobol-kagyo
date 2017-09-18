/*  ================================================================  */
/*  App server functions (main app logic here).                       */
/*  ================================================================  */
var fs      = require('fs');
var pg		= require('pg');
var async	= require('async');
var querystring = require('querystring');

module.exports = function(app) {
    app.get('/data-types', function(req, res) {
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT * FROM types');

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.post('/data-kagyos', function(req, res) {
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT types.name as "types-name", kgdp.* FROM types, (SELECT kagyos.kagyo_id, kagyos.type_id, kagyos.name, descriptions.short_description, descriptions.long_description FROM kagyos LEFT JOIN descriptions ON kagyos.kagyo_id=descriptions.kagyo_id) kgdp WHERE kgdp.type_id=types.type_id');

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
	app.get('/data-kagyos-by-typeid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var type_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT kagyos.type_id, kagyos.kagyo_id, kagyos.name, descriptions.short_description, descriptions.long_description FROM kagyos LEFT JOIN descriptions ON kagyos.kagyo_id=descriptions.kagyo_id WHERE kagyos.type_id=$1', [type_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.post('/data-categories', function(req, res) {
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT chapters.list_order, kagyos.name as "kagyos-name", chapters.kagyo_id, categories.* FROM categories, chapters, kagyos WHERE categories.category_id=chapters.category_id and chapters.kagyo_id=kagyos.kagyo_id');

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.get('/data-categories-by-kagyoid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var kagyo_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT chapters.list_order, chapters.kagyo_id, categories.* FROM categories, chapters WHERE categories.category_id=chapters.category_id and chapters.kagyo_id=$1 ORDER BY chapters.list_order ASC', [kagyo_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
	app.get('/data-categories-by-recipeid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var recipe_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT kagyos.type_id, kagyos.kagyo_id, kagyos.name as kagyo_name, categories.category_id, categories.name as category_name FROM menus, categories, chapters, kagyos WHERE menus.category_id=categories.category_id and categories.category_id=chapters.category_id and chapters.kagyo_id=kagyos.kagyo_id and menus.recipe_id=$1', [recipe_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.post('/data-recipes', function(req, res) {
		var category_id = req.body.category_id;
		
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var getMaterials = function(row, callback) {
				client.query('SELECT array_to_json(array_agg(details)) as material FROM (SELECT recipe_detail.list_order, recipe_detail.recipe_id, materials.*, recipe_detail.needs FROM recipe_detail, materials WHERE recipe_detail.material_id=materials.material_id and recipe_detail.recipe_id=$1 ORDER BY recipe_detail.list_order ASC) details', [row["recipe_id"]], function(err, result) {
					if (err) return callback(err);
					row.material = result.rows[0].material;
					callback();
				});
			};

			// Stream results back one row at a time
			client.query('SELECT menus.list_order as "menus-list_order", categories.name as "categories-name", menus.category_id as "menus-category_id", recipes.recipe_id, recipes.level, recipes.name, recipes.quantity FROM categories, menus, recipes WHERE recipes.recipe_id=menus.recipe_id and menus.category_id=categories.category_id and categories.category_id=$1 ORDER BY menus.list_order ASC', [category_id], function(err, result) {
				if (err) {
					done();
					return res.status(200).json({
						success: true,
						data: []
					});
				}
				
				async.each(result.rows, getMaterials, function(err) {
					if (err) {
						done();
						return res.status(200).json({
							success: true,
							data: []
						});
					}
					
					done();
					return res.status(200).json({
						success: true,
						data: result.rows
					});
				});
			});
		});
    });
	
    app.get('/data-search-by-keyword', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var keyword = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var getMaterials = function(row, callback) {
				client.query('SELECT array_to_json(array_agg(details)) as material FROM (SELECT recipe_detail.list_order, recipe_detail.recipe_id, materials.*, recipe_detail.needs FROM recipe_detail, materials WHERE recipe_detail.material_id=materials.material_id and recipe_detail.recipe_id=$1 ORDER BY recipe_detail.list_order ASC) details', [row["recipe_id"]], function(err, result) {
					if (err) return callback(err);
					row.material = result.rows[0].material;
					callback();
				});
			};
				
			var getRecipes = function(row, callback) {
				client.query('SELECT recipes.level, recipes.name, recipes.quantity FROM recipes WHERE recipes.recipe_id=$1', [row["recipe_id"]], function(err, result) {
					if (err) return callback(err);
					row.level = result.rows[0].level;
					row.name = result.rows[0].name;
					row.quantity = result.rows[0].quantity;
					
					var array = [];
					array.push(row);
					async.each(array, getMaterials, function(err) {
						if (err) return callback(err);
						callback();
					});
				});
			};

			// Stream results back one row at a time
			var keyword_searchlike = '%' + keyword + '%';
			client.query('SELECT distinct recipes.recipe_id FROM recipes, recipe_detail, materials WHERE recipe_detail.material_id=materials.material_id and recipe_detail.recipe_id=recipes.recipe_id and (recipes.name ilike $1 or materials.name ilike $1)', [keyword_searchlike], function(err, result) {
				if (err) {
					done();
					return res.status(200).json({
						success: true,
						data: []
					});
				}
				
				async.each(result.rows, getRecipes, function(err) {
					if (err) {
						done();
						return res.status(200).json({
							success: true,
							data: []
						});
					}
					
					done();
					return res.status(200).json({
						success: true,
						data: result.rows
					});
				});
			});
		});
    });
	
    app.get('/data-recipes-by-categoryid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var category_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var getMaterials = function(row, callback) {
				client.query('SELECT array_to_json(array_agg(details)) as material FROM (SELECT recipe_detail.list_order, recipe_detail.recipe_id, materials.*, recipe_detail.needs FROM recipe_detail, materials WHERE recipe_detail.material_id=materials.material_id and recipe_detail.recipe_id=$1 ORDER BY recipe_detail.list_order ASC) details', [row["recipe_id"]], function(err, result) {
					if (err) return callback(err);
					row.material = result.rows[0].material;
					callback();
				});
			};

			// Stream results back one row at a time
			client.query('SELECT menus.list_order as "menus-list_order", recipes.recipe_id, recipes.level, recipes.name, recipes.quantity FROM menus, recipes WHERE recipes.recipe_id=menus.recipe_id and menus.category_id=$1 ORDER BY menus.list_order ASC', [category_id], function(err, result) {
				if (err) {
					done();
					return res.status(200).json({
						success: true,
						data: []
					});
				}
				
				async.each(result.rows, getMaterials, function(err) {
					if (err) {
						done();
						return res.status(200).json({
							success: true,
							data: []
						});
					}
					
					done();
					return res.status(200).json({
						success: true,
						data: result.rows
					});
				});
			});
		});
    });
	
    app.get('/data-material-by-recipeid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var recipe_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT * FROM material_manufactor WHERE recipe_id=$1', [recipe_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.get('/data-recipe-by-materialid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var material_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT * FROM material_manufactor WHERE material_id=$1', [material_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.get('/data-needs-by-materialid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var material_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var getMaterials = function(row, callback) {
				client.query('SELECT array_to_json(array_agg(details)) as material FROM (SELECT recipe_detail.list_order, recipe_detail.recipe_id, materials.*, recipe_detail.needs FROM recipe_detail, materials WHERE recipe_detail.material_id=materials.material_id and recipe_detail.recipe_id=$1 ORDER BY recipe_detail.list_order ASC) details', [row["recipe_id"]], function(err, result) {
					if (err) return callback(err);
					row.material = result.rows[0].material;
					callback();
				});
			};
			
			// Stream results back one row at a time
			client.query('SELECT distinct menus.category_id, menus.list_order as "menus-list_order", recipes.recipe_id, recipes.level, recipes.name, recipes.quantity FROM menus, recipes, recipe_detail WHERE recipe_detail.material_id=$1 and recipe_detail.recipe_id=recipes.recipe_id and recipes.recipe_id=menus.recipe_id ORDER BY menus.category_id ASC, menus.list_order ASC', [material_id], function(err, result) {
				if (err) {
					done();
					return res.status(200).json({
						success: true,
						data: []
					});
				}
				
				async.each(result.rows, getMaterials, function(err) {
					if (err) {
						done();
						return res.status(200).json({
							success: true,
							data: []
						});
					}
					
					done();
					return res.status(200).json({
						success: true,
						data: result.rows
					});
				});
			});
		});
    });
	
    app.get('/data-calculator-by-recipeid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var recipe_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var getMaterials = function(row, callback) {
				client.query('SELECT array_to_json(array_agg(details)) as material FROM (SELECT recipe_detail.list_order, recipe_detail.recipe_id, materials.*, recipe_detail.needs FROM recipe_detail, materials WHERE materials.material_id=recipe_detail.material_id and recipe_detail.recipe_id=$1 ORDER BY recipe_detail.list_order ASC) details', [row["recipe_id"]], function(err, result) {
					if (err) return callback(err);
					row.material = result.rows[0].material;
					callback();
				});
			};
			
			var query = client.query('SELECT recipes.recipe_id, recipes.name, recipes.quantity FROM recipes WHERE recipes.recipe_id=$1', [recipe_id]);

			// Stream results back one row at a time
			client.query('SELECT recipes.recipe_id, recipes.name, recipes.quantity FROM recipes WHERE recipes.recipe_id=$1', [recipe_id], function(err, result) {
				if (err) {
					done();
					return res.status(200).json({
						success: true,
						data: []
					});
				}
				
				async.each(result.rows, getMaterials, function(err) {
					if (err) {
						done();
						return res.status(200).json({
							success: true,
							data: []
						});
					}
					
					done();
					return res.status(200).json({
						success: true,
						data: result.rows
					});
				});
			});
		});
    });
	
    app.get('/data-manufactorlist-by-materialid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var material_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT material_manufactor.*, kagyos.name as "kagyos-name" FROM material_manufactor, menus, chapters, kagyos WHERE material_manufactor.material_id=$1 and material_manufactor.recipe_id=menus.recipe_id and menus.category_id=chapters.category_id and chapters.kagyo_id=kagyos.kagyo_id', [material_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.get('/data-sellerprice-by-materialid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var material_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT distinct material_seller.price FROM material_seller WHERE material_seller.material_id=$1 ORDER BY material_seller.price DESC', [material_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
	app.post('/data-settings-by-mapid', function(req, res) {
		var map_id = req.body.data;
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT * FROM imagemap WHERE imagemap.map_id=$1', [map_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
	app.post('/data-materials-by-seller', function(req, res) {
		var map_id = req.body.data[0]["mapid"];
		var anchor_id = req.body.data[0]["anchorid"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT material_seller.list_order, material_seller.material_id, materials.name, material_seller.price FROM merchants, material_seller, materials WHERE materials.material_id=material_seller.material_id and material_seller.merchant_id=merchants.merchant_id and merchants.map_id=$1 and merchants.anchor_id=$2 ORDER BY material_seller.list_order', [map_id, anchor_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
	app.get('/data-sellers-by-materialid', function(req, res) {
		var parameters = JSON.parse(querystring.unescape(req.query.data));
		var material_id = parameters["data"];
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT imagemap.name as location, imagemap.map_id, merchants.name as seller, merchants.anchor_id, material_seller.price FROM imagemap, merchants, material_seller WHERE material_seller.merchant_id=merchants.merchant_id and merchants.map_id=imagemap.map_id and material_seller.material_id=$1', [material_id]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
    app.post('/data-imagemap', function(req, res) {
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var query = client.query('SELECT * FROM imagemap');

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
	
	app.post('/data-same-merchants', function(req, res) {
		var merchant_name = req.body.data
		
		var records = [];
		pg.connect(OPENSHIFT_POSTGRESQL_DB_URL, function(err, client, done) {
			// Handle connection errors
			if (err) {
			  done();
			  return res.status(500).json({
				  success: false,
				  data: err
			  });
			}
			
			// SQL Query > Select Data
			var merchant_name_root = merchant_name;
			
			var prefixes = ['安土', '尾張', '界', '海賊', '山賊'];
			for (var i = 0; i < prefixes.length; i++) {
				merchant_name_root = merchant_name_root.replace(prefixes[i], '');
			}
			
			var merchant_searchlike = '%' + merchant_name_root + '%';
			var query = client.query('SELECT merchants.*, imagemap.name as map_name FROM imagemap, merchants WHERE merchants.map_id=imagemap.map_id and merchants.name like $1', [merchant_searchlike]);

			// Stream results back one row at a time
			query.on('row', function(row) {
				records.push(row);
			});

			// After all data is returned, close connection and return results
			query.on('end', function() {
				done();
				return res.status(200).json({
					success: true,
					data: records
				});
			});
		});
    });
}