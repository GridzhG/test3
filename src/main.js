import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookie from 'vue-cookie'
import io from "socket.io-client"
import VueWebsocket from "vue-websocket"
import router from "./router"
import App from './App.vue'
import {numberFormat} from "./utils"
import Chakra, {CThemeProvider} from '@chakra-ui/vue'

Vue.config.productionTip = false

const socket = io(`api.gmdrop.webcenter.website`)

Vue.use(VueAxios, axios)
Vue.use(VueWebsocket, socket)
Vue.use(VueCookie)
Vue.use(Chakra)

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${process.env.VUE_APP_API_URL}`;

Vue.filter('num', (val, format = '# ##0.##') => numberFormat(val, format))
Vue.filter('float', (val, format = '# ##0.00') => numberFormat(val, format))

new Vue({
    data() {
        return {
            user: null,
            online: 0,
            sound: true,
            isLoading: false,
            liveDrop: {
                drops: [],
                opened: 0,
                bust: 0,
                upgrades: 0
            },
            giveaways: [],
            timeToOpenHtml: {}
        }
    },
    created() {
        if (this.$cookie.get('token')) {
            this.getUser();
        }

        if (this.$cookie.get('sound')) {
            this.sound = parseInt(this.$cookie.get('sound'))
        }

        this.getLiveDrop()
    },
    methods: {
        async request(type, uri, data = {}) {
            if (this.$cookie.get('token')) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$cookie.get('token');
            }

            if (this.$cookie.get('ref')) {
                axios.defaults.headers.common['Ref'] = this.$cookie.get('ref');
            }

            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (res, rej) => {
                try {
                    let result;

                    if (type === 'POST') {
                        result = await this.$root.axios.post(uri, data)
                    } else {
                        result = await this.$root.axios.get(uri, {params: data})
                    }

                    if (typeof result.data.errors !== "undefined") {
                        return rej(result.data.errors)
                    }

                    return res(result.data.data);
                } catch (e) {
                    if (typeof e.response !== "undefined" && typeof e.response.data.message !== "undefined") {
                        return rej(e.response.data.message);
                    } else {
                        return rej(false);
                    }
                }
            });
        },
        getUser() {
            this.request(
                'POST',
                `/graphql`,
                {"query": "{currentUser {id, steamId, username, avatar, balance, trade_url, opened, contracts, upgrades, role, referral_code, referral_lvl, referral_sum, referral_balance, referral_payment, referral_invited, bestDrop { box { name }}} }"}
            )
                .then(data => {
                    this.user = data.currentUser
                })
                .catch(() => {

                })
        },
        openAuthWindow(url) {
            let width = 860;
            let height = 500;
            let left = (screen.width / 2) - (width / 2);
            let top = (screen.height / 2) - (height / 2);
            let windowOptions = `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`;
            let type = 'auth';

            window.open(`${process.env.VUE_APP_API_URL}${url}`, type, windowOptions);

            window.addEventListener("message", this.initToken, false);
        },
        async initToken(event) {
            try {
                if (event.data.length > 0 && event.data.indexOf('token')) {
                    const token = event.data.slice(7);
                    this.$cookie.set('token', token, {domain: process.env.VUE_APP_FRONTEND_URL, expires: '1Y'});

                    await this.$root.getUser();
                }
            } catch (e) {
                console.log(e)
            }
        },
        getStyleItem(rarity) {
            let style = 'consumer';
            rarity = rarity.toLowerCase();

            if (rarity.indexOf('industrial') > -1) {
                style = 'industrial';
            } else if (rarity.indexOf('mil-spec') > -1) {
                style = 'mil-spec';
            } else if (rarity.indexOf('restricted') > -1) {
                style = 'restricted';
            } else if (rarity.indexOf('classified') > -1) {
                style = 'classified';
            } else if (rarity.indexOf('★') > -1) {
                style = '★';
            } else if (rarity.indexOf('covert') > -1) {
                style = 'covert';
            } else if (rarity.indexOf('exceedingly') > -1) {
                style = 'exceedingly-rare';
            } else if (rarity.indexOf('contraband') > -1) {
                style = 'contraband';
            }

            return style;
        },
        getColor(rarity) {
            let style = 'gray';
            rarity = rarity.toLowerCase();

            if (rarity.indexOf('industrial') > -1) {
                style = 'gray';
            } else if (rarity.indexOf('mil-spec') > -1) {
                style = 'blue';
            } else if (rarity.indexOf('restricted') > -1) {
                style = 'purple';
            } else if (rarity.indexOf('classified') > -1) {
                style = 'pink';
            } else if (rarity.indexOf('★') > -1) {
                style = 'red';
            } else if (rarity.indexOf('covert') > -1) {
                style = 'red';
            } else if (rarity.indexOf('exceedingly') > -1) {
                style = 'gray';
            } else if (rarity.indexOf('contraband') > -1) {
                style = 'gray';
            }

            return style;
        },
        getNameParts(name) {
            return (name ?? '').split('|')
                .map(n => n.replace(/(^[^\w\d()]|[^\w\d()]$)/ig, ''))
        },
        getItemType(name) {
            const nameParts = this.getNameParts(name)
            if (nameParts.length === 1) return null
            return nameParts[0].replace(/StatTrak.*?\s/i, '[ST] ')
        },
        getItemName(name) {
            const nameParts = this.getNameParts(name)
            if (nameParts.length === 1) return nameParts[0]
            return nameParts[1].replace(/\(.+\)$/, '')
        },
        setSound() {
            if (this.sound) {
                this.sound = false
                this.$cookie.set('sound', 0)
            } else {
                this.sound = true
                this.$cookie.set('sound', 1)
            }
        },
        showNotify(title, description, status) {
            this.playSound('notification')

            this.$root.$toast({
                title,
                description,
                status,
                duration: 3e3,
                isClosable: true,
                position: "bottom-right"
            })
        },
        sellItems(ids) {
            this.request('POST', '/graphql', {
                "query": "mutation sellItems($ids: [Int!]!) {userInventorySellItems(ids: $ids)}",
                "variables": {"ids": ids},
                "operationName": "sellItems"
            }).then((data) => {
                this.getUser()

                this.$root.showNotify('Успешно', `Ваш баланс пополнен на ${parseFloat(data.userInventorySellItems).toFixed(2)}Р`, 'success')
            }).catch(e => {
                this.$root.showNotify('Ошибка', e[0].message, 'error')
            })
        },
        getLiveDrop() {
            this.request(
                'POST',
                `/graphql`,
                {"query": "{getLiveDrop {drops {user {  username},box {  name  image},item {  market_name icon_url rarity} type}opened bust upgrades}}"}
            )
                .then(data => {
                    this.liveDrop = data.getLiveDrop
                })
        },
        playSound(t) {
            if (this.sound) {
                const e = new Audio("".concat("/audio/").concat(t, ".mp3"));
                try {
                    e.volume = .2, e.play()
                } catch (s) {
                    console.log(s)
                }
            }
        }
    },
    socket: {
        events: {
            online(online) {
                this.online = online
            },
            updateLivedrop(data) {
                this.liveDrop = data
            }
        }
    },
    render: (h) => h(CThemeProvider, [h(App)]),
    router
}).$mount('#app')
