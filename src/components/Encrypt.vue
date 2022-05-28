<template>
  <div class="encrypt">
    <div class="create">
      <div class="create-content">
        <div>
          <input
            class="title-input"
            placeholder="Title (optional)"
            v-model="title"
            @keyup="checkUrlLength"
          />
          <div v-if="true || chain.length > 0">
            <ul>
              <li v-for="(c, index) in chain" :key="c.index">
                <div class="add-lock-group">
                  <div class="add-lock-text-div">
                    <textarea
                      class="add-lock-textarea"
                      rows="3"
                      placeholder="Message"
                      v-model="chain[index][0]"
                      @keyup="checkUrlLength"
                    ></textarea>
                    <button
                      class="delete-btn"
                      v-bind:style="deleteAvailable"
                      :disabled="chain.length == 1"
                      @click="remove(index)"
                      title="Remove lock"
                    >
                      <img src="remove-lock.png" height="30" width="30" />
                    </button>
                  </div>
                  <div>
                    <input
                      class="password-input"
                      placeholder="Password"
                      type="text"
                      v-model="chain[index][1]"
                      @keyup="checkUrlLength"
                    />
                  </div>
                </div>
                <img src="chain.png" style="margin-bottom:20px;" height="30" width="30" />
              </li>
            </ul>
          </div>
          <transition name="fade">
            <div class="secret-input-area">
              <textarea
                class="secret-textarea"
                rows="3"
                placeholder="Enter a secret"
                v-model="secret"
                @keyup="checkUrlLength"
              ></textarea>
              <button
                class="secret-btn"
                v-bind:style="addAvailable"
                :disabled="!validate()"
                @click="formatChain"
                title="Add a lock"
              >
                <img src="add-lock.png" height="30" width="30" />
              </button>
            </div>
          </transition>
        </div>

        <div v-if="validInput">
          <div id="qr-area-id" class="qr">
            <div class="qrTitle">
              <img class="qrIcon" src="favicon.ico" height="30" width="30" />
              <h5 class="qrHeader">{{title}}</h5>
            </div>
            <qr :url="fullLink"></qr>
          </div>
          <div class="create-details">
            <div class="create-details-inner">
              <div style="margin-left:0px;">
                <textarea v-model="fullLink" ref="linkToKeepme" @select="gaCreated"></textarea>
              </div>
              <div style="margin-bottom:10px;">
                <button @click="copyText" class="btn btn-primary">Copy</button>
                <a :href="fullLink" target="_blank" @click="gaCreated">KeepMe</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <br />
          <br />
          <div class="text-danger"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Qr from "@/components/Qr.vue";

