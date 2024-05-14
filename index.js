//server.js
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const bcrypt = require('bcrypt')
app.use(express.static(path.join(__dirname, 'Assets')));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());



mongoose
  .connect(
    "mongodb+srv://hundlanijay:hVFEqU8iumiSowXL@registerdata.pqv1sbi.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log("mongo error", err));

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileno: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  book: [
    {
      name: String,
      email: String,
      mobile: Number,
      numofpass: String,
      date: Date,
      time: String,

    }
  ],

  cart: [
    {

      id: {
        type: Number
      },
      quantity:
      {
        type: Number,
        default: 1
      }


    },
  ],

  checkout: {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    mobile: {
      type: String,
      require: true,
    },
    state: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    landmark: {
      type: String,
  
    },
    pincode: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    alternate: {
      type: String,
  
    },
  },

  order: [
    {
      id: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      },
      orderdate: {
        type: Date,
        default: Date.now
      }
    }
  ]





});

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    requre: true,
  },
  mobileno: {
    type: String,
    requre: true,
  },
  message: {
    type: String,
    requre: true,
  },


});


const User1 = mongoose.model("cafecontact", ContactSchema);



const User = mongoose.model("caferegister", registerSchema);




app.get('/api', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');



  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, error: 'Internal Server Error' });
    }

    const jsonData = JSON.parse(data);

    const updatedData = jsonData.map(item => {
      if (item.img) {
        item.img = 'https://' + req.get('host') + item.img;
      }

      return item;
    });

    res.json({ data: updatedData });
  });
});






app.post("/contact", async (req, res) => {
  const { name, email, mobileno, message } = req.body;


  try {

    const exist = await User1.findOne({ email, message })

    if (exist) {
      return res.json({ success: false, error: 'you have already messaged..' })
    }

    const result = await User1.create({
      name,
      email,
      mobileno,
      message,
    });

    console.log(result);


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'smile cafe point',
      html: `
  <div style="background-color: #f3f3f3; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
        <p style="color: #333; font-size: 18px;">Dear Customer,</p>
        <p style="color: #333; font-size: 16px;">Thank you for contacting Smile Cafe Point!</p>
        <p style="color: #333; font-size: 16px;">Below is the information you requested:</p>
        <hr style="border: 1px solid #ccc;">
        <div style="margin-top: 20px;">
            <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
            <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Name:</strong> veer</li>
                <li><strong>Email:</strong> book@smilecafepoint.com</li>
                <li><strong>Phone:</strong> +1-444-123-4559</li>
                <li><strong>Message:</strong> will get back to you soon</li>
            </ul>
        </div>
        <hr style="border: 1px solid #ccc;">
        <p style="color: #333; font-size: 16px;">If you have any further questions or need assistance, feel free to contact us.</p>
        <p style="color: #666; font-size: 16px;">Best regards,</p>
        <p style="color: #666; font-size: 16px;">Smile Cafe Point Team</p>
      
      
        <p style="color: #666; font-size: 16px; margin-top: 20px;"> Nizampura,Vadodara,india</p>
    </div>
</div>

  `,
      attachments: [
        {
          filename: 'Menu.pdf',
          path: 'cafe.pdf' // provide the path to your PDF file
        }
      ]
    };

    const mailOptions1 = {
      from: process.env.EMAIL_USER,
      to: 'himanshu0409agraval@gmail.com',
      subject: 'Details',
      html: `
  <div style="background-color: #f3f3f3; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
       
        <div style="margin-top: 20px;">
            <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
            <ul style="list-style-type: none; padding-left: 0;">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${mobileno}</li>
                <li><strong>Message:</strong> ${message}</li>
            </ul>
        </div>
       
    </div>
</div>

  `
    };





    const info = await transporter.sendMail(mailOptions);
    const info1 = await transporter.sendMail(mailOptions1);
    console.log('Email sent:', info.response);
    console.log('Email sent:', info1.response);


    res.json({ success: true, message: 'Thanks Your Message has been sent!' });

  } catch (error) {
    res.json({ success: false, error: 'Data not added' })
  }
});






