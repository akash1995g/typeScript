import express from 'express'

import todoRouter from './routes/todos'

var app = express()

app.use("/todos", todoRouter)

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ message: err.message })
})
app.listen(3000)