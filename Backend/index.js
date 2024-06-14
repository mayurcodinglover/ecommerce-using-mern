const express = require("express");
const Razorpay=require("razorpay");
const crypto=require("crypto");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}));

//database connect with mongodb
mongoose.connect(
  "mongodb+srv://hedaumayur2003:64fU8a59Na7T6PPQ@cluster0.saixtve.mongodb.net/e-commerce"
);
console.log("connected");

//api creation
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));


//creating upload endpoint for images
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(req.body.category);
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

//creating api for deleting product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: 1,
    name: req.body.name,
  });
});

//creating api for getting all product
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All products fetched");
  res.send(products);
});



//creating user model schema
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


//creating endpoint for the user signup
app.post("/signup", async (req, res) => {
   let check=await Users.findOne({email:req.body.email});
   if(check)
    {
      return res.status(400).json({success:false,errors:"Email id Already Exist"})
    }
    let cart={};
    for (let i = 0; i < 300; i++) {
      cart[i]=0
    }
    const user=new Users({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password,
      cartData:cart,
    })

    await user.save();
    const data={
      user:{
        id:user.id
      }
    }
    const token=jwt.sign(data,'secret_ecom')
    res.json({success:true,token})
});

//creating endpoint for users login 
  app.post("/login",async (req,res)=>{
        let user=await Users.findOne({email:req.body.email})
        if(user)
          {
            const checkpass=(user.password===req.body.password)
            if(checkpass)
              {
                const data={
                  user:{
                    id:user.id
                  }
                }
                const token=jwt.sign(data,'secret_ecom');
                res.json({success:true,token})
              }
              else{
                res.json({success:false,error:"Password not match"})
              }
          }
          else{
            res.json({success:false,error:"User not exist"})
          }
  })

  //creating api for newcollection
  app.get("/newcollections",async (req,res)=>{
    const product=await Product.find({})
    let newcollections=product.slice(1).slice(-4);
    console.log(newcollections);
    res.send(newcollections);
  })

  //creating api for popularin women 
  app.get("/popularinwomen",async (req,res)=>{
    let product=await Product.find({category:"women"})
    let popular=product.slice(0,4);
    console.log("popularwomen fetched");
    res.send(popular);
  })

  //creating middleware to fetch user

  const fetchUser=async(req,res,next)=>{
    const token =req.header("auth-token");
    if(!token)
      {
        res.status(401).send({errors:"please authenticate using valid token"});
      }
      else{
        try {
          const data=jwt.verify(token,'secret_ecom');
          req.user=data.user;
          next();
        } catch (error) {
          res.status(401).send({errors:"please authenticate using valid token"});
        }
      }
  }
  //Add cart item
  app.post("/addtocart",fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    console.log("Added",req.body.itemId);
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
  })

  //remove cart item
  app.post("/removecart",fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    console.log("removed",req.body.itemId);
    if(userData.cartData[req.body.itemId]>0)
      {
        userData.cartData[req.body.itemId]-=1;
      }
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("removed");
  })
  //reset cart when payment done
  app.post("/resetcart",fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    
    const cart = {};
    for (let i = 0; i <= 300; i++) {
      cart[i] = 0;
    }

    // Update the user's cartData with the new empty cart
    userData.cartData = cart;
    console.log(userData.cartData);

    // Save the updated user data to the database
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.send("reset");
  })

  //get cart data when user login
  app.post("/getcart",fetchUser,async(req,res)=>{
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
  })

  //creating address documents
  const Address=mongoose.model("Address",{
    id:{
      type:Number,
      required:true,
    },
    uid:{
      type: String,
      required:true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  //creating order document
  const Orders =mongoose.model("Orders",{
    id:{
      type:String,
      required:true,
    },
    uid:{
      type:String,
      required:true,
    },
    items:{
      type:String,
      required:true,
    },
    total:{
      type:Number,
      required:true,
    },
    status:{
      type:String,
      required:true,
    },
    createdAt:{
      type:Date,
      default:Date.now,
    },
  });

  //endpoint for store order details
  app.post("/storeorderdata",async(req,res)=>{
      const order=new Orders({
        id:req.body.orderid,
        uid:req.body.uid,
        items:req.body.products,
        total:req.body.total,
        status:"Pending",
      });

      await order.save();
      res.send({success:true,message:"data saved"});
  })
  //end point for fetch order details

  app.get("/userid",fetchUser,async(req,res)=>{
    res.send({id:req.user.id})
  })
  //endpoint for storing order data
  

  //endpoint for store adderess in the database
app.post("/address",fetchUser,async(req,res)=>{
    const addresses=await Address.find({})
    let id;
    if (addresses.length > 0) {
      let last_address_array = addresses.slice(-1);
      let last_address = last_address_array[0];
      id = last_address.id + 1;
    } else {
      id = 1;
    }
    const address=new Address({
      id:id,
      uid:req.user.id,
      firstName:req.body.fname,
      lastName:req.body.lname,
      email:req.body.email,
      street:req.body.street,
      city:req.body.city,
      state:req.body.state,
      pincode:req.body.pincode,
      country:req.body.country,
      phone:req.body.phone,
    });
    await address.save();
    res.send({success:true,message:"address stored successfully"});
})

//fetch user address
app.get("/useraddress",fetchUser,async(req,res)=>{
  const useraddress=await Address.find({uid:req.user.id})
  res.send(useraddress);
})

//integrate razor pay
app.post("/orders",async (req,res)=>{
  try{
  const razorpay=new Razorpay({
    key_id:process.env.RAZORPAY_ID_KEY,
    key_secret:process.env.RAZORPAY_SECRET_KEY,
  })
  
  const options=req.body;
  const order=await razorpay.orders.create(options);

  if(!order)
    {
      return res.status(500).send("Error");
    }
    res.json(order);
  }catch(err){
    console.log(err);
    res.status(500).send("Error");
  }
})
//verify payment
app.post("/order/validate",async(req,res)=>{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;

  const sha=crypto.createHmac("sha256",process.env.RAZORPAY_SECRET_KEY);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest=sha.digest("hex");
  if(digest!==razorpay_signature){
    return res.status(400).json({msg:"Transaction is not legal!"});
  }
  res.json({
    success:true,
    orderId:razorpay_order_id,
    paymentId:razorpay_payment_id,
  });
});

//endpoint for fetch all user data
app.get("/alluser",fetchUser,async(req,res)=>{
  const alluser=await Users.find({_id:req.user.id});
  res.send(alluser);
})
//endpoint for fetch order data 
app.get("/fetchorder",fetchUser,async(req,res)=>{
  const alldata=await Orders.find({uid:req.user.id});
  res.json(alldata)
})
//endpoint for fetch all order data for admin
app.get("/fetchallorder",async(req,res)=>{
  const data=await Orders.find({})
  console.log(data);
  res.json(data);
})

//endpoint for update order status
app.put("/orders/:orderId",async(req,res)=>{
  try{
    const {orderId}=req.params
    const data=await Orders.findOne({id:orderId})
    const updatedorder=await Orders.findOneAndUpdate({id:orderId},{status:req.body.status},{new:true});
    if(!updatedorder)
      {
        return res.status(404).json({error:'order not found'})
      }
      res.json({success:true})
  }
  catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
