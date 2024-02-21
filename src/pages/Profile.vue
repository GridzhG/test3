<template>
  <div style="" v-if="$root.user">
    <div data-v-6fcbaddf="" class="profile">
      <div data-v-6fcbaddf="" class="container">
        <div data-v-6fcbaddf="" class="page__title blue"><span data-v-6fcbaddf="">ЛИЧНЫЙ ПРОФИЛЬ</span></div>
        <div data-v-6fcbaddf="" class="wrapper">
          <div data-v-6fcbaddf="" class="left">
            <div data-v-6fcbaddf="" class="profile">
              <div data-v-6fcbaddf="" class="user">
                <div data-v-6fcbaddf="" class="avatar">
                  <img data-v-6fcbaddf="" :src="$root.user.avatar" alt=""></div>
                <div data-v-6fcbaddf="" class="text">
                  <div data-v-6fcbaddf="" class="nickname">{{ $root.user.username }}</div>
                  <p data-v-6fcbaddf="">ID: {{ $root.user.id }}</p>
                  <div data-v-6fcbaddf="" class="balance"><span data-v-6fcbaddf="">{{
                      $root.user.balance | num
                    }}₽</span>
                    <button data-v-6fcbaddf="" @click="$root.$emit('showDepositModal')" class="add">+</button>
                  </div>
                  <div data-v-6fcbaddf="">
                    <button @click="$root.$emit('showPromocodeModal')" data-v-6fcbaddf="">Ввести Промокод</button>
                  </div>
                </div>
              </div>
              <div data-v-6fcbaddf="" class="stats">
                <div data-v-6fcbaddf="" class="stat">
                  <div data-v-6fcbaddf="" class="img"><img data-v-6fcbaddf="" src="/img/stat1.svg" alt=""></div>
                  <div data-v-6fcbaddf="" class="text"><strong data-v-6fcbaddf="">{{ $root.user.opened | num }}</strong><span
                      data-v-6fcbaddf="">кейсов открыто</span>
                  </div>
                </div>
                <div data-v-6fcbaddf="" class="stat">
                  <div data-v-6fcbaddf="" class="img"><img data-v-6fcbaddf="" src="/img/stat3.svg" alt=""></div>
                  <div data-v-6fcbaddf="" class="text"><strong data-v-6fcbaddf="">{{
                      $root.user.contracts | num
                    }}</strong><span data-v-6fcbaddf="">бустов</span>
                  </div>
                </div>
                <div data-v-6fcbaddf="" class="stat">
                  <div data-v-6fcbaddf="" class="img"><img data-v-6fcbaddf="" src="/img/stat3.svg" alt=""></div>
                  <div data-v-6fcbaddf="" class="text"><strong data-v-6fcbaddf="">{{
                      $root.user.upgrades | num
                    }}</strong><span data-v-6fcbaddf="">апгрейдов</span>
                  </div>
                </div>
                <div data-v-6fcbaddf="" class="stat">
                  <div data-v-6fcbaddf="" class="img"><img data-v-6fcbaddf="" src="/img/stat2.svg" alt=""></div>
                  <div data-v-6fcbaddf="" class="text">
                    <strong v-if="$root.user.bestDrop" data-v-6fcbaddf="">{{ $root.user.bestDrop.box.name }}</strong>
                    <span data-v-6fcbaddf="">лучший дроп</span>
                  </div>
                </div>
              </div>
            </div>
            <div data-v-6fcbaddf="" class="profile" style="margin-top: 10px;display: block;">
              <div data-v-6fcbaddf="" class="input" style="margin-bottom: 22px;margin-top: 22px;">
                <label data-v-6fcbaddf="" for=""
                       style="font-size: 17px;line-height: 20px;margin-bottom: 18px;color: #4d4c5a;display: block;">Ссылка
                  на обмен (<a :href="`https://steamcommunity.com/profiles/${$root.user.steamId}/tradeoffers/privacy`"
                               target="_blank">Узнать
                    мою ссылку</a>)</label>
                <div data-v-6fcbaddf="" class="input__body"
                     style="background: #171627;border-radius: 7px;display: flex;position: relative;align-items: center;">
                  <input v-model="$root.user.trade_url"
                         style="flex-grow: 1;overflow: hidden;background: 0 0;outline: none;border: none;padding: 20px 22px;"
                         data-v-6fcbaddf="" type="text">
                  <button data-v-6fcbaddf="" class="inv_sell_rub"
                          @click="saveLink()"
                          style="background: #009f40;border-radius: 5px;font-weight: 500;color: #fff;padding: 10px 16px;margin-right: 8px;">
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
            <div data-v-6fcbaddf="" class="wrapper__tabs">
              <div data-v-6fcbaddf="" class="tabs">
                <div data-v-6fcbaddf="" class="tab active"> Инвентарь</div>
              </div>
            </div>
            <div data-v-6fcbaddf="" class="inventory">
              <div data-v-6fcbaddf="" class="inventory__head">
                <img data-v-6fcbaddf="" src="/img/inventory-profile.svg" alt="">
                <span data-v-6fcbaddf="">Инвентарь</span>
                <div data-v-6fcbaddf="" class="inv_btn">
                  <button @click="sellAllItems()" data-v-6fcbaddf="" class="inv_sell_rub">Продать всё за
                    {{ getAllPrice() | num }} ₽
                  </button>
                </div>
              </div>
              <div data-v-6fcbaddf="" class="inventory__items">
                <div
                    v-for="(item, i) in items"
                    :key="item.id"
                    data-v-6fcbaddf=""
                    class="inventory__item"
                    :style="(item.status > 0 && !(item.status === 2 && item.trade_id !== null)) ? 'pointer-events: none;opacity: 0.5;' : ''"
                >
                  <div data-v-6fcbaddf="" class="actions"
                       v-if="item.status === 0 && typeof disableButtons[i] === 'undefined'">
                    <button data-v-6fcbaddf="" @click="withdrawItem(item.id)">
                      <svg data-v-6fcbaddf="" width="15" height="15" viewBox="0 0 15 15" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path data-v-6fcbaddf=""
                              d="M7.49981 10.0001C7.35377 10.0003 7.21225 9.94948 7.09981 9.8563L3.34981 6.7313C3.22217 6.62521 3.14191 6.47277 3.12667 6.3075C3.11143 6.14224 3.16247 5.97769 3.26856 5.85005C3.37464 5.72241 3.52709 5.64215 3.69235 5.62691C3.85762 5.61167 4.02217 5.66271 4.14981 5.7688L7.49981 8.5688L10.8498 5.8688C10.9137 5.81688 10.9873 5.77811 11.0663 5.75472C11.1452 5.73132 11.228 5.72377 11.3099 5.73248C11.3918 5.74119 11.4712 5.766 11.5434 5.80548C11.6157 5.84497 11.6795 5.89835 11.7311 5.96255C11.7883 6.02681 11.8316 6.10221 11.8584 6.184C11.8851 6.2658 11.8947 6.35224 11.8865 6.4379C11.8783 6.52356 11.8525 6.60661 11.8107 6.68183C11.7688 6.75706 11.712 6.82283 11.6436 6.87505L7.89356 9.8938C7.77788 9.97225 7.63924 10.0097 7.49981 10.0001Z"
                              fill="#00A3FF"></path>
                      </svg>
                      <span data-v-6fcbaddf="">ВЫВЕСТИ</span>
                    </button>
                    <button data-v-6fcbaddf="" @click="sellItem(item.id)">
                      <svg data-v-6fcbaddf="" width="15" height="15" viewBox="0 0 15 15" fill="none"
                           xmlns="http://www.w3.org/2000/svg">
                        <path data-v-6fcbaddf=""
                              d="M1.875 3.28127C1.75068 3.28127 1.63145 3.33066 1.54354 3.41856C1.45564 3.50647 1.40625 3.6257 1.40625 3.75002C1.40625 3.87434 1.45564 3.99357 1.54354 4.08148C1.63145 4.16938 1.75068 4.21877 1.875 4.21877H2.91562L4.14562 9.14065C4.25016 9.55783 4.62375 9.84377 5.05359 9.84377H10.8989C11.3222 9.84377 11.6817 9.56252 11.7928 9.15471L13.0078 4.68752H12.0262L10.8984 8.90627H5.05312L3.82359 3.98439C3.7728 3.78247 3.65572 3.60343 3.4911 3.47595C3.32648 3.34846 3.12383 3.27991 2.91562 3.28127H1.875ZM10.3125 9.84377C9.54141 9.84377 8.90625 10.4789 8.90625 11.25C8.90625 12.0211 9.54141 12.6563 10.3125 12.6563C11.0836 12.6563 11.7188 12.0211 11.7188 11.25C11.7188 10.4789 11.0836 9.84377 10.3125 9.84377ZM6.09375 9.84377C5.32266 9.84377 4.6875 10.4789 4.6875 11.25C4.6875 12.0211 5.32266 12.6563 6.09375 12.6563C6.86484 12.6563 7.5 12.0211 7.5 11.25C7.5 10.4789 6.86484 9.84377 6.09375 9.84377ZM7.5 3.28127V5.62502H6.09375L7.96875 7.50002L9.84375 5.62502H8.4375V3.28127H7.5ZM6.09375 10.7813C6.35813 10.7813 6.5625 10.9856 6.5625 11.25C6.5625 11.5144 6.35813 11.7188 6.09375 11.7188C5.82937 11.7188 5.625 11.5144 5.625 11.25C5.625 10.9856 5.82937 10.7813 6.09375 10.7813ZM10.3125 10.7813C10.5769 10.7813 10.7812 10.9856 10.7812 11.25C10.7812 11.5144 10.5769 11.7188 10.3125 11.7188C10.0481 11.7188 9.84375 11.5144 9.84375 11.25C9.84375 10.9856 10.0481 10.7813 10.3125 10.7813Z"
                              fill="#FF5C00"></path>
                      </svg>
                      <span data-v-6fcbaddf="">ПРОДАТЬ</span></button>
                  </div>
                  <div v-else-if="item.status === 1" data-v-6fcbaddf="" class="actions__sale">ПРЕДМЕТ ПРОДАН</div>
                  <div v-else-if="item.status === 2 && item.trade_id === null" data-v-6fcbaddf="" class="actions__sale">
                    ОЖИДАЕТ ПРОДАВЦА
                  </div>
                  <a style="cursor: pointer;" @click="openTrade(item.trade_id)"
                     v-else-if="item.status === 2 && item.trade_id !== null" data-v-6fcbaddf="" class="actions__sale">ПОЛУЧИТЬ</a>
                  <div v-else-if="item.status === 3" data-v-6fcbaddf="" class="actions__sale">ПРЕДМЕТ ВЫВЕДЕН</div>
                  <div v-else-if="item.status === 4" data-v-6fcbaddf="" class="actions__sale">ПРЕДМЕТ ИСПОЛЬЗОВАН В
                    АПГРЕЙДЕ
                  </div>
                  <div v-else-if="item.status === 5" data-v-6fcbaddf="" class="actions__sale">ПРЕДМЕТ ИСПОЛЬЗОВАН В
                    БУСТЕ
                  </div>
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
          <div data-v-6fcbaddf="" class="right">
            <div data-v-6fcbaddf="" class="referal"><h3 data-v-6fcbaddf="">Реферальная система</h3>
              <div data-v-6fcbaddf="" class="separator"></div>
              <div data-v-6fcbaddf="" class="input"><label data-v-6fcbaddf="" for="">Ваш реферальный код</label>
                <div data-v-6fcbaddf="" class="input__body"><input ref="refLinkRef" data-v-6fcbaddf=""
                                                                   :value="domain + '/r/' + $root.user.referral_code"
                                                                   type="text" readonly="readonly">
                  <button data-v-6fcbaddf="" @click="makeTextSelection"><img data-v-6fcbaddf="" src="/img/copy.svg"
                                                                             alt=""></button>
                </div>
              </div>
              <div data-v-6fcbaddf="" class="table"><span data-v-6fcbaddf="">Уровни</span>
                <div data-v-6fcbaddf="" class="table__head">
                  <div data-v-6fcbaddf="">LVL</div>
                  <div data-v-6fcbaddf="">Депозитов</div>
                  <div data-v-6fcbaddf="">Ваш бонус</div>
                  <div data-v-6fcbaddf="">Реферальный бонус</div>
                </div>
                <div data-v-6fcbaddf="" class="table__items">
                  <div data-v-6fcbaddf="" class="item three">
                    <div data-v-6fcbaddf="">
                      <div data-v-6fcbaddf="" class="lvl"> 5</div>
                    </div>
                    <div data-v-6fcbaddf="" class="deposits"> 30000₽</div>
                    <div data-v-6fcbaddf="" class="bonus">25%</div>
                    <div data-v-6fcbaddf="">+ 5% к депозиту</div>
                  </div>
                  <div data-v-6fcbaddf="" class="item two">
                    <div data-v-6fcbaddf="">
                      <div data-v-6fcbaddf="" class="lvl"> 4</div>
                    </div>
                    <div data-v-6fcbaddf="" class="deposits"> 10000₽</div>
                    <div data-v-6fcbaddf="" class="bonus">20%</div>
                    <div data-v-6fcbaddf="">+ 5% к депозиту</div>
                  </div>
                  <div data-v-6fcbaddf="" class="item first">
                    <div data-v-6fcbaddf="">
                      <div data-v-6fcbaddf="" class="lvl"> 3</div>
                    </div>
                    <div data-v-6fcbaddf="" class="deposits"> 1000₽</div>
                    <div data-v-6fcbaddf="" class="bonus">15%</div>
                    <div data-v-6fcbaddf="">+ 5% к депозиту</div>
                  </div>
                  <div data-v-6fcbaddf="" class="item">
                    <div data-v-6fcbaddf="">
                      <div data-v-6fcbaddf="" class="lvl"> 2</div>
                    </div>
                    <div data-v-6fcbaddf="" class="deposits"> 500₽</div>
                    <div data-v-6fcbaddf="" class="bonus">10%</div>
                    <div data-v-6fcbaddf="">+ 5% к депозиту</div>
                  </div>
                  <div data-v-6fcbaddf="" class="item">
                    <div data-v-6fcbaddf="">
                      <div data-v-6fcbaddf="" class="lvl"> 1</div>
                    </div>
                    <div data-v-6fcbaddf="" class="deposits"> 0₽</div>
                    <div data-v-6fcbaddf="" class="bonus">5%</div>
                    <div data-v-6fcbaddf="">+ 5% к депозиту</div>
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
      items: [],
      disableButtons: {},
      disabledSellItems: false,
      domain: ''
    }
  },
  created() {
    this.domain = window.location.protocol + '//' + window.location.hostname;

    this.$root.isLoading = true

    if (!this.$cookie.get('token')) {
      this.$root.isLoading = false
      return this.$router.back()
    }

    this.getItems()
  },
  methods: {
    getItems() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": "{userInventory {  id  item { market_hash_name, market_name, icon_url  }  box {    id    name  }  price status trade_id}}"}
      ).then(data => {
        this.items = data.userInventory

        this.$root.isLoading = false
      })
    },
    async sellItem(id) {
      try {
        await this.$root.sellItems([id])

        const index = this.items.findIndex(x => x.id === id)

        if (index > -1) {
          this.items[index].status = 1
        }

        this.$forceUpdate()
      } catch (e) {
        console.log(e)
      }
    },
    async withdrawItem(id) {
      const itemIndex = this.items.findIndex(x => x.id === id)

      if (typeof this.disableButtons[itemIndex] > -1) {
        return this.$root.showNotify('Ошибка', 'Не так часто', 'error')
      }

      this.disableButtons[itemIndex] = 1
      this.$forceUpdate()

      this.$root.showNotify('Оповещение', 'Запрос на покупку отправлен', 'warning')

      this.$root.request(
          'POST',
          '/graphql',
          {
            "query": "mutation withdrawItem($id: Int!) {userInventoryWithdrawItem(id: $id)}",
            "variables": {"id": id},
            "operationName": "withdrawItem"
          }
      ).then(() => {
        this.$root.showNotify('Успешно', 'Заявка на вывод создана', 'success')
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')

        delete this.disableButtons[itemIndex]
        this.$forceUpdate()
      })
    },
    makeTextSelection() {
      const el = this.$refs['refLinkRef'];
      el.select();
      document.execCommand('copy');

      this.$root.showNotify('success', 'Реферальная ссылка скопирована в буфер обмена', 'success');
    },
    async openTrade(tradeId) {
      let width = 860;
      let height = 500;
      let left = (screen.width / 2) - (width / 2);
      let top = (screen.height / 2) - (height / 2);
      let windowOptions = `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`;
      let type = 'auth';

      window.open(`//steamcommunity.com/tradeoffer/${tradeId}`, type, windowOptions);
    },
    getAllPrice() {
      let price = 0

      for (const item of this.items) {
        if (item.status === 0) {
          price += item.price
        }
      }

      return price
    },
    async sellAllItems() {
      if (this.disabledSellItems) {
        return this.$root.showNotify('Ошибка', 'Не так часто', 'error')
      }

      if (await this.getAllPrice() <= 0) {
        return this.$root.showNotify('Ошибка', 'Нет предметов на продажу', 'error')
      }

      this.$root.showNotify('Оповещение', 'Идет продажа', 'warning')

      this.disabledSellItems = true

      const ids = []

      for (const item of this.items) {
        if (item.status === 0) {
          ids.push(item.id)
        }
      }

      try {
        await this.$root.sellItems(ids)

        for (const id of ids) {
          const index = this.items.findIndex(x => x.id === id)

          if (index > -1) {
            this.items[index].status = 1
          }
        }

        this.disabledSellItems = false
        this.$forceUpdate()
      } catch (e) {
        this.disabledSellItems = false

        console.log(e)
      }
    },
    saveLink() {
      this.$root.request(
          'POST',
          '/graphql',
          {
            "query": "mutation setTradeLink($url: String!) {setTradeLink(url: $url)}",
            "variables": {"url": this.$root.user.trade_url},
            "operationName": "setTradeLink"
          }
      ).then(() => {
        this.$root.showNotify('Успешно', 'Ссылка на обмен сохранена', 'success')
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    }
  },
  socket: {
    events: {
      updateItemStatus(data) {
        if (this.$root.user !== null && parseInt(this.$root.user.id) === parseInt(data.user_id)) {
          const index = this.items.findIndex(x => x.id === parseInt(data.id))

          if (index > -1) {
            this.items[index].status = data.status
            this.items[index].trade_id = data.trade_id
          }
        }
      }
    }
  }
}
</script>