const StartVenomService = require("../service/StartVenomService");

class StartVenomController {
  async index(req, res) {
    const startVenomService = await StartVenomService.execute();
    return res.status(startVenomService?.erro ? 400 : 200).json(startVenomService);
  }
}

module.exports = new StartVenomController();