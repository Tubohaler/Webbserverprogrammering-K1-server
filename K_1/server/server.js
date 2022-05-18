const http = require("http");

const port = 4000;
//  Här hämtar vi Frontend
const todo = [];

// Här skapar vi servern. Vi kollar vilken metod som requesten har med sig.
const app = http.createServer((req, res) => {
  //Hämta data
  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify(todo));
  }
  //skickar den data
  if (req.method === "POST") {
    req.on("data", (chunk) => {
      // Pushar till objektet todo, sen gör om JS till JSON sträng.
      todo.push(chunk.toString());
    });
    res.statusCode = 200;
    req.end();
  }
});

// Här lyssnar vi efter responsen på port 4000
app.listen(4000, () => {
  console.log(`Servern lyssnar på ${port}`);
});
