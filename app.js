const express = require('express');
const app = express();
const ytdl = require('ytdl-core');
const cors = require('cors')

app.use(cors({ origin: '*' }))


app.listen(3333, () => {
    console.log('server started');
})

app.get('/api/stream/medata', async (req, res) => {
    try {
        let medata = await ytdl.getInfo(req.query.url)
        return res.json(medata.videoDetails)
    } catch (error) {
        res.status
        res.status(400).json({
            message: error.message
        })
    }
})

app.get('/api/stream', (req, res) => {
    let aData = []
    if (!req.query.url) res.send({ message: 'please enter an url' })
    if (req.query.type === 'mp3') {
        try {
            let stream = ytdl(req.query.url, { filter: 'audioonly' })
            stream.on('data', (data) => {
                aData.push(data);
            })
            stream.on('end', () => {
                let buffer = Buffer.concat(aData)
                res.setHeader('content-type', 'audio/mpeg');
                res.write(buffer, () => {
                })
                res.end()
            })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }
    if (req.query.type === 'mp4') {
        try {
            let stream = ytdl(req.query.url)
            stream.on('data', (data) => {
                aData.push(data);
            })
            stream.on('end', () => {
                let buffer = Buffer.concat(aData)
                res.setHeader('content-type', 'video/mp4');
                res.write(buffer, () => {
                })
                res.end()
            })
        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }
})