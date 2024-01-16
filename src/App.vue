<script setup lang="ts">
import { userLogin } from '@/api'

userLogin({ username: '1', password: '1' }).then((res) => console.log(res.data))
</script>
<style></style>
