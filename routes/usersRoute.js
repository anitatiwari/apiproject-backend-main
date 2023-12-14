import express from 'express';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { posts, users } from "../lib/db/schema.js";
import { ensureAuthenticated } from '../lib/db/utils.js';
import { dbURL } from '../constants.js';
const userRouter = express.Router();


userRouter.post('/signup', async function (req, res, next) {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    console.log(req.body);

    const { firstname, lastname, email, password } = req.body;

    //check if user exists
    const userExists = await db.select().from(users).where(eq(users.email, email));
    console.log(userExists);

    if (userExists.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
    }


    const user = await db.insert(users).values({
        firstname,
        lastname,
        email,
        password
    });

    return res.status(200).json({ message: 'User created successfully' });


});





userRouter.get('/profile', ensureAuthenticated, async function (req, res, next) {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User does not exist' });
    }


    //check if user exists
    const user = await db.select().from(users).where(eq(users.id, userId));


    if (user.length === 0) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    return res.status(200).json(user[0]);

});


userRouter.delete('/deleteAccount', ensureAuthenticated, async function (req, res, next) {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    //check if user exists
    const user = await db.delete(users).where(eq(users.id, userId));

    return res.status(200).json({"message":"success"});

});

userRouter.get('/profile/:userId', async function (req, res, next) {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const userId = req.params.userId;
    console.log(userId);
    if (!userId) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    //check if user exists
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (user.length === 0) {
        return res.status(400).json({ error: 'User does not exist' });
    }

    return res.status(200).json(user[0]);

});


userRouter.get('/posts/:userId', async function (req, res, next) {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);

    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ error: 'User does not exist' });
    }
    //check if user exists
    const postsOfUser = await db.select().from(posts).leftJoin(users, eq(posts.user_id, users.id)).where(eq(posts.user_id, userId));


    return res.json(postsOfUser);

});

userRouter.get('/listUsers/', async function (req, res, next) {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);


    const allUsers = await db.select({
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        id: users.id,
        createdAt: users.created_at,
    }).from(users);

    return res.json(allUsers);
});





export default userRouter;
