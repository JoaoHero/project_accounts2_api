const crypto = require('crypto');

function generateEmailCode(){
  // Definindo tamanho do código
  const length = 9

  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
};

module.exports = generateEmailCode;