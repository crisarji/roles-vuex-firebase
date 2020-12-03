<script>
import { mapGetters } from 'vuex';
import SiteNav from '@/components/SiteNav';

export default {
  components: {
    SiteNav
  },
  computed: {
    ...mapGetters(['getUserProfile']),
    showNav() {
      return Object.keys(this.getUserProfile).length > 1
    }
  }
}
</script>
<template>
  <div id="app">
    <SiteNav v-if="showNav"></SiteNav>
    <router-view/>
  </div>
</template>
