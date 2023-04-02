const { http } = require("./http");
require("dotenv").config();

http.listen(process.env.PORT || 3333, () => {
    console.log("Server Started");
});
