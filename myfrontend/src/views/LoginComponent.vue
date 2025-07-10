<template>
  <div class="container is-fluid pt-6">
    <div class="columns is-centered">
      <div class="column is-4">
        <h1 class="title">Log in</h1>
        <p
          v-if="error"
          class="px-3 py-2 mb-3 has-text-danger-dark has-background-danger-light"
        >
          {{ error }}
        </p>

        <!-- Login form -->
        <div class="field">
          <label class="label">Username</label>
          <div class="control has-icons-left">
            <input
              v-model="$v.username.$model"
              :class="{ 'is-danger': $v.username.$error }"
              class="input"
              type="text"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
          <template v-if="$v.username.$error">
            <p class="help is-danger" v-if="!$v.username.required">
              This field is required
            </p>
          </template>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              v-model="$v.password.$model"
              :class="{ 'is-danger': $v.password.$error }"
              class="input"
              type="password"
            />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <span class="icon is-small is-right">
              <i class="fas fa-check"></i>
            </span>
            <template v-if="$v.password.$error">
              <p class="help is-danger" v-if="!$v.password.required">
                This field is required
              </p>
            </template>
          </div>
        </div>

        <button class="button is-primary is-fullwidth" @click="submit">
          Login
        </button>

        <p class="my-3">
          <!-- Don't have an account yet? <a href="/signup.html">Sign up</a> -->
          Don't have an account yet? <a href="#/user/signup">Sign up</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/plugins/axios";
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  validations: {
    username: {
      required: required,
    },
    password: {
      required: required,
    },
  },
  methods: {
    submit() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        let data = {
          username: this.username,
          password: this.password,
        };

        axios
          .post("http://localhost:3000/user/login/", data)
          .then((res) => {
            const token = res.data.token;
            localStorage.setItem("token", token);
            this.$emit("auth-change");
            this.$router.push({ path: "/" });
          })
          .catch((error) => {
            this.error = error.response.data;
            console.log(error.response.data);
          });
      }
    },
  },
};
</script>