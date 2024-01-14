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
        <th colspan="1">ชื่อ</th>
        <th colspan="1">รายการ</th>
        <th colspan="1">ราคารวม</th>
        <th colspan="1">ยืนยัน</th>
      </tr>
      <tr v-for="queue in queues" :key="queue.id">
        <td colspan="1">{{ queue.time }}</td>
        <td colspan="1">{{ queue.first_name }}</td>
        <td colspan="1">
          <tr class="media" v-for="item in queueitems" :key="item.id" v-show="queue.id == item.queue_id">
            <span class="level-left"> {{ item.name }}</span>
            <span class="media-content">x{{ item.quantity }}</span>
            <input
              class="level-right"
              type="checkbox"
              
              @click="changecheckbox(item)"
             :checked="item.check === 1"
            />
          </tr>

        </td>
        <td colspan="1">{{ queue.totalprice }} บาท</td>
        <td colspan="1">
          <a class="button is-success" @click="changeStatus(queue, 'finish')"
            >Finish</a
          >
        </td>
      </tr>
    </table>
    <!-- ---------------------------------------------------------------------- -->
    <table id="order-table" style="width: 100%" class="table is-bordered">
      <tr>
        <th
          class="is-selected"
          colspan="4"
          style="text-align: center; font-size: 1.5em"
        >
          Finish Queue
        </th>
      </tr>
      <tr>
        <th colspan="1">คิว</th>
        <th colspan="1">ชื่อ</th>
        <th colspan="1">รายการ</th>
        <th colspan="1">ราคารวม</th>
      </tr>
      <tr v-for="queue in queuesfinish" :key="queue.id">
        <td colspan="1">{{ queue.time }}</td>
        <td colspan="1">{{ queue.first_name }}</td>
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
</style>