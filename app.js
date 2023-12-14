import express from 'express';
import userRouter from './routes/usersRoute.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import session from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';


const app = express()

var whitelist = ['http://localhost:3000' ]
const swaggerDocument = YAML.load('openapi.spec.yaml');

const corsOptions = {
  origin: 'http://localhost:3000',  //Your Client, do not write '*'
  credentials: true,
};
app.use(cors(corsOptions));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use(bodyParser.json());
app.use(session({
  secret: 'Keep it secret'
  , name: 'uniqueSessionID'
  , saveUninitialized: false
}))

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/post', postsRouter);


const port = 3001

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})