const express = require('express')

const morgan = require('morgan')
const cors = require('cors')
const bodyParse = require('body-parser')
const path = require('path');
const connectDB = require('./Config/db')


const { readdirSync } = require('fs')
// const productRouters = require('./Routes/product')
// const authRouters = require('./Routes/auth')

const app = express();

connectDB()


app.use(express.static(path.join(__dirname, 'public')));





app.use(morgan('dev'))
app.use(cors())
app.use(bodyParse.json({ limit: '10mb' }))


readdirSync('./Routes')
    .map((r) => app.use('/api', require('./Routes/' + r)))


app.listen(5000, () => console.log('Server is Running 5000'))