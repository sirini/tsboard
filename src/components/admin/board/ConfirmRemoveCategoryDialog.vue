<v-dialog width="500" v-model="admin.confirmRemoveCategoryDialog" persistent>
  <v-card class="mx-auto">
    <v-card-title>확인</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      {{ route.params?.id }} 게시판의 {{ admin.board.category.remove.name }} 카테고리를 정말로 삭제하시겠습니까? 해당하는 게시글들은 모두 기본 카테고리로 재설정되며 글은 삭제되지 않습니다. 이 작업은 되돌릴 수 없습니다. 계속 진행하시겠습니까?
    </v-card-text>
    <v-card-actions>
      <v-btn prepend-icon="mdi-check" color="primary">이해했습니다, 그대로 유지할께요</v-btn>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-trash-can">삭제</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useAdminStore } from "../../../store/admin"

const route = useRoute()
const admin = useAdminStore()
</script>
