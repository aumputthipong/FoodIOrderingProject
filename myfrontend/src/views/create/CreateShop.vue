<template>
  <div>
    <section class="hero">
      <div class="hero-body ml-5">
        <p class="title">Create a New Shop</p>
      </div>
    </section>
    <section class="container">
      <div class="content">
        <div class="field">
          <label class="label">Shop Name</label>
          <input
            v-model="$v.shopname.$model"
            :class="{ 'is-danger': $v.shopname.$error }"
            class="input"
            type="text"
            name="shopname"
            placeholder="Shop name"
          />
          <template v-if="$v.shopname.$error">
            <p class="help is-danger" v-if="!$v.shopname.required">*Required</p>
          </template>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea
              v-model="$v.describe.$model"
              :class="{ 'is-danger': $v.describe.$error }"
              class="textarea"
              placeholder="รายละเอียดร้าน"
              name="describe"
            ></textarea>
            <template v-if="$v.describe.$error">
              <p class="help is-danger" v-if="!$v.describe.required">
                *Required
              </p>
            </template>
          </div>
        </div>
        <div class="file">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              id="file"
              ref="file"
              name="shop_image"
              @change="handleFileUpload()"
            />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label"> Choose an image… </span>
            </span>
          </label>
        </div>
        <div class="field is-grouped mt-3">
          <div class="control">
            <input
              type="button"
              class="button is-link"
              value="submit"
              @click="submit()"
            />
          </div>
          <div class="control">
            <router-link to="/">
              <button class="button is-link is-light">Back to home</button>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "@/plugins/axios";
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      shopname: "",
      describe: "",
      file: null,
    };
  },
  validations: {
    shopname: {
      required: required,
    },
    describe: {
      required: required,
    },
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    submit() {
      this.$v.$touch();

      var formData = new FormData();
      formData.append("shop_image", this.file);
      formData.append("shopname", this.shopname);
      formData.append("describe", this.describe);

      axios
        .post("http://localhost:3000/createshop", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ path: "/" }); // Success! -> redirect to home page
        })
        .catch((error) => {
          console.log(error)
            alert(error.response.data.details.message);
        });
    },
  },
};
</script>

<style scoped>
</style>