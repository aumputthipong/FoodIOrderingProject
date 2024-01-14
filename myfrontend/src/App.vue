<template>
  <div id="app">
    <!-- nav bar -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item is-size-4"> Shop </router-link>
         <!-- <div v-if="user" class="navbar-item">
            <router-link to="/queuemanage" class="button is-primary">
              <i class="fas fa-hammer"> QueueManageMent</i>
            </router-link>
          </div> -->
        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
        
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          
        </a>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <!-- <div v-if="user" class="navbar-item">
            <router-link to="/create/createshop" class="button is-primary">
              <strong>Create Shop</strong>
            </router-link>
          </div> -->
          <div v-if="user" class="navbar-item">
            <router-link to="/queuedetail" class="button is-primary">
              <i class="fas fa-users"> Queue</i>
            </router-link>
          </div>
          <div v-if="user" class="navbar-item">
            <router-link to="/cartdetail" class="button is-primary">
              <i class="fas fa-shopping-cart"> : Cart</i>
            </router-link>
          </div>
          <div v-if="user" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <figure class="image is-24x24 my-auto">
                <img
                  class="is-rounded"
                  src="https://bulma.io/images/placeholders/128x128.png"
                />
              </figure>
              <span class="pl-3">{{ user.username }}</span>
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item">Profile</a>
              <a class="navbar-item" @click="logOut">Log out</a>
            </div>
          </div>
          <div v-if="!user" class="navbar-item">
            <router-link to="/user/login">
              <strong>Login</strong>
            </router-link>
          </div>
          <div v-if="!user" class="navbar-item">
            <router-link to="/user/signup">
              <strong>Signup</strong>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view
      :key="$route.fullPath"
      @auth-change="onAuthChange"
      :user="user"
    />
  </div>
</template>
<script>
import axios from "@/plugins/axios";

export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    this.onAuthChange();
  },
  methods: {
    onAuthChange() {
      const token = localStorage.getItem("token");
      if (token) {
        this.getUser();
      }
    },
    getUser() {
      axios.get("/user/me").then((res) => {
        this.user = res.data;
      });
    },
    logOut() {
      localStorage.removeItem("token");
      // localStorage.clear();
      this.$router.push("/user/login");
      this.user = null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
