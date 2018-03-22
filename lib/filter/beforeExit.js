const path = require('path');
const fs = require('fs');

module.exports = function () {
  let mainScript = this.theme.mainScript;

  if (mainScript && fs.existsSync(mainScript))
    fs.unlinkSync(mainScript);
}