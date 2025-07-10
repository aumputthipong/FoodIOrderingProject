<template>
  <div class="container is-widescreen">
    <!-- Header Section -->
    <div class="hero is-light is-small mb-5 mt-6">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2 has-text-centered">
            <i class="fas fa-clock mr-3 mt-4 "></i>
            คิวรายการอาหารที่สั่ง
          </h1>
          <p class="subtitle has-text-centered">
            ติดตามสถานะคิวและประวัติการสั่งซื้อ
          </p>
        </div>
      </div>
    </div>

    <!-- Processing Queue Section -->
    <div class="section">
      <div class="container">
        <div class="card queue-section">
          <header class="card-header">
            <p class="card-header-title is-size-4">
              <span class="icon has-text-warning">
                <i class="fas fa-hourglass-half"></i>
              </span>
              <span class="ml-2">รายการที่กำลังดำเนินการ</span>
              <span class="tag is-warning is-medium ml-3">
                {{ queues.length }} รายการ
              </span>
            </p>
          </header>
          
          <div class="card-content">
            <div v-if="queues.length === 0" class="notification is-info is-light">
              <div class="has-text-centered">
                <i class="fas fa-info-circle fa-2x mb-3"></i>
                <p class="title is-5">ไม่มีรายการกำลังดำเนินการ</p>
                <p class="subtitle is-6">คิวทั้งหมดได้รับการดำเนินการเสร็จสิ้นแล้ว</p>
              </div>
            </div>
            
            <div v-else class="queue-list">
              <div
                v-for="queue in queues"
                :key="queue.id"
                class="card queue-item processing-item"
              >
                <div class="card-content">
                  <div class="columns is-vcentered">
                    <div class="column is-2">
                      <div class="queue-number">
                        <span class="tag is-warning is-large">
                          <i class="fas fa-clock mr-1"></i>
                          {{ queue.time }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="column is-3">
                      <div class="shop-info">
                        <p class="title is-6 mb-1">
                          <i class="fas fa-store mr-2 py-5"></i>
                          {{ queue.name }}
                        </p>
                        <p class="subtitle is-7 has-text-grey">
                          <i class="fas fa-calendar mr-1"></i>
                          {{ formatDate(queue.date) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="column is-4">
                      <div class="items-list">
                        <p class="has-text-weight-semibold mb-2">
                          <i class="fas fa-list mr-2"></i>
                          รายการสินค้า:
                        </p>
                        <div class="item-tags">
                          <span
                            v-for="item in getQueueItems(queue.id)"
                            :key="item.id"
                            class="tag is-light mb-1 mr-1"
                          >
                            {{ item.name }} x{{ item.quantity }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="column is-3">
                      <div class="price-info has-text-right">
                        <p class="has-text-weight-semibold mb-1">ราคารวม</p>
                        <p class="title is-4 has-text-success">
                          ฿{{ queue.totalprice.toLocaleString() }}
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
    </div>

    <!-- Finished Queue Section -->
    <div class="section">
      <div class="container">
        <div class="card queue-section">
          <header class="card-header">
            <p class="card-header-title is-size-4">
              <span class="icon has-text-success">
                <i class="fas fa-check-circle"></i>
              </span>
              <span class="ml-2">รายการที่เสร็จสิ้นแล้ว</span>
              <span class="tag is-success is-medium ml-3">
                {{ queuesfinish.length }} รายการ
              </span>
            </p>
          </header>
          
          <div class="card-content">
            <div v-if="queuesfinish.length === 0" class="notification is-success is-light">
              <div class="has-text-centered">
                <i class="fas fa-check-circle fa-2x mb-3"></i>
                <p class="title is-5">ยังไม่มีคิวที่เสร็จสิ้น</p>
                <p class="subtitle is-6">คิวที่เสร็จสิ้นจะแสดงที่นี่</p>
              </div>
            </div>
            
            <div v-else class="queue-list">
              <div
                v-for="queue in queuesfinish"
                :key="queue.id"
                class="card queue-item finished-item"
              >
                <div class="card-content">
                  <div class="columns is-vcentered">
                    <div class="column is-2">
                      <div class="queue-number">
                        <span class="tag is-success is-large">
                          <i class="fas fa-check mr-1"></i>
                          {{ queue.time }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="column is-3">
                      <div class="shop-info">
                        <p class="title is-6 mb-1">
                          <i class="fas fa-store mr-2 py-5"></i>
                          {{ queue.shop_name }}
                        </p>
                        <p class="subtitle is-7 has-text-grey">
                          <i class="fas fa-calendar mr-1"></i>
                          {{ formatDate(queue.date) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="column is-4">
                      <div class="items-list">
                        <p class="has-text-weight-semibold mb-2">
                          <i class="fas fa-list mr-2"></i>
                          รายการสินค้า:
                        </p>
                        <div class="item-tags">
                          <span
                            v-for="item in getQueueItemsFinish(queue.id)"
                            :key="item.id"
                            class="tag is-light mb-1 mr-1"
                          >
                            {{ item.name }} x{{ item.quantity }}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="column is-3">
                      <div class="price-info has-text-right">
                        <p class="has-text-weight-semibold mb-1">ราคารวม</p>
                        <p class="title is-4 has-text-success">
                          ฿{{ queue.totalprice.toLocaleString() }}
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
    </div>


  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  props: ["user"],
  name: "QueueDetail",
  data() {
    return {
      shop: [],
      products: [],
      error: null,
      cart: [],
      queueitems: [],
      queues: [],
      queueitemsfinish: [],
      queuesfinish: [],
    };
  },
  mounted() {
    // setInterval(() => {
    //   location.reload();
    // }, 10000);

    this.getQueueDetail();
  },
  computed: {},
  methods: {
    imagePath(file_path) {
      if (file_path) {
        return "http://localhost:3000/" + file_path;
      } else {
        return "https://bulma.io/images/placeholders/640x360.png";
      }
    },
    getQueueDetail() {
      axios
        .get(`http://localhost:3000/queue`)
        .then((response) => {
          this.queueitems = response.data.queueitems;
          this.queues = response.data.queues;
          this.queueitemsfinish = response.data.queueitemsfinish;
          this.queuesfinish = response.data.queuesfinish;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    getQueueItems(queueId) {
      return this.queueitems.filter(item => item.queue_id === queueId);
    },
    getQueueItemsFinish(queueId) {
      return this.queueitemsfinish.filter(item => item.queue_id === queueId);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    getTotalQueues() {
      return this.queues.length + this.queuesfinish.length;
    },
    getTotalRevenue() {
      const processingTotal = this.queues.reduce((sum, queue) => sum + (queue.totalprice || 0), 0);
      const finishedTotal = this.queuesfinish.reduce((sum, queue) => sum + (queue.totalprice || 0), 0);
      return processingTotal + finishedTotal;
    }
  },
};
</script>

<style scoped>
.queue-section {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.queue-item {
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.processing-item {
  border-left-color: #ffdd57;
  background-color: #fffbf0;
}

.processing-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(255, 221, 87, 0.3);
}

.finished-item {
  border-left-color: #48c774;
  background-color: #f0fff4;
}

.finished-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(72, 199, 116, 0.3);
}

.queue-number {
  text-align: center;
}

.shop-info {
  padding-left: 1rem;
}

.items-list {
  padding: 0 1rem;
}

.item-tags {
  max-height: 100px;
  overflow-y: auto;
}

.item-tags::-webkit-scrollbar {
  width: 4px;
}

.item-tags::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.item-tags::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.price-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.hero.is-light {
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.card-header {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.notification.is-info.is-light {
  background-color: #f0f8ff;
  border: 1px solid #bee5eb;
}

.notification.is-success.is-light {
  background-color: #f0fff4;
  border: 1px solid #b8e6c1;
}

.queue-list {
  max-height: 600px;
  overflow-y: auto;
}

.queue-list::-webkit-scrollbar {
  width: 8px;
}

.queue-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.queue-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.queue-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.level-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0.5rem;
  transition: all 0.2s ease;
}

.level-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 768px) {
  .columns {
    flex-direction: column;
  }
  
  .column {
    margin-bottom: 1rem;
  }
  
  .price-info {
    text-align: center !important;
  }
  
  .queue-item {
    margin-bottom: 2rem;
  }
  
  .level {
    flex-direction: column;
  }
  
  .level-item {
    margin-bottom: 1rem;
  }
}

@media screen and (max-width: 480px) {
  .card-header-title {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tag.is-medium {
    margin-top: 0.5rem;
    margin-left: 0 !important;
  }
  
  .hero-body .title {
    font-size: 1.5rem;
  }
  
  .queue-list {
    max-height: 400px;
  }
}
</style>