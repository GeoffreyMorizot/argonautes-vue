import "./assets/styles/main.scss";
import { apiFetch } from "./assets/js/utils.js";

Vue.component("ArgonauteItem", {
  template: `<li class="row__item">
   <input v-model="argonaute.name" type="text" name="name"  />
   <button class="btn--secondary" data-action="update" v-on:click="updateArg">Editer</button>
   <button class="btn--secondary"  v-on:click="deleteArg">Effacer</button>
  </li>`,
  props: {
    argonaute: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteArg() {
      this.$emit("delete-argonaute", this.argonaute._id);
      console.log("emit");
    },
    updateArg() {
      this.$emit("update-argonaute", this.argonaute._id, this.argonaute.name);
    },
  },
});

const ArgonautesVue = new Vue({
  el: "#app",
  data() {
    return {
      BASE_URL: import.meta.env.DEV ? "http://localhost:5050/api/argonautes/" : "https://argonautes-api.herokuapp.com/api/argonautes/",
      argonautes: [],
      name: "",
      loading: false,
    };
  },
  methods: {
    init() {
      this.loading = true;
      fetch(this.BASE_URL)
        .then((res) => res.json())
        .then((data) => {
          this.argonautes = data;
          this.loading = false;
        });
    },
    addArgonaute(e) {
      e.preventDefault();
      apiFetch(this.BASE_URL, {
        method: "POST",
        body: JSON.stringify({ name: this.name }),
      }).then((res) => {
        this.argonautes.push(res);
        this.name = "";
      });
    },
    deleteArgonaute(id) {
      apiFetch(`${this.BASE_URL + "/" + id}`, {
        method: "DELETE",
      }).then((res) => (this.argonautes = this.argonautes.filter((arg) => arg._id !== res._id)));
    },
    updateArgonaute(id, name) {
      apiFetch(`${this.BASE_URL + "/" + id}`, {
        method: "PUT",
        body: JSON.stringify({ name: name }),
      }).then((res) => {
        const index = this.argonautes.findIndex((arg) => arg._id === res._id);
        this.argonautes[index] = res;
      });
    },
  },
  mounted() {
    this.init();
  },
});
