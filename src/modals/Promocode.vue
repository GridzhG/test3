<template>
  <transition name="slide-fade">
    <div data-v-a38c5d3e="" ref="modal" class="modal deposit" v-show="showModal">
      <div data-v-a38c5d3e="" class="body" ref="modal_body">
        <h2 data-v-a38c5d3e="">Активация промокода</h2>
        <div data-v-a38c5d3e="" class="close" @click="showModal = false">
          <img data-v-a38c5d3e="" src="/img/close.svg" alt="">
        </div>
        <div data-v-a38c5d3e="" class="form">
          <div data-v-a38c5d3e="" class="input sum">
            <label data-v-a38c5d3e="" for="">Введите промокод</label>
            <input data-v-a38c5d3e="" v-model="promo" type="text" placeholder="PROMOCODE">
          </div>
          <button data-v-a38c5d3e="" @click="setPromo()">АКТИВИРОВАТЬ</button>
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
      promo: ''
    }
  },
  created() {
    this.$root.$on('showPromocodeModal', () => {
      this.showModal = true
    })
  },
  mounted() {
    const t = this

    this.$refs.modal.addEventListener("click", (function(e) {
      if (!t.$refs["modal_body"].contains(e.target)) {
        t.showModal = false
      }
    }), !1)
  },
  methods: {
    setPromo() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query":"mutation usePromocode($promo: String!) {usePromocode(promo: $promo)}","variables":{"promo":this.promo},"operationName":"usePromocode"}
      ).then(() => {
        this.$root.showNotify('Успешно', 'Промокод активирован', 'success')

        this.$root.getUser()
        this.showModal = false
      }).catch(e => {
        this.$root.showNotify('Ошибка', e[0].message, 'error')
      })
    }
  }
}
</script>