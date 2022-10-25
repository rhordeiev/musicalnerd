const express = require('express');
const cors = require('cors');
require('./config/chat');

const accountRouter = require('./routes/accountRouter');
const imageRouter = require('./routes/imageRouter');
const artistRouter = require('./routes/artistRouter');
const albumRouter = require('./routes/albumRouter');
const reviewRouter = require('./routes/reviewRouter');
const messageRouter = require('./routes/messageRouter');

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(express.json());
app.use('/account', accountRouter);
app.use('/image', imageRouter);
app.use('/artist', artistRouter);
app.use('/album', albumRouter);
app.use('/review', reviewRouter);
app.use('/message', messageRouter);

app.listen(process.env.PORT || 3000);
