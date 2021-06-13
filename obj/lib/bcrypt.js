let bcrypt = require("bcrypt");

module.exports = {
    hashSync: (password) => bcrypt.hashSync(password, 10),
    compareSync: (password, hash) => { return bcrypt.compareSync(password, hash) }
}