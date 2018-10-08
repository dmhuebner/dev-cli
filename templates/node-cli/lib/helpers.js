/*==================
 Helper Functions
===================*/

// Initialize helpers module object
const helpers = {};

// Set text color for console log
helpers.setConsoleColor = (colorString, stringToColor) => {
  colorString = colorString.trim() && typeof(colorString) === 'string' ? colorString.trim().toLowerCase() : null;

  // Available console log colors
  const colors = {
    red: '31',
    green: '32',
    yellow: '33',
    blue: '34',
    pink: '35',
    lightblue: '36'
  };

  if (colorString && colors.hasOwnProperty(colorString)) {
    return `\x1b[${colors[colorString]}m${stringToColor}\x1b[0m`;
  }
};

module.exports = helpers;