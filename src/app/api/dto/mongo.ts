import mongoose from 'mongoose'

let mongo: mongoose.Mongoose

export const MaterialSchema = new mongoose.Schema({
  title: String,
  imgUrl: String,
  tags: [String],
})

export const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // 确保 name 字段唯一
  },
})

export async function connectMongo() {
  if (mongo) {
    return mongo
  } else {
    await mongoose.connect('mongodb://localhost:27017/yinke')
    mongo = mongoose
    return mongo
  }
}
