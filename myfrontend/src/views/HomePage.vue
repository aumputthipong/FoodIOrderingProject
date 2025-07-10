<template>
  <div class="container is-widescreen">
    <section class="section" id="app">
      <!-- Header Section -->
      <div class="hero is-light is-small mb-5">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-2 has-text-centered">
              <i class="fas fa-store mr-3"></i>
              ร้านค้าทั้งหมด
            </h1>
            <p class="subtitle has-text-centered">
              กดและสั่งอาหารในโรงอาหารคณะไอทีได้เลย
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons for Non-Customer Users -->
      <div v-if="!user" class="column is-0"></div>
      <div v-else-if="user.role !== 'customer'" class="box mb-5">
        <div class="level">
          <div class="level-left">
            <h3 class="title is-4 mb-0">
              <i class="fas fa-cog mr-2"></i>
              จัดการร้านค้า
            </h3>
          </div>
          <div class="level-right">
            <div class="buttons">
              <router-link to="/create/createshop" class="button is-primary is-rounded">
                <span class="icon">
                  <i class="fas fa-plus"></i>
                </span>
                <span><strong>สร้างร้านค้าใหม่</strong></span>
              </router-link>
              <router-link to="/queuemanage" class="button is-info is-rounded">
                <span class="icon">
                  <i class="fas fa-tasks"></i>
                </span>
                <span><strong>จัดการคิว</strong></span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Shop Cards Section -->
      <div class="content">
        <div v-if="blogs.length === 0" class="notification is-info is-light">
          <div class="has-text-centered">
            <i class="fas fa-info-circle fa-2x mb-3"></i>
            <p class="title is-5">ไม่พบร้านค้า</p>
            <p class="subtitle is-6">กรุณาลองใหม่อีกครั้งหรือสร้างร้านค้าใหม่</p>
          </div>
        </div>
        
        <div v-else class="columns is-multiline">
          <div class="column is-4" v-for="blog in blogs" :key="blog.id">
            <div class="card enhanced-card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img
                    :src="imagePath(blog.picture)"
                    alt="Shop image"
                    class="shop-image"
                  />
                </figure>
              </div>
              
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4 mb-2">{{ blog.name }}</p>
                    <div class="tags">
                      <span class="tag is-primary is-light">
                        <i class="fas fa-store mr-1"></i>
                        ร้านค้า
                      </span>
                    </div>
                  </div>
                </div>

                <div class="content">
                  <div class="description-box">
                    <p class="has-text-weight-semibold mb-2">
                      <i class="fas fa-info-circle mr-2"></i>รายละเอียด:
                    </p>
                    <p class="description-text">{{ blog.description }}</p>
                  </div>
                </div>
              </div>
              
              <footer class="card-footer">
                <router-link
                  class="card-footer-item has-text-link"
                  :to="`/shop/detail/${blog.id}`"
                >
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-eye"></i>
                    </span>
                    <span><strong>เยี่ยมชม</strong></span>
                  </span>
                </router-link>
                
                <a
                  class="card-footer-item has-text-warning"
                  v-if="isShopOwner(blog)"
                  @click="
                    $router.push({
                      name: 'update-shop',
                      params: { id: blog.id },
                    })
                  "
                >
                  <span class="icon-text">
                    <span class="icon">
                      <i class="fas fa-edit"></i>
                    </span>
                    <span><strong>แก้ไข</strong></span>
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
.enhanced-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
}

.enhanced-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.shop-image {
  object-fit: cover;
  transition: transform 0.3s ease;
}

.enhanced-card:hover .shop-image {
  transform: scale(1.05);
}

.card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.description-box {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  border-left: 4px solid #3273dc;
  margin-top: auto;
}

.description-text {
  line-height: 1.6;
  color: #4a4a4a;
  max-height: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.card-footer-item {
  transition: background-color 0.2s ease;
}

.card-footer-item:hover {
  background-color: #f5f5f5;
}

.hero.is-light {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.level {
  align-items: center;
}

.buttons .button {
  margin-right: 0.5rem;
}

.buttons .button:last-child {
  margin-right: 0;
}

.notification.is-info.is-light {
  background-color: #f0f8ff;
  border: 1px solid #bee5eb;
}

.tags .tag {
  font-size: 0.8rem;
}

@media screen and (max-width: 768px) {
  .level {
    flex-direction: column;
    align-items: stretch;
  }
  
  .level-left,
  .level-right {
    margin-bottom: 1rem;
  }
  
  .buttons {
    justify-content: center;
  }
  
  .hero-body .title {
    font-size: 1.5rem;
  }
}
</style>