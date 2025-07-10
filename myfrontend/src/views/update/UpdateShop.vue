<template>
  <div class="container is-widescreen">
    <section class="hero m-auto">
      <div class="hero-body">
        <p class="title">Edit Shop</p>
      </div>
    </section>
    <section class="px-6">
      <div class="field mt-5">
        <label class="label">Shop Name</label>
        <div class="control">
          <input
            v-model="$v.shopname.$model"
            :class="{ 'is-danger': $v.shopname.$error }"
            class="input"
            type="text"
            name="shopname"
            placeholder="Shop name"
          />
        </div>
        <template v-if="$v.shopname.$error">
          <p class="help is-danger" v-if="!$v.shopname.required">*Required</p>
        </template>
      </div>

      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea
            v-model="$v.describe.$model"
            :class="{ 'is-danger': $v.describe.$error }"
            class="textarea"
            placeholder="รายละเอียดร้าน"
            name="describe"
          ></textarea>
        </div>
        <template v-if="$v.describe.$error">
          <p class="help is-danger" v-if="!$v.describe.required">*Required</p>
        </template>
      </div>
      <div class="field">
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
      </div>
      <div class="field is-grouped mb-6">
        <div class="control">
          <button @click="submitShop()" class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button @click="$router.go(-1)" class="button is-link is-light">
            Cancel
          </button>
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
    submitShop() {
      this.$v.$touch();

      var formData = new FormData();
      formData.append("shop_image", this.file);
      formData.append("shopname", this.shopname);
      formData.append("describe", this.describe);

      axios
        .put(
          `http://localhost:3000/shopupdate/${this.$route.params.id}`,
          formData
        )
        .then((response) => {
          console.log(response);
          this.$router.push({ path: "/" }); // Success! -> redirect to home page
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>

<style>
</style>