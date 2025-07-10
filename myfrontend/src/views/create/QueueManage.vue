<template>
  <div class="container is-widescreen">
    <!-- Header Section -->
    <div class="hero is-light is-small ">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-2 has-text-centered">
            <span class="icon is-large has-text-primary">
              <i class="fas fa-clipboard-list"></i>
            </span>
            ระบบจัดการคิว
          </h1>
          <p class="subtitle is-5 has-text-centered has-text-grey">
            จัดการคิวลูกค้าและรายการสั่งซื้อ
          </p>
        </div>
      </div>
    </div>

    <!-- Processing Queue Section -->
    <div class="section">
      <div class="card">
        <div class="card-header">
          <div class="card-header-title is-centered">

            <span class="title is-4 ml-3">
              <i class="fas fa-clock"></i>
              รายการที่ลูกค้าสั่ง
            <span class="tag is-warning is-medium ml-3">{{ queues.length }} คิว</span>
              </span>
          </div>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped">
              <thead>
                <tr class="has-background-warning-light">
                  <th class="has-text-centered"><strong>เวลา</strong></th>
                  <th class="has-text-centered"><strong>ชื่อลูกค้า</strong></th>
                  <th class="has-text-centered"><strong>รายการสั่งซื้อ</strong></th>
                  <th class="has-text-centered"><strong>ราคารวม</strong></th>
                  <th class="has-text-centered"><strong>การดำเนินการ</strong></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="queue in queues" :key="queue.id">
                  <td class="has-text-centered">
                    <span class="tag is-light">{{ queue.time }}</span>
                  </td>
                  <td class="has-text-centered">
                    <span class="has-text-weight-semibold">{{ queue.first_name }}</span>
                  </td>
                  <td>
                    <div class="content">
                      <div 
                        v-for="item in queueitems" 
                        :key="item.id" 
                        v-show="queue.id == item.queue_id"
                        class="level is-mobile mb-2"
                      >
                        <div class="level-left">
                          <div class="level-item">
                            <span class="has-text-weight-medium">{{ item.name }}</span>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="tag is-primary is-light">x{{ item.quantity }}</span>
                          </div>
                          <div class="level-item">
                            <label class="checkbox">
                              <input
                                type="checkbox"
                                @click="changecheckbox(item)"
                                :checked="item.check === 1"
                              />
                              <span class="ml-1">เสร็จ</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="has-text-centered">
                    <span class="tag is-success is-medium">{{ queue.totalprice }} บาท</span>
                  </td>
                  <td class="has-text-centered">
                    <button 
                      class="button is-success is-rounded"
                      @click="changeStatus(queue, 'finish')"
                    >
                      <span class="icon">
                        <i class="fas fa-check"></i>
                      </span>
                      <span>เสร็จสิ้น</span>
                    </button>
                  </td>
                </tr>
                <tr v-if="queues.length === 0">
                  <td colspan="5" class="has-text-centered has-text-grey">
                    <div class="content">
                      <span class="icon is-large">
                        <i class="fas fa-inbox"></i>
                      </span>
                      <p class="is-size-5">ไม่มีคิวรอประมวลผล</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Finished Queue Section -->
    <div class="section">
      <div class="card">
        <div class="card-header">
          <div class="card-header-title is-centered">
       
            <span class="title is-4 ml-3">
              <i class="fas fa-check-circle"></i>
              คิวที่เสร็จสิ้นแล้ว

            <span class="tag is-success is-medium ml-3">{{ queuesfinish.length }} คิว</span>
            </span>
          </div>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table is-fullwidth is-hoverable is-striped">
              <thead>
                <tr class="has-background-success-light">
                  <th class="has-text-centered"><strong>เวลา</strong></th>
                  <th class="has-text-centered"><strong>ชื่อลูกค้า</strong></th>
                  <th class="has-text-centered"><strong>รายการสั่งซื้อ</strong></th>
                  <th class="has-text-centered"><strong>ราคารวม</strong></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="queue in queuesfinish" :key="queue.id">
                  <td class="has-text-centered">
                    <span class="tag is-light">{{ queue.time }}</span>
                  </td>
                  <td class="has-text-centered">
                    <span class="has-text-weight-semibold">{{ queue.first_name }}</span>
                  </td>
                  <td>
                    <div class="content">
                      <div 
                        v-for="item in queueitemsfinish"
                        :key="item.id"
                        v-show="queue.id == item.queue_id"
                        class="level is-mobile mb-2"
                      >
                        <div class="level-left">
                          <div class="level-item">
                            <span class="has-text-weight-medium">{{ item.name }}</span>
                          </div>
                        </div>
                        <div class="level-right">
                          <div class="level-item">
                            <span class="tag is-primary is-light">x{{ item.quantity }}</span>
                          </div>
                          <div class="level-item">
                            <span class="tag is-success is-light">
                              <span class="icon">
                                <i class="fas fa-check"></i>
                              </span>
                              <span>เสร็จ</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="has-text-centered">
                    <span class="tag is-success is-medium">{{ queue.totalprice }} บาท</span>
                  </td>
                </tr>
                <tr v-if="queuesfinish.length === 0">
                  <td colspan="4" class="has-text-centered has-text-grey">
                    <div class="content">
                      <span class="icon is-large">
                        <i class="fas fa-inbox"></i>
                      </span>
                      <p class="is-size-5">ยังไม่มีคิวที่เสร็จสิ้น</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
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
      queueitems: [],
      queues: [],
      queueitemsfinish: [],
      queuesfinish: [],
    };
  },
  mounted() {
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
        .get(`http://localhost:3000/queuemanage`)
        .then((response) => {
          this.queues = response.data.queues;
          this.queueitems = response.data.queueitems;
          this.queuesfinish = response.data.queuesfinish;
          this.queueitemsfinish = response.data.queueitemsfinish;
        })
        .catch((error) => {
          this.error = error.response.data.message;
        });
    },
    changeStatus(queue, status) {
      queue["status"] = status;
      axios
        .put(`http://localhost:3000/updatestatus/${queue.id}`, {
          queue: queue,
        })
        .catch((e) => console.log(e.response.data));
      window.location.reload();
    },
    changecheckbox(item) {
      axios
        .put(`http://localhost:3000/updateitemstatus/${item.queueitem_id}`, {
        })
        .catch((e) => console.log(e.response.data));
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.hero {
  margin-bottom: 2rem;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  border-bottom: 1px solid #e8e8e8;
}

.table td, .table th {
  vertical-align: middle;
  padding: 1rem;
}

.level.is-mobile {
  margin-bottom: 0.5rem !important;
}

.level.is-mobile:last-child {
  margin-bottom: 0 !important;
}

.checkbox {
  cursor: pointer;
}

.checkbox:hover {
  color: #3273dc;
}

.button.is-rounded {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.tag.is-medium {
  font-size: 0.9rem;
}

.content p {
  margin-bottom: 0.5rem;
}

.table-container {
  overflow-x: auto;
}

@media screen and (max-width: 768px) {
  .level.is-mobile {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .level-left, .level-right {
    width: 100%;
  }
  
  .level-right {
    margin-top: 0.5rem;
    justify-content: flex-end;
  }
}
</style>