// http://truffleframework.com/docs/advanced/configuration

module.exports = {
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // match any network
    },
  }
};
