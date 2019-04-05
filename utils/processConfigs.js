const fs = require('fs'),
    path = require('path'),
    processFiles = require('./processFiles')();

const processConfigs = () => {

    const getConfigs = () => {
        const rawFileData = fs.readFileSync(path.join(__dirname, `/../`, 'configs.json'));
        return processFiles.parseJsonToObject(rawFileData);
    };

    const setConfigs = (configDataToSet) => {
        try {
            fs.writeFileSync(path.join(__dirname, `/../configs.json`), JSON.stringify(configDataToSet));
            return true;
        } catch (err) {
            return false;
        }
    };

    const generator = {
        getSeedProjectsDir(templatesSourceDirectory) {
            if (templatesSourceDirectory[templatesSourceDirectory.length - 1] !== '/') {
                templatesSourceDirectory += '/';
            }

            const rawSeedFileDirectoryData = fs.readFileSync(path.join(templatesSourceDirectory, 'seedProjectsDirectory.json'));
            return processFiles.parseJsonToObject(rawSeedFileDirectoryData);
        }
    };

    return {
        getConfigs,
        setConfigs,
        generator
    };
};

module.exports = processConfigs;
