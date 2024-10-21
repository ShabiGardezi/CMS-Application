import mongoose from 'mongoose'

const connectDb = (handler: any) => async (req: any, res: any) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res)
  }

  await mongoose.connect('mongodb+srv://shabigardezi51214:saqs123321@cluster0.e4dpy0n.mongodb.net/CMS')

  return handler(req, res)
}

export default connectDb
