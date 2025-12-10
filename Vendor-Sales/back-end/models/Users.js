import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: { type: String, },
  address: { type: String },
  bills: { type: Object },
  customerSalesContribution: { type: Object },
});

const personalInfoSchema = new mongoose.Schema({
  shopName: { type: String },
  ownerName: { type: String },
  gender: { type: String },
  streetAddress: { type: String },
  district: { type: String },
  state: { type: String },
  pinCode: { type: String },
  email: { type: String },
  phoneNo: { type: String },
  instagram: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personalInfo: personalInfoSchema,
  customers: [customerSchema],
});

const Users = mongoose.model("Users", userSchema);
export default Users;
