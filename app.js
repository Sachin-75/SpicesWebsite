const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");

// ***Database Connection***
// const mongoose = require("./db/conn.js");
const mongoose = require("mongoose");

// const DB = 'mongodb+srv://Sachin-75:sachin750@cluster0.kdb6soc.mongodb.net/Spicesproject?retryWrites=true&w=majority'
const DB = 'mongodb://localhost:27017/SpicesRegistration'
mongoose.connect(DB).then(() => {
    console.log(`connection successfully`);
}).catch((err) => console.log(`no connection`));

//mongodb+srv://Sachin-75:sachin750@cluster0.kdb6soc.mongodb.net/Spicesproject?retryWrites=true&w=majority
// mongoose.connect("mongodb://localhost:27017/SpicesRegistration", {
//     // useNewUrlParser:true,
//     // useUnifiedTopology:true,
//     // useCreateIndex:true
// }).then(() => {
//     console.log(`connection successful`);
// }).catch((e) => {
//     console.log(`no connection`);
// })

// End of database connection




// Connection With Register

// const employeeSchema = new mongoose.Schema({
//     name : {
//         type:String,
//         required:true
//     },
//     phone : {
//         type:Number,
//         required:true,
//         unique:true
//     },
//     email : {
//         type:String,
//         required:true,
//         unique:true
//     },
//     password : {
//         type:String,
//         required:true
//     },
//     confirmpassword : {
//         type:String,
//         required:true
//     },
//     selection : {
//         type:String,
//         required:true
//     }
// })

// const Register = new mongoose.model("Registers", employeeSchema)

// module.exports = Register;

// End of connection with Register


const Register = require("./models/registers");
const Payment = require("./models/payment");

const { json } = require("express");
const { Connection } = require("mongoose");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
// const template_path = path.join(__dirname, "../templates/views");
// const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(express.static(static_path));
app.set("view engine", "hbs");
app.use(express.static(__dirname + '/public'));
// app.set("views", template_path);
// hbs.registerPartials(partials_path);

app.use('/payment', require('./server'));
app.post("/payment", async (req, res) => {
    try {
        const userPayment = new Payment({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        })

        await userPayment.save();

    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/", (req, res) => {
    res.render("./index.hbs");
});

app.get("/sign", (req, res) => {
    res.render("./sign.hbs");
});

// app.post("/register", async (req, res) => {
//     try {
//         const password = req.body.password;
//         const cpassword = req.body.confirmpassword;

//         if(password === cpassword){
//             const registerEmployee = new Register({
//                 name : req.body.name,
//                 phone : req.body.phone,
//                 email : req.body.email,
//                 password : req.body.password,
//                 confirmpassword : req.body.confirmpassword
//             })

//             const registered = await registerEmployee.save();
//             res.status(201).render("login");
//         }else{
//             res.send("password are not matching");
//         }

//     } catch(error) {
//         res.status(400).send(error);
//     }
// });

app.post("/sign", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerEmployee = new Register({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,
                selection: req.body.selection
            })

            const registered = await registerEmployee.save();
                    res.redirect("/login");
           
        } else {
            res.send("password are not matching");
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

// app.post("/login", async (req, res) => {
//     try {
//         const email = req.body.email;
//         const password = req.body.password;

//         const useremail = await Register.findOne({email:email});
//         //res.send(useremail.password);
//         //console.log(useremail);
//         if(useremail.password === password){
//             res.status(201).render("index");
//         }else{
//             res.send("password are not matching");
//         }

//     } catch (error) {
//         res.status(400).send("Invalid Email");
//     }
// });


app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const selection = req.body.selection;

        const useremail = await Register.findOne({ email: email });

        const Selection = await Register.findOne({ selection: selection });
        if (useremail.password === password) {
            if (Selection.selection === selection) {
                res.status(201).redirect("/cart");
            } else {
                res.redirect("/login").then(
                    () => {
                        // alert("choose properly");
                        res.send("Invalid Details");
                    }
                )
            }

        } else {
            res.redirect("/login").then(
                () => {
                    // alert("choose properly");
                    res.send("Invalid login details");
                }
            )
        }
    
    } catch (error) {
        // alert("Invalid Details");
        res.status(400).send("Invalid login details");
    }
});

app.get("/product", (req, res) => {
    res.render("product");
});

app.get("/product2", (req, res) => {
    res.render("product2");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/cart", (req, res) => {
    res.render("cart");
});

app.get("/Trpage", (req, res) => {
    res.render("TraditionalPage");
});

app.get("/admin", (req, res) => {
    res.render("admin_panel.hbs");
});


app.listen(port, () => {
    console.log(`server is listening at port ${port}`);
});

