<template>
  <div class="encrypt">
    <br>
    <div class="chat">
      <div class="yours messages">
        <div class="message" v-if="title.match(/\S/)">
          {{title}}
        </div>
      </div>
      <div v-for="(value, key) in chain" :key="value.id">
        <div class="yours messages">
          <div v-bind:class="['message', key + 1 == chain.length ? 'last' : '']">
            <div v-for="i in value[0].split('\n')" :key="i.id">
              {{i}}
            </div>
          </div>
        </div>

        <div class="mine messages">
          <div v-if="value[1]" v-bind:class="['message', key + 2 == chain.length ? 'last' : '']">
            {{value[1]}}
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!solved">
      <!-- <div>
        <p>{{encryptionDisplay}}</p>
      </div> -->
      <div id="boxinput">
        <input id="password-input" class="input" @keyup.enter="unlock" ref="user_key" type="text" placeholder="Enter Key" v-model="key" autocomplete="off"/>
        <button @click="unlock" class="btn btn-primary unlock">Unlock</button>
      </div>
    </div>

  </div>
</template>


<script>
export default {
    name: 'Decrypt',
    data: function() {
      return {
        base: process.env.VUE_APP_DOMAIN,
        title: '',
        display: '',
        encryption: '',
        encryptionDisplay: '',
        key:'',
        wildcard: '?_?',

        secret: '',
        chain: [],
        solved: false
      }
    },

    mounted() {
      this.configure();
      gtag('config', 'UA-146148867-1', {
        page_path: '/unlock',
        app_name: 'KeepMe',
        send_page_view: true,
      });
    },

    methods: {
      configure(){
        //this.$refs.user_key.focus();
        var param = atob(this.$route.query.k);
        
        if (!param) {
          console.log('no param');
          return;
        }
        this.display = param;

        var cipher = this.decrypt(param, this.base);
        cipher = cipher.split(this.wildcard);
        this.title = cipher[0];

        this.chain.push([cipher[1],'']);
        this.display = cipher[1];
        this.encryption = cipher[2];
        //this.encryptionDisplay = "The secret " + this.encryption.substring(0,11) + "... is still unrecognizable.";
      },

      unlock() {
        if (!this.encryption.toString()) {
          return;
        }
        
        var cipher = '';
        var key = this.key.toLowerCase().trim();
        if (!key) {
          console.log("Empty password");
          this.shakeInput();
          return;
        }

        try {
          cipher = CryptoJS.AES.decrypt(this.encryption, key).toString(CryptoJS.enc.Utf8);
        } catch {
          console.log("Bad or incorrect password"); // Cipher sometimes throws error on try
          this.shakeInput();
          return;
        }

        this.secret = '';
        //this.encryptionDisplay = "The secret " + this.encryption.substring(0,11) + "... is still unrecognizable.";

        if (cipher.indexOf(this.wildcard) <= -1) {
          if (cipher) {
            this.secret = cipher;
            this.encryptionDisplay = '';
            this.chain.slice(-1)[0][1] = this.key;
            this.pushChain(this.secret,'');
            this.solved = true;
            console.log('Keepme fully unlocked.');
            this.scrollDown();
            this.gaCompleted();
            return;
          }
          console.log('Incorrect cipher. Try again');
          this.shakeInput();
          return; 
        }
        
        cipher = cipher.split(this.wildcard);
        if (cipher.length == 1) {
          console.log('Malformed KeepMe');
          this.secret = cipher[0];
          this.display = '';
          this.encryption = '';
          //this.encryptionDisplay = '';
          return;
        }

        console.log('Unlocking next part');
        this.display = cipher[0];
        this.encryption = cipher[1];
        this.chain.slice(-1)[0][1] = this.key;
        this.pushChain(this.display, '');
        this.key = '';
        this.scrollDown();
        this.gaPartiallySolved();
      },

      pushChain(a,b) {
        this.chain.push([a,b]);
      },

      decrypt(enc, pwd) {
        try {
          var attempt = CryptoJS.AES.decrypt(enc, pwd).toString(CryptoJS.enc.Utf8);
          return attempt;
        } catch {
          console.log("Incorrect password");
        }
      },

      shakeInput() {
        $("#boxinput").effect("shake", {times:2, distance: 3}, 350);
        this.focusInput();
      },

      focusInput() {
        //this.$refs.user_key.select();
      },

      scrollDown() {
        // var old_height = $(document).height();  //store document height before modifications
        // var old_scroll = $(window).scrollTop(); //remember the scroll position
        // //do anything
        // $(document).scrollTop(old_scroll + $(document).height() - old_height); //restore "scroll position"

        var $container = $('.encrypt'), $scrollTo = $('#password-input');
        $('html, body').animate({ scrollTop: $scrollTo.offset().top - $container.offset().top 
          + $container.scrollTop() }, 1600, 'linear');
        this.focusInput();
      },

      gaCompleted() {
        gtag('event', 'solved', {
          event_category: 'keepme',
          event_label: 'completed',
        });
      },

      gaPartiallySolved() {
        gtag('event', 'partially_solved', {
          event_category: 'keepme',
          event_label: 'partially_solved',
        });
      }
    }
    
}
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


input {
  border: 1px solid #aaaaaa; 
  color: #000000; 
  padding: 4px; 
  border-radius: 15px;
  margin-top: 30px;
  margin-right: 5px;
  margin-bottom: 20px;
  width: 225px;
}

input:focus {
  outline: none;
  box-shadow: 0px 0px 2px blue;
}

.unlock {
  border-radius: 15px;
}

body {
  font-family: helvetica;
  display: flex ;
  flex-direction: column;
  align-items: center;
}

.chat {
  width: 300px;
  /*border: solid 1px #EEE;*/
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
}

.messages {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
}

.message {
  border-radius: 20px;
  padding: 8px 15px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: inline-block;
}

.yours {
  align-items: flex-start;
}

.yours .message {
  margin-right: 25%;
  background-color: #EEE;
  position: relative;
}

.yours .message.last:before {
  content: "";
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: -7px;
  height: 20px;
  width: 20px;
  background: #EEE;
  border-bottom-right-radius: 15px;
}
.yours .message.last:after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: -10px;
  width: 10px;
  height: 20px;
  background: white;
  border-bottom-right-radius: 10px;
}

.mine {
  align-items: flex-end;
}

.mine .message {
  color: white;
  margin-left: 25%;
  background: rgb(0, 120, 254);
  position: relative;
}

.mine .message.last:before {
  content: "";
  position: absolute;
  z-index: 0;
  bottom: 0;
  right: -8px;
  height: 20px;
  width: 20px;
  background: rgb(0, 120, 254);
  border-bottom-left-radius: 15px;
}

.mine .message.last:after {
  content: "";
  position: absolute;
  z-index: 1;
  bottom: 0;
  right: -10px;
  width: 10px;
  height: 20px;
  background: white;
  border-bottom-left-radius: 10px;
}

@media screen and (max-width: 1000px){
    .create {
    flex: 1 1 100%;
    position: relative;
    padding: 10px 5% 0px;
  }
}
</style>
