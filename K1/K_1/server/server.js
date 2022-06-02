const http = require("http");
const fs = require("fs");
const { readFile, writeFile } = require("./hooks");

const port = 4000;
const todos = readFile("./todo.json");

const app = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
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
      const todos = readFile("./todo.json");
      const id = req.url.split("/");
      const requestedID = parseInt(id[2]);

      const todo = todos.filter((todo) => todo.id === requestedID);

      const convertedTodo = JSON.stringify(todo);

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(convertedTodo);
    } catch (err) {
      console.log(`Something fucked up in todo ${err}.`);
    }
  } else if (req.method === "GET") {
    try {
      const todos = readFile("./todo.json");

      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(todos));
    } catch (err) {
      console.log(`Something went wrong with the todo ${err}.`);
    }
  } else if (req.method === "POST") {
    try {
      req.on("data", (chunk) => {
        const data = JSON.parse(chunk);
        const todo = {
          name: data.name,
          id: Math.floor(Math.random() * 100000),
          done: data.done,
        };
        todos.push(todo);
        writeFile("./todo.json", todos);
        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(todos));
      });
    } catch (err) {
      console.log(`Something went wrong in the post ${err}.`);
    }
  } else if (req.method === "DELETE") {
    try {
      const id = req.url.split("/");
      const todos = readFile("./todo.json");

      const filteredTodos = todos.filter((item) => {
        return item.id !== Number(id[2]);
      });
      writeFile("./todo.json", filteredTodos);
      res.writeHead(204);

      res.end();
    } catch (err) {
      console.log(`Something went wrong with deleting the todo ${err}.`);
    }
  } else if (req.method === "PUT") {
    try {
      const id = req.url.split("/");
      const todos = readFile("./todo.json");

      let todo = todos.filter((item) => {
        return item.id === Number(id[2]);
      });

      req.on("data", (chunk) => {
        const receivedData = JSON.parse(chunk);

        const newTodo = {
          ...todo[0],
          ...receivedData,
        };

        const newTodos = todos.map((pt) => {
          if (pt.id === Number(id[2])) {
            return newTodo;
          } else {
            return pt;
          }
        });

        writeFile("./todo.json", newTodos);

        res.writeHead(204, {
          "Content-Type": "application/json",
        });
        res.end();
        if (todo.length === 0) {
          res.statusCode = 404;
          res.end("Can not find data with that id.");
        }
      });
    } catch (err) {
      console.log(`Something went wrong ${err}.`);
    }
  } else if (req.method === "PATCH") {
    // try {
    const id = req.url.split("/");
    const todos = readFile("./todo.json");

    let todo = todos.filter((item) => {
      return item.id === Number(id[2]);
    });
    let filterdTodos = todos.filter((item) => {
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

      writeFile("./todo.json", newTodos);

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
