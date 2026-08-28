import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kings-farms'
const mongoClient = new MongoClient(mongoUri)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'kingsturkeyfarm@gmail.com',
    pass: process.env.EMAIL_PASS || '',
  },
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/orders', async (req, res) => {
  const { customerName, phone, option, address, items, createdAt } = req.body || {}

  if (!customerName || !phone || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Customer and product information are required.' })
  }

  try {
    await mongoClient.connect()
    const db = mongoClient.db()
    const collection = db.collection('orders')

    const orderDoc = {
      customerName,
      phone,
      option: option || 'Local Delivery',
      address: address || 'Not provided',
      items,
      createdAt: createdAt || new Date().toISOString(),
      source: 'web-app',
    }

    await collection.insertOne(orderDoc)

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'kingsturkeyfarm@gmail.com',
        to: 'kingsturkeyfarm@gmail.com',
        subject: `New Order Request - ${customerName}`,
        text: `
Customer: ${customerName}
Phone: ${phone}
Option: ${option || 'Local Delivery'}
Address: ${address || 'Not provided'}

Items:
${items
  .map((item) => `- ${item.quantity} ${item.unit} x ${item.name}`)
  .join('\n')}

Please reply with the current daily rates and availability for this request.
        `.trim(),
      })
    } catch (mailError) {
      console.error('Email backup failed:', mailError)
    }

    return res.status(201).json({
      message: 'Order saved successfully and backup email queued.',
      orderId: orderDoc._id || null,
    })
  } catch (error) {
    console.error('Order save failed:', error)
    return res.status(500).json({
      message: 'Unable to save order right now. Please try again or send via WhatsApp.',
    })
  } finally {
    await mongoClient.close()
  }
})

app.listen(port, () => {
  console.log(`Kings Farms API running on http://localhost:${port}`)
})
