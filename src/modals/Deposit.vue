<template>
  <transition name="slide-fade">
    <div data-v-99c275b8="" ref="modal" class="modal deposit" style="" v-show="showModal">
      <div data-v-99c275b8="" ref="modal_body" class="body"><h2 data-v-99c275b8="">ПОПОЛНЕНИЕ БАЛАНСА</h2>
        <div @click="showModal = false" data-v-99c275b8="" class="close"><img data-v-99c275b8="" src="/img/close.svg" alt=""></div>
        <div data-v-99c275b8="" class="items">
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('card', 'unitpay')" type="radio" id="p1" name="payment"
                   value="card">
            <label data-v-99c275b8="" for="p1">
              <img data-v-99c275b8="" src="/img/p1.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('45', 'free-kassa')" type="radio" id="p3" name="payment"
                   value="yoomoney">
            <label data-v-99c275b8="" for="p3">
              <img data-v-99c275b8="" src="/img/p3.svg" alt=""></label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('applepay', 'unitpay')" type="radio" id="p4"
                   name="payment" value="applepay">
            <label data-v-99c275b8="" for="p4">
              <img data-v-99c275b8="" src="/img/p4.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('googlepay', 'unitpay')" type="radio" id="p5"
                   name="payment" value="googlepay">
            <label data-v-99c275b8="" for="p5">
              <img data-v-99c275b8="" src="/img/p5.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('samsungpay', 'unitpay')" type="radio" id="p11"
                   name="payment" value="samsungpay">
            <label data-v-99c275b8="" for="p11">
              <img data-v-99c275b8="" src="/img/p11.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('mts', 'unitpay')" type="radio" id="p7" name="payment"
                   value="mts">
            <label data-v-99c275b8="" for="p7">
              <img data-v-99c275b8="" src="/img/p7.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('beeline', 'unitpay')" type="radio" id="p8"
                   name="payment" value="beeline">
            <label data-v-99c275b8="" for="p8">
              <img data-v-99c275b8="" src="/img/p8.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('mf', 'unitpay')" type="radio" id="p9" name="payment"
                   value="megafone">
            <label data-v-99c275b8="" for="p9">
              <img data-v-99c275b8="" src="/img/p9.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('tele2', 'unitpay')" type="radio" id="p10" name="payment"
                   value="tele2">
            <label data-v-99c275b8="" for="p10">
              <img data-v-99c275b8="" src="/img/p10.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('116', 'free-kassa')" type="radio" id="p12"
                   name="payment" value="bitcoin">
            <label data-v-99c275b8="" for="p12">
              <img data-v-99c275b8="" src="/img/p12.svg" alt="">
            </label>
          </div>
          <div data-v-99c275b8="" class="item">
            <input data-v-99c275b8="" @click="setPaymentMethod('154', 'free-kassa')" type="radio" id="p13"
                   name="payment" value="skinpay">
            <label data-v-99c275b8="" for="p13">
              <img data-v-99c275b8="" src="/img/p13.svg" alt="">
            </label>
          </div>
        </div>
        <div data-v-99c275b8="" class="form">
          <div data-v-99c275b8="" class="input sum">
            <label data-v-99c275b8="" for="">Введите сумму</label>
            <input data-v-99c275b8="" type="number" v-model="value" placeholder="от 10₽">
          </div>
          <div data-v-99c275b8="" class="input promo">
            <label data-v-99c275b8="" for=""> Бонус-код (при наличии) </label>
            <input data-v-99c275b8="" type="text" v-model="promo" placeholder="Бонус-код">
          </div>
          <button data-v-99c275b8="" @click="setPayment()">ПОПОЛНИТЬ</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      i: "0",
      method: '',
      value: '',
      promo: ''
    }
  },
  created() {
    this.$root.$on('showDepositModal', () => {
      this.showModal = true
    })
  },
  mounted() {
    const t = this

    this.$refs.modal.addEventListener("click", (function (e) {
      if (!t.$refs["modal_body"].contains(e.target)) {
        t.showModal = false
      }
    }), !1)
  },
  methods: {
    setPaymentMethod(i, method) {
      this.i = i.toString()
      this.method = method
    },
    setPayment() {
      if (this.i === "0" || this.method === '' || this.value === '' || this.value < 10) {
        return
      }

      this.$root.request(
          'POST',
          '/graphql',
          {
            "query": "mutation setPayment($i: String!, $method: String!, $value: Float!, $promo: String!) {setPayment(i: $i, method: $method, value: $value, promo: $promo)}",
            "variables": {"i": this.i, "method": this.method, "value": parseFloat(this.value), "promo": this.promo},
            "operationName": "setPayment"
          }
      ).then((data) => {
        window.location.href = data.setPayment
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    }
  }
}
</script>