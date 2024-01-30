import { app } from './root.js'

import dotenv from 'dotenv'
import defaultRoute from './routes/default.route.js'

dotenv.config()
const port = process.env.PORT || 3000

app.use(defaultRoute)

app.listen(port, () => {
  console.log(`⚡Server listening on port \x1b[33m${port}\x1b[37m`)
})
