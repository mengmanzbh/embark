const ProcessWrapper = require('../../process/processWrapper');
const BlockchainClient = require('./blockchain');
const i18n = require('../../i18n/i18n.js');
const constants = require('../../constants');

let blockchainProcess;

class BlockchainProcess extends ProcessWrapper {
  constructor(options) {
    super();
    this.blockchainConfig = options.blockchainConfig;
    this.client = options.client;
    this.env = options.env;
    this.isDev = options.isDev;

    i18n.setOrDetectLocale(options.locale);

    this.blockchainConfig.silent = true;
    this.blockchain = BlockchainClient(
      this.blockchainConfig,
      this.client,
      this.env,
      this.isDev,
      this.blockchainReady.bind(this)
    );

    this.blockchain.run();
  }

  blockchainReady() {
    blockchainProcess.send({result: constants.blockchain.blockchainReady});
  }
}

process.on('message', (msg) => {
  if (msg.action === constants.blockchain.init) {
    blockchainProcess = new BlockchainProcess(msg.options);
    return blockchainProcess.send({result: constants.blockchain.initiated});
  }
});
