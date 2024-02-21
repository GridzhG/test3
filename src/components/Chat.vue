<template>
  <div data-v-3b5cc8c8="" data-v-13fec4b2="" class="chat">
    <div data-v-3b5cc8c8="" class="chat__head">
      <div data-v-3b5cc8c8="" class="control">
        <div data-v-3b5cc8c8="" class="title">Чат</div>
        <input v-on:change="setState()" data-v-3b5cc8c8="" type="checkbox" id="chats">
        <div data-v-3b5cc8c8="" class="checkbox">
          <label data-v-3b5cc8c8="" for="chats">
            <span data-v-3b5cc8c8="" class="line"></span>
            <em data-v-3b5cc8c8="">Лайв-лента</em>
          </label>
        </div>
      </div>
    </div>
    <div v-if="state === 'chat'" data-v-3b5cc8c8="" class="chat__body">
      <div data-v-3b5cc8c8="" id="chat" class="body" ref="container">
        <div v-for="message in messages" :key="message.id" data-v-3b5cc8c8="" class="message" ref="message">
          <div v-if="$root.user && ($root.user.role === 'admin' || $root.user.role === 'moderator')" @click="openSettings(message.id)" data-v-3b5cc8c8="" class="settings">
            <svg data-v-3b5cc8c8="" width="17" height="5" viewBox="0 0 17 5" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <circle data-v-3b5cc8c8="" cx="2.10526" cy="2.10526" r="2.10526" fill="#6C6B8B"></circle>
              <circle data-v-3b5cc8c8="" cx="8.31571" cy="2.10526" r="2.10526" fill="#6C6B8B"></circle>
              <circle data-v-3b5cc8c8="" cx="14.5262" cy="2.10526" r="2.10526" fill="#6C6B8B"></circle>
            </svg>
            <div v-show="typeof openedSettings[message.id] !== 'undefined'" data-v-3b5cc8c8="" class="dropdown">
              <li v-if="!message.user.is_ban_chat" @click="banUser(message.user.id)" data-v-3b5cc8c8="">Заблокировать</li>
              <li data-v-3b5cc8c8="" @click="deleteMessage(message.id)">Удалить сообщ.</li>
            </div>
          </div>
          <RouterLink data-v-3b5cc8c8="" :to="`/user/${message.user.id}`" class="avatar">
            <img data-v-3b5cc8c8=""
                 :src="message.user.avatar" alt="">
          </RouterLink>
          <div data-v-3b5cc8c8="" class="text">
            <div @click="setMessageUsername(message.user.username)" data-v-3b5cc8c8="" class="nickname">
              <div v-if="message.user.role === 'admin'" data-v-3b5cc8c8="" class="admin">ADM</div>
              {{ message.user.username }}
            </div>
            <div data-v-3b5cc8c8="" class="area"> {{ message.message }}</div>
          </div>
          <div data-v-3b5cc8c8="" class="date"> {{ message.date }}</div>
        </div>
      </div>
      <div data-v-3b5cc8c8="" class="form" v-if="$root.user">
        <div data-v-3b5cc8c8="" class="textarea">
          <input @keydown.enter.prevent="sendMessage" v-model="message" data-v-3b5cc8c8="" name=""
                 placeholder="Ваше сообщение" autocomplete="off" id="chat-input">
          <div data-v-3b5cc8c8="" class="message-length">{{ maxSymbols - message.length }}</div>
          <button @click="sendMessage" data-v-3b5cc8c8="" class="send">
            <img data-v-3b5cc8c8="" src="/img/send.svg" alt="">
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="state === 'drops'" data-v-3b5cc8c8="" class="chat__body">
      <div data-v-3b5cc8c8="" id="live" class="body body_live">
        <div v-for="(drop, i) in $root.liveDrop.drops" :key="i" data-v-3b5cc8c8="" class="live__item" :class="$root.getColor(drop.item.rarity)">
          <div data-v-3b5cc8c8="" class="info">
            <div data-v-3b5cc8c8="" class="game" v-if="drop.type === 'case'"> Кейс <span data-v-3b5cc8c8="">{{ drop.box.name }}</span></div>
            <div data-v-3b5cc8c8="" class="game" v-if="drop.type === 'contracts'"><span data-v-3b5cc8c8="">Буст</span></div>
            <div data-v-3b5cc8c8="" class="game" v-if="drop.type === 'upgrade'"><span data-v-3b5cc8c8="">Апгрейд</span></div>
            <div data-v-3b5cc8c8="" class="details"><strong data-v-3b5cc8c8="">{{ $root.getItemType(drop.item.market_name) }}</strong><span data-v-3b5cc8c8="">{{ $root.getItemName(drop.item.market_name) }}</span>
            </div>
          </div>
          <div data-v-3b5cc8c8="" class="skin">
            <div data-v-3b5cc8c8="" class="drop_user">{{ drop.user.username }}</div>
            <div data-v-3b5cc8c8="" class="skin_img">
              <img data-v-3b5cc8c8="" :src="`https://steamcommunity-a.akamaihd.net/economy/image/${drop.item.icon_url}/222fx166f`" :alt="drop.item.market_name">
            </div>
            <div data-v-3b5cc8c8="" class="case_img" v-if="drop.type === 'case'">
              <img data-v-3b5cc8c8="" :src="drop.box.image" :alt="drop.box.name">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: 'chat',
      maxSymbols: 100,
      message: '',
      messages: [],
      openedSettings: {}
    }
  },
  watch: {
    message(newValue, oldValue) {
      if (newValue.length > this.maxSymbols) {
        this.message = oldValue
      }
    }
  },
  created() {
    this.getMessages()
  },
  methods: {
    getMessages() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": "{getAllMessages {  id,  user {    id    username    avatar    role is_ban_chat  },  message  date}}"}
      ).then(data => {
        this.messages = data.getAllMessages

        this.$nextTick(() => {
          this.scrollToEnd()
        })
      })
    },
    sendMessage() {
      this.$root.request(
          'POST',
          '/graphql',
          {
            "query": "mutation sendMessage($message: String!) {sendMessage(message: $message)}",
            "variables": {"message": this.message},
            "operationName": "sendMessage"
          }
      ).then(() => {
        this.$root.showNotify('Успешно', 'Сообщение отправлено', 'success')
        this.message = ''
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    },
    setState() {
      if (this.state === 'chat') {
        this.state = 'drops'
      } else {
        this.state = 'chat'
      }
    },
    scrollToEnd() {
      const checkChat = setInterval(() => {
        if (typeof this.$refs['message'] !== 'undefined' && this.$refs['message'].length > 0) {
          this.$refs['container'].scrollTop = 9999999
          clearInterval(checkChat)
        }
      }, 100)

    },
    setMessageUsername(username) {
      this.message = `${username}, `
    },
    openSettings(id) {
      if (typeof this.openedSettings[id] === 'undefined') {
        this.openedSettings[id] = 1
      } else {
        delete this.openedSettings[id]
      }

      this.$forceUpdate()
    },
    banUser(userId) {
      this.$root.request(
          'POST',
          '/graphql',
          {"query":"mutation banUserInChat($id: Int!) {banUserInChat(id: $id)}","variables":{"id":userId},"operationName":"banUserInChat"}
      ).then(() => {
        this.$root.showNotify('Успешно', 'Пользователь заблокирован', 'success')
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    },
    deleteMessage(messageId) {
      this.$root.request(
          'POST',
          '/graphql',
          {"query":"mutation deleteMessage($id: String!) {deleteMessage(id: $id)}","variables":{"id":messageId},"operationName":"deleteMessage"}
      ).then(() => {
        this.$root.showNotify('Успешно', 'Сообщение удалено', 'success')

        if (typeof this.openedSettings[messageId] !== 'undefined') {
          delete this.openedSettings[messageId]
        }
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    }
  },
  socket: {
    events: {
      chatNewMessage(data) {
        this.messages.push(data);
        this.$forceUpdate();

        this.scrollToEnd()
      },
      chatDeleteMessage(id) {
        const index = this.messages.findIndex(x => x.id === id);

        if (index > -1) {
          this.messages.splice(index, 1);
          this.$forceUpdate();

          this.scrollToEnd()
        }
      },
      chatClear() {
        this.messages = [];
        this.$forceUpdate();

        this.scrollToEnd()
      }
    }
  }
}
</script>