app.get("/contact-info", async (req, res) => {
  try {
    const contacts = await User1.find();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});
//get register data

app.post('/register', async (req, res) => {
  const { name, email, mobileno, password } = req.body;
  console.log(name + email + mobileno + password)


  try {

    // Check if the user with the given email already exists
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      // If user exists, return an error response
      return res.json({ success: false, error: 'Email already registered, please do login!' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    // add data
    const result = await User.create({
      name,
      email,
      mobileno,
      password: hashedPassword,

    });

    console.log(result);


    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Smile Cafe Point',
      html: `
      <p>Hello ${name},</p>
      <p>Thank you for registering with Smile Cafe Point. We are thrilled to welcome you to our community!</p>
      <p>As a member, you can enjoy exclusive offers, discounts, and updates on our latest offerings.</p>
      <p>Stay tuned for exciting news and events!</p>
      <p>Best regards,</p>
      <p>Smile Cafe Point Team</p>
      <img src="https://www.cafecoffeeday.com/sites/default/files/mobile-new-menu-cafe-coffee-day.jpg">
    `,
    };




    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.json({ success: true, message: 'Thanks Registration successful' });
  }




  catch (error) {
    console.error('Error during registration:', error);

    res.json({ success: false, error: 'Internal Server Error' });
  }













});



app.get("/register-info", async (req, res) => {
  try {
    const user = await User.find();
    res.json({ success: true, data: user });
  } catch (error) {
    res.json({ success: false, error: 'Failed to retrieve contacts' });
  }
});

// Update your login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;



  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, error: 'Invalid email' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid  password' });
    }



    const token = jwt.sign({ email }, 'secret-key', { expiresIn: '24h' });



    console.log(token)
    console.log(user.name)

    

    res.json({ success: true, message: 'Thanks Shop here now', data: token ,cartinfo:user.cart,name:user.name});

  } catch (error) {
    console.error('Error during login:', error);
  }





});




