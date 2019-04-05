const fs = require('fs'),
      path = require('path'),
      consoleStyles = require('../utils/consoleStyles')();

const processFiles = () => {

  // Interpolate the template: {%var%}
  // Take a given string and a variables object and find/replace all the keys within it
  const interpolate = (string, variables) => {
    string = typeof(string) === 'string' && string.length > 0 ? string : '';
    variables = variables && typeof (variables) === 'object' ? variables : {};

    const additionalVariables = createCasingVars(variables);

    // Combine variables with additionalVariables created above
    variables = {...variables, ...additionalVariables};

    // For each key in the variables object, insert its value into the string at the corresponding placeholder
    for (let key in variables) {
      if (variables.hasOwnProperty(key) && typeof(variables[key]) === 'string') {
        const replace = variables[key];
        const find = `{%${key}%}`;

        // Interpolate
        string = string.split(find).join(replace);
      }
    }

    return string;
  };

  const readFile = (fromDir, element) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(fromDir, element), 'utf8', (error, fileContent) => {
        if (!error && fileContent) {
          resolve(fileContent);
        } else {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            const rejectMessage = `No content: ${consoleStyles.setConsoleColor('yellow', element)} 
                                  \nThere must be content in all files within a given template in order to generate a project.
                                  \n${consoleStyles.setConsoleColor('red', 'You may need to delete the directory that was generated')} 
                                  \nTemplate Directory containing file(s) with no content: 
                                  \n${consoleStyles.setConsoleColor('pink', fromDir)}`;
            reject(rejectMessage);
          }
        }
      });
    });
  };

  const writeInterpolatedFile = (toDir, element, fileContent, variables) => {
    return new Promise((resolve, reject) => {
      fs.open(toDir + '/' + element, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
          // Write to file and close it
          const interpolatedFileContent = interpolate(fileContent, variables);
          fs.writeFile(fileDescriptor, interpolatedFileContent, (error) => {
            if (!error) {
              fs.close(fileDescriptor, (error) => {
                if (!error) {
                  resolve('Success');
                } else {
                  console.log(`${consoleStyles.setConsoleColor('red', 'Error')} closing new file`);
                  reject(error);
                }
              });
            } else {
              console.log(`\`${consoleStyles.setConsoleColor('red', 'Error')} writing to new file`);
              reject(error);
            }
          });
        } else {
          console.log(`\`${consoleStyles.setConsoleColor('red', 'Error:')} Could not create new file, it may already exist`);
          reject(error);
        }
      });
    });
  };

  // TODO this should be put in a utility file under utils
  const capitalizeString = (str) => {
    return str.split(' ').map(word => word.substring(0, 1).toUpperCase() + word.substring(1)).join(' ');
  };

  const camelToKebabCase = (str, delimiter = '-') => {
    return str.split('').map((char) => {
      if (char !== delimiter && char === char.toUpperCase() && str.indexOf(char) > 0) {
        // char is uppercase and delimiter should be inserted
        return `${delimiter}${char}`;
      }
      return char;
    }).join('').toLowerCase();
  };

  // Interpolates fileNames with generator seed project's custom variables
  const interpolateFileNames = (toDir, fileName, variables) => {
    const newFileName = interpolate(fileName, variables);
    fs.renameSync(path.join(toDir, fileName), path.join(toDir, newFileName));
    return 'Success';
  };

  /*
  * @description: Generates a new project from a seed project
  *               Interpolates custom variables into the project such as projectName, projectAuthor, etc.
  *
  * @param: fromDir: String - Directory that should be used to create the project
  * @param: toDir: String - Directory to put the newly created project into
  * @param: variables: Object - An object with property values that should be interpolated and replaced throughout each file of the seed project
  * */
  const generateProjectFromSeed = (fromDir, toDir, variables) => {
    return new Promise((resolve, reject) => {
      try {
        // Interpolate toDir directory names
        const interpolatedToDir = interpolate(toDir, variables);

        fs.mkdirSync(interpolatedToDir);
        fs.readdirSync(fromDir).forEach(element => {
          // Check if element in the directory is a file
          if (fs.lstatSync(path.join(fromDir, element)).isFile()) {
            return readFile(fromDir, element).then((fileContent) => {
              return writeInterpolatedFile(interpolatedToDir, element, fileContent, variables);
            }).then(() => {
              // Rename any files that start with foo if a modelVariable is passed in
              return interpolateFileNames(interpolatedToDir, element, variables);
            }).then(result => {
              resolve(result);
            }).catch(error => {
              reject(error + `\nProject Generated: ${consoleStyles.setConsoleColor('yellow', variables.projectName)}`);
            });
          } else {
            // If its not a file its a directory - recursively generate files within that directory
            generateProjectFromSeed(path.join(fromDir, element), path.join(interpolatedToDir, element), variables);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Parse a JSON string to an object in all cases, without throwing an error
  const parseJsonToObject = (string) => {
    try {
      const obj = JSON.parse(string);
      return obj;
    } catch(error) {
      return {};
    }
  };

  const createCasingVars = (variables) => {
    const additionalVariables = {};
    // Create Casing permutations:
    for (let key in variables) {
      if (variables.hasOwnProperty(key) && typeof(variables[key]) === 'string') {
        // Capitalized
        additionalVariables[`${key}[capitalized]`] = capitalizeString(variables[key]);
        // Kebab Case
        additionalVariables[`${key}[kebabCase]`] = camelToKebabCase(variables[key]);
        // Underscore Case
        additionalVariables[`${key}[underscoreCase]`] = camelToKebabCase(variables[key], '_');
      }
    }

    return additionalVariables;
  };

  return {
    readFile,
    generateProjectFromSeed,
    parseJsonToObject
  };
};

module.exports = processFiles;
