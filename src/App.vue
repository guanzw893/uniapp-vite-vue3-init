<script setup lang="ts">
import { getWxLoginCallback } from '@/api'

getWxLoginCallback({ code: '1', state: '1' }).then((res) =>
  console.log(res.data)
)
</script>
<style></style>
