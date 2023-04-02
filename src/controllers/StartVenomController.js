const StartVenomService = require("../service/StartVenomService");

class StartVenomController {
  async index(req, res) {
    console.log("entrei no index");

    const startVenomService = await StartVenomService.execute();
    return res.status(startVenomService?.erro ? 400 : 200).json(startVenomService);
  }

  async create(req, res) {
    console.log("entrei no create");
    return res.status(200).json({chave: 'kaio'});
  }

}

module.exports = new StartVenomController();