app.post('/book', async (req, res) => {
  const { name, email, mobile, numofpass, date, time } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token)
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }


      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Check if the user already has a booking for the given date
      const existingBooking = user.book.find(booking => booking.email === email);
      if (existingBooking) {
        return res.status(400).json({ success: false, error: 'User already has a booking for this date' });
      }

      user.book.push({
        name,
        email,
        mobile,
        numofpass,
        date,
        time
      });

      const userbook = await user.save();

      console.log(userbook)
      // console.log(user)

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });


      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Smile cafe point',
        html: `
  <div style="background-color: #f3f3f3; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
        <p style="color: #333; font-size: 18px;">Dear Customer,</p>
        <p style="color: #333; font-size: 16px;">Thank you for Booking at Smile Cafe Point!</p>
        <p style="color: #333; font-size: 16px;">Below is the information you requested:</p>
        <hr style="border: 1px solid #ccc;">
        <div style="background-color: #f3f3f3; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
           
            <div style="margin-top: 20px;">
                <p style="color: #333; font-size: 16px;"><strong>Contact Details:</strong></p>
                <ul style="list-style-type: none; padding-left: 0;">
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Phone:</strong> ${mobile}</li>
                    <li><strong>Total Booking:</strong> ${numofpass}</li>
                    <li><strong>date:</strong> ${date}</li>
                    <li><strong>time:</strong> ${time}</li>
                </ul>
            </div>
           
        </div>
    </div>
        <hr style="border: 1px solid #ccc;">
        <p style="color: #333; font-size: 16px;">If you have any further questions or need assistance, feel free to contact us.</p>
        <p style="color: #666; font-size: 16px;">Best regards,</p>
        <p style="color: #666; font-size: 16px;">Smile Cafe Point Team</p>
      
      
        <p style="color: #666; font-size: 16px; margin-top: 20px;"> Nizampura,Vadodara,india</p>
    </div>
</div>

  `,
        attachments: [
          {
            filename: 'Menu.pdf',
            path: 'cafe.pdf' // provide the path to your PDF file
          }
        ]
      };







      const info = await transporter.sendMail(mailOptions);

      console.log('Email sent:', info.response);


      res.json({ success: true, message: 'Thanks Your Booking has been Confirmed' });
    });
  } catch (error) {
    console.error('Error during booking:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/book-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    // console.log('Token:', token);

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // console.log('Decoded:', decoded);

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // console.log('User:', user);

      res.json({ bookInfo: user.book });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/add-to-cart', async (req, res) => {
  const {id} = req.body;
  console.log(id)
  
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false,message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({success: false, message: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({success: false, message: 'User not found' });
      }

      const existingId = user.cart.find(item => item.id === id);
      if (existingId) {
        return res.status(400).json({ success: false, error: 'product already in the cart' });
      }

      

      // Add the product to the user's cart
      user.cart.push({
        id,
      });

      await user.save();

      console.log(user.cart)

   

      res.json({ success: true, message: 'Thanks Product added to cart',cartinfo:user.cart});
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/cart-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Read the data.json file
      const filePath = path.join(__dirname, 'data.json');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        const updatedData = jsonData.map(item => {
          if (item.img) {
            item.img = 'http://' + req.get('host') + item.img;
          }
    
          return item;
        });

        // Filter the products based on the IDs in the user's cart
        const cartData = user.cart.map(cartItem => {
          const product = updatedData.find(product => product.id === cartItem.id);
          if (product) {
            return {
              id: product.id,
              title: product.title,
              price: product.price,
              img: product.img,
              quantity: cartItem.quantity
            };
          }
          return null;
        }).filter(Boolean);

        console.log(cartData)
        res.json({ success: true, cartinfo:cartData });
      });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/remove-from-cart', async (req, res) => {
  const { id } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({success:false, error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({success:false, error: 'Invalid token' });
      }

      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { $pull: { cart: { id: id } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({success:false, error: 'User not found' });
      }

      // Fetch the updated cart items
      const updatedCartItems = user.cart;

      res.json({ success: true, message: 'Product deleted from the cart', cartinfo: updatedCartItems });
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/increase-quantity', async (req, res) => {
  const { id } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const user = await User.findOneAndUpdate(
        { email: decoded.email, 'cart.id': id },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Flag to track if quantity exceeds 10
      let quantityExceeds10 = false;

      // Check if the quantity exceeds 10 and reset it to 10 if it does
      user.cart.forEach(item => {
        if (item.id === id && item.quantity > 10) {
          item.quantity = 10;
          quantityExceeds10 = true;
        }
      });

      // Save the updated user
      await user.save();

      // Fetch the updated cart items
      const updatedCartItems = user.cart;

      // Send response based on the flag
      if (quantityExceeds10) {
        return res.json({ success: false, error: `can't add more than 10` });
      } else {
        res.json({ success: true, message: 'Quantity added', cartinfo: updatedCartItems });
      }
    });

  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


app.post('/decrease-quantity', async (req, res) => {
  const { id } = req.body;

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const user = await User.findOneAndUpdate(
        { email: decoded.email, 'cart.id': id },
        { $inc: { 'cart.$.quantity': -1 } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Flag to track if quantity exceeds 10
      let quantityExceeds10 = false;

      // Check if the quantity exceeds 10 and reset it to 10 if it does
      user.cart.forEach(item => {
        if (item.id === id && item.quantity <1) {
          item.quantity = 1;
          quantityExceeds10 = true;
        }
      });

      // Save the updated user
      await user.save();

      // Fetch the updated cart items
      const updatedCartItems = user.cart;

      // Send response based on the flag
      if (quantityExceeds10) {
        return res.json({ success: false, error: `can't be less than 1` });
      } else {
        res.json({ success: true, message: 'Quantity decrease', cartinfo: updatedCartItems });
      }
    });

  } catch (error) {
    console.error('Error increasing quantity:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/remove-from-register', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndDelete({ email: email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/checkout', async (req, res) => {
  const { name, email, mobile, address, state, pincode, landmark, city, alternate } = req.body;
  
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({success: false, message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false,message: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false,message: 'User not found' });
      }

      
      user.checkout = {
        name, 
        email, 
        mobile, 
        address, 
        state, 
        pincode, 
        landmark, 
        city, 
        alternate
      };

  const result = await user.save();
     

      console.log(result)

      res.json({ success: true, message: 'Thanks Shipping information saved successfully!' })});
  } catch (error) {
    console.error('Error saving shipping information:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/shipping-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // You can directly send the shipping information in the response
      const shippingInfo = user.checkout || {};

      res.json({ success: true, data:shippingInfo });
      console.log(shippingInfo)
    });
  } catch (error) {
    console.error('Error fetching user address:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});








app.post('/order', async (req, res) => {
  const { items } = req.body;

  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      // Find user by email
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Add items to the user's order
      user.order.push(...items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        orderdate: new Date()
      })));

      // Remove ordered items from the cart
      user.cart = user.cart.filter(cartItem => !items.some(item => item.id === cartItem.id));

      // Save the updated user
      await user.save();
console.log(user.order)
      res.json({ success: true, message: 'Thanks Order placed successfully' });
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/order-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Read the data.json file
      const filePath = path.join(__dirname, 'data.json');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, error: 'Internal Server Error' });
        }

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        const updatedData = jsonData.map(item => {
          if (item.img) {
            item.img = 'http://' + req.get('host') + item.img;
          }
    
          return item;
        });

        // Filter the products based on the IDs in the user's cart
        const cartData = user.order.map(cartItem => {
          const product = updatedData.find(product => product.id === cartItem.id);
          if (product) {
            return {
              id: product.id,
              title: product.title,
              price: product.price,
              img: product.img,
              quantity: cartItem.quantity,
              orderdate:cartItem.orderdate
            };
          }
          return null;
        }).filter(Boolean);

        console.log(cartData)
        res.json({ success: true, orderinfo:cartData });
      });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});








app.listen(3005, () => {
  console.log('Server connected');
});