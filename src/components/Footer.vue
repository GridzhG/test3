<template>
  <footer data-v-b77bf4ca="" class="footer">
    <div data-v-b77bf4ca="" class="container">
      <div data-v-b77bf4ca="" class="footer__body"><RouterLink data-v-b77bf4ca="" to="/" aria-current="page"
                                                      class="logo router-link-exact-active router-link-active"><img
          data-v-b77bf4ca="" src="/img/logo.png" alt=""></RouterLink>
        <div data-v-b77bf4ca="" class="text"> © 2021 GMDROP.GG<br data-v-b77bf4ca=""><br data-v-b77bf4ca=""> На нашем
          сайте вы можете открыть различные кейсы GM по самым выгодным ценам
        </div>
        <nav data-v-b77bf4ca="">
          <RouterLink to="/cooperation?tab=agreement" data-v-b77bf4ca="" class="">
            <span data-v-b77bf4ca="">Пользовательское соглашение</span>
          </RouterLink>
<!--          <RouterLink v-if="$root.user" data-v-b77bf4ca="" to="/faq" class="">-->
<!--            <span data-v-b77bf4ca="">F.A.Q и поддержка сайта</span>-->
<!--          </RouterLink>-->
          <RouterLink data-v-b77bf4ca="" to="/cooperation?tab=cooperation" class="">
            <span data-v-b77bf4ca="">Контакты и корп. информация</span>
          </RouterLink>
        </nav>
      </div>
    </div>
    <div data-v-b77bf4ca="" class="mobile__footer">
      <div data-v-b77bf4ca="" class="container">
        <div data-v-b77bf4ca="" class="links">
          <RouterLink data-v-b77bf4ca="" to="/cooperation?tab=agreement" class="">
            <span data-v-b77bf4ca="">Пользовательское соглашение</span>
          </RouterLink>
<!--          <RouterLink v-if="$root.user" data-v-b77bf4ca="" to="/faq" class="">-->
<!--            <span data-v-b77bf4ca="">F.A.Q и поддержка сайта</span>-->
<!--          </RouterLink>-->
        </div>
        <RouterLink data-v-b77bf4ca="" to="/cooperation?tab=cooperation" class="yellow-btn">
          <span data-v-b77bf4ca="">Контакты и корп. информация</span>
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<script>
export default {}
</script>