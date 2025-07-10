<template>
  <div class="page-wrapper">
    <!-- Enhanced Hero Section -->
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <div>
                  <p class="title is-4 has-text-primary">
                    <i class="fas fa-plus-circle mr-2"></i>
                    Create a New Product
                  </p>
                  
                </div>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <router-link :to="`/shop/detail/${this.shop.id}`">
                  <button class="button is-light">
                    <i class="fas fa-arrow-left mr-2"></i>
                    Back to Shop
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="section">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-8">
            <!-- Form Card -->
            <div class="card">
              <div class="card-header">
                <p class="card-header-title">
                  <i class="fas fa-edit mr-2"></i>
                  Product Information
                </p>
              </div>
              <div class="card-content">
                <div class="content">
                  <!-- Product Name Field -->
                  <div class="field">
                    <label class="label">
                      <i class="fas fa-tag mr-2"></i>
                      Product Name
                    </label>
                    <div class="control has-icons-left">
                      <input
                        v-model="$v.productname.$model"
                        :class="{ 'is-danger': $v.productname.$error }"
                        class="input"
                        type="text"
                        name="productname"
                        placeholder="Enter product name"
                      />
                      <span class="icon is-small is-left">
                        <i class="fas fa-shopping-bag"></i>
                      </span>
                    </div>
                    <template v-if="$v.productname.$error">
                      <p class="help is-danger" v-if="!$v.productname.required">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        Product name is required
                      </p>
                    </template>
                  </div>

                  <!-- Price Field -->
                  <div class="field">
                    <label class="label">
                      <i class="fas fa-dollar-sign mr-2"></i>
                      Price
                    </label>
                    <div class="control has-icons-left">
                      <input
                        v-model="$v.price.$model"
                        :class="{ 'is-danger': $v.price.$error }"
                        class="input"
                        type="number"
                        name="proprice"
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                      <span class="icon is-small is-left">
                        <i class="fas fa-money-bill-wave"></i>
                      </span>
                    </div>
                    <template v-if="$v.price.$error">
                      <p class="help is-danger" v-if="!$v.price.required">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        Price is required
                      </p>
                    </template>
                  </div>

                  <!-- Description Field -->
                  <div class="field">
                    <label class="label">
                      <i class="fas fa-align-left mr-2"></i>
                      Description
                    </label>
                    <div class="control">
                      <textarea
                        v-model="$v.describe.$model"
                        :class="{ 'is-danger': $v.describe.$error }"
                        class="textarea"
                        placeholder="Enter product description"
                        name="describe"
                        rows="4"
                      ></textarea>
                    </div>
                    <template v-if="$v.describe.$error">
                      <p class="help is-danger" v-if="!$v.describe.required">
                        <i class="fas fa-exclamation-triangle mr-1"></i>
                        Description is required
                      </p>
                    </template>
                  </div>

                  <!-- File Upload Field -->
                  <div class="field">
                    <label class="label">
                      <i class="fas fa-image mr-2"></i>
                      Product Image
                    </label>
                    <div class="file has-name is-fullwidth">
                      <label class="file-label">
                        <input
                          class="file-input"
                          type="file"
                          id="file"
                          ref="file"
                          name="shop_image"
                          @change="handleFileUpload()"
                          accept="image/*"
                        />
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-upload"></i>
                          </span>
                          <span class="file-label">
                            Choose an image…
                          </span>
                        </span>
                        <span class="file-name">
                          {{ file ? file.name : 'No file selected' }}
                        </span>
                      </label>
                    </div>
                    <p class="help">
                      <i class="fas fa-info-circle mr-1"></i>
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>

                  <!-- Image Preview -->
                  <div class="field" v-if="imagePreview">
                    <label class="label">
                      <i class="fas fa-eye mr-2"></i>
                      Image Preview
                    </label>
                    <figure class="image is-128x128">
                      <img :src="imagePreview" class="preview-image" />
                    </figure>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="card mt-4">
              <div class="card-content">
                <div class="field is-grouped is-grouped-right">
                  <div class="control">
                    <router-link :to="`/shop/detail/${this.shop.id}`">
                      <button class="button is-light is-medium">
                        <i class="fas fa-times mr-2"></i>
                        Cancel
                      </button>
                    </router-link>
                  </div>
                  <div class="control">
                    <button
                      class="button is-primary is-medium"
                      @click="submit()"
                      :class="{ 'is-loading': isSubmitting }"
                      :disabled="$v.$invalid || isSubmitting"
                    >
                      <i class="fas fa-save mr-2"></i>
                      Create Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
      imagePreview: null,
      isSubmitting: false,
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
      
      // Create image preview
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(this.file);
      } else {
        this.imagePreview = null;
      }
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
      
      if (this.$v.$invalid) {
        return;
      }

      this.isSubmitting = true;

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
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.hero.is-light {
  background-color: #ffffff;
  border-bottom: 1px solid #e8e8e8;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(10, 10, 10, 0.1);
  border: 1px solid #e8e8e8;
}

.card-header {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.card-header-title {
  color: #363636;
  font-weight: 600;
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  font-weight: 600;
  color: #363636;
  margin-bottom: 0.5rem;
}

.input, .textarea {
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.input:focus, .textarea:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

.input.is-danger, .textarea.is-danger {
  border-color: #ff3860;
}

.file.has-name .file-cta {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.file.has-name .file-name {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
}

.preview-image {
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #dbdbdb;
}

.button.is-primary {
  background-color: #3273dc;
  border-color: #3273dc;
}

.button.is-primary:hover {
  background-color: #2366d1;
  border-color: #2366d1;
}

.button.is-light {
  background-color: #f5f5f5;
  border-color: #dbdbdb;
  color: #363636;
}

.button.is-light:hover {
  background-color: #eeeeee;
  border-color: #dbdbdb;
}

.help {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

.help.is-danger {
  color: #ff3860;
}

.icon {
  color: #b5b5b5;
}

.has-text-primary .icon {
  color: #3273dc;
}

@media screen and (max-width: 768px) {
  .hero .level {
    display: block;
  }
  
  .level-right {
    margin-top: 1rem;
  }
  
  .column.is-8 {
    margin: 0 1rem;
  }
}
</style>