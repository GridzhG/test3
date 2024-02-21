<template>
  <div data-v-0728769c="" class="upgrade" style="">
    <div data-v-0728769c="" class="wrapper">
      <div data-v-0728769c="" class="title"><span data-v-0728769c="">АПГРЕЙД</span></div>
      <template v-if="!winItem">
        <div data-v-0728769c="" class="upgrade-game">
          <div data-v-0728769c="" class="top">
            <div data-v-0728769c="" class="buttons">
              <button data-v-0728769c="" class="active">
                <span data-v-0728769c="">Скины</span>
              </button>
            </div>
            <div data-v-0728769c="" class="skins-for-upgrade">
              <span data-v-0728769c="">Скин для апгрейда</span>
            </div>
          </div>
          <div data-v-0728769c="" class="game">
            <div data-v-0728769c="" class="run" @click="runUpgrade()">
              <svg data-v-0728769c="" width="39" height="39" viewBox="0 0 39 39" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path data-v-0728769c=""
                      d="M13 34.125V30.875H26V34.125H13ZM13 27.625V24.375H26V27.625H13ZM13 21.125V17.875H26V21.125H13ZM30.875 14.625H8.125L19.5 3.25L30.875 14.625Z"
                      fill="black"></path>
              </svg>
              <span data-v-0728769c="">UPGRADE</span>
            </div>
            <div data-v-0728769c="" class="left">
              <div data-v-0728769c="" class="chance">
              <span data-v-0728769c=""> {{ getChance() }}%<br
                  data-v-0728769c=""> ШАНС </span>
                <img data-v-0728769c="" src="/img/chance-red.svg" alt="">
              </div>
              <div data-v-0728769c="" class="holder" v-if="myItem === null">
                <div data-v-0728769c="" class="select"> Выберите скин<br data-v-0728769c=""> для апгрейда</div>
              </div>
              <div data-v-0728769c="" class="holder" v-else @click="unsetMyItem()" style="cursor: pointer;">
                <img data-v-0728769c="" src="/img/holder-active-1.png" alt="" class="active-bg">
                <div data-v-0728769c="" class="skin"><img data-v-0728769c=""
                                                          :src="`https://steamcommunity-a.akamaihd.net/economy/image/${myItem.item.icon_url}/222fx166f`"
                                                          alt="">
                  <div data-v-0728769c="" class="name">{{ $root.getItemType(myItem.item.market_name) }}</div>
                  <div data-v-0728769c="" class="desk">"{{ $root.getItemType(myItem.item.market_name) }}"</div>
                </div>
              </div>
            </div>
            <div data-v-0728769c="" class="right">
              <div data-v-0728769c="" class="chance">
                <span data-v-0728769c=""> {{ getCoeff() }}x<br data-v-0728769c=""> КОЭФ. </span>
                <img
                    data-v-0728769c="" src="/img/chance-blue.svg" alt="">
              </div>
              <div data-v-0728769c="" class="holder" v-if="siteItem === null">
                <div data-v-0728769c="" class="select"> Выберите скин<br data-v-0728769c=""> для апгрейда</div>
              </div>
              <div data-v-0728769c="" class="holder" v-else @click="unsetSiteItem()" style="cursor: pointer;">
                <img data-v-0728769c="" src="/img/holder-active-1.png" alt="" class="active-bg">
                <div data-v-0728769c="" class="skin"><img data-v-0728769c=""
                                                          :src="`https://steamcommunity-a.akamaihd.net/economy/image/${siteItem.icon_url}/222fx166f`"
                                                          alt="">
                  <div data-v-0728769c="" class="name">{{ $root.getItemType(siteItem.market_name) }}</div>
                  <div data-v-0728769c="" class="desk">"{{ $root.getItemType(siteItem.market_name) }}"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-v-213f2d16="" data-v-0728769c="" class="mobile-upgrade-game">
          <div data-v-213f2d16="" class="container">
            <div data-v-213f2d16="" class="top">
              <div data-v-213f2d16="" class="indicator chance"><em data-v-213f2d16="">0.00%</em><span
                  data-v-213f2d16="">ШАНС</span>
              </div>
              <div data-v-213f2d16="" class="indicator coef"><em data-v-213f2d16="">0x</em><span
                  data-v-213f2d16="">КОЭФ.</span></div>
            </div>
            <div data-v-213f2d16="" class="game">
              <button data-v-213f2d16="" class="run">
                <svg data-v-213f2d16="" width="39" height="39" viewBox="0 0 39 39" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path data-v-213f2d16=""
                        d="M13 34.125V30.875H26V34.125H13ZM13 27.625V24.375H26V27.625H13ZM13 21.125V17.875H26V21.125H13ZM30.875 14.625H8.125L19.5 3.25L30.875 14.625Z"
                        fill="black"></path>
                </svg>
                <span data-v-213f2d16="">UPGRADE</span></button>
              <div data-v-213f2d16="" class="block">
                <div data-v-213f2d16="" class="holder">
                  <div data-v-213f2d16="" class="select">Скин для апгрейда</div>
                </div>
                <div data-v-213f2d16="" class="description"><p data-v-213f2d16="">Выберите предмет<br
                    data-v-213f2d16="">
                  из инвентаря</p></div>
              </div>
              <div data-v-213f2d16="" class="block">
                <div data-v-213f2d16="" class="holder">
                  <div data-v-213f2d16="" class="select">Скин для апгрейда</div>
                </div>
                <div data-v-213f2d16="" class="description"><p data-v-213f2d16="">Выберите предмет<br
                    data-v-213f2d16="">
                  из инвентаря</p></div>
              </div>
            </div>
            <div data-v-213f2d16="" class="buttons">
              <button data-v-213f2d16="" class="primary  purple">Инвентарь</button>
              <button data-v-213f2d16="" class="primary">Скины</button>
            </div>
          </div>
        </div>
      </template>
      <template v-if="winItem">
        <div data-v-4e693f8f="" class="finish-wrapper">
          <div data-v-8e4ea3aa="" data-v-75ba8794="" class="finish"
               :class="$root.getColor(winItem.rarity)">
            <div data-v-8e4ea3aa="" class="skin">
              <div data-v-8e4ea3aa="" class="bg">
                <img data-v-8e4ea3aa="" src="/img/circle-blue.png" alt="">
              </div>
              <div data-v-8e4ea3aa="" class="img">
                <img data-v-8e4ea3aa=""
                     :src="`https://steamcommunity-a.akamaihd.net/economy/image/${winItem.icon_url}/222fx166f`"
                     alt="">
              </div>
            </div>
            <div data-v-8e4ea3aa="" class="name"> {{ winItem.market_name }}</div>
          </div>
        </div>
        <div data-v-4e693f8f="" class="buttons">
          <button data-v-4e693f8f="" class="restart" @click="refresh()">
            <span data-v-4e693f8f="" class="sell">Забрать</span>
          </button>
          <button data-v-4e693f8f="" class="sell" @click="sellItem(winItem.id)">
            <span data-v-4e693f8f="" class="price">Продать за {{ winItem.price }}₽</span>
          </button>
        </div>
      </template>
    </div>
    <div data-v-0728769c="" class="container" v-if="!winItem">
      <div data-v-0728769c="" class="skins">
        <div data-v-0728769c="" class="inventory">
          <div data-v-0728769c="" class="head"><img data-v-0728769c="" src="/img/inventory.svg" alt=""><span
              data-v-0728769c="">Ваш инвентарь</span></div>
          <div data-v-0728769c="" class="items">
            <div v-if="!userItems.length" data-v-0728769c="" style="width: 322px;">
              Пока предметов нет. Откройте свой
              <RouterLink data-v-0728769c="" to="/" style="text-decoration: underline;">первый кейс!</RouterLink>
            </div>
            <div
                v-for="item in userItemsSorting"
                :key="item.id"
                :class="[$root.getColor(item.item.rarity), (myItem !== null && myItem.id === item.id) ? 'selected' : '']"
                @click="[(myItem !== null && myItem.id === item.id) ? unsetMyItem() : setMyItem(item)]"
                data-v-0728769c=""
                class="item gray"
            >
              <div data-v-0728769c="" class="circle gray"></div>
              <div data-v-0728769c="" class="img">
                <img data-v-0728769c=""
                     :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.item.icon_url}/222fx166f`"
                     alt="">
              </div>
              <div data-v-0728769c="" class="description">
                <div data-v-0728769c="" class="text">
                  <div data-v-0728769c="" class="name">{{ $root.getItemType(item.item.market_name) }}</div>
                  <div data-v-0728769c="" class="desk">"{{ $root.getItemName(item.item.market_name) }}"</div>
                </div>
                <div data-v-0728769c="" class="item_price">{{ item.price | num }}₽</div>
              </div>
            </div>
          </div>
        </div>
        <div data-v-0728769c="" class="inventory hide">
          <div data-v-0728769c="" class="head">
            <img data-v-0728769c="" src="/img/skins.svg" alt="">
            <span data-v-0728769c="">Скины</span>
          </div>
          <div @click="setSort()" data-v-0728769c="" class="setSiteFilter">
            <span v-if="sort === 'ASC'" data-v-0728769c="">Показать сначала дорогие</span>
            <span v-if="sort === 'DESC'" data-v-0728769c="">Показать сначала дешёвые</span>
          </div>
          <div data-v-0728769c="" class="items">
            <div class="loader" v-if="$root.loadingItems">
              <div class="sk-chase">
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
              </div>
            </div>
            <template v-else>
              <div
                  v-for="item in items"
                  :key="item.id"
                  :class="[$root.getColor(item.rarity), (siteItem !== null && siteItem.id === item.id) ? 'selected' : '']"
                  @click="[(siteItem !== null && siteItem.id === item.id) ? unsetSiteItem() : setSiteItem(item)]"
                  data-v-0728769c=""
                  class="item gray"
              >
                <div data-v-0728769c="" class="circle gray"></div>
                <div data-v-0728769c="" class="img">
                  <img data-v-0728769c=""
                       :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/222fx166f`" alt="">
                </div>
                <div data-v-0728769c="" class="description">
                  <div data-v-0728769c="" class="text">
                    <div data-v-0728769c="" class="name">{{ $root.getItemType(item.market_name) }}</div>
                    <div data-v-0728769c="" class="desk">"{{ $root.getItemName(item.market_name) }}"</div>
                  </div>
                  <div data-v-0728769c="" class="item_price">{{ item.price | num }}₽</div>
                </div>
              </div>
            </template>
          </div>
          <div data-v-0728769c="" class="upg__thing_bottom">
            <div data-v-0728769c="" class="upg__nav">
              <span data-v-0728769c="" class="upg__nav-prev" @click="setPage('back')"></span>
              <span data-v-0728769c="" class="upg__nav-current">{{ page }}</span>
              <span data-v-0728769c="" class="upg__nav-next" @click="setPage('next')"></span>
              <div data-v-0728769c="" class="upg__thing-pages">
                <span data-v-0728769c="">{{ page }} из {{ pages }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div data-v-0728769c="" class="faq">
        <div data-v-0728769c="" class="faq__title">Как это работает</div>
        <div data-v-0728769c="" class="faq__items" v-for="(item, i) in faq" :key="i">
          <div data-v-0728769c="" class="top" @click="setActiveFaq(i)" :class="[item.active ? 'active' : '']">
            <span data-v-0728769c="" v-html="item.quest"></span>
            <div data-v-0728769c="" class="plus">+</div>
          </div>
          <div data-v-0728769c="" class="answer" v-html="item.answer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userItems: [],
      items: [],
      page: 1,
      sort: 'ASC',
      loadingItems: false,
      pages: 1,
      myItem: null,
      siteItem: null,
      faq: [
        {
          active: false,
          quest: 'Как этим пользоваться?',
          answer: 'Выбери один предмет из своего инвентаря слева, чтобы обновить его и\n' +
              'получить более дорогой.\n' +
              '<br data-v-0728769c=""> Справа выбери предмет который хотел бы получить (используй сортировку для того чтобы\n' +
              'удобно найти нужный предмет).'
        },
        {
          active: false,
          quest: 'От чего зависит будет ли мой апгрейд успешным?',
          answer: 'Вероятность успешного апгрейда зависит от соотношения стоимости твоего скина и желаемого.\n' +
              '<br data-v-0728769c=""> В случае неудачи ты получишь приз дешевле желаемого.'
        },
      ],
      minPrice: 0,
      disableButton: false,
      winItem: null
    }
  },
  created() {
    this.$root.isLoading = true

    if (!this.$cookie.get('token')) {
      this.$root.isLoading = false
      return this.$router.back()
    }

    this.getUserItems()
    this.getItems()
  },
  computed: {
    userItemsSorting() {
      if (this.siteItem !== null && this.myItem === null) {
        return this.userItems.filter(i => (i.price <= this.siteItem.price * 0.75))
      } else if (this.siteItem !== null && this.myItem !== null) {
        return this.userItems.filter(i => (i.price <= this.siteItem.price * 0.75))
      } else {
        return this.userItems
      }
    }
  },
  methods: {
    getUserItems() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": "{userInventoryInGame {  id  item { market_name, icon_url, rarity } price }}"}
      ).then(data => {
        this.userItems = data.userInventoryInGame

        this.$root.isLoading = false
      })
    },
    getItems() {
      this.loadingItems = true

      this.$root.request(
          'POST',
          '/graphql',
          {"query": `{getItems(page: ${this.page}, sort: "${this.sort}", minPrice: ${this.minPrice}) {  items {id market_name icon_url price rarity} pages}}`}
      ).then(data => {
        this.items = data.getItems.items
        this.pages = data.getItems.pages

        this.loadingItems = false
      })
    },
    setSort() {
      if (this.sort === 'DESC') {
        this.sort = 'ASC'
      } else {
        this.sort = 'DESC'
      }

      this.page = 1
      this.getItems()
    },
    setPage(type) {
      let page = this.page

      if (type === 'next') {
        page++
      } else {
        page--
      }

      if (page < 1) {
        page = 1
      }

      if (page > this.pages) {
        return
      }

      this.page = page
      this.getItems()
    },
    setSiteItem(item) {
      if (this.$root.user === null) {
        return
      }

      if (this.myItem !== null) {
        if (((this.myItem.price / item.price) * 100) > 75) {
          return
        }
      }

      this.siteItem = item

      if (this.myItem === null) {
        this.minPrice = item.price * 0.65
      }
    },
    unsetSiteItem() {
      if (this.$root.user === null) {
        return
      }

      this.siteItem = null

      if (this.myItem === null) {
        this.minPrice = 0
      }
    },
    setMyItem(item) {
      if (this.$root.user === null) {
        return
      }

      if (this.siteItem !== null) {
        const price = item.price - (item.price * 0.25)

        if (this.siteItem.price < price) {
          return
        }

        if (((item.price / this.siteItem.price) * 100) > 75) {
          return
        }
      }

      this.myItem = item

      if (this.siteItem === null && this.myItem !== null) {
        this.minPrice = item.price * 1.35
        this.page = 1
        this.getItems()
      }
    },
    unsetMyItem() {
      if (this.$root.user === null) {
        return
      }

      this.myItem = null

      this.minPrice = 0

      if (this.siteItem === null) {
        this.page = 1
        this.getItems()
      }
    },
    setActiveFaq(i) {
      const item = this.faq[i]

      item.active = !item.active

      this.faq[i] = item
    },
    getChance() {
      if (this.myItem !== null && this.siteItem !== null) {
        return (this.myItem.price / this.siteItem.price * 100).toFixed(2)
      }

      return '0.00'
    },
    getCoeff() {
      if (this.myItem !== null && this.siteItem !== null) {
        return (this.siteItem.price / this.myItem.price).toFixed(2)
      }

      return 0
    },
    runUpgrade() {
      if (this.disableButton) {
        return this.$root.showNotify('Ошибка', 'Не так часто', 'error')
      }

      if (this.myItem === null) {
        return this.$root.showNotify('Ошибка', 'Выберите предмет для апгрейда', 'error')
      }

      if (this.siteItem === null) {
        return this.$root.showNotify('Ошибка', 'Выберите предмет для апгрейда', 'error')
      }

      this.$root.request(
          'POST',
          '/graphql',
          {
            "query": "mutation upgrade($myItem: Int!, $winItem: Int!) {upgrade(myItem: $myItem, winItem: $winItem) {id market_name icon_url rarity price}}",
            "variables": {"myItem": this.myItem.id, "winItem": this.siteItem.id},
            "operationName": "upgrade"
          }
      ).then(data => {
        this.$root.playSound('case_reveal')

        this.winItem = data.upgrade

        setTimeout(() => {
          this.myItem = null
          this.siteItem = null
          this.minPrice = 0
          this.page = 1
          this.getItems()
          this.getUserItems()
          this.$root.getUser()
        }, 100)
      }).catch(e => {
        this.disableButton = false
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    },
    refresh() {
      this.winItem = null
    },
    async sellItem(id) {
      try {
        await this.$root.sellItems([id])

        this.refresh()

        setTimeout(() => {
          this.getUserItems()
        }, 100)

        this.$forceUpdate()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>