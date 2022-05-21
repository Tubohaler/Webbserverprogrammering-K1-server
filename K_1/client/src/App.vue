<script setup>
import Todo from "./components/Todo.vue";
import axios from "axios";

const getTodos = async () => {
  const { data } = await axios.get("http://localhost:4000/");
  console.log(data);
};

getTodos();
</script>

<template>
  <Todo />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f3f0f0;
  margin: 4rem;
}
</style>
