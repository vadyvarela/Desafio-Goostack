'use strict';

module.exports = {
	up: QueryInterface => {
		return QueryInterface.bulkInsert(
			"students",
			[
				{
					name: "Vadnir José Varela Vieira",
					email: "vadyy2014@gmail.com",
					idade: "24",
					peso: "70",
					altura: "1.80",
					created_at: new Date(),
					updated_at: new Date()
				},
				{
					name: "Ludmila Conceição Semedo Rocha",
					email: "ludysemedo@gmail.com",
					idade: 24,
					peso: 62,
					altura: 1.73,
					created_at: new Date(),
					updated_at: new Date()
				}
			],
			{}
		);
	},

	down: () => {}
};
