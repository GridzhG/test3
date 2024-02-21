<template>
  <div>
    <Header/>
    <Mixer />
    <div class="content">
      <div class="loader" v-if="$root.isLoading">
        <div class="sk-chase">
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
          <div class="sk-chase-dot"></div>
        </div>
      </div>
      <router-view v-show="!$root.isLoading" />
    </div>
    <Footer />
    <Promocode />
    <Deposit />
  </div>
</template>

<script>
import Header from "./components/Header";
import Promocode from "./modals/Promocode";
import Deposit from "./modals/Deposit";
import Footer from "./components/Footer";
import Mixer from "./components/Mixer";

export default {
  components: {Mixer, Footer, Header, Promocode, Deposit}
}
</script>
