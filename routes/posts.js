import { ensureAuthenticated } from "../lib/db/utils.js";
import express from 'express';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { posts, users, likes } from "../lib/db/schema.js";
import { dbURL } from '../constants.js';
import { sql } from "drizzle-orm";
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';


const postsRouter = express.Router();



postsRouter.get('/posts', ensureAuthenticated, async (req, res, next) => {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const posts_ = (await db.select().from(posts).leftJoin(users, eq(posts.user_id, users.id)).where(eq(posts.user_id, req.session.userId)))
    return res.json(posts_);
});

//Update post by id 
postsRouter.put('/posts/:id', ensureAuthenticated, async (req, res, next) => {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const posts_ = await db.update(posts).set({ title: req.body.title, content: req.body.body }).where(eq(posts.id, req.params.id));
    return res.json(posts_);
});


//delete post by id
postsRouter.delete('/posts/:id', ensureAuthenticated, async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const posts_ = await db.delete(posts).where(and(eq(posts.id, req.params.id), eq(posts.user_id, authenticatedUserId)));
    return res.json(posts_);
});


//create post
postsRouter.post('/posts', ensureAuthenticated, async (req, res, next) => {
    try {
        const sqlite = new Database(dbURL);
        const db = drizzle(sqlite);
        const posts_ = await db.insert(posts).values({ title: req.body.title, content: req.body.content, user_id: req.session.userId });
        return res.json(posts_);

    }
    catch (err) {
        res.send(401);
    }



});

//View post by userid
postsRouter.get('/posts/:id', async (req, res, next) => {
    const sqlite = new Database(dbURL);
    const db = drizzle(sqlite);
    const posts_ = await db.select().from(posts).where(eq(posts.user_id, req.params.id));
    return res.json(posts_);
});


postsRouter.get('/getAllPosts', async (req, res, next) => {
    const sqlite = new Database(dbURL);

    const db = drizzle(sqlite);

    //this query should join the likes tables also to return count
    const posts_ = await db.select().from(posts).leftJoin(users, eq(posts.user_id, users.id));
    const likeCOunts = [];
    for (let i = 0; i < posts_.length; i++) {
        const post = posts_[i];
        const count = await db.select().from(likes).where(eq(likes.post_id, post.id));
        likeCOunts.push(count.length);
    }

    for (let i = 0; i < posts_.length; i++) {
        const post = posts_[i];
        post.likeCount = likeCOunts[i];
    }
    return res.json(posts_);
});


postsRouter.put('/like', ensureAuthenticated, async (req, res, next) => {

    const like = req.body.like;
    const id = req.body.id;
    const sessionUserId = req.session.userId;

    const sqlite = new Database(dbURL);

    const db = drizzle(sqlite);


    const alreadyLiked = await db.select().from(likes).where(and(eq(likes.post_id, id), eq(likes.user_id, sessionUserId)));

    if (like == true) {
        if (alreadyLiked.length > 0) {
            return res.json({ "message": "already liked" });
        }
        const like_ = await db.insert(likes).values({ post_id: id, user_id: sessionUserId });
        return res.json(like_);
    }
    else {
        if (alreadyLiked.length > 0) {
            const like_ = await db.delete(likes).where(and(eq(likes.post_id, id), eq(likes.user_id, sessionUserId)));
            return res.json(like_);
        }
        else {
            return res.json({ "message": "not liked" });
        }
    }
});




export default postsRouter;