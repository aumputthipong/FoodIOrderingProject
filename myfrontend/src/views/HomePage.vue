<template>
   <div class="container is-widescreen">
   <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
              Hi
          </h1>

        </div>
      </div>
    </section>
    <div class="container">
      <section class="section" id="app">
        <div class="content">
          <form method="GET" action="/">
          <div class="columns">
            <div class="column is-2">
              <input class="button" type="button" value="additem" onClick="window.location.href = '/createshop'">
            </div>
          </div>
        </form>
        </div>
    </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
      return {
         blogs: null 
      }
    },
    created() {
    axios.get("http://localhost:3000/")
        .then((response) => {
          this.blogs = response.data;
          console.log(this.blogs)
        })
        .catch((err) => {
          console.log(err);
        });
}
  }
</script>

<style scoped>
</style>