module.exports = function (object) {
  let result = `Email: ${object.email}\n`;
  if (object.fullName) {
    result += `Full Name: ${object.fullName}\n`;
  }
  if (object.subject) {
    result += `Subject: ${object.subject}\n`;
  }
  if (object.message) {
    result += `Message: ${object.message}\n`;
  }
  return result;
};
