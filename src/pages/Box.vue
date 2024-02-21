<template>
  <div data-v-75ba8794="" style="" v-if="box">
    <div data-v-75ba8794="" class="open-case">
      <div data-v-75ba8794="" class="container">
        <div data-v-75ba8794="" class="case">
          <div data-v-75ba8794="" class="page__title blue"><span data-v-75ba8794="">{{ box.name }}</span></div><!---->
          <div v-if="state === 'default'" data-v-75ba8794="" class="case__body">
            <div data-v-75ba8794="" class="img"><img data-v-75ba8794="" alt="" :src="box.image">
            </div>
            <div data-v-75ba8794="" class="x-title">Выберите множитель</div>
            <div data-v-75ba8794="" class="x-es">
              <input data-v-75ba8794="" type="radio" value="1" :checked="opened === 1" @click="opened = 1" name="x"
                     id="x1">
              <label data-v-75ba8794="" for="x1" class="x">x1</label>
              <input data-v-75ba8794="" type="radio" value="2" :checked="opened === 2" @click="opened = 2" name="x"
                     id="x2">
              <label data-v-75ba8794="" for="x2" class="x">x2</label>
              <input data-v-75ba8794="" type="radio" value="3" :checked="opened === 3" @click="opened = 3" name="x"
                     id="x3">
              <label data-v-75ba8794="" for="x3" class="x">x3</label>
              <input data-v-75ba8794="" type="radio" value="4" :checked="opened === 4" @click="opened = 4" name="x"
                     id="x4">
              <label data-v-75ba8794="" for="x4" class="x">x4</label>
              <input data-v-75ba8794="" type="radio" value="5" :checked="opened === 5" @click="opened = 5" name="x"
                     id="x5">
              <label data-v-75ba8794="" for="x5" class="x">x5</label>
              <input data-v-75ba8794="" type="radio" value="10" :checked="opened === 10" @click="opened = 10" name="x"
                     id="x10">
              <label data-v-75ba8794="" for="x10" class="x">x10</label>
            </div>
            <div data-v-75ba8794="" class="buttons">
              <button data-v-75ba8794="" class="open" @click="open('default')"><span data-v-75ba8794="">Открыть</span>
              </button>
              <button data-v-75ba8794="" class="buy"><span data-v-75ba8794="">{{ (box.price * opened) | num }} ₽</span>
              </button>
              <button data-v-75ba8794="" class="fast" @click="open('fast')"><span
                  data-v-75ba8794="">Открыть быстро</span></button>
            </div>
          </div>
          <div v-else-if="state === 'open'" data-v-75ba8794="" class="roulette">
            <div data-v-75ba8794="" class="roulette-wrapper">
              <div v-for="(i, l) in opened" :key="l" data-v-1e8773e4="" data-v-75ba8794="" class="roulette-item">
                <div data-v-1e8773e4="" class="arrow-top">
                  <svg data-v-1e8773e4="" width="39" height="33" viewBox="0 0 39 33" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path data-v-1e8773e4="" d="M6.94263 4.25L19.5 26L32.0574 4.25H6.94263Z"
                          stroke="url(#paint0_linear)" stroke-width="7"></path>
                    <defs data-v-1e8773e4="">
                      <linearGradient data-v-1e8773e4="" id="paint0_linear" x1="19.5" y1="33" x2="19.5" y2="-57.7031"
                                      gradientUnits="userSpaceOnUse">
                        <stop data-v-1e8773e4="" stop-color="#FFB800"></stop>
                        <stop data-v-1e8773e4="" offset="1" stop-color="#FFA800"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div data-v-1e8773e4="" class="agile d-flex roulette-items agile--no-nav-buttons disabled">
                  <div class="agile__list">
                    <div class="agile__track"
                         id="roulette"
                         style="transform: translate(0px); transition: transform 7000ms ease 0s;">
                      <div class="agile__slides agile__slides--cloned">
                        <div v-for="(item, o) in rouletteItems[l]" :key="o" data-v-1e8773e4=""
                             class="skin__item agile__slide"
                             style="transition: none 0s ease 0s;transform: none;width: 181.667px;"
                             :class="$root.getColor(item.rarity)" :data-current="[o === 50 ? 1 : 0]">
                          <div data-v-1e8773e4="" class="dots"></div>
                          <div data-v-1e8773e4="" class="img">
                            <div data-v-1e8773e4="" class="bg">
                              <svg data-v-1e8773e4="" width="50" height="58" viewBox="0 0 50 58" fill="none"
                                   xmlns="http://www.w3.org/2000/svg">
                                <path data-v-1e8773e4=""
                                      d="M25.75 2.70096L25 2.26795L24.25 2.70096L2.59937 15.201L1.84937 15.634V16.5V41.5V42.366L2.59937 42.799L24.25 55.299L25 55.7321L25.75 55.299L47.4006 42.799L48.1506 42.366V41.5V16.5V15.634L47.4006 15.201L25.75 2.70096Z"
                                      stroke="#00A3FF" stroke-width="3"></path>
                              </svg>
                            </div>
                            <div data-v-1e8773e4="" class="skin"><img data-v-1e8773e4=""
                                                                      :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/222fx166f`"
                                                                      alt=""></div>
                          </div>
                          <div data-v-1e8773e4="" class="info">
                            <div data-v-1e8773e4="" class="title">{{ $root.getItemType(item.market_name) }}</div>
                            <div data-v-1e8773e4="" class="name">{{ $root.getItemName(item.market_name) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button data-v-75ba8794="" class="opening"> ОТКРЫТИЕ...</button>
          </div>
          <div v-else-if="state === 'opened'" data-v-75ba8794="" class="finished one">
            <div data-v-75ba8794="" class="finish-wrapper">
              <div v-for="(item) in winItems" :key="item.id" data-v-8e4ea3aa="" data-v-75ba8794="" class="finish" :class="$root.getColor(item.rarity)">
                <div data-v-8e4ea3aa="" class="skin">
                  <div data-v-8e4ea3aa="" class="bg">
                    <img data-v-8e4ea3aa="" :src="`/img/circle-${$root.getColor(item.rarity)}.png`" alt="">
                  </div>
                  <div data-v-8e4ea3aa="" class="img">
                    <img data-v-8e4ea3aa=""
                         :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/222fx166f`" alt="">
                  </div>
                </div>
                <div data-v-8e4ea3aa="" class="name"> {{ item.market_name }}</div>
                <template v-if="winItems.length > 1">
                  <button data-v-8e4ea3aa="" class="sell" v-if="typeof selledItems[item.id] === 'undefined'" @click="sellItem(item.id)">
                    <span data-v-8e4ea3aa="">Продать за</span>
                    <em data-v-8e4ea3aa="" class="price">
                      <span data-v-8e4ea3aa="">{{ item.price | num }} ₽</span>
                    </em>
                  </button>
                </template>
              </div>
            </div>
            <div data-v-75ba8794="" class="buttons">
              <button data-v-75ba8794="" class="restart" @click="refresh()">
                <span data-v-75ba8794="">Попробывать еще раз</span>
              </button>
              <button data-v-75ba8794="" class="sell" @click="sellAllItems()">
                <em data-v-75ba8794="">Продать за</em>
                <span data-v-75ba8794="" class="price">
                  <span data-v-75ba8794="">{{ getAllPrice() | num }} ₽</span>
                </span>
              </button>
            </div>
          </div>
          <div data-v-75ba8794="" class="case__body_includes">
            <div data-v-75ba8794="" class="page__title blue"><span data-v-75ba8794="">Содержимое кейса</span></div>
            <div data-v-75ba8794="" class="case__items">
              <div v-for="item in items" :key="item.id" data-v-75ba8794="" class="skin__item"
                   :class="$root.getColor(item.rarity)">
                <div data-v-75ba8794="" class="dots"></div>
                <div data-v-75ba8794="" class="img">
                  <div data-v-75ba8794="" class="bg">
                    <svg data-v-75ba8794="" width="50" height="58" viewBox="0 0 50 58" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path data-v-75ba8794=""
                            d="M25.75 2.70096L25 2.26795L24.25 2.70096L2.59937 15.201L1.84937 15.634V16.5V41.5V42.366L2.59937 42.799L24.25 55.299L25 55.7321L25.75 55.299L47.4006 42.799L48.1506 42.366V41.5V16.5V15.634L47.4006 15.201L25.75 2.70096Z"
                            stroke="#00A3FF" stroke-width="3"></path>
                    </svg>
                  </div>
                  <div data-v-75ba8794="" class="skin"><img data-v-75ba8794=""
                                                            :src="`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}/222fx166f`"
                                                            alt=""></div>
                </div>
                <div data-v-75ba8794="" class="info">
                  <div data-v-75ba8794="" class="title">{{ $root.getItemType(item.market_name) }}</div>
                  <div data-v-75ba8794="" class="name">{{ $root.getItemName(item.market_name) }}
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
import {randomInteger} from "../utils";

