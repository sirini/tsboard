<template>
  <v-app>
    <admin-header></admin-header>
    <v-container class="admin">
      <v-card class="mx-auto">
        <v-card-title
          ><strong>{{ route.params?.id }}</strong> 게시판 설정</v-card-title
        >
        <v-divider></v-divider>
        <v-layout>
          <v-navigation-drawer permanent location="left" width="250">
            <v-list>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                append-icon="mdi-chevron-right"
                @click="admin.selectMenu = 0"
              >
                일반
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <v-main class="main">
            <v-card elevation="0" v-if="admin.selectMenu === 0">
              <v-list>
                <v-list-item class="mb-2">
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="admin.board.id"
                        variant="outlined"
                        density="compact"
                        disabled
                        hide-details
                        prepend-inner-icon="mdi-pencil-off"
                      ></v-text-field>
                    </v-col>
                    <v-col class="mt-2"> 게시판 아이디는 생성 후 변경이 불가능 합니다. </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item class="mt-2 mb-2">
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="admin.board.group.selected"
                        readonly
                        variant="outlined"
                        density="compact"
                        hide-details
                        append-inner-icon="mdi-chevron-down"
                      >
                        <v-menu activator="parent">
                          <v-list>
                            <v-list-item
                              v-for="(group, index) in admin.board.group.list"
                              :key="index"
                              @click="admin.changeGroup(group)"
                            >
                              {{ group.name }}
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-text-field>
                    </v-col>
                    <v-col class="mt-2">
                      게시판은 하나의 그룹에만 소속됩니다. 그룹 관리자는 개별 게시판에서도
                      관리자입니다.
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item class="mt-2 mb-2">
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="admin.board.name"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="mt-2">
                      게시판 이름입니다. 이 게시판을 대표할만한 이름으로 작성해 보세요.
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item class="mt-2 mb-2">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="admin.board.info"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="mt-2"> 게시판 설명을 작성해 보세요. </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item class="mt-2 mb-2">
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="admin.board.rows"
                        variant="outlined"
                        density="compact"
                        hide-details
                      ></v-text-field>
                    </v-col>
                    <v-col class="mt-2">
                      한 페이지에 몇 개의 게시글을 보여줄지 지정합니다. 공지글을 포함한 갯수입니다.
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>

                <v-list-item class="mt-2 mb-2">
                  <v-row>
                    <v-col cols="3">
                      <v-text-field
                        v-model="admin.board.category.add"
                        variant="outlined"
                        density="compact"
                        append-inner-icon="mdi-tag-plus"
                        @click:append-inner="admin.addCategory()"
                        hide-details
                      >
                        <v-menu activator="parent">
                          <v-list>
                            <v-list-item
                              v-for="(category, index) in admin.board.category.list"
                              :key="index"
                            >
                              <v-list-item-title>
                                {{ category.name }}
                              </v-list-item-title>
                              <template v-slot:append>
                                <v-btn
                                  icon
                                  elevation="0"
                                  @click="admin.confirmRemoveCategory(category.uid, category.name)"
                                >
                                  <v-icon>mdi-trash-can</v-icon>
                                  <v-tooltip activator="parent">
                                    이 카테고리를 삭제하고 기본 카테고리와 병합합니다. (글은
                                    삭제되지 않습니다)
                                  </v-tooltip>
                                </v-btn>
                              </template>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <v-tooltip activator="parent" location="top">
                          기본 카테고리는 삭제가 불가능하며, 기본 카테고리만 남아 있으면 자동으로
                          비활성화 됩니다.
                        </v-tooltip>
                      </v-text-field>
                    </v-col>
                    <v-col class="mt-2"> 카테고리를 추가하거나 삭제하실 수 있습니다. </v-col>
                  </v-row>
                </v-list-item>
                <v-divider></v-divider>
              </v-list>
            </v-card>
          </v-main>
        </v-layout>
      </v-card>
    </v-container>
    <admin-footer></admin-footer>
    <confirm-remove-category-dialog></confirm-remove-category-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { useRoute } from "vue-router"
import { useAdminStore } from "../../store/admin"
import AdminHeader from "../../components/admin/common/AdminHeader.vue"
import AdminFooter from "../../components/admin/common/AdminFooter.vue"
import ConfirmRemoveCategoryDialog from "../../components/admin/board/ConfirmRemoveCategoryDialog.vue"

const route = useRoute()
const admin = useAdminStore()

watchEffect(() => {
  if (route.params?.id.length > 1) {
    admin.board.id = route.params?.id.toString()
  }
})
</script>

<style scoped>
.admin {
  margin-top: 64px;
}
.main {
  min-height: 300px;
}
</style>
