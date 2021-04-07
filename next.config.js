const withFonts = require("next-fonts");
const withImages = require("next-images");
module.exports = withFonts(withImages({future: {webpack5: true}}));