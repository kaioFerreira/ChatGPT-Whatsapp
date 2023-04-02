const { http } = require("./http");
require("dotenv").config();

http.listen(3333, () => {
    console.log("Server Started On Port 3333");
});
