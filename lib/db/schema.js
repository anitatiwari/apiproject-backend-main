import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";


export const users = sqliteTable('users', {
    id: integer('id').unique().primaryKey(),
    firstname: text('firstname').notNull(),
    lastname: text('lastname').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    
});

export const posts = sqliteTable('posts', {
    id: integer('id').unique().primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    user_id: integer('user_id').references(() => users.id,{ onDelete: 'cascade' }),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const likes = sqliteTable('likes', {
    id: integer('id').unique().primaryKey(),
    user_id: integer('user_id').references(() => users.id,{ onDelete: 'cascade' }),
    post_id: integer('post_id').references(() => posts.id,{ onDelete: 'cascade' }),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});





