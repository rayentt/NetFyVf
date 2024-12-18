/*import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from 'cors';
import moviesRoute from  "./routes/moviesRoute.js";
import usersRoute from "./routes/userRoute.js";
import musicRoute from "./routes/musicRoute.js" ;
import playlistRoute from "./routes/playlistRoute.js"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Movie from './models/movieModel.js'
import Music from "./models/musicModel.js";





// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());



// Connect to MongoDB and start the server
mongoose
    .connect(mongoDBURL)
    .then(async () => {
        console.log("Connected to MongoDB");

        // Update the path to the correct location of movies.json
        const moviesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../Mern_Netfy/movies.json'))); // Adjust the path here
        const musicData = JSON.parse(fs.readFileSync(path.join(__dirname, '../Mern_Netfy/spotify_tracks.json'))); // Adjust the path here


        try {
            // Insert movies into MongoDB if they don't already exist
            const existingMovies = await Movie.find({});
            if (existingMovies.length === 0) {
                const result = await Movie.insertMany(moviesData);
                console.log('Movies loaded:', result);
            } else {
                console.log('Movies already loaded.');
            }
        } catch (error) {
            console.error('Error inserting movies:', error.message);
        }
        try {
            // Insert music into MongoDB if they don't already exist
            const existingMusic = await Music.find({});
            if (existingMusic.length === 0) {
                const result = await Music.insertMany(musicData);
                console.log('Music loaded:', result);
            } else {
                console.log('Music already loaded.');
            }
        } catch (error) {
            console.error('Error inserting music:', error.message);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/movies', moviesRoute);
app.use('/api/users', usersRoute);
app.use('/music' , musicRoute) ;
app.use('/playlists' , playlistRoute) ;


app.use(express.static(path.join(__dirname, 'public')));

// Rediriger toutes les routes vers le fichier index.html (pour les SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});*/


import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import moviesRoute from "./routes/moviesRoute.js";
import usersRoute from "./routes/userRoute.js";
import musicRoute from "./routes/musicRoute.js";
import playlistRoute from "./routes/playlistRoute.js";
import Movie from "./models/movieModel.js";
import Music from "./models/musicModel.js";

// Setup for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

import compression from 'compression';
app.use(compression());



// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB and start the server
mongoose
  .connect(mongoDBURL)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Load movies and music data
    const moviesPath = path.join(__dirname, "../Mern_Netfy/movies.json");
    const musicPath = path.join(__dirname, "../Mern_Netfy/spotify_tracks.json");

    if (fs.existsSync(moviesPath) && fs.existsSync(musicPath)) {
      const moviesData = JSON.parse(fs.readFileSync(moviesPath));
      const musicData = JSON.parse(fs.readFileSync(musicPath));

      try {
        const existingMovies = await Movie.find({});
        if (existingMovies.length === 0) {
          const result = await Movie.insertMany(moviesData);
          console.log("Movies loaded:", result.length);
        } else {
          console.log("Movies already loaded.");
        }
      } catch (error) {
        console.error("Error inserting movies:", error.message);
      }

      try {
        const existingMusic = await Music.find({});
        if (existingMusic.length === 0) {
          const result = await Music.insertMany(musicData);
          console.log("Music loaded:", result.length);
        } else {
          console.log("Music already loaded.");
        }
      } catch (error) {
        console.error("Error inserting music:", error.message);
      }
    } else {
      console.error("Data files not found!");
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/movies", moviesRoute);
app.use("/api/users", usersRoute);
app.use("/music", musicRoute);
app.use("/playlists", playlistRoute);

// Redirect all SPA routes to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
