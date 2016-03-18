import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import igNode from 'instagram-node';

const ig = igNode.instagram();
ig.use({ client_id: 'ab78cb1a37264d23a1fdaca1d801ea33',
         client_secret: '402920b758d1416e9a6fbcddffe4af95' });

var app = express();
app.server = http.createServer(app);

app.use(cors({
    exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
    limit : '100kb'
}));

app.get('/user/search/:userName', (req, res) => {
    ig.user_search(req.params.userName, (err, users, remaining, limit) => {
        res.json(users);
    });
});

app.get('/user/images/:userId', (req, res) => {
    ig.user_media_recent(req.params.userId, (err, medias, pagination, remaining, limit) => {
        var result = medias.map(item => {
            return {
                id: item.id,
                thumbnail: item.images.thumbnail.url,
                small: item.images.low_resolution.url, 
                big: item.images.standard_resolution.url,
                likeCount: item.likes.count
            }
        });
        res.json(result);
    });
});

app.server.listen(process.env.PORT || 7001);
console.log(`Insta2048 is up on ${app.server.address().port}`);