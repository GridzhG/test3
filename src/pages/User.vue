<template>
  <div style="" v-if="user">
    <div data-v-497d236d="" class="other-profile profile">
      <div data-v-497d236d="" class="container">
        <div data-v-497d236d="" class="page__title blue"><span data-v-497d236d="">ПРОФИЛЬ ИГРОКА {{ user.username }}</span>
        </div>
        <div data-v-497d236d="" class="wrapper">
          <div data-v-497d236d="" class="left">
            <div data-v-497d236d="" class="profile">
              <div data-v-497d236d="" class="user">
                <div data-v-497d236d="" class="avatar">
                  <img data-v-497d236d="" :src="user.avatar" alt="">
                </div>
                <div data-v-497d236d="" class="text"><span data-v-497d236d="">Пользователь</span>
                  <div data-v-497d236d="" class="nickname">{{ user.username }}</div>
                  <p data-v-497d236d="">ID: {{ user.id }}</p></div>
              </div>
              <div data-v-497d236d="" class="best" v-if="user.bestDrop">
                <div data-v-497d236d="" class="text">
                  <span data-v-497d236d="">Лучший дроп</span>
                  <strong data-v-497d236d="">{{ user.bestDrop.item.market_name }}</strong>
                  <em data-v-497d236d="">{{ user.bestDrop.item.price | num }} ₽</em>
                </div>
                <img data-v-497d236d=""  :src="`https://steamcommunity-a.akamaihd.net/economy/image/${user.bestDrop.item.icon_url}/222fx166f`" alt="" class="best_img">
              </div>
              <div data-v-497d236d="" class="stats">
                <div data-v-497d236d="" class="stat" v-if="user.bestDrop">
                  <div data-v-497d236d="" class="img">
                    <img data-v-497d236d="" src="/img/stat2.svg" alt="">
                  </div>
                  <div data-v-497d236d="" class="text">
                    <strong data-v-497d236d="">{{ user.bestDrop.box.name }}</strong>
                    <span data-v-497d236d="">самый профитный кейс</span>
                  </div>
                </div>
                <div data-v-497d236d="" class="stat">
                  <div data-v-497d236d="" class="img"><img data-v-497d236d="" src="/img/stat1.svg" alt=""></div>
                  <div data-v-497d236d="" class="text"><strong data-v-497d236d="">{{ user.opened }}</strong><span data-v-497d236d="">кейсов открыто</span>
                  </div>
                </div>
              </div>
            </div>
            <div data-v-497d236d="" class="wrapper__tabs">
              <div data-v-497d236d="" class="tabs">
                <div data-v-497d236d="" class="tab active"> Инвентарь</div>
              </div>
            </div>
            <div data-v-497d236d="" class="inventory">
              <div data-v-497d236d="" class="inventory__head">
                <img data-v-497d236d="" src="/img/inventory-profile.svg" alt=""><span data-v-497d236d="">Инвентарь</span>
              </div>
              <div data-v-497d236d="" class="inventory__items">
                <div
                    v-for="item in items"
                    :key="item.id"
                    data-v-6fcbaddf=""
                    class="inventory__item"
                    style="pointer-events: none;opacity: 0.5;"
                >
                  <div v-if="item.status === 0" data-v-6fcbaddf="" class="actions__sale">ОЖИДАЕТ</div>
                  <div v-if="item.status === 1" data-v-6fcbaddf="" class="actions__sale">ПРЕДМЕТ ПРОДАН</div>
                  <div v-else-if="item.status === 2" data-v-6fcbaddf="" class="actions__sale">
                    ОЖИДАЕТ ВЫВОДА
                  </div>
                  <div v-else-if="item.status === 3" data-v-6fcbaddf="" class="actions__sale">ПРЕДМЕТ ВЫВЕДЕН</div>
                  <div data-v-6fcbaddf="" class="circle gray"></div>
                  <div data-v-6fcbaddf="" class="img"><img data-v-6fcbaddf=""
                                                           :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.item.icon_url}/222fx166f`"
                                                           alt=""></div>
                  <div data-v-6fcbaddf="" class="description">
                    <div data-v-6fcbaddf="" class="text">
                      <div data-v-6fcbaddf="" class="name">{{ $root.getItemType(item.item.market_name) }}</div>
                      <div data-v-6fcbaddf="" class="desk">{{ $root.getItemName(item.item.market_name) }}</div>
                    </div>
                    <div data-v-6fcbaddf="" class="info">
                      <div data-v-6fcbaddf="" class="price">{{ item.price }}₽</div>
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
export default {
  data() {
    return {
      user: null,
      items: []
    }
  },
  created() {
    this.$root.isLoading = true

    this.getUser()
  },
  methods: {
    getUser() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": `{getUserById(id: ${this.$route.params.id}) {  id,  username,  avatar,  opened,  bestDrop {    box {      name    },    item {      market_name,      icon_url,      price    }  }}}`}
      ).then(data => {
        this.user = data.getUserById
        this.getItems()

        this.$root.isLoading = false
      }).catch(() => {
        this.$root.isLoading = false
        return this.$router.back()
      })
    },
    getItems() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": `{userInventoryById(id: ${this.$route.params.id}) {  id  item { market_hash_name, market_name, icon_url  }  box {    id    name  }  price status}}`}
      ).then(data => {
        this.items = data.userInventoryById
      })
    },
  }
}
</script>