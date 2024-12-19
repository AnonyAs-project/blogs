const mailgun = require('mailgun.js');
const formData = require('form-data');

const mg = mailgun.client({ username: 'Test', key: env.process.MAIL_GUN_API });

const data = {
  from: 't67073957@gmail.com',
  to: ``,
  subject: 'Hello, Thank you for joining out website good luck!',
  text: 'Testing Mailgun!',
};

mg.messages.create('sandbox000a284d960c46e2874d5c3577cd6331.mailgun.org', data)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });