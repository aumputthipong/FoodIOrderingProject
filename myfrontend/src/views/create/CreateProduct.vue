<template>
  <div>
    <section class="hero">
      <div class="hero-body ml-5">
        <p class="title">Create a New Product</p>
      </div>
    </section>
    <section class="container">
      <div class="content">
        <div class="field">
          <label class="label">Product Name</label>
          <input
            v-model="$v.productname.$model"
            :class="{ 'is-danger': $v.productname.$error }"
            class="input"
            type="text"
            name="productname"
            placeholder="Product name"
          />
          <template v-if="$v.productname.$error">
            <p class="help is-danger" v-if="!$v.productname.required">
              *Required
            </p>
          </template>
        </div>
        <div class="field">
          <label class="label">Price</label>
          <input
            v-model="$v.price.$model"
            :class="{ 'is-danger': $v.price.$error }"
            class="input"
            type="number"
            name="proprice"
            placeholder="ราคา"
          />
          <template v-if="$v.price.$error">
            <p class="help is-danger" v-if="!$v.price.required">
              *Required
            </p>
          </template>
        </div>
        <div class="field">
          <label class="label">Content</label>
          <div class="control">
            <textarea
            v-model="$v.describe.$model"
            :class="{ 'is-danger': $v.describe.$error }"
              class="textarea"
              placeholder="รายละเอียดอาหาร"
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
            <router-link :to="`/shop/detail/${this.shop.id}`">
              <button class="button is-link is-light">Back to Shop</button>
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
      shop: [],
      productname: "",
      describe: "",
      price: 0,
      file: null,
    };
  },
  validations: {
    productname: {
      required: required,
    },
    price: {
      required: required,
    },
    describe: {
      required: required,
    },
  },
  mounted() {
    this.getShopDetail(this.$route.params.shopid);
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    getShopDetail(shopId) {
      axios
        .get(`http://localhost:3000/createproduct/${shopId}`)
        .then((response) => {
          this.shop = response.data.shop;
          this.products = response.data.products;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },

    submit() {
      this.$v.$touch();

      var formData = new FormData();
      formData.append("product_image", this.file);
      formData.append("pro_name", this.productname);
      formData.append("pro_description", this.describe);
      formData.append("pro_price", this.price);

      axios
        .post(`http://localhost:3000/createproduct/${this.shop.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response);
          this.$router.push({ path: `/shop/detail/${this.shop.id}` });
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },
};
</script>
  
  <style scoped>
</style>