/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('uk0f12226b3de0i');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 't6jwx3bf',
				name: 'is_team1_turn',
				type: 'bool',
				required: false,
				presentable: false,
				unique: false,
				options: {}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('uk0f12226b3de0i');

		// remove
		collection.schema.removeField('t6jwx3bf');

		return dao.saveCollection(collection);
	}
);
