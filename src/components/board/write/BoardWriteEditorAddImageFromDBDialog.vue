<template>
  <v-dialog width="500" v-model="board.addImageFromDBDialog" persistent scrollable>
    <v-card>
      <v-card-title>기존 이미지를 본문에 추가/관리</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-card v-show="showRemoveImageInfo" elevation="0" class="mt-2 mb-5" variant="tonal">
          <v-card-text class="pa-3">
            정말로 삭제하시겠습니까? 이전에 사용한 적이 없거나 앞으로도 사용할 계획이 없을 경우에만
            삭제해 주세요! 만약 이전 게시글들에 이미 사용하셨다면, 해당 게시글들은 더 이상 이미지가
            나타나지 않게 됩니다. 계속 진행하시겠습니까?
          </v-card-text>
          <v-card-actions>
            <v-btn prepend-icon="mdi-check" color="primary" @click="clear"
              >아니요, 삭제하지 않겠습니다</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn prepend-icon="mdi-trash-can" @click="remove">
              삭제
              <v-tooltip activator="parent" location="top">
                위의 설명을 충분히 이해했고, 그럼에도 삭제를 원하실 경우 클릭!
              </v-tooltip>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-row>
          <v-col v-for="(image, index) in uploadedImages" :key="index" cols="3">
            <v-img cover height="100" aspect-ratio="1/1" :src="PREFIX + image.src">
              <div class="action">
                <v-btn
                  @click="add(image.src)"
                  size="small"
                  elevation="0"
                  variant="tonal"
                  color="white"
                  icon
                >
                  <v-icon>mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="top">
                    클릭하시면 이 사진을 본문에 추가합니다
                  </v-tooltip>
                </v-btn>

                <v-btn
                  @click="check(image.uid, image.src)"
                  size="small"
                  elevation="0"
                  variant="tonal"
                  color="white"
                  class="ml-1"
                  icon
                >
                  <v-icon>mdi-trash-can</v-icon>
                  <v-tooltip activator="parent" location="top">
                    클릭하시면 이 사진을 서버에서 삭제합니다 (이 사진을 참조하는 모든 게시글에
                    영향을 줍니다)
                  </v-tooltip>
                </v-btn>
              </div>
            </v-img>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn block prepend-icon="mdi-close" @click="board.addImageFromDBDialog = false"
          >닫기</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useBoardStore } from "../../../store/board"

interface Image {
  uid: number
  src: string
}

const emits = defineEmits<{
  addImageURL: [src: string]
  removeImage: [src: string]
}>()
const board = useBoardStore()
const PREFIX = process.env.PREFIX || ""
const showRemoveImageInfo = ref<boolean>(false)
const removeImageTarget = ref<Image>({
  uid: 0,
  src: "",
})
const uploadedImages = ref<Image[]>([
  {
    uid: 1,
    src: `https://images.unsplash.com/photo-1688494930045-328d0f95efe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80`,
  },
  {
    uid: 2,
    src: `https://images.unsplash.com/photo-1690402687447-87600bae0364?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3132&q=80`,
  },
  {
    uid: 3,
    src: `https://images.unsplash.com/photo-1692871480784-4fd78f25459f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2160&q=80`,
  },
  {
    uid: 4,
    src: `https://images.unsplash.com/photo-1685516882750-807fa81a949f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3280&q=80`,
  },
])

// 기존에 업로드한 이미지 추가하기
function add(src: string): void {
  emits("addImageURL", PREFIX + src)
}

// 이미지 삭제하기 전에 확인하기
function check(uid: number, src: string): void {
  showRemoveImageInfo.value = true
  removeImageTarget.value = { uid, src: PREFIX + src }
}

// 업로드한 이미지 삭제하기 (작성중인 본문에서도 제거)
function remove(): void {
  emits("removeImage", removeImageTarget.value.src)
  // TODO 서버에 올려진 사진 파일 / DB 레코드 제거
  uploadedImages.value = uploadedImages.value.filter((value: Image) => {
    return value.uid !== removeImageTarget.value.uid
  })
  clear()
}

// 삭제하지 않기
function clear(): void {
  showRemoveImageInfo.value = false
  removeImageTarget.value = { uid: 0, src: "" }
}
</script>

<style scoped>
.action {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
</style>
