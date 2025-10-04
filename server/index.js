const express = require('express')
const cors = require('cors')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.post('/api/uploadStatement', upload.single('file'), (req, res) => {
  // Placeholder: save file and return a fake parsed response
  res.json({ message: 'uploaded', filename: req.file?.filename || null })
})

app.get('/api/cashbackTips', (req, res) => {
  // Static example response
  res.json({ tips: [
    { card: 'Discover', category: 'Gas', note: '5% rotating for April' },
    { card: 'Chase Freedom', category: 'Groceries', note: '1% base + 3% bonus' }
  ]})
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log('Server listening on', port))
