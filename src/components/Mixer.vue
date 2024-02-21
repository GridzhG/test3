<template>
  <div data-v-0bca687a="" class="mixer">
    <div data-v-0bca687a="" class="container">
      <div data-v-0bca687a="" class="mixer__body">
        <div data-v-0bca687a="" class="agile d-flex mixes agile--no-nav-buttons disabled">
          <div class="agile__list">
            <div class="agile__track" style="transform: translate(0px); transition: transform 1000ms ease 0s;">
              <div class="agile__slides agile__slides--regular">
                <div data-v-0bca687a=""
                     v-for="giveaway in giveaways"
                     :key="giveaway.id"
                     style="max-width: 33.3333%; transition: none 0s ease 0s; transform: none; width: 284.667px;"
                     class="agile__slide agile__slide--current agile__slide--active">
                  <div v-if="typeof timeToOpenHtml !== null" data-v-0bca687a="" class="mixes__item red">
                    <div data-v-0bca687a="" class="skin">
                      <div data-v-0bca687a="" class="image">
                        <img data-v-0bca687a="" :src="`https://steamcommunity-a.akamaihd.net/economy/image/${giveaway.item.icon_url}/80fx80f`" alt="">
                      </div>
                      <div data-v-0bca687a="" class="name"> {{ giveaway.item.market_name }}</div>
                    </div>
                    <div data-v-0bca687a="" class="selecting-blocks">
                      <div data-v-0bca687a="" class="left-top"></div>
                      <div data-v-0bca687a="" class="right-top"></div>
                      <div data-v-0bca687a="" class="left-bottom"></div>
                      <div data-v-0bca687a="" class="right-bottom"></div>
                    </div><!---->
                    <div data-v-0bca687a="" class="description">
                      <div data-v-0bca687a="" class="title">
                        <svg data-v-0bca687a="" width="13" height="13" viewBox="0 0 13 13" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                          <path data-v-0bca687a=""
                                d="M2.93543 8.00936L1.96693 12.2024C1.93694 12.3293 1.94594 12.4624 1.99276 12.5842C2.03958 12.7059 2.12205 12.8107 2.22938 12.8849C2.33671 12.9591 2.46393 12.9992 2.59441 13C2.72489 13.0008 2.85258 12.9622 2.96078 12.8893L6.50005 10.5302L10.0393 12.8893C10.15 12.9628 10.2806 13.0006 10.4135 12.9977C10.5464 12.9948 10.6751 12.9513 10.7825 12.873C10.8899 12.7947 10.9708 12.6854 11.0142 12.5598C11.0576 12.4342 11.0615 12.2984 11.0254 12.1705L9.83652 8.01131L12.7849 5.35852C12.8794 5.27351 12.9468 5.16269 12.9789 5.03977C13.011 4.91684 13.0064 4.78721 12.9656 4.66689C12.9248 4.54657 12.8496 4.44085 12.7493 4.3628C12.6491 4.28475 12.5281 4.23779 12.4014 4.22774L8.69577 3.9327L7.09221 0.38373C7.04108 0.269453 6.95796 0.172413 6.85288 0.104323C6.74781 0.0362318 6.62527 0 6.50005 0C6.37484 0 6.2523 0.0362318 6.14723 0.104323C6.04215 0.172413 5.95903 0.269453 5.9079 0.38373L4.30434 3.9327L0.598671 4.22709C0.474166 4.23695 0.355139 4.28247 0.255829 4.35819C0.15652 4.43391 0.0811329 4.53664 0.0386878 4.65408C-0.00375727 4.77152 -0.0114634 4.89869 0.0164914 5.0204C0.0444462 5.1421 0.106878 5.25317 0.196318 5.34033L2.93543 8.00936ZM4.78989 5.198C4.90592 5.18887 5.01734 5.14869 5.11249 5.08169C5.20764 5.01468 5.28301 4.92332 5.3307 4.81718L6.50005 2.23002L7.66941 4.81718C7.7171 4.92332 7.79247 5.01468 7.88762 5.08169C7.98277 5.14869 8.09419 5.18887 8.21021 5.198L10.792 5.40271L8.66587 7.31595C8.48127 7.48232 8.40781 7.73837 8.47542 7.97752L9.28987 10.8272L6.86146 9.20838C6.75487 9.13686 6.6294 9.09866 6.50103 9.09866C6.37266 9.09866 6.24719 9.13686 6.1406 9.20838L3.60299 10.9L4.28549 7.94568C4.31052 7.83702 4.30716 7.72375 4.27574 7.61677C4.24432 7.50978 4.1859 7.41268 4.10609 7.33479L2.13138 5.40986L4.78989 5.198Z"
                                fill="#FF2929"></path>
                        </svg>
                        <span data-v-0bca687a="">STANDART</span></div>
                      <div data-v-0bca687a="" class="info">
                        <div data-v-0bca687a="" class="d-flex">
                          <div data-v-0bca687a="" class="indicator-item">
                            <svg data-v-0bca687a="" width="19" height="19" viewBox="0 0 19 19" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path data-v-0bca687a=""
                                    d="M10.4499 9.4999C10.9538 9.4999 11.4371 9.70008 11.7934 10.0564C12.1497 10.4127 12.3499 10.896 12.3499 11.3999V12.8249C12.3499 14.7762 10.3663 16.1499 7.1249 16.1499C3.8835 16.1499 1.8999 14.7762 1.8999 12.8249V11.3999C1.8999 10.896 2.10008 10.4127 2.4564 10.0564C2.81272 9.70008 3.29599 9.4999 3.7999 9.4999H10.4499ZM10.4499 10.4499H3.7999C3.54795 10.4499 3.30631 10.55 3.12815 10.7282C2.94999 10.9063 2.8499 11.1479 2.8499 11.3999V12.8249C2.8499 14.1616 4.34995 15.1999 7.1249 15.1999C9.89985 15.1999 11.3999 14.1616 11.3999 12.8249V11.3999C11.3999 11.1479 11.2998 10.9063 11.1217 10.7282C10.9435 10.55 10.7019 10.4499 10.4499 10.4499ZM15.1999 9.4999C15.7038 9.4999 16.1871 9.70008 16.5434 10.0564C16.8997 10.4127 17.0999 10.896 17.0999 11.3999V11.8749C17.0999 13.8595 15.6103 15.1999 12.8249 15.1999C12.691 15.1999 12.5589 15.1971 12.4316 15.1904C12.6292 14.9605 12.7945 14.7135 12.9275 14.4485L13.0197 14.2461H13.0567C15.1771 14.1844 16.1499 13.2619 16.1499 11.8749V11.3999C16.1499 11.1479 16.0498 10.9063 15.8717 10.7282C15.6935 10.55 15.4519 10.4499 15.1999 10.4499H13.1375C13.0131 10.0995 12.8214 9.77672 12.5732 9.4999H15.1999ZM7.1249 1.8999C7.56155 1.8999 7.99392 1.98591 8.39732 2.153C8.80073 2.3201 9.16728 2.56502 9.47603 2.87377C9.78479 3.18253 10.0297 3.54907 10.1968 3.95248C10.3639 4.35589 10.4499 4.78826 10.4499 5.2249C10.4499 5.66155 10.3639 6.09392 10.1968 6.49732C10.0297 6.90073 9.78479 7.26728 9.47603 7.57603C9.16728 7.88479 8.80073 8.1297 8.39732 8.2968C7.99392 8.4639 7.56155 8.5499 7.1249 8.5499C6.24306 8.5499 5.39733 8.19959 4.77377 7.57603C4.15021 6.95247 3.7999 6.10675 3.7999 5.2249C3.7999 4.34306 4.15021 3.49733 4.77377 2.87377C5.39733 2.25021 6.24306 1.8999 7.1249 1.8999ZM13.7749 3.7999C14.4048 3.7999 15.0089 4.05012 15.4543 4.49552C15.8997 4.94092 16.1499 5.54501 16.1499 6.1749C16.1499 6.80479 15.8997 7.40888 15.4543 7.85428C15.0089 8.29968 14.4048 8.5499 13.7749 8.5499C13.145 8.5499 12.5409 8.29968 12.0955 7.85428C11.6501 7.40888 11.3999 6.80479 11.3999 6.1749C11.3999 5.54501 11.6501 4.94092 12.0955 4.49552C12.5409 4.05012 13.145 3.7999 13.7749 3.7999ZM7.1249 2.8499C6.49501 2.8499 5.89092 3.10012 5.44552 3.54552C5.00012 3.99092 4.7499 4.59501 4.7499 5.2249C4.7499 5.85479 5.00012 6.45888 5.44552 6.90428C5.89092 7.34968 6.49501 7.5999 7.1249 7.5999C7.75479 7.5999 8.35888 7.34968 8.80428 6.90428C9.24968 6.45888 9.4999 5.85479 9.4999 5.2249C9.4999 4.59501 9.24968 3.99092 8.80428 3.54552C8.35888 3.10012 7.75479 2.8499 7.1249 2.8499ZM13.7749 4.7499C13.397 4.7499 13.0345 4.90004 12.7673 5.16727C12.5 5.43451 12.3499 5.79697 12.3499 6.1749C12.3499 6.55284 12.5 6.91529 12.7673 7.18253C13.0345 7.44977 13.397 7.5999 13.7749 7.5999C14.1528 7.5999 14.5153 7.44977 14.7825 7.18253C15.0498 6.91529 15.1999 6.55284 15.1999 6.1749C15.1999 5.79697 15.0498 5.43451 14.7825 5.16727C14.5153 4.90004 14.1528 4.7499 13.7749 4.7499Z"
                                    fill="#FF2929"></path>
                            </svg>
                            <span data-v-0bca687a="">{{ giveaway.members | num }}</span>
                          </div>
                          <div data-v-0bca687a="" class="indicator-item">
                            <span data-v-0bca687a="">{{ giveaway.item.price | num }}₽</span></div>
                        </div>
                        <div data-v-0bca687a="" class="d-flex">
                          <div data-v-0bca687a="" class="indicator-item">
                            <svg data-v-0bca687a="" width="16" height="16" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                              <path data-v-0bca687a=""
                                    d="M8 15C6.61553 15 5.26216 14.5895 4.11101 13.8203C2.95987 13.0511 2.06266 11.9579 1.53285 10.6788C1.00303 9.39971 0.86441 7.99224 1.13451 6.63437C1.4046 5.2765 2.07129 4.02922 3.05026 3.05026C4.02922 2.07129 5.2765 1.4046 6.63437 1.13451C7.99224 0.86441 9.39971 1.00303 10.6788 1.53285C11.9579 2.06266 13.0511 2.95987 13.8203 4.11101C14.5895 5.26216 15 6.61553 15 8C15 9.85652 14.2625 11.637 12.9498 12.9498C11.637 14.2625 9.85652 15 8 15ZM8 2C6.81332 2 5.65328 2.3519 4.66658 3.01119C3.67989 3.67047 2.91085 4.60755 2.45673 5.7039C2.0026 6.80026 1.88378 8.00666 2.11529 9.17055C2.3468 10.3344 2.91825 11.4035 3.75736 12.2426C4.59648 13.0818 5.66558 13.6532 6.82946 13.8847C7.99335 14.1162 9.19975 13.9974 10.2961 13.5433C11.3925 13.0892 12.3295 12.3201 12.9888 11.3334C13.6481 10.3467 14 9.18669 14 8C14 6.40871 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2Z"
                                    fill="#FF2929"></path>
                              <path data-v-0bca687a="" d="M10.295 11L7.5 8.205V3.5H8.5V7.79L11 10.295L10.295 11Z"
                                    fill="#FF2929"></path>
                            </svg>
                            <span data-v-0bca687a=""><span data-v-0bca687a="" v-html="timeToOpenHtml[giveaway.id]"></span></span></div>
                        </div>
                      </div>
                      <button data-v-0bca687a="" class="join" @click="joinGiveaway(giveaway.id)"> УЧАСТВОВАТЬ</button>
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
        giveaways: [],
        timeToOpenHtml: []
      }
  },
  created() {
    this.getGiveaways()
  },
  methods: {
    startTimers() {
      for (const giveaway of Object.values(this.giveaways)) {
        this.tickTimer(giveaway)
        this.startTimer(giveaway)
      }
    },
    startTimer(giveaway) {
      setInterval(() => {
        this.tickTimer(giveaway)
      }, 1000)
    },
    tickTimer(giveaway) {
      const timeStart = new Date()
      const targetDate = new Date(giveaway.end_time)

      const timeToOpen = targetDate - timeStart

      if (timeToOpen <= 0) {
        return
      }

      let seconds = Math.floor(timeToOpen / 1000),
          minutes = Math.floor(seconds / 60),
          hours = Math.floor(minutes / 60),
          days = Math.floor(timeToOpen / (1000 * 60 * 60 * 24))

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      let text = ''

      if (days > 0) {
        text = `${days}д. `
      }

      text += `${hours}ч. ${minutes}м. ${seconds}с.`

      this.timeToOpenHtml[giveaway.id] = text

      this.$forceUpdate()
    },
    getGiveaways() {
      this.$root.request('POST', '/graphql', {"query": "{getGiveaways {  id  item {    market_name    icon_url    price  }  members  end_time}}"})
          .then(data => {
            this.giveaways = data.getGiveaways

            this.$nextTick(() => {
              this.startTimers()
            })
          })
    },
    joinGiveaway(id) {
      this.$root.request(
          'POST',
          '/graphql',
          {"query":"mutation joinGiveaway($id: Int!) {joinGiveaway(id: $id)}","variables":{"id":id},"operationName":"joinGiveaway"}
      ).then(() => {
        this.getGiveaways()
        this.$root.showNotify('Успешно', 'Вы участвуете в розыгрыше', 'success')
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    }
  }
}
</script>