export default {
  name: "Encrypt",

  components: {
    Qr
  },

  data: function() {
    return {
      base: process.env.VUE_APP_DOMAIN,
      chain: [],

      title: "",
      secret: "", //'BTC: 1FfmbHfnpaZjKFvyi1okTjJJusN455paPH',
      encryption: "Hello",
      wildcard: "?_?",
      fullLink: "",

      maxLength: 1250,
      maxUrlLength: 2083,
      maxQr: 1250,
      size: 0,

      validInput: false,

      deleteAvailable: {
        filter: "grayscale(1)"
      },

      addAvailable: {
        filter: "grayscale(1)"
      }
    };
  },

  mounted() {
    gtag("config", "UA-146148867-1", {
      page_path: "/create",
      app_name: "KeepMe",
      send_page_view: true
    });
    this.pushChain("", "");
  },

  methods: {
    configure() {
      this.validInput = this.validate();

      var encryption = "";
      var arr = this.chain.slice();
      //arr = arr.unshift([this.title, this.base]);

      var i = arr.pop();
      encryption = this.encrypt(this.secret.trim(), i[1].toLowerCase().trim());
      encryption = i[0] + this.wildcard + encryption.toString();

      while (arr != undefined && arr.length > 0) {
        i = arr.pop();
        encryption = this.encrypt(encryption, i[1].toLowerCase().trim());
        encryption = i[0] + this.wildcard + encryption.toString();
      }
      encryption = this.getTitle() + this.wildcard + encryption.toString();
      encryption = this.encrypt(encryption, this.base);

      // url abled
      this.encryption = btoa(encryption.toString());
      this.fullLink = this.base + "/#/u?k=" + this.encryption;
      this.size = this.fullLink.length;

      if (this.fullLink.length > this.maxLength) {
        alert("KeepMe is too large. Reduce character count.");
        this.size = this.fullLink.length;
        this.chain.pop();
        this.configure();
      }
      Event.fire("broadcastLink", this.fullLink);
    },

    formatChain() {
      this.size = this.fullLink.length;
      if (this.secret && true) {
        if (this.chain.length == 0) {
          this.pushChain("", "");
          this.configure();
          return;
        }
        if (this.validate()) {
          this.pushChain("", "");
          this.configure();
        }
      }
    },

    validate() {
      if (!this.secret || this.chain.length == 0) {
        this.addAvailable.filter = "grayscale(1)";
        // redundant I know, but I'm tired
        if (this.chain.length > 1) {
          this.deleteAvailable.filter = "none";
        }
        return false;
      }

      for (var i = 0; i < this.chain.length; i++) {
        if (!this.chain[i][0] || !this.chain[i][1]) {
          this.addAvailable.filter = "grayscale(1)";
          if (this.chain.length > 1) {
            this.deleteAvailable.filter = "none";
          }
          return false;
        }
      }

      this.addAvailable.filter = "none";
      if (this.chain.length > 1) {
        this.deleteAvailable.filter = "none";
      }

      return true;
    },

    checkUrlLength() {
      this.validInput = this.validate();
      if (!this.validInput) {
        return;
      }

      var encryption = "";
      var arr = this.chain.slice();
      var i = arr.pop();
      encryption = this.encrypt(this.secret.toLowerCase().trim(), i[1]);
      encryption = i[0] + this.wildcard + encryption.toString();

      while (arr != undefined && arr.length > 0) {
        i = arr.pop();
        encryption = this.encrypt(encryption, i[1]);
        encryption = i[0] + this.wildcard + encryption.toString();
      }
      encryption = this.getTitle() + this.wildcard + encryption.toString();
      encryption = this.encrypt(encryption, this.base);

      encryption = btoa(encryption.toString());

      this.size = encryption.length + 16;
      console.log(this.size);
      if (this.size > this.maxLength) {
        alert("too high");
      }

      this.configure();
    },

    remove(id) {
      this.chain.splice(id, 1);
      this.configure();
    },

    encrypt(msg, pwd) {
      return CryptoJS.AES.encrypt(msg, pwd).toString();
    },

    decrypt(enc, pwd) {
      return CryptoJS.AES.decrypt(enc, pwd).toString(CryptoJS.enc.Utf8);
    },

    pushChain(a, b) {
      this.chain.push([a, b]);
    },

    copyText() {
      this.$refs.linkToKeepme.select();
      document.execCommand("copy");
    },

    getTitle() {
      if (this.title) return this.title;
      return " ";
    },

    gaCreated() {
      gtag("event", "created", {
        event_category: "keepme",
        event_label: "created"
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.create {
  flex: 1 1 100%;
  position: relative;
  padding: 10px 20% 0px;
}

.create-content {
  padding: 5px 5px 30px;
}

.create-details {
  position: absolute;
  padding: 0px 10% 0px;
  width: 100%;
  bottom: 0;
  left: 0;
}

.create-details-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 0px;
}

.qr {
  padding: 15px 0px 25px;
  margin: 0px 0px 50px;
  align-items: center;
  border-top: 1px solid #efefef;
}
.qrDiv {
  border: 1px #4d0909;
}
.qrTitle {
  margin-bottom: 7px;
}

.qrIcon {
  margin-right: 7px;
  margin-bottom: 7px;
}

.qrHeader {
  display: inline;
}

.title-input {
  border: 1px solid #aaaaaa;
  color: #000000;
  padding: 4px;
  border-radius: 15px;
  width: 100%;
  margin-bottom: 20px;
}

textarea {
  border: 1px solid #aaaaaa;
  color: #000000;
  padding: 4px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.message-textarea {
  border: 1px solid #aaaaaa;
  color: #000000;
  padding: 4px;
  border-radius: 15px;
  margin-bottom: 20px;
  width: 80%;
  margin-right: 20%;
}

.message-textarea:focus {
  outline: none;
  box-shadow: 0px 0px 2px blue;
}

.password-input {
  border: 1px solid #aaaaaa;
  color: #000000;
  padding: 4px;
  margin-right: 20%;
  border-radius: 15px;
  margin-bottom: 5px;
  width: 100%;
}

.password-input:focus {
  outline: none;
  box-shadow: 0px 0px 2px blue;
}

.secret-input-area {
  display: flex;
}

.secret-textarea {
  width: 80%;
  border: 1px solid #aaaaaa;
}

.delete-btn {
  border: none;
  background: transparent;

  display: inline-block;
  margin-bottom: 0px;
  width: 20%;
}

.delete-btn:focus {
  outline: none;
}

.secret-btn {
  border: none;
  background: transparent;

  display: inline-block;
  width: 20%;
  margin-bottom: 20px;
}

.secret-btn:focus {
  outline: none;
}

.add-lock-text-div {
  display: flex;
}

.add-lock-textarea {
  width: 80%;
}

.add-lock-btn {
  border: none;
  background: transparent;
  display: inline;
}

.add-lock-btn:focus {
  outline: none;
}

html {
  line-height: 1.6;
  font-family: "Nunito", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1,
h2,
h3,
h4,
h5 {
  line-height: 1.2;
}

.container {
  width: 500px;
  clear: both;
  text-align: center;
}

.container input {
  clear: both;
  text-align: center;

  border: 1px solid #aaaaaa;
  color: #000000;
  padding: 4px;
  border-radius: 15px;
}

.container input:focus {
  outline: none;
  box-shadow: 0px 0px 2px blue;
}

ul {
  list-style-type: none;
  padding: 0px;
  margin: 0;
}

.add-lock-group {
  padding: 0px 0px 10px;
}

.inputGroupBtn {
  display: inline;
}

a {
  color: #42b983;
}

.fade-enter-active {
  transition: opacity 3.5s;
}
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (max-width: 1000px) {
  .create {
    flex: 1 1 100%;
    position: relative;
    padding: 10px 5% 0px;
  }
}
</style>
