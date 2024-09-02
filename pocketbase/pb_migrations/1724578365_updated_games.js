/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('uk0f12226b3de0i');

		// add
		collection.schema.addField(
			new SchemaField({
				system: false,
				id: 'hndzeexq',
				name: 'words',
				type: 'json',
				required: true,
				presentable: false,
				unique: false,
				options: {
					maxSize: 2000000
				}
			})
		);

		return dao.saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('uk0f12226b3de0i');

		// remove
		collection.schema.removeField('hndzeexq');

		return dao.saveCollection(collection);
	}
);
