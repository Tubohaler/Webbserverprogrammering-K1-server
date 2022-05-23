const http = require("http");
const fs = require("fs");
const { readFile, writeFile } = require("./hooks"); // glöm inte skriva funktionerna i separat fil!

const port = 4000;

let todos = require("./todo.json"); // funkar?

// Här skapar vi servern. Vi kollar vilken metod som requesten har med sig.
const app = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
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

  const tasks = req.url.split("/");
  //GET single todos

  if (req.method === "GET" && req.url.split("/")[1] === "oneTodo") {
    try {
      const id = req.url.split("/");
      const parsedId = JSON.parse(id[2]);
      const todos = readFile("./todo.json");
      const parsedTodos = JSON.parse(todos);

      const todo = parsedTodos.filter((todo) => todo.id === parsedId);
      convertedTodo = JSON.stringify(todo, null, 2);
      res.writeHead(200, {
        "Content-Type": "application/json",
        data: "One todo recieveth.",
      });

      res.end(convertedTodo);
    } catch (err) {
      console.log(`Something fucked up in todo ${err}.`);
    } // GET all todos
  } else if (req.method === "GET") {
    try {
      res.writeHead(200, {
        "Content-Type": "application/json",
        data: "todos recieveth successfully.",
      });

      res.end(JSON.stringify(todos, null, 2));
    } catch (err) {
      console.log(`Something went wrong with the todo ${err}.`);
    } //POST
  } else if (req.method === "POST") {
    try {
      const todos = readFile("./todo.json");
      const parsedTodos = JSON.parse(todos);
      req.on("data", (chunk) => {
        const data = JSON.parse(chunk);
        const todo = {
          todo: data,
          id: Math.random(Math.floor() * 1000),
          done: false,
        };
        parsedTodos.push(todo);
        const convertedTodo = JSON.stringify(parsedTodos, null, 2);
        writeFile("./todo.json", convertedTodo);
      });
      res.writeHead(201, {
        "Content-Type": "application/json",
        data: "Posted OK.",
      });

      res.end();
    } catch (err) {
      console.log(`Something went wrong in the post ${err}.`);
    }
  } else if (req.method === "DELETE") {
    try {
      const id = req.url.split("/");
      const parsedId = JSON.parse(id[1]);
      const todos = readFile("./todo.json");
      const parsedTodos = JSON.parse(todos);
      const filteredParsedTodos = parsedTodos.filter((todo) => {
        return todo.id !== parsedId;
      });
      const convertedTodo = JSON.stringify(filteredParsedTodos, null, 2);
      writeFile("./todo.json", convertedTodo);
      res.writeHead(204, {
        "Content-Type": "application/json",
        data: "Deleted successully.",
      });

      res.end();
    } catch (err) {
      console.log(`Something went wrong with deleting the todo ${err}.`);
    }
  } else if (req.method === "PUT") {
    try {
      const id = req.url.split("/");
      const parsedId = JSON.parse(id[1]);
      const parsedTodos = JSON.parse(todos);

      let todo = parsedTodos.filter((todo) => {
        return todo.id === parsedId;
      });
      let filterdTodos = parsedTodos.filter((todo) => {
        return todo.id === parsedId;
      });
      todo[0].done = null;
      todo[0].name = "Rastafarai";
      console.log(todo);
      convertedTodo.push(todo[0]);

      const convertedTodo = JSON.stringify(filterdTodos, null, 2);

      writeFile("./todo.json", convertedTodo);

      res.writeHead(204, {
        "Content-Type": "application/json",
        data: "Updated successfully.",
      });
    } catch (err) {
      console.log(`Something went wrong ${err}.`);
    }
  } else if (req.method === "PATCH") {
    try {
      const id = rec.url.split("/");
      const parsedId = JSON.parse(id[1]);
      const todos = readFile("./todo.json");
      const parsedTodos = JSON.parse(todos);

      let todo = parsedTodos.filter((todo) => {
        return todo.id === parsedId;
      });
      let filterdTodos = parsedTodos.filter((todo) => {
        return todo.id !== parsedId;
      });
      todo[0].done = true;

      filterdTodos.push(todo[0]);

      convertedTodo = JSON.stringify(filterdTodos, null, 2);

      writeFile("./todo.json", convertedTodo);

      res.writeHead(204, {
        "Content-Type": "application/json",
        data: "Updated successfully.",
      });

      res.end();
    } catch (err) {
      console.log(`Something went wrong ${err}.`);
    }
  }

  // Om det blir en GET så sätter vi headern till text/html. Går allt som det ska så ger den status kod 200 som indikerar att allt funkar som det ska.
  // res.setHeader("Content-Type", "text/html");
  // res.statusCode = 200;
  // res.end(JSON.stringify(todo)); // <-----------------------

  //skickar den data, lägger till en Todo
  //   if (req.method === "POST") {
  //     req.on("data", (chunk) => {
  //       // Pushar till objektet todo, sen gör om JS till JSON sträng.
  //       todo.push(chunk.toString());
  //     });
  //     res.statusCode = 200;
  //     req.end();
  //   }

  //   // Ändrar en Todo
  //   if (req.method === "PUT") {
  //     req.on("data", (chunk) => {
  //       // Pushar till objektet todo, sen gör om JS till JSON sträng.
  //       todo.push(chunk.toString());
  //     });
  //     res.statusCode = 200;
  //     req.end();
  //   }

  //   // Delete en Todo
  //   if (req.method === "DELETE" && tasks[1] === todos) {
  //     req.on("data", (chunk) => {
  //       // Pushar till objektet todo, sen gör om JS till JSON sträng.
  //       todo.push(chunk.toString());
  //     });
  //     res.statusCode = 200;
  //     req.end();
  //   }
  // });

  // Här lyssnar vi efter responsen på port 4000
});
app.listen(4000, () => {
  console.log(`Servern lyssnar på ${port}`);
});
