import dotenv from 'dotenv';
import pathFinder from './pathFinder.js';
dotenv.config();
pathFinder()
// Create an admin axios instance with admin-specific config

console.log("Dotenv:", process.env.APP_URL)