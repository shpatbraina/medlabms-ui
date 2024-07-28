module.exports = {
  transpileDependencies: [
    'vuetify',
    'keycloak-js' // Add 'keycloak-js' here if it's not being transpiled correctly by default
  ],
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title = "MedLab MS";
          return args;
        })
  }
}
