console.log(process.env.NODE_ENV);

function buildConfig(env) {
    console.log(env);
}

module.exports = buildConfig(process.env.NODE_ENV);
