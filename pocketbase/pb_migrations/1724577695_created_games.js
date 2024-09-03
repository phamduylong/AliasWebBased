/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: '3yr6oi00v7jm6w9',
			created: '2024-08-25 09:21:35.454Z',
			updated: '2024-08-25 09:21:35.454Z',
			name: 'games',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'gmmjveim',
					name: 'team1',
					type: 'text',
					required: true,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'lka4ap33',
					name: 'team2',
					type: 'text',
					required: true,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				},
				{
					system: false,
					id: 'ouzpokh5',
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
				},
				{
					system: false,
					id: 'nncqqixx',
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
				},
				{
					system: false,
					id: 'eleyqebm',
					name: 'game_id',
					type: 'text',
					required: true,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: ''
					}
				}
			],
			indexes: [],
			listRule: null,
			viewRule: null,
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {}
		});

		return Dao(db).saveCollection(collection);
	},
	(db) => {
		const dao = new Dao(db);
		const collection = dao.findCollectionByNameOrId('3yr6oi00v7jm6w9');

		return dao.deleteCollection(collection);
	}
);