export default {
  data() {
    return {
      box: null,
      items: [],
      styles: ['consumer', 'industrial', 'mil-spec', 'restricted', 'classified', 'covert', '★'],
      opened: 1,
      buttonDisabled: false,
      rouletteItems: [],
      state: 'default',
      winItems: [],
      selledItems: {}
    }
  },
  created() {
    this.$root.isLoading = true

    this.getBox()
  },
  methods: {
    getBox() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": `{casesGetByUrl(  id: "${this.$route.params.url}") {  id,  name,  image,  old_price,  price,  opened,  max_opened,  category {    id,    name,    sorting  },  items {    id,    market_hash_name,    market_name,    icon_url,    price,    exterior,    rarity,    color  }}}`}
      ).then(data => {
        this.box = data.casesGetByUrl

        const itemStyles = []

        for (const item of data.casesGetByUrl.items) {
          const style = this.$root.getStyleItem(item.rarity)

          if (typeof itemStyles[style] === 'undefined') {
            itemStyles[style] = []
          }

          itemStyles[style].push(item)
        }

        for (const style of this.styles) {
          if (typeof itemStyles[style] !== 'undefined') {
            for (const item of itemStyles[style]) {
              this.items.push(item)
            }
          }
        }

        this.setItems()

        this.$root.isLoading = false
      }).catch(() => {
        this.$router.back()
      })
    },
    open(type) {
      if (this.buttonDisabled) {
        return alert('Не так часто')
      }

      this.$root.request(
          'POST',
          '/graphql',
          {
            "query": "mutation openCase($id: Int!, $opened: Int!) {casesOpen(id: $id, opened: $opened) {  id, market_hash_name, market_name, rarity,  icon_url, price}}",
            "variables": {"id": this.box.id, "opened": this.opened},
            "operationName": "openCase"
          }
      ).then(data => {
        if (type === 'default') {
          this.$root.playSound('case_open')
        }

        this.winItems = data.casesOpen

        this.$root.getUser();

        this.setRouletteItems(this.winItems, this.opened)

        if (type === 'default') {
          this.state = 'open'

          setTimeout(() => {
            [].forEach.call(document.querySelectorAll('#roulette'), function (el) {
              const speed = 7;
              const setLeft = el.querySelector('.skin__item[data-current="1"]').offsetLeft - 260 + randomInteger(1, 100)
              el.style.transition = 'all ' + speed + 's ease-in-out';
              el.style.transform = 'translateX(-' + setLeft + 'px)';
            });
          }, 100)

          setTimeout(() => {
            this.$root.playSound('case_reveal')

            this.state = 'opened'
          }, 7500)
        } else {
          this.$root.playSound('case_reveal')

          this.state = 'opened'
        }
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    },
    setItems() {
      for (let l = 0; l < 10; l++) {
        this.rouletteItems[l] = []

        for (let i = 0; i < 70; i++) {
          this.rouletteItems[l].push(this.items[randomInteger(0, this.items.length - 1)])
        }
      }
    },
    setRouletteItems(items, openedBoxes) {
      for (let l = 0; l < openedBoxes; l++) {
        this.rouletteItems[l][50] = items[l]
      }
    },
    getAllPrice() {
      let price = 0

      for (const item of this.winItems) {
        price += item.price
      }

      return price
    },
    refresh() {
      this.opened = 1
      this.buttonDisabled = false
      this.state = 'default'
      this.rouletteItems = []
      this.winItems = []
      this.selledItems = {}
      this.setItems()
    },
    async sellAllItems() {
      let ids = []

      for (const item of this.winItems) {
        ids.push(item.id)
      }

      await this.$root.sellItems(ids)

      this.refresh()
    },
    async sellItem(id) {
      try {
        await this.$root.sellItems([id])

        this.selledItems[id] = 1
        this.$forceUpdate()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>