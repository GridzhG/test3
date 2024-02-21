<template>
  <div>
    <div data-v-13fec4b2="" class="home" style="">
      <div data-v-13fec4b2="" class="container">
        <div data-v-43074c82="" data-v-13fec4b2="" class="top-banner">
          <div data-v-43074c82="" class="banner">
            <img data-v-43074c82="" src="/img/new_banner.png" alt="" class="dekstop-banner">
            <img data-v-43074c82="" src="/img/new_banner-big.png" alt="" class="big-banner">
            <img data-v-43074c82="" src="/img/new_banner-mobile.png" alt="" class="mobile-banner">
          </div>
          <div data-v-43074c82="" class="stats">
            <div data-v-43074c82="" class="stats-column">
              <div data-v-43074c82="" class="stats-item">
                <div data-v-43074c82="" class="img"><img data-v-43074c82="" src="/img/stats-icon.svg" alt=""></div>
                <div data-v-43074c82="" class="text"><strong data-v-43074c82="">{{
                    $root.liveDrop.opened | num
                  }}</strong><span
                    data-v-43074c82="">кейсов открыто</span></div>
              </div>
              <div data-v-43074c82="" class="stats-item">
                <div data-v-43074c82="" class="img"><img data-v-43074c82="" src="/img/stats-icon-upload.svg" alt="">
                </div>
                <div data-v-43074c82="" class="text"><strong data-v-43074c82="">{{ $root.liveDrop.upgrades | num }}</strong><span data-v-43074c82="">апгрейдов</span>
                </div>
              </div>
            </div>
            <div data-v-43074c82="" class="stats-column">
              <div data-v-43074c82="" class="stats-item">
                <div data-v-43074c82="" class="img"><img data-v-43074c82="" src="/img/stats-icon-el.svg" alt=""></div>
                <div data-v-43074c82="" class="text"><strong data-v-43074c82="">{{ $root.liveDrop.bust | num }}</strong><span
                    data-v-43074c82="">бустов</span>
                </div>
              </div>
              <div data-v-43074c82="" class="stats-item">
                <div data-v-43074c82="" class="img"><img data-v-43074c82="" src="/img/stats-icon-on.svg" alt=""></div>
                <div data-v-43074c82="" class="text"><strong data-v-43074c82="">{{ $root.online | num }}</strong><span
                    data-v-43074c82="">онлайн</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-v-13fec4b2="" class="wrapper">
          <div data-v-13fec4b2="" class="cases">
            <div v-for="(category, i) in categories" :key="i" data-v-13fec4b2="" class="cases__list">
              <div v-if="category !== undefined" data-v-13fec4b2="" class="page__title blue">
                <span data-v-13fec4b2="">{{ category.category.name }}</span>
              </div>
              <template v-if="category !== undefined">
                <div data-v-13fec4b2="" class="cases__items">
                  <RouterLink v-for="box in category.cases" :key="box.id" data-v-13fec4b2="" :to="`/box/${box.url}`"
                              class="case__item">
                    <div data-v-13fec4b2="" class="img">
                      <img data-v-13fec4b2="" :src="box.image" alt="">
                    </div>
                    <div data-v-13fec4b2="" class="name">{{ box.name }}</div>
                    <div data-v-13fec4b2="" class="prices">
                      <div data-v-13fec4b2="" class="actual-price"><span data-v-13fec4b2="">{{
                          box.price | num
                        }} ₽</span></div>
                      <div v-if="box.old_price" data-v-13fec4b2="" class="old-price">{{ box.old_price | num }} ₽</div>
                    </div>
                  </RouterLink>
                </div>
              </template>
            </div>
          </div>
          <Chat/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from "../components/Chat";

export default {
  components: {Chat},
  data() {
    return {
      categories: []
    }
  },
  created() {
    this.getCases()
  },
  methods: {
    getCases() {
      this.$root.request(
          'POST',
          '/graphql',
          {"query": "{casesAll { id,  name,  url,  image,  old_price,  price,  opened,  max_opened,  category { id, name, sorting }}}"}
      ).then(data => {
        const cases = data.casesAll

        for (const box of cases) {
          if (typeof this.categories[box.category.id] === 'undefined') {
            this.categories[box.category.id] = {
              category: box.category,
              cases: []
            }
          }

          this.categories[box.category.id]['cases'].push(box)
        }

        this.categories = this.categories.sort((a, b) => {
          if (a.category.sorting > b.category.sorting) {
            return 1
          }

          if (a.category.sorting < b.category.sorting) {
            return -1
          }

          return 0
        })

        this.$forceUpdate()
      })
    }
  }
}
</script>