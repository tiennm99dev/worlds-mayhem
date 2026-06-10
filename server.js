const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/version.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'version.json'));
});

app.get('/cache.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'cache.json'));
});

app.get('/streakCodes.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'streakCodes.json'));
});

app.get('/cache', (req, res) => {
  res.json(null);
});

app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/userData', (req, res) => {
  res.json(null);
});

app.get('/ddragon/{*path}', (req, res) => {
  const subPath = req.params.path;
  const url = `https://ddragon.leagueoflegends.com/${subPath}`;
  https.get(url, (proxyRes) => {
    res.set('Content-Type', proxyRes.headers['content-type']);
    res.set('Cache-Control', 'public, max-age=86400');
    proxyRes.pipe(res);
  }).on('error', () => {
    res.status(502).send('Failed to proxy ddragon request');
  });
});

app.use(express.static(__dirname, {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) res.set('Content-Type', 'text/css');
    if (filePath.endsWith('.js')) res.set('Content-Type', 'application/javascript');
    if (filePath.endsWith('.json')) res.set('Content-Type', 'application/json');
    if (filePath.endsWith('.svg')) res.set('Content-Type', 'image/svg+xml');
    if (filePath.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    if (filePath.endsWith('.png')) res.set('Content-Type', 'image/png');
    if (filePath.endsWith('.woff2')) res.set('Content-Type', 'font/woff2');
    if (filePath.endsWith('.ttf')) res.set('Content-Type', 'font/ttf');
  }
}));

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`LoLdle local server running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/worldsMayhem to play`);
});
