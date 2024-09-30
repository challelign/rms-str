module.exports = {
	apps: [
		{
			name: "rms",
			script: "server.js",
			watch: true,
			max_memory_restart: "2G",
			autorestart: true,
		},
	],
};
