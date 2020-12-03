<template>
  <header>
    <section>
      <button @click="logout()" class="bg-yellow-400 text-xs hover:bg-yellow-300 text-black font-bold m-2 py-2 px-4 rounded float-right">
				LogOut
			</button>
    </section>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
