<template>
  <div class="container is-widescreen">
    <section class="hero m-auto">
      <div class="hero-body">
        <p class="title">Edit Product</p>
      </div>
    </section>
    <section class="px-6">
      <div class="field mt-5">
        <label class="label">Product Name</label>
        <div class="control">
          <input
            v-model="$v.productname.$model"
            :class="{ 'is-danger': $v.productname.$error }"
            class="input"
            type="text"
            name="productname"
            placeholder="Product name"
          />
        </div>
        <template v-if="$v.productname.$error">
          <p class="help is-danger" v-if="!$v.productname.required">
            *Required
          </p>
        </template>
      </div>

      <div class="field mt-5">
        <label class="label">Price</label>
        <div class="control">
          <input
            v-model="$v.price.$model"
            :class="{ 'is-danger': $v.price.$error }"
            class="input"
            type="number"
            name="proprice"
            placeholder="ราคา"
          />
        </div>
        <template v-if="$v.price.$error">
          <p class="help is-danger" v-if="!$v.price.required">*Required</p>
        </template>
      </div>

      <div class="field">
        <label class="label">Content</label>
        <div class="control">
          <textarea
            v-model="$v.prodescribe.$model"
            :class="{ 'is-danger': $v.prodescribe.$error }"
            class="textarea"
            placeholder="รายละเอียดอาหาร"
            name="prodescribe"
          ></textarea>
        </div>
        <template v-if="$v.prodescribe.$error">
          <p class="help is-danger" v-if="!$v.prodescribe.required">*Required</p>
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
              name="pro_image"
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
          <button @click="submit()" class="button is-link">Submit</button>
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
      productname: "",
      prodescribe: "",
      price: 0,
    };
  },
  validations: {
    productname: {
      required: required,
    },
    price: {
      required: required,
    },
    prodescribe: {
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
      formData.append("pro_image", this.file);
      formData.append("proname", this.proname);
      formData.append("prodescribe", this.prodescribe);

      axios
        .put(
          `http://localhost:3000/productupdate/${this.$route.params.id}`,
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