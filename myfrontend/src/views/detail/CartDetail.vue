<template>
  <div class="container is-widescreen">
    <div class="columns is-multiline">
      <!-- column ร้าน -->
      <div class="column is-12" v-for="shop in shops" :key="shop.id">
        <div class="card">
          <div class="title">
            <img
              style="height: 40px"
              :src="imagePath(shop.picture)"
              alt="Placeholder image"
            />
            ชื่อ:{{ shop.name }} 
            <div class="subtitle is-3"
              v-for="price in prices"
              :key="price.shop_id"
              v-show="price.shop_id == shop.shop_id"
            >
              ทั้งหมด: {{ price.totalprice }}
            </div>
          </div>
          <div class="card-content">
            <!-- column สินค้าในร้าน -->
            <div
              v-for="item in carts"
              :key="item.id"
              v-show="item.shop_id == shop.shop_id"
            >
              <div class="card" style="margin: 0.5em; padding: 0.5em">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-96x96">
                      <img
                        :src="imagePath(item.picture)"
                        alt="Placeholder image"
                      />
                    </figure>
                  </div>
                  <div class="media-content">
                    name:{{ item.name }}<br />
                     price:{{ item.price }}
                    <br />รวม:{{ item.quantity * item.price }}
                  </div>
                  <div class="media-right mt-5 mr-5">
                    <a class="button " @click="reduceQuantity(item)">-</a>
                   <span class="p-4 is-size-5">{{ item.quantity }}</span>
                    <a class="button" @click="addQuantity(item)">+</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <button
              class="card-footer-item button is-primary is-pulled-left" @click="addtoQueue(shop)">
              Add to queue
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
        })
        .catch((e) => {
          console.log(e);
        });
        window.location.reload();
    },
    reduceQuantity(item) {
      axios
        .put(`http://localhost:3000/cartdetail/reducequantity/${item.cart_items_id}`)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
        window.location.reload();
    },
     addtoQueue(shop) {
      axios
        .post(`http://localhost:3000/addqueue/${shop.id}`)
        .then((response) => {
          console.log(response)
           this.$router.replace({ path: "/queuedetail" }); 
        })
        .catch((e) => {
          console.log(e);
        });
        // window.location.reload();
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
  },
   
};
</script>

<style scoped>
</style>