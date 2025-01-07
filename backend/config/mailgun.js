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


  
// const mailgun = require("mailgun-js");
// const mg = mailgun({
//   apiKey: process.env.MAIL_GUN_API,
//   domain: "sandbox000a284d960c46e2874d5c3577cd6331.mailgun.org",
// });

// const createUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User with this email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ name, email, password: hashedPassword });
//     await user.save();
   
//     // const emailData = {
//     //   from: "postmaster@sandbox000a284d960c46e2874d5c3577cd6331.mailgun.org",
//     //   to: email,
//     //   subject: "Welcome to Our Platform!",
//     //   text: `Hello ${name},\n\nWelcome to our platform. Your account has been successfully created.\n\nBest regards,\nTeam`,
//     // };

//     // mg.messages().send(emailData, (error, body) => {
//     //   if (error) {
//     //     console.error("Error sending email:", error);
//     //   } else {
//     //     console.log("Email sent successfully:", body);
//     //   }
//     // });

//     const token = jwt.sign({ id: user._id }, process.env.SECRET);
//     res.status(201).json({
//       message: "User created successfully",
//       token,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ message: `Error creating user` });
//   }
// };
