<template>
  <div class="container is-widescreen">
    <!-- Error Message -->
    <section class="section" v-if="error">
      <div class="container is-widescreen">
        <div class="notification is-danger has-text-weight-bold">
          <button class="delete" @click="error = null"></button>
          {{ error }}
        </div>
      </div>
    </section>

    <!-- Shop Header -->
    <section class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-narrow">
              <figure class="image is-128x128">
                <img
                  :src="'http://localhost:3000' + shop.picture"
                  alt="Shop Image"
                  class="is-rounded shop-image"
                />
              </figure>
            </div>
            <div class="column">
              <h1 class="title is-2 has-text-dark">{{ shop.name }}</h1>
              <h2 class="subtitle is-4 has-text-grey-dark">
                <span class="icon-text">
                  <span class="icon">
                    <i class="fas fa-info-circle"></i>
                  </span>
                  <span>{{ shop.description }}</span>
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="columns is-gapless-mobile">
      <!-- Customer View -->
      <div class="column is-four-fifths" v-if="!isShopOwner(shop)">
        <section class="section">
          <div class="container">
            <h3 class="title is-4 has-text-centered mb-6">
              <span class="icon-text">
                <span class="icon has-text-primary">
                  <i class="fas fa-utensils"></i>
                </span>
                <span>เมนูอาหาร</span>
              </span>
            </h3>
            
            <!-- Products Grid -->
            <div class="columns is-multiline">
              <div
                class="column is-one-third-desktop is-half-tablet"
                v-for="product in products"
                :key="product.id"
              >
                <div class="card product-card">
                  <div class="card-image">
                    <figure class="image is-3by2">
                      <img
                        :src="imagePath(product.picture)"
                        alt="Product Image"
                        class="product-image"
                      />
                    </figure>
                  </div>
                  <div class="card-content">
                    <div class="media">
                      <div class="media-content">
                        <p class="title is-5 has-text-dark">{{ product.name }}</p>
                      </div>
                    </div>
                    <div class="content">
                      <p class="product-description">{{ product.description }}</p>
                      <div class="price-section">
                        <span class="tag is-success is-medium has-text-weight-bold">
                          ราคา: {{ product.price }} บาท
                        </span>
                      </div>
                    </div>
                  </div>
                  <footer class="card-footer">
                    <a
                      v-if="product.status === 'available'"
                      class="card-footer-item button is-primary is-fullwidth cart-button"
                      @click="addtoCart(product)"
                    >
                      <span class="icon">
                        <i class="fas fa-cart-plus"></i>
                      </span>
                      <span>เพิ่มลงตะกร้า</span>
                    </a>
                    <div v-else class="card-footer-item">
                      <span class="tag is-danger is-medium">
                        <span class="icon">
                          <i class="fas fa-times-circle"></i>
                        </span>
                        <span>สินค้าไม่พร้อมบริการ</span>
                      </span>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Back Button -->
        <div class="section pt-0">
          <div class="container has-text-centered">
            <router-link class="button is-light is-medium" to="/">
              <span class="icon">
                <i class="fas fa-arrow-left"></i>
              </span>
              <span>กลับสู่หน้าหลัก</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Admin/ShopOwner View -->
      <div class="column" v-if="isShopOwner(shop)">
        <section class="section">
          <div class="container">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <h3 class="title is-4">
                    <span class="icon-text">
                      <span class="icon has-text-info">
                        <i class="fas fa-cog"></i>
                      </span>
                      <span>จัดการสินค้า</span>
                    </span>
                  </h3>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <router-link
                    class="button is-info is-medium"
                    :to="`/createproduct/${this.shop.id}`"
                  >
                    <span class="icon">
                      <i class="fas fa-plus"></i>
                    </span>
                    <span>Create Product</span>
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Products Grid for Owner -->
            <div class="columns is-multiline">
              <div
                class="column is-one-quarter-desktop is-one-third-tablet"
                v-for="product in products"
                :key="product.id"
              >
                <div class="card admin-product-card">
                  <div class="card-header">
                    <p class="card-header-title">{{ product.name }}</p>
                    <router-link
                      class="card-header-icon button is-small is-info"
                      :to="`/productupdate/${product.id}`"
                    >
                      <span class="icon">
                        <i class="fas fa-edit"></i>
                      </span>
                    </router-link>
                  </div>
                  <div class="card-image">
                    <figure class="image is-3by2">
                      <img
                        :src="imagePath(product.picture)"
                        alt="Product Image"
                        class="product-image"
                      />
                    </figure>
                  </div>
                  <div class="card-content">
                    <div class="content">
                      <div class="field is-grouped is-grouped-multiline">
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">Status:</span>
                            <span
                              class="tag"
                              :class="product.status === 'available' ? 'is-success' : 'is-danger'"
                            >
                              {{ product.status }}
                            </span>
                          </div>
                        </div>
                        <div class="control">
                          <div class="tags has-addons">
                            <span class="tag is-dark">ราคา:</span>
                            <span class="tag is-primary">{{ product.price }} บาท</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <footer class="card-footer">
                    <a
                      class="card-footer-item button is-success is-small"
                      @click="changeStatus(product, 'available')"
                    >
                      <span class="icon">
                        <i class="fas fa-check"></i>
                      </span>
                      <span>Available</span>
                    </a>
                    <a
                      class="card-footer-item button is-danger is-small"
                      @click="changeStatus(product, 'not-available')"
                    >
                      <span class="icon">
                        <i class="fas fa-times"></i>
                      </span>
                      <span>Not Available</span>
                    </a>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Back Button -->
        <div class="section pt-0">
          <div class="container has-text-centered">
            <router-link class="button is-light is-medium" to="/">
              <span class="icon">
                <i class="fas fa-arrow-left"></i>
              </span>
              <span>กลับสู่หน้าหลัก</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Cart Section -->
      <div class="column is-narrow" v-if="!isShopOwner(shop)">
        <div class="cart-sidebar">
          <div class="card">
            <div class="card-header">
              <p class="card-header-title">
                <span class="icon-text">
                  <span class="icon has-text-primary">
                    <i class="fas fa-shopping-cart"></i>
                  </span>
                  <span>ตะกร้า</span>
                </span>
              </p>
            </div>
            <div class="card-content">
              <div class="content">
                <div class="notification is-success is-light">
                  <strong>ราคารวม: {{ sumTotal }} บาท</strong>
                </div>
                
                <button
                  class="button is-primary is-fullwidth mb-4"
                  v-show="cart.length > 0"
                  @click="updateCart()"
                >
                  <span class="icon">
                    <i class="fas fa-sync-alt"></i>
                  </span>
                  <span>Update Cart</span>
                </button>

                <div v-if="cart.length === 0" class="has-text-centered">
                  <p class="has-text-grey">ตะกร้าว่าง</p>
                  <span class="icon is-large has-text-grey-lighter">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                  </span>
                </div>

                <!-- Cart Items -->
                <div v-for="item in cart" :key="item.id" class="cart-item">
                  <div class="card">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-64x64">
                            <img
                              :src="imagePath(item.picture)"
                              alt="Product Image"
                              class="is-rounded"
                            />
                          </figure>
                        </div>
                        <div class="media-content">
                          <p class="title is-6">{{ item.name }}</p>
                          <p class="subtitle is-7 has-text-grey">
                            {{ item.price }} บาท/ชิ้น
                          </p>
                        </div>
                      </div>
                    </div>
                    <footer class="card-footer">
                      <a class="card-footer-item" @click="reduceNum(item)">
                        <span class="icon">
                          <i class="fas fa-minus"></i>
                        </span>
                      </a>
                      <span class="card-footer-item has-text-weight-bold">
                        {{ item.quantity }}
                      </span>
                      <a class="card-footer-item" @click="addNum(item)">
                        <span class="icon">
                          <i class="fas fa-plus"></i>
                        </span>
                      </a>
                      <a
                        class="card-footer-item has-text-danger"
                        @click="removeCart(item.product_id)"
                      >
                        <span class="icon">
                          <i class="fas fa-trash"></i>
                        </span>
                      </a>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  props: ["user"],
  name: "ShopDetail",
  data() {
    return {
      shop: [],
      products: [],
      error: null,
      cart: [],
    };
  },
  mounted() {
    this.getShopDetail(this.$route.params.id);
    this.getCartDetail(this.$route.params.id);
  },
  computed: {
    sumTotal() {
      return this.cart.reduce(
        (total, current) => total + parseInt(current.quantity * current.price),
        0
      );
    },
  },
  methods: {
    addtoCart(product) {
      const checkCart = this.cart.findIndex((val) => val.id === product.id);

      if (!this.user) {
        this.$buefy.toast.open({
          message: 'กรุณาเข้าสู่ระบบก่อน',
          type: 'is-warning',
          position: 'is-top'
        });
        this.$router.push({ path: "/user/login" });
      } else {
        if (checkCart == -1) {
          this.cart.push({
            id: product.id,
            name: product.name,
            picture: product.picture,
            price: product.price,
            quantity: 1,
          });
        } else {
          this.cart[checkCart].quantity++;
        }
        this.$buefy.toast.open({
          message: 'เพิ่มสินค้าลงตะกร้าแล้ว',
          type: 'is-success',
          position: 'is-top'
        });
      }
    },
    removeCart(itemId) {
      axios
        .delete(`http://localhost:3000/delete/${itemId}`)
        .then(() => {
          this.$buefy.toast.open({
            message: 'ลบสินค้าออกจากตะกร้าแล้ว',
            type: 'is-success',
            position: 'is-top'
          });
          this.$router.push({ path: `/shop/detail/${this.shop.id}` });
        })
        .catch((e) => console.log(e.response.data));
      window.location.reload();
    },
    reduceNum(item) {
      const checkCart = this.cart.findIndex((val) => val.id === item.id);
      if (this.cart[checkCart].quantity > 1) {
        this.cart[checkCart].quantity--;
      }
    },
    addNum(item) {
      const checkCart = this.cart.findIndex((val) => val.id === item.id);
      this.cart[checkCart].quantity++;
    },
    updateCart() {
      axios
        .post(`http://localhost:3000/updatecart/${this.shop.id}`, {
          cart: this.cart,
        })
        .then(() => {
          this.$buefy.toast.open({
            message: 'อัพเดทตะกร้าแล้ว',
            type: 'is-success',
            position: 'is-top'
          });
        })
        .catch((e) => console.log(e.response.data));
      window.location.reload();
    },
    imagePath(file_path) {
      if (file_path) {
        return "http://localhost:3000/" + file_path;
      } else {
        return "https://bulma.io/images/placeholders/640x360.png";
      }
    },
    getShopDetail(shopId) {
      axios
        .get(`http://localhost:3000/shop/detail/${shopId}`)
        .then((response) => {
          this.shop = response.data.shop;
          this.products = response.data.products;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    getCartDetail(shopId) {
      axios
        .get(`http://localhost:3000/shop/cart/${shopId}`)
        .then((response) => {
          this.cart = response.data.cart;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    isShopOwner(shop) {
      if (!this.user) return false;
      else if (this.user.role === "admin") return true;
      else if (shop.create_by_id == this.user.id) return true;
      return shop.create_by_id === this.user.id;
    },
    changeStatus(product, status) {
      product["status"] = status;
      axios
        .post(`http://localhost:3000/updatestatus/${product.id}`, {
          product: product,
        })
        .then(() => {
          this.$buefy.toast.open({
            message: `อัพเดทสถานะสินค้าเป็น ${status} แล้ว`,
            type: 'is-success',
            position: 'is-top'
          });
        })
        .catch((e) => console.log(e.response.data));
    },
  },
};
</script>

<style scoped>
.shop-image {
  width: 128px;
  height: 128px;
  object-fit: cover;
  border: 3px solid #3273dc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-description {
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.price-section {
  margin-top: 1rem;
}

.cart-button {
  border: none;
  border-radius: 0 0 6px 6px;
  font-weight: 600;
}

.admin-product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}

.admin-product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.cart-sidebar {
  width: 350px;
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.cart-item {
  margin-bottom: 1rem;
}

.cart-item .card {
  border-left: 4px solid #3273dc;
}

.hero.is-light {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.level {
  margin-bottom: 2rem;
}

@media screen and (max-width: 768px) {
  .cart-sidebar {
    width: 100%;
    position: static;
    max-height: none;
    margin-top: 2rem;
  }

  .columns.is-gapless-mobile {
    margin: 0;
  }

  .column.is-narrow {
    padding: 0.75rem;
  }
}

/* Custom scrollbar for cart */
.cart-sidebar::-webkit-scrollbar {
  width: 6px;
}

.cart-sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.cart-sidebar::-webkit-scrollbar-thumb {
  background: #3273dc;
  border-radius: 10px;
}

.cart-sidebar::-webkit-scrollbar-thumb:hover {
  background: #2366d1;
}
</style>