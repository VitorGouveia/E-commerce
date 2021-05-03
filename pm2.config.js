module.exports = {
  apps : [{
    name       : "ecommerce",
    script     : "./dist/server.js",
    watch: true,
    instances  : 4,
    exec_mode  : "cluster",
    env: {
      "NODE_ENV": "development"
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}