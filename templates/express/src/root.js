import express from 'express'
const app = express()

app.get('/api/products', (req, res) => {
  res.status(200).json([
    {
      id: 1,
      name: 'iPhone',
    },
    {
      id: 2,
      name: 'MacBook Pro',
    },
  ])
})

export { app }
