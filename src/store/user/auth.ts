import { SHA256 } from "crypto-js"
import { ref } from "vue"
import { defineStore } from "pinia"
import { useUtilStore } from "../util"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/user/auth"
import { TSBOARD } from "../../../tsboard.config"
import axios from "axios"
import { MY_INFO_RESULT, MyInfoResult, USER_INFO_KEY } from "../../interface/user_interface"
import { ResponseData } from "../../interface/util_interface"

export const useAuthStore = defineStore("auth", () => {
  const util = useUtilStore()
  const home = useHomeStore()
  const password = ref<string>("")
  const checkedPassword = ref<string>("")
  const newProfile = ref<File | undefined>(undefined)
  const user = ref<MyInfoResult>(MY_INFO_RESULT)

  loadUserInfoFromStorage()

  // 아이디(이메일) 입력란 체크
  const emailRule = [
    (value: string) => {
      if (util.filters.email.test(value)) return true
      return TEXT[home.lang].INVALID_EMAIL
    },
  ]

  // 비밀번호 입력란 체크
  const passwordRule = [
    (value: string) => {
      if (util.filters.password.test(value)) return true
      return TEXT[home.lang].INVALID_PASSWORD
    },
  ]

  // 닉네임 입력란 체크
  const nameRule = [
    (value: string) => {
      if (value?.length > 2) return true
      return TEXT[home.lang].INVALID_NAME
    },
  ]

  // 로컬 스토리지에 보관한 사용자 정보 꺼내오기
  function loadUserInfoFromStorage(): void {
    const savedUserInfo = window.localStorage.getItem(USER_INFO_KEY)
    if (!savedUserInfo) {
      return
    }
    user.value = JSON.parse(savedUserInfo) as MyInfoResult
  }

  // 기존에 로그인 한 사용자의 정보를 서버에서 가져오기
  async function loadUserInfo(): Promise<void> {
    try {
      const response = await axios.get(`${TSBOARD.API}/auth/load`, {
        headers: {
          Authorization: `Bearer ${user.value.token}`,
        },
      })

      const data = response.data as ResponseData<MyInfoResult>
      if (!data || data.success === false) {
        return util.error(`${TEXT[home.lang].FAILED_LOAD_MYINFO} (${data.error})`)
      }

      const accessToken = user.value.token
      const refreshToken = user.value.refresh
      user.value = data.result
      user.value.signature = util.unescape(user.value.signature)
      user.value.token = accessToken
      user.value.refresh = refreshToken
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    } catch (e) {
      util.error(TEXT[home.lang].FAILED_LOAD_MYINFO)
      logout()
      util.go("home")
    }
  }

  // 사용자 로그인하기
  async function login(): Promise<void> {
    if (util.filters.email.test(user.value.id) === false) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }

    const fd = new FormData()
    fd.append("id", user.value.id.trim())
    fd.append("password", SHA256(password.value).toString())

    const response = await axios.post(`${TSBOARD.API}/auth/signin`, fd)
    const data = response.data as ResponseData<MyInfoResult>
    if (!data || data.success === false) {
      return util.error(TEXT[home.lang].INVALID_ID_PW)
    }

    user.value = data.result
    if (user.value) {
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    }
    password.value = ""
    util.go("home")
  }

  // OAuth 로그인 이후 결과 받아오기
  async function loadOAuthUserInfo(): Promise<void> {
    const response = await axios.get(`${TSBOARD.API}/auth/oauth/userinfo`)
    const data = response.data as ResponseData<MyInfoResult>
    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_LOAD_MYINFO} (${data.error})`)
    }

    user.value = data.result
    if (user.value) {
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
    }
    util.go("home")
  }

  // 사용자 로그아웃 하기
  async function logout(): Promise<void> {
    axios.post(
      `${TSBOARD.API}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.value.token}`,
        },
      },
    )
    user.value.uid = 0
    user.value.admin = false
    user.value.token = ""
    user.value.name = ""
    user.value.level = 0
    user.value.point = 0
    window.localStorage.removeItem(USER_INFO_KEY)
    util.success(TEXT[home.lang].GOODBYE_USER)
  }

  // 액세스 토큰 만료 시 리프레시 토큰으로 다시 발급 받기
  async function updateAccessToken(): Promise<boolean> {
    const fd = new FormData()
    fd.append("userUid", user.value.uid.toString())
    fd.append("refresh", user.value.refresh)

    const response = await axios.post(`${TSBOARD.API}/auth/refresh`, fd)
    const data = response.data as ResponseData<string>

    if (!data || data.success === false) {
      util.error(`${TEXT[home.lang].FAILED_UPDATE_ACCESS_TOKEN} (${data.error})`)
      return false
    }
    updateUserToken(data.result)
    return data.result.length > 0
  }

  // 사용자 토큰 업데이트 하기
  function updateUserToken(token: string): void {
    if (!token || token.length < 1) {
      return
    }
    user.value.token = token
    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user.value))
  }

  // 변경할 프로필 사진 받기
  function selectProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement
    if (!input.files) {
      return
    }
    newProfile.value = input.files[0] as File
    user.value.profile = URL.createObjectURL(newProfile.value)
  }

  // 내 정보 수정하기
  async function updateMyInfo(): Promise<void> {
    const name = user.value.name.trim()
    if (name.length < 2) {
      return util.error(TEXT[home.lang].INVALID_NAME)
    }
    if (password.value.length > 7 && password.value !== checkedPassword.value) {
      return util.error(TEXT[home.lang].DIFFERENT_PASSWORD)
    }
    if (password.value.length > 7 && util.filters.password.test(password.value) === false) {
      return util.error(TEXT[home.lang].INVALID_PASSWORD)
    }

    const fd = new FormData()
    fd.append("name", user.value.name)
    fd.append("password", password.value.length < 1 ? "" : SHA256(password.value).toString())
    fd.append("signature", user.value.signature)
    if (newProfile.value) {
      fd.append("profile", newProfile.value)
    }

    const response = await axios.patch(`${TSBOARD.API}/auth/update`, fd, {
      headers: {
        Authorization: `Bearer ${user.value.token}`,
      },
    })
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].FAILED_UPDATE_MYINFO} (${data.error})`)
    }

    await loadUserInfo()
    password.value = ""
    checkedPassword.value = ""
    util.success(TEXT[home.lang].MYINFO_SUCCESS)
  }

  return {
    user,
    password,
    checkedPassword,
    emailRule,
    passwordRule,
    nameRule,
    login,
    loadOAuthUserInfo,
    logout,
    updateMyInfo,
    selectProfileImage,
    updateAccessToken,
    updateUserToken,
  }
})
