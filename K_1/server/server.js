const http = require("http");
const fs = require("fs/promises");

const port = 4000;
//  Här hämtar vi Frontend

let file = "./todo.json";

tasks = await read(file); // Tsubasas stuff

// Här skapar vi servern. Vi kollar vilken metod som requesten har med sig.
const app = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PATCH, DELETE, OPTIONS, POST, PUT"
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    // Eventuellt en return; här för att förhindra att den går vidare till de faktiska endpointsen nedan.
    return;
  }

  //Hämta data
  if (req.method === "GET") {
    // Om det blir en GET så sätter vi headern till text/html. Går allt som det ska så ger den status kod 200 som indikerar att allt funkar som det ska.
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    res.end(JSON.stringify(todo)); // <-----------------------
  }
  //skickar den data, lägger till en Todo
  if (req.method === "POST") {
    req.on("data", (chunk) => {
      // Pushar till objektet todo, sen gör om JS till JSON sträng.
      todo.push(chunk.toString());
    });
    res.statusCode = 200;
    req.end();
  }

  // Ändrar en Todo
  if (req.method === "PUT") {
    req.on("data", (chunk) => {
      // Pushar till objektet todo, sen gör om JS till JSON sträng.
      todo.push(chunk.toString());
    });
    res.statusCode = 200;
    req.end();
  }

  // Delete en Todo
  if (req.method === "DELETE" && tasks[1] === todos) {
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

async function read() { // Tsubasas stuff för att JSON behöver läsas in i början. Finns den inte så skapas den.
  if (!existsSync(file)) {
      console.log('Creating a new save file');
      await fs.writeFile(file, JSON.stringify([]));
      console.log('Created a new save file');
  }