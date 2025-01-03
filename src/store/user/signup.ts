import { ref } from "vue"
import { SHA256 } from "crypto-js"
import { defineStore } from "pinia"
import { useRouter } from "vue-router"
import { useUtilStore } from "../util"
import { useAuthStore } from "./auth"
import { useHomeStore } from "../home"
import { TEXT } from "../../messages/store/user/auth"
import { TSBOARD } from "../../../tsboard.config"
import axios from "axios"
import { SignupResult } from "../../interface/auth_interface"
import { ResponseData } from "../../interface/util_interface"

export const useSignupStore = defineStore("signup", () => {
  const router = useRouter()
  const util = useUtilStore()
  const auth = useAuthStore()
  const home = useHomeStore()
  const verificationCode = ref<string>("")
  const loading = ref<boolean>(false)

  // 아이디(이메일) 중복 체크하기
  async function checkEmail(): Promise<void> {
    if (auth.user.id.length < 6) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }

    const fd = new FormData()
    fd.append("email", auth.user.id.trim())

    const response = await axios.post(`${TSBOARD.API}/auth/checkemail`, fd)
    const data = response.data as ResponseData<null>
    if (!data || data.success === false) {
      util.error(`${TEXT[home.lang].EXIST_EMAIL} (${data.error})`)
      auth.user.id = ""
      return
    }
    util.success(TEXT[home.lang].AVAILABLE_EMAIL)
  }

  // 이름 중복 체크하기
  async function checkName(): Promise<void> {
    if (auth.user.name.length < 2) {
      return util.error(TEXT[home.lang].INVALID_NAME)
    }

    const fd = new FormData()
    fd.append("name", auth.user.name.trim())

    const response = await axios.post(`${TSBOARD.API}/auth/checkname`, fd)
    const data = response.data as ResponseData<null>

    if (!data || data.success === false) {
      util.error(`${TEXT[home.lang].EXIST_NAME} (${data.error})`)
      auth.user.name = ""
      return
    }
    util.success(TEXT[home.lang].AVAILABLE_NAME)
  }

  // 가입 양식 제출받기
  async function submit(): Promise<void> {
    if (util.filters.email.test(auth.user.id) === false) {
      return util.error(TEXT[home.lang].INVALID_EMAIL)
    }
    if (util.filters.password.test(auth.password) === false) {
      return util.error(TEXT[home.lang].INVALID_PASSWORD)
    }
    if (auth.password !== auth.checkedPassword) {
      return util.error(TEXT[home.lang].DIFFERENT_PASSWORD)
    }
    if (auth.user.name.length < 2) {
      return util.error(TEXT[home.lang].INVALID_NAME)
    }

    loading.value = true

    const fd = new FormData()
    fd.append("email", auth.user.id)
    fd.append("password", SHA256(auth.password).toString())
    fd.append("name", auth.user.name.trim())
    fd.append("lang", home.lang.toString())

    try {
      const response = await axios.post(`${TSBOARD.API}/auth/signup`, fd)
      const data = response.data as ResponseData<SignupResult>
      if (!data || data.success === false) {
        util.error(`${TEXT[home.lang].FAILED_ADD_USER} (${data.error})`)
        return
      }

      if (data.result.sendmail === false) {
        util.success(TEXT[home.lang].SIGNUP_COMPLETE)
        util.go("login")
        return
      }

      util.success(`${auth.user.id} ${TEXT[home.lang].SENT_VERIFICATION}`)
      router.push({ name: "verify", params: { target: data.result.target } })
    } finally {
      loading.value = false
    }
  }

  // 인증 완료하기
  async function verify(target: number): Promise<void> {
    if (target < 1) {
      return util.error(TEXT[home.lang].WRONG_VERIFY_TARGET)
    }
    if (verificationCode.value.length !== 6) {
      return util.error(TEXT[home.lang].WRONG_VERIFICATION_LENGTH)
    }
    if (auth.user.id.length < 1) {
      util.error(TEXT[home.lang].VERIFY_EMPTY_EMAIL)
      util.go("signup")
      return
    }
    if (auth.user.name.length < 1) {
      util.error(TEXT[home.lang].VERIFY_EMPTY_NAME)
      util.go("signup")
      return
    }
    if (auth.password.length < 8) {
      util.error(TEXT[home.lang].VERIFY_EMPTY_PASSWORD)
      util.go("signup")
      return
    }

    const fd = new FormData()
    fd.append("target", target.toString())
    fd.append("code", verificationCode.value)
    fd.append("email", auth.user.id.trim())
    fd.append("name", auth.user.name.trim())
    fd.append("password", SHA256(auth.password).toString())
    fd.append("lang", home.lang.toString())

    const response = await axios.post(`${TSBOARD.API}/auth/verify`, fd)
    const data = response.data as ResponseData<null>

    if (!data || data.success === false) {
      return util.error(`${TEXT[home.lang].WRONG_VERIFICATION_CODE} (${data.error})`)
    }
    util.success(TEXT[home.lang].SIGNUP_COMPLETE)
    util.go("login")
  }

  return {
    loading,
    verificationCode,
    checkEmail,
    checkName,
    submit,
    verify,
  }
})
