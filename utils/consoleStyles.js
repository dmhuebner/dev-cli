const consoleStyles = () => {
  // Create vertical space
  const verticalSpace = (lines) => {
    lines = lines && typeof(lines) === 'number' ? lines : 1;

    for (let i = 0; i < lines; i++) {
      return '';
    }
  };

// Create a horizontal line across the terminal
  const horizontalLine = (lineChar) => {
    const char = lineChar ? lineChar : '=';
    // Get the available screen size
    const width = process.stdout.columns;
    let line = '';

    for (let i = 0; i < width; i++) {
      line += char;
    }

    return line;
  };

  // Create centered text on the screen
  const centered = (string) => {
    string = string.trim() && typeof(string) === 'string' ? string.trim() : '';

    // Get the available screen size
    const width = process.stdout.columns;

    // Calculate the required left padding
    const leftPadding = Math.floor((width - string.length) / 2);

    // Add leftPadding before the string
    let line = '';

    for (let i = 0; i < leftPadding; i++) {
      line += ' ';
    }

    line += string;

    return line;
  };

  // Set text color for console log
  const setConsoleColor = (colorString, stringToColor) => {
    colorString = colorString && typeof(colorString) === 'string' ? colorString.toLowerCase() : null;

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

  return {
    verticalSpace,
    horizontalLine,
    centered,
    setConsoleColor
  }
};

module.exports = consoleStyles;