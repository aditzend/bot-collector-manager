import {
    Mongo
} from 'meteor/mongo';

export const Chat = new Mongo.Collection('chat');
export const Client = new Mongo.Collection('client');
export const Expenses = new Mongo.Collection('expenses');