import { run } from './app.js';

run(process.env.NODE_ENV || 'development')
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

// import mongoose from 'mongoose';
// import express from 'express';
// import bodyParser from 'body-parser';
