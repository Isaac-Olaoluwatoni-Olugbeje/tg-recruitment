// function to generate a unique ID with a padded zero prefix
const idConverter = (operatorCount) => {
    const id = (operatorCount + 1).toString().padStart(3, '0');
    return id;
  };

module.exports = idConverter;