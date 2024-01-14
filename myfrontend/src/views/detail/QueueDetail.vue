<template>
  <div class="container is-widescreen">
    <h2 class="title">ตาราง Queue</h2>
    <table id="order-table" style="width: 100%" class="table is-bordered">
      <tr>
        <th
          class="is-selected"
          colspan="5"
          style="text-align: center; font-size: 1.5em"
        >
          Processing Queue
        </th>
      </tr>
      <tr>
        <th colspan="1">คิว</th>
        <th colspan="1">ชื่อร้าน</th>
        <th colspan="1">รายการ</th>
        <th colspan="1">ราคารวม</th>
        <th colspan="1">วันที่</th>
      </tr>
      <tr v-for="queue in queues" :key="queue.id">
        <td colspan="1">{{ queue.time }}</td>
        <td colspan="1">{{ queue.name }}</td>
        <td colspan="1">
          <tr class="media"
            v-for="item in queueitems"
            :key="item.id"
            v-show="queue.id == item.queue_id"
          >
            <span class="level-left"> {{ item.name }}</span>
            <span class="media-content">x{{ item.quantity }}</span>
          </tr>
        </td>
        <td colspan="1">{{ queue.totalprice }} บาท</td>
        <td colspan="1">{{ queue.date }}</td>
      </tr>
    </table>
    <!-- ---------------------------------------------------------------------- -->
    <table id="order-table" style="width: 100%" class="table is-bordered">
      <tr>
        <th
          class="is-selected"
          colspan="5"
          style="text-align: center; font-size: 1.5em"
        >
          Finish Queue
        </th>
      </tr>
      <tr>
        <th colspan="1">คิว</th>
        <th colspan="1">ชื่อร้าน</th>
        <th colspan="1">รายการ</th>
        <th colspan="1">ราคารวม</th>
        <th colspan="1">วันที่</th>
      </tr>
      <tr v-for="queue in queuesfinish" :key="queue.id">
        <td colspan="1">
          {{ queue.time }}
        </td>
        <td colspan="1">{{ queue.shop_name }}</td>
        <td colspan="1">
          <tr class="media"
            v-for="item in queueitemsfinish"
            :key="item.id"
            v-show="queue.id == item.queue_id"
          >
            <span class="level-left"> {{ item.name }}</span>
            <span class="media-content">x{{ item.quantity }}</span>
          </tr>
        </td>
        <td colspan="1">{{ queue.totalprice }} บาท</td>
        <td colspan="1">{{ queue.date }}</td>
        <!-- <td colspan="1">บาท</td> -->
      </tr>
    </table>
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
  },
};
</script>

<style scoped>
</style>