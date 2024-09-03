/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('uk0f12226b3de0i');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'xkbagzpq',
				name: 'team1_score',
				type: 'number',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: 0,
					max: null,
					noDecimal: true
				}
			})
		);

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'ix8h2klp',
				name: 'team2_score',
				type: 'number',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: 0,
					max: null,
					noDecimal: true
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('uk0f12226b3de0i');

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'xkbagzpq',
				name: 'team1_score',
				type: 'number',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: 0,
					max: null,
					noDecimal: false
				}
			})
		);

		// update
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'ix8h2klp',
				name: 'team2_score',
				type: 'number',
				required: false,
				presentable: false,
				unique: false,
				options: {
					min: 0,
					max: null,
					noDecimal: false
				}
			})
		);

		return dao.saveCollection(collection);
	}
);
