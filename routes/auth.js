import express from 'express';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { users } from "../lib/db/schema.js";
import { gt, lt, and } from "drizzle-orm";
import bodyParser from 'body-parser';
import { dbURL } from '../constants.js';
const authRouter = express.Router();


authRouter.post('/authenticate'
    , bodyParser.urlencoded()
    , async (req, res, next) => {
        const sqlite = new Database(dbURL);
        const db = drizzle(sqlite);
        // Actual implementation would check values in a database
        const email = req.body.email;
        const password = req.body.password;

        const data = await db.select().from(users).where(and(eq(users.email, email), eq(users.password, password)));
        if (data.length === 0) {
            return res.sendStatus(401)
        }

        const userId = data[0].id
        req.userId = userId; // Assigning userId to the request object
        
        next();

        
    }
    , (req, res) => {
        req.session.isLoggedIn = true
        console.log(req.userId)
     
        req.session.userId = req.userId;
        return res.json({ status: 'success' });
})




export default authRouter;
