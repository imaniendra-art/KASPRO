const mongoose = require('mongoose');
const uri = "mongodb+srv://imaniendra:imaniman@cluster0.pfto4.mongodb.net/kaspro?retryWrites=true&w=majority";

async function check() {
  await mongoose.connect(uri);
  const Pengajuan = mongoose.model('Pengajuan', new mongoose.Schema({}, { strict: false }));
  const data = await Pengajuan.find({}, 'judul pengusulId status').lean();
  console.log("Pengajuan Data:");
  console.log(JSON.stringify(data, null, 2));
  
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const users = await User.find({}, 'username role').lean();
  console.log("Users:");
  console.log(JSON.stringify(users, null, 2));
  
  process.exit(0);
}
check();
