<template>
  <div class="container is-widescreen">
    <!-- Header Section -->
    <div class="hero is-light is-small mb-5">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2 has-text-centered">
            <i class="fas fa-shopping-cart mr-3"></i>
            ตะกร้าสินค้า
          </h1>
          <p class="subtitle has-text-centered">
            ตรวจสอบและจัดการสินค้าในตะกร้าของคุณ
          </p>
        </div>
      </div>
    </div>
   <!-- Summary Section -->
    <div v-if="shops.length > 0" class="box summary-box">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <p class="heading">ยอดรวมทั้งหมด</p>
              <p class="title is-3">
                ฿{{ calculateGrandTotal().toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="tags">
              <span class="tag is-info is-medium">
                <i class="fas fa-shopping-bag mr-2"></i>
                {{ getTotalItems() }} รายการ
              </span>
              <span class="tag is-success is-medium">
                <i class="fas fa-store mr-2"></i>
                {{ shops.length }} ร้าน
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Empty Cart State -->
    <div v-if="shops.length === 0" class="notification is-info is-light">
      <div class="has-text-centered">
        <i class="fas fa-shopping-cart fa-3x mb-4 has-text-grey-light"></i>
        <p class="title is-4">ตะกร้าสินค้าว่างเปล่า</p>
        <p class="subtitle is-6">เริ่มต้นการช็อปปิ้งและเพิ่มสินค้าลงในตะกร้า</p>
        <router-link to="/" class="button is-primary is-rounded">
          <span class="icon">
            <i class="fas fa-store"></i>
          </span>
          <span>เลือกซื้อสินค้า</span>
        </router-link>
      </div>
    </div>

    <!-- Cart Items -->
    <div class="columns is-multiline" v-else>
      <div class="column is-12" v-for="shop in shops" :key="shop.id">
        <div class="card shop-card">
          <!-- Shop Header -->
          <header class="card-header">
            <div class="card-header-title">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img
                      :src="imagePath(shop.picture)"
                      alt="Shop image"
                      class="is-rounded"
                    />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4 mb-1">{{ shop.name }}</p>
                  <p class="subtitle is-6 mb-0 py-4">
                      <i class="fas fa-store mr-1"></i>
                    ร้านค้า
                  </p>
                </div>
              </div>
            </div>
            <div class="card-header-icon">
              <div
                class="tag is-primary is-large"
                v-for="price in prices"
                :key="price.shop_id"
                v-show="price.shop_id == shop.shop_id"
              >
                <span class="icon">
                  <i class="fas fa-calculator"></i>
                </span>
                <span class="ml-2">
                  <strong>รวม: ฿{{ price.totalprice.toLocaleString() }}</strong>
                </span>
              </div>
            </div>
          </header>

          <!-- Cart Items -->
          <div class="card-content">
            <div class="cart-items">
              <div
                v-for="item in carts"
                :key="item.id"
                v-show="item.shop_id == shop.shop_id"
                class="cart-item"
              >
                <div class="card item-card">
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-96x96">
                          <img
                            :src="imagePath(item.picture)"
                            alt="Product image"
                            class="product-image"
                          />
                        </figure>
                      </div>
                      
                      <div class="media-content">
                        <div class="content">
                          <p class="title is-5 mb-2">{{ item.name }}</p>
                          <div class="tags has-addons mb-2">
                            <span class="tag is-light">ราคา</span>
                            <span class="tag is-info">฿{{ item.price.toLocaleString() }}</span>
                          </div>
                          <div class="price-summary">
                            <span class="has-text-weight-bold is-size-5">
                              รวม: ฿{{ (item.quantity * item.price).toLocaleString() }}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="media-right">
                        <div class="quantity-controls">
                          <p class="has-text-weight-semibold mb-2">จำนวน</p>
                          <div class="field has-addons">
                            <p class="control">
                              <button
                                class="button is-small is-danger"
                                @click="reduceQuantity(item)"
                                :disabled="item.quantity <= 1"
                              >
                                <span class="icon">
                                  <i class="fas fa-minus"></i>
                                </span>
                              </button>
                            </p>
                            <p class="control">
                              <span class="button is-small is-static quantity-display">
                                {{ item.quantity }}
                              </span>
                            </p>
                            <p class="control">
                              <button
                                class="button is-small is-success"
                                @click="addQuantity(item)"
                              >
                                <span class="icon">
                                  <i class="fas fa-plus"></i>
                                </span>
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shop Footer -->
          <footer class="card-footer">
            <button
              class="card-footer-item button is-primary is-large"
              @click="addtoQueue(shop)"
            >
              <span class="icon">
                <i class="fas fa-clock"></i>
              </span>
              <span><strong>สั่งอาหาร</strong></span>
            </button>
          </footer>
        </div>
      </div>
    </div>

 
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  props: ["user"],
  name: "CartDetail",
  data() {
    return {
      shops: [],
      products: [],
      error: null,
      carts: [],
      prices: [],
    };
  },
  mounted() {
    this.getCartDetail();
  },
  methods: {
    addQuantity(item) {
      axios
        .put(`http://localhost:3000/cartdetail/addquantity/${item.cart_items_id}`)
        .then((response) => {
          console.log(response);
          this.getCartDetail(); // Refresh data instead of page reload
        })
        .catch((e) => {
          console.log(e);
        });
    },
    reduceQuantity(item) {
      axios
        .put(`http://localhost:3000/cartdetail/reducequantity/${item.cart_items_id}`)
        .then((response) => {
          console.log(response);
          this.getCartDetail(); // Refresh data instead of page reload
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addtoQueue(shop) {
      axios
        .post(`http://localhost:3000/addqueue/${shop.id}`)
        .then((response) => {
          console.log(response);
          this.$router.replace({ path: "/queuedetail" });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getCartDetail() {
      axios
        .get(`http://localhost:3000/shop/cartdetail/`)
        .then((response) => {
          this.carts = response.data.cart;
          this.shops = response.data.shops;
          this.prices = response.data.prices;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    imagePath(file_path) {
      if (file_path) {
        return "http://localhost:3000/" + file_path;
      } else {
        return "https://bulma.io/images/placeholders/640x360.png";
      }
    },
    calculateGrandTotal() {
      return this.prices.reduce((total, price) => total + parseFloat(price.totalprice), 0);
    },
    getTotalItems() {
      return this.carts.reduce((total, item) => total + item.quantity, 0);
    },
  },
};
</script>

<style scoped>
.shop-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  margin-bottom: 2rem;
}

.shop-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.item-card {
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.item-card:hover {
  border-color: #3273dc;
  transform: translateX(5px);
}

.product-image {
  border-radius: 8px;
  object-fit: cover;
}

.quantity-controls {
  text-align: center;
  min-width: 120px;
}

.quantity-display {
  min-width: 50px;
  font-weight: bold;
}

.price-summary {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 6px;
  border-left: 4px solid #3273dc;
}

.cart-items {
  max-height: 600px;
  overflow-y: auto;
}

.cart-items::-webkit-scrollbar {
  width: 6px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.summary-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #3273dc;
  border-radius: 12px;
}

.hero.is-light {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.notification.is-info.is-light {
  background-color: #f0f8ff;
  border: 1px solid #bee5eb;
}

.card-header {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.card-footer-item.button {
  border: none;
  border-radius: 0;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.card-footer-item.button:hover {
  background-color: #2366c9;
  transform: scale(1.02);
}

@media screen and (max-width: 768px) {
  .media-right {
    margin-top: 1rem;
  }
  
  .quantity-controls {
    min-width: auto;
  }
  
  .level {
    flex-direction: column;
  }
  
  .level-left,
  .level-right {
    margin-bottom: 1rem;
  }
  
  .cart-items {
    max-height: 400px;
  }
}

@media screen and (max-width: 480px) {
  .media {
    flex-direction: column;
  }
  
  .media-left,
  .media-right {
    margin-bottom: 1rem;
  }
  
  .card-header-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-header-icon {
    margin-top: 1rem;
  }
}
</style>