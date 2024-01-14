<template>
  <div class="container is-widescreen">
    <section class="section" id="app">
      <div v-if="!user" class="column is-0"></div>
      <div v-else-if="user.role !== 'customer'">
        <div class="columns">
          <div class="column is-2">
            <router-link to="/create/createshop" class="button is-primary">
              <strong>Create Shop</strong>
            </router-link>
          </div>
          <div class="column is-2">
            <router-link to="/queuemanage" class="button is-primary">
              <i class="fas fa-hammer"> QueueManageMent</i>
            </router-link>
          </div>
          <div class="column"></div>
        </div>
      </div>

      <div class="content">
        <!-- column ร้านค้า -->
        <div class="columns is-multiline">
          <div class="column is-4" v-for="blog in blogs" :key="blog.id">
            <div class="card">
              <div class="card-image pt-5">
                <img
                  style="height: 120px"
                  :src="imagePath(blog.picture)"
                  alt="Placeholder image"
                />
              </div>
              <div class="card-content">
                <div class="title">{{ blog.name }}</div>
                <div
                  class="content subtitle has-text-left mt-4"
                  style="height: 200px"
                >
                  รายละเอียด: <br />{{ blog.description }}
                </div>
              </div>
              <footer class="card-footer">
                <router-link
                  class="card-footer-item"
                  :to="`/shop/detail/${blog.id}`"
                >
                  เยี่ยมชม...
                </router-link>
                <a
                  class="card-footer-item"
                  v-if="isShopOwner(blog)"
                  @click="
                    $router.push({
                      name: 'update-shop',
                      params: { id: blog.id },
                    })
                  "
                >
                  <span class="icon-text">
                    <span>Edit</span>
                  </span>
                </a>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "HomePage",
  props: ["user"],
  data() {
    return {
      blogs: [],
    };
  },
  mounted() {
    // re
    // setInterval(() => {
    //   location.reload();
    // }, 10000);

    axios
      .get("http://localhost:3000/")
      .then((response) => {
        this.blogs = response.data;
        console.log(this.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    imagePath(file_path) {
      if (file_path) {
        return "http://localhost:3000/" + file_path;
      } else {
        return "https://bulma.io/images/placeholders/640x360.png";
      }
    },
    isShopOwner(shop) {
      if (!this.user) return false;
      else if (this.user.role === "admin") return true;
      else if (shop.create_by_id == this.user.id) return true;
      return shop.create_by_id === this.user.id;
    },
    // shortContent(content) {
    //   if (content.length > 200) {
    //     return content.substring(0, 197) + "...";
    //   }
    //   return content;
    // },
  },
};
</script>

<style scoped>
</style>