module.exports = function (object) {
  let result = ``;
  if (object.fullName) {
    result += `Full Name: ${object.fullName}\n`;
  }
  if (object.email) {
    result += `Email: ${object.email}\n`;
  }
  if (object.phone) {
    result += `Phone: ${object.phone}\n`;
  }
  return result;
};
