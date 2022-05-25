const http = require("http");
const fs = require("fs");
const { readFile, writeFile } = require("./hooks"); // glöm inte skriva funktionerna i separat fil!

const port = 4000;

let todos = require("./todo.json"); // funkar?
const { recordExpression } = require("@babel/types");

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
    return;
  }

  const tasks = req.url.split("/");

  if (tasks[1] === "todos" && req.method === "GET" && tasks.length === 3) {
    try {
      const id = req.url.split("/");
      const todos = readFile("./todo.json");
      const requestedID = id[2];
      const parsedTodos = JSON.parse(todos);

      const todo = parsedTodos.filter((todo) => {
        console.log(todo.id, requestedID);
      });

      const convertedTodo = JSON.stringify(todo, null, 2);

      res.writeHead(200, {
        "Content-Type": "application/json",
        data: "One todo recieveth.",
      });
      res.end(convertedTodo);
      console.log("Here return 200");
    } catch (err) {
      console.log(`Something fucked up in todo ${err}.`);
      console.log("here return 404");
    }
  } else if (req.method === "GET") {
    try {
      res.writeHead(200, {
        "Content-Type": "application/json",
        data: "todos recieveth successfully.",
      });
      res.end(JSON.stringify(todos, null, 2));
    } catch (err) {
      console.log(`Something went wrong with the todo ${err}.`);
    } //POST --OK/ ej kollat error handling
  } else if (req.method === "POST") {
    try {
      const todos = readFile("./todo.json");
      const parsedTodos = JSON.parse(todos);
      req.on("data", (chunk) => {
        console.log(chunk);
        const data = JSON.parse(chunk);
        const todo = {
          todo: data.name,
          id: Math.random(Math.floor() * 1000),
          done: data.done,
        };
        parsedTodos.push(todo);
        const convertedTodo = JSON.stringify(parsedTodos, null, 2);
        writeFile("./todo.json", convertedTodo);
      });

      res.writeHead(201, {
        "Content-Type": "application/json",
        data: "Your post went well!",
      });

      res.end();
    } catch (err) {
      console.log(`Something went wrong in the post ${err}.`);
    } // DELETE
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
    } // PUT
  } else if (req.method === "PUT") {
    try {
      const id = req.url.split("/");
      const todos = readFile("./todo.json");
      const parsedTodos = JSON.parse(todos);
      console.log(parsedTodos);
      let todo = parsedTodos.filter((item) => {
        return item.id === Number(id[2]);
      });
      let filterdTodos = parsedTodos.filter((item) => {
        return item.id === Number(id[2]);
      });
      if (todo.length === 0) {
        res.statusCode = 400;
        res.end("Can not find data with that id.");
      }
      req.on("data", (chunk) => {
        const receivedData = JSON.parse(chunk);
        const newTodos = {
          ...todo[0],
          ...receivedData,
        };
        filterdTodos.push(newTodos);

        const convertedTodo = JSON.stringify(filterdTodos, null, 2);

        writeFile("./todo.json", convertedTodo);

        res.writeHead(204, {
          "Content-Type": "application/json",
          data: "Updated successfully.",
        });

        res.end();
      });
    } catch (err) {
      console.log(`Something went wrong ${err}.`);
    } // PATCH -- OK
  } else if (req.method === "PATCH") {
    // try {
    const id = req.url.split("/");
    const todos = readFile("./todo.json");
    const parsedTodos = JSON.parse(todos);
    console.log(parsedTodos);
    let todo = parsedTodos.filter((item) => {
      return item.id === Number(id[2]);
    });
    let filterdTodos = parsedTodos.filter((item) => {
      return item.id !== Number(id[2]);
    });
    if (todo.length === 0) {
      res.statusCode = 404;
      res.end("Can not find data with that id.");
    }
    req.on("data", (chunk) => {
      const receivedData = JSON.parse(chunk);
      const newTodos = {
        ...todo[0],
        ...receivedData,
      };
      filterdTodos.push(newTodos);

      const convertedTodo = JSON.stringify(filterdTodos, null, 2);

      writeFile("./todo.json", convertedTodo);

      res.writeHead(204, {
        "Content-Type": "application/json",
        data: "Updated successfully.",
      });

      res.end();
    });
    // } catch (err) {
    //   console.log(`Something went wrong ${err}.`);
    // }
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port} `);
});
