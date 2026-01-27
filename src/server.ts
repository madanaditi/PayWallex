import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`PayWallex prototype listening on http://localhost:${PORT}`);
});
