<template>
<div class="c-page" v-if="admin_user">
  <h4>Login User - {{admin_user.username}}</h4>
</div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
export default {
  computed: {
    ...mapState([
      'admin_user'
    ])
  },

}
</script>