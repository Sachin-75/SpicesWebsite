const mongoose = require("mongoose");

const DB = 'mongodb+srv://Sachin-75:sachin750@cluster0.kdb6soc.mongodb.net/Spicesproject?retryWrites=true&w=majority'
mongoose.connect(DB).then(() => {
    console.log(`connection successfully`);
}).catch((err) => console.log(`no connection`));



// mongoose.connect("mongodb://localhost:27017/SpicesRegistration", {
//     // useNewUrlParser:true,
//     // useUnifiedTopology:true,
//     // useCreateIndex:true
// }).then(() => {
//     console.log(`connection successful`);
// }).catch((e) => {
//     console.log(`no connection`);
// })