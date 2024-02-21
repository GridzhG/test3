<template>
  <div data-v-4e693f8f="" class="bust" style="">
    <div data-v-4e693f8f="" class="body">
      <div data-v-4e693f8f="" class="container-bust">
        <div data-v-4e693f8f="" class="title"><span data-v-4e693f8f="">БУСТ</span></div>
        <div data-v-4e693f8f="" class="modes"></div>
        <template v-if="!winItem">
          <div data-v-4e693f8f="" class="holders">
            <div
                v-for="i in maxItems"
                :key="i"
            >
              <div
                  v-if="typeof selected[i - 1] === 'undefined'"
                  data-v-4e693f8f=""
                  id="0"
                  class="holder"
              >
                <div data-v-4e693f8f="" class="place">{{ i }}</div>
                <div data-v-4e693f8f="" class="placeholder">
                  <div data-v-4e693f8f="" class="img"><img data-v-4e693f8f="" src="/img/placeholder.svg" alt=""></div>
                  <div data-v-4e693f8f="" class="placeholder-title"> Добавить предмет</div>
                </div>
              </div>
              <div
                  v-else
                  data-v-4e693f8f=""
                  class="holder"
              >
                <div data-v-4e693f8f="" class="inventory__item">
                  <div data-v-4e693f8f="" class="place">{{ i }}</div>
                  <div data-v-4e693f8f="" class="circle blue"></div>
                  <div data-v-4e693f8f="" class="img">
                    <img data-v-4e693f8f="" alt=""
                         :src="`https://steamcommunity-a.akamaihd.net/economy/image/${selected[i - 1].item.icon_url}/80fx80f`"/>
                  </div>
                  <div data-v-4e693f8f="" class="description">
                    <div data-v-4e693f8f="" class="text">
                      <div data-v-4e693f8f="" class="name">{{
                          $root.getItemType(selected[i - 1].item.market_name)
                        }}
                      </div>
                      <div data-v-4e693f8f="" class="desk">{{
                          $root.getItemName(selected[i - 1].item.market_name)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-v-4e693f8f="" class="indicators">
            <div data-v-4e693f8f="" class="left">
              <div data-v-4e693f8f="" class="indicator__item purple">
                <div data-v-4e693f8f="" class="goods"><span data-v-4e693f8f="">{{ selected.length }}</span><em
                    data-v-4e693f8f=""> / {{ maxItems }}</em>
                </div>
                <div data-v-4e693f8f="" class="span">предметов<br data-v-4e693f8f=""> выбрано</div>
              </div>
              <div data-v-4e693f8f="" class="indicator__item orange">
                <div data-v-4e693f8f="" class="price"> {{ price | num }}₽</div>
                <div data-v-4e693f8f="" class="span">мин 10₽<br data-v-4e693f8f=""> макс 20 000₽</div>
              </div>
            </div>
            <div data-v-4e693f8f="" class="center">
              <div data-v-4e693f8f="" class="badges" v-if="badges.length">
                <div v-for="(badge, i) in badges" :key="i" data-v-4e693f8f=""
                     :class="[getClassBadge(i) ? 'active' : '']" class="badge"></div>
              </div>
              <button data-v-4e693f8f=""
                      :style="[(selected.length >= 3 && !disableButton) ? {opacity: 1, cursor: 'pointer'} : {opacity: '0.1', cursor: 'default'}]"
                      @click="startBoost()">НАЧАТЬ БУСТ
              </button>
            </div>
            <div data-v-4e693f8f="" class="right">
              <div data-v-4e693f8f=""><strong data-v-4e693f8f="">{{ (price / 4) | num }} ≈ {{
                  (price * 4) | num
                }}₽</strong><span data-v-4e693f8f="">получаете скин ценой</span>
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
    </div>
    <div data-v-4e693f8f="" class="container">
      <div data-v-4e693f8f="" class="inventory">
        <div data-v-4e693f8f="" class="head"><img data-v-4e693f8f="" src="/img/inventory.svg" alt=""><span
            data-v-4e693f8f="">Ваш инвентарь</span></div>
        <div data-v-4e693f8f="" class="items">
          <div v-if="!items.length" data-v-4e693f8f="" style="width: 322px;">Пока предметов нет. Откройте свой
            <RouterLink data-v-4e693f8f="" to="/" style="text-decoration: underline;">первый
              кейс!
            </RouterLink>
          </div>
          <div
              v-for="item in items"
              :key="item.id"
              class="item"
              data-v-4e693f8f=""
              :style="[typeof item.selected !== 'undefined' ? {opacity: '0.3'} : '']"
              @click="typeof item.selected !== 'undefined' ? setUnselectedItem(item.id) : setSelectedItem(item.id)"
          >
            <div data-v-4e693f8f="" class="circle" :class="$root.getColor(item.item.rarity)"></div>
            <div data-v-4e693f8f="" class="img">
              <img data-v-4e693f8f="" width="80" height="80"
                   :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.item.icon_url}/80fx80f`" alt=""/>
            </div>
            <div data-v-4e693f8f="" class="description">
              <div data-v-4e693f8f="" class="text">
                <div data-v-4e693f8f="" class="name">{{ $root.getItemType(item.item.market_name) }}</div>
                <div data-v-4e693f8f="" class="desc">{{ $root.getItemName(item.item.market_name) }}</div>
              </div>
              <div data-v-4e693f8f="" class="item_price">{{ item.price | num }}₽</div>
            </div>
          </div>
        </div>
      </div>
      <div data-v-4e693f8f="" class="how-works">
        <div data-v-4e693f8f="" class="title"> Как это работает?</div>
        <div data-v-4e693f8f="" class="blocks">
          <div data-v-4e693f8f="" class="block">
            <div data-v-4e693f8f="" class="img"><img data-v-4e693f8f="" src="/img/block1.svg" alt=""></div>
            <div data-v-4e693f8f="" class="text">
              <div data-v-4e693f8f="" class="number"><img data-v-4e693f8f="" src="/img/01.svg" alt=""></div>
              <div data-v-4e693f8f="" class="title"> Открывай кейсы</div>
              <div data-v-4e693f8f="" class="separator"></div>
              <span data-v-4e693f8f="">Открой несколько кейсов, чтобы получить предметы.</span></div>
          </div>
          <div data-v-4e693f8f="" class="block">
            <div data-v-4e693f8f="" class="img"><img data-v-4e693f8f="" src="/img/block2.svg" alt=""></div>
            <div data-v-4e693f8f="" class="text">
              <div data-v-4e693f8f="" class="number"><img data-v-4e693f8f="" src="/img/02.svg" alt=""></div>
              <div data-v-4e693f8f="" class="title"> Создай контракт</div>
              <div data-v-4e693f8f="" class="separator"></div>
              <span data-v-4e693f8f="">Создай контракт с помощью полученных предметов.</span></div>
          </div>
          <div data-v-4e693f8f="" class="block">
            <div data-v-4e693f8f="" class="img"><img data-v-4e693f8f="" src="/img/block3.svg" alt=""></div>
            <div data-v-4e693f8f="" class="text">
              <div data-v-4e693f8f="" class="number"><img data-v-4e693f8f="" src="/img/03.svg" alt=""></div>
              <div data-v-4e693f8f="" class="title"> Получи скин</div>
              <div data-v-4e693f8f="" class="separator"></div>
              <span data-v-4e693f8f="">Получи рандомный скин из контракта.</span></div>
          </div>
          <div data-v-4e693f8f="" class="block">
            <div data-v-4e693f8f="" class="img"><img data-v-4e693f8f="" src="/img/block4.svg" alt=""></div>
            <div data-v-4e693f8f="" class="text">
              <div data-v-4e693f8f="" class="number"><img data-v-4e693f8f="" src="/img/04.svg" alt=""></div>
              <div data-v-4e693f8f="" class="title"> Enjoy!</div>
              <div data-v-4e693f8f="" class="separator"></div>
              <span data-v-4e693f8f="">Выведи предмет в свой аккаунт Steam или же продай сайту.</span></div>
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
      items: [],
      selected: [],
      price: 0,
      maxItems: 10,
      badges: [],
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

    this.getItems()
    this.addBadges()
  },
  methods: {
    getItems() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": "{userInventoryInGame {  id  item { market_name, icon_url, rarity } price }}"}
      ).then(data => {
        this.items = data.userInventoryInGame

        this.$root.isLoading = false
      })
    },
    setSelectedItem(id) {
      if (this.selected.length === this.maxItems) {
        return this.$root.showNotify('Ошибка', `Максимум ${this.maxItems} предметов`, 'error')
      }

      const index = this.items.findIndex(x => x.id === id)

      if (index > -1) {
        this.items[index].selected = true
        this.selected.push(this.items[index])
        this.price += this.items[index].price

        this.$forceUpdate()
      }
    },
    setUnselectedItem(i) {
      const index = this.items.findIndex(x => x.id === i)

      if (index > -1) {
        const indexSelected = this.selected.findIndex(x => x.id === i)

        if (indexSelected > -1) {
          this.selected.splice(indexSelected, 1)
        }

        delete this.items[index].selected
        this.price -= this.items[index].price

        this.$forceUpdate()
      }
    },
    startBoost() {
      if (this.selected.length < 3) {
        return
      }

      if (this.disableButton) {
        return
      }

      this.disableButton = true

      this.startBadgeAnimation()

      setTimeout(() => {
        this.$root.request(
            'POST',
            '/graphql',
            {
              "query": "mutation createBust($items: [Int!]!) {createBust(items: $items) {id market_name icon_url rarity price}}",
              "variables": {
                "items": Object.values(this.selected).map((item) => {
                  return item.id
                })
              },
              "operationName": "createBust"
            }
        ).then(data => {
          this.$root.playSound('case_reveal')

          this.winItem = data.createBust
          this.selected = []
          this.price = 0
          this.stopBadge()
          this.getItems()

          setTimeout(() => {
            this.$root.getUser()
          }, 500)
        }).catch(e => {
          this.disableButton = false
          this.stopBadge()
          return this.$root.showNotify('Ошибка', e[0].message, 'error')
        })
      }, 1800)
    },
    addBadges() {
      for (let i = 0; i < 12; i++) {
        this.badges.push(false)
      }
    },
    startBadgeAnimation() {
      const t = this
      let i = 0

      setTimeout(function startTimer() {
        t.badges[i] = true
        t.$forceUpdate()

        if (i < 11) {
          i++
          setTimeout(startTimer, 150)
        }
      })
    },
    stopBadge() {
      this.badges = []
      this.addBadges()
    },
    refresh() {
      this.disableButton = false
      this.winItem = null
    },
    getClassBadge(badge) {
      return this.badges[badge]
    },
    async sellItem(id) {
      try {
        await this.$root.sellItems([id])

        this.refresh()

        setTimeout(() => {
          this.getItems()
        }, 100)

        this.$forceUpdate()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>