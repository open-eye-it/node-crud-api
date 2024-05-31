const randomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const responseJson = (status, message, token='', data='') => {
  let msg = {status:status, message:message};
  if(token != ''){
    msg.token = token;
  }
  if(data != ''){
    msg.data = data;
  }
  return msg;
}

const decodeBase64Image = (dataString) => {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  return matches;
}

const titletoslug = (title) => {
  const convertTitle = title.trim().replace(/\s+/g, " ");
  const slug = convertTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  return slug
}

module.exports = { randomString, responseJson, decodeBase64Image, titletoslug };