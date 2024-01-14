<template>
  <div class="container is-widescreen">
    <section class="section" v-if="error">
      <div class="container is-widescreen">
        <div class="notification is-danger">{{ error }}</div>
      </div>
    </section>
    <section class="hero m-auto">
      <div class="hero-body">
        <div class="columns is-multiline">
          <div class="column is-4">
            <figure class="image">
              <img
                :src="'http://localhost:3000' + shop.picture"
                alt="Placeholder image"
                style="height: 40%; width: 40%"
              />
            </figure>
          </div>
          <div class="column is-4">
            <p class="title is-1">{{ shop.name }}</p>
            <p class="subtitle m-auto">รายละเอียด: {{ shop.description }}</p>
          </div>
        </div>
      </div>
    </section>
    <div class="columns">
      <!-- Customer -->
      <div class="column is-four-fifths" v-if="!isShopOwner(shop)">
        <section class="section">
          <!-- products -->
          <div class="columns is-multiline">
            <div
              class="column is-4"
              v-for="product in products"
              :key="product.id"
            >
              <div class="card">
                <div class="card-image pt-5">
                  <img
                    style="height: 120px"
                    :src="imagePath(product.picture)"
                    alt="Placeholder image"
                  />
                </div>
                <div class="card-content">
                  <div class="title">{{ product.name }}</div>
                  <div class="content" style="height: 200px">
                    {{ product.description }}
                  </div>
                 ราคา: {{ product.price }} บาท
                </div>
                <footer class="card-footer">
                  <a
                    v-if="product.status === 'available'"
                    class="card-footer-item"
                    @click="addtoCart(product)"
                    >เพิ่มลงตะกร้า</a
                  >
                  <p v-else class="card-footer-item ">สินค้าไม่พร้อมบริการ</p>
                </footer>
              </div>
            </div>
          </div>
        </section>
        <footer class="card-footer">
          <router-link class="card-footer-item" to="/"
            >กลับสู่หน้าหลัก</router-link
          >
        </footer>
      </div>

      <!-- Admin/ShopOwner -->
      <div class="column" v-if="isShopOwner(shop)">
        <router-link
          class="button is-info"
          :to="`/createproduct/${this.shop.id}`"
          >Create Product</router-link
        >
        <section class="section">
          <!-- products -->
          <div class="columns is-multiline">
            <div
              class="column is-3"
              v-for="product in products"
              :key="product.id"
            >
              <div v-if="isShopOwner(shop)" class="card">
                  <router-link
                    class="button is-link"
                    :to="`/productupdate/${product.id}`"
                  >
                    EditDetail</router-link
                  >
                <div class="card-image pt-5">
                  <img
                    style="height: 120px"
                    :src="imagePath(product.picture)"
                    alt="Placeholder image"
                  />
                </div>
                <div class="card-content">
                  <div class="title">{{ product.name }}</div>
                  <div
                    v-if="product.status === 'available'"
                    style="color: hsl(153, 53%, 53%)"
                  >
                    Status: {{ product.status }}
                  </div>
                  <div v-else style="color: hsl(348, 86%, 61%)">
                    Status: {{ product.status }}
                  </div>
                  <div>ราคา: {{ product.price }} บาท</div>
                </div>
                <footer class="card-footer">
                  <a
                    class="card-footer-item button is-success"
                    @click="changeStatus(product, 'available')"
                    >Available</a
                  >
                  <a
                    class="card-footer-item button is-danger"
                    @click="changeStatus(product, 'not-available')"
                    >Not-Available</a
                  >
                </footer>
              </div>
            </div>
          </div>
        </section>
        <footer class="card-footer">
          <router-link class="card-footer-item" to="/"
            >กลับสู่หน้าหลัก</router-link
          >
        </footer>
      </div>

      <!-- cart -->
      <div class="column" v-if="!isShopOwner(shop)">
        <h3 class="title has-text-centered is-size-4">ตะกร้า</h3>
        <h1 class="subtitle">ราคารวม {{ sumTotal }} บาท</h1>
        <button
          class="button is-primary mb-4"
          v-show="cart.length > 0"
          @click="updateCart()"
        >
          UpdateCart
        </button>
        <div v-for="item in cart" :key="item.id">
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">{{ item.id }}{{ item.name }}</p>
              <a href="#" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </a>
            </header>
            <div class="card-content">
              <div class="content">
                <img
                  style="height: 120px"
                  :src="imagePath(item.picture)"
                  alt="Placeholder image"
                />
              </div>
            </div>
            <footer class="card-footer">
              <a class="card-footer-item" @click="reduceNum(item)">-</a>
              <p class="card-footer-item">{{ item.quantity }}</p>
              <a class="card-footer-item" @click="addNum(item)">+</a>
              <a
                class="card-footer-item has-text-danger"
                @click="removeCart(item.product_id)"
                >Delete</a
              >
            </footer>
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
        alert("Please Login");
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
      }
      // console.log(this.cart)
    },
    removeCart(itemId) {
      axios
        .delete(`http://localhost:3000/delete/${itemId}`)
        .then(() => this.$router.push({ path: `/shop/detail/${this.shop.id}` }))
        .catch((e) => console.log(e.response.data));
      window.location.reload();
      //  alert("update ตะกร้าแล้ว");
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
        // .then(() =>  this.$router.push({path: `/shop/detail/${this.shop.id}`}))
        .catch((e) => console.log(e.response.data));
      window.location.reload();
      //  alert("update ตะกร้าแล้ว");
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
        .catch((e) => console.log(e.response.data));
      // window.location.reload();
    },
  },
};
</script>

<style scoped>
</style>