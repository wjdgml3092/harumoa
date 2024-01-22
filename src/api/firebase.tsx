import { initializeApp } from 'firebase/app'
import { child, get, getDatabase, ref, set, update } from 'firebase/database'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  UserCredential,
} from '@firebase/auth'
import {
  Custom,
  ICategory,
  IFixedExpense,
  MonthDetail,
  TotalPrice,
} from '../types'
import { initialCustom } from '../constants/config'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const provider = new GoogleAuthProvider()

const db = getDatabase(app)

//localStorage 세팅
export const localStorageSetting = (category: ICategory) => {
  localStorage.setItem('category_income', category.income)

  localStorage.setItem('category_expense', category.expense)
}

//user가 로그인중인가..
export async function onUserStateChange(callback: Function) {
  onAuthStateChanged(auth, (user) => {
    callback(user)
  })
}

//유저 가져오기
async function getUser(user: UserCredential['user']) {
  const { uid } = user
  return get(child(ref(getDatabase(app)), `${uid}/users`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        localStorageSetting(snapshot.val().custom.category)
        return true
      } else {
        return false
      }
    })
    .catch((error) => {
      return error
    })
}

//유저 세팅 (첫 로그인 시)
async function setUser(userCredential: UserCredential['user']) {
  const { uid, email } = userCredential
  console.log(uid, email)

  const reqData = {
    //TODO : default 값 정의 필요

    email: email,
    custom: initialCustom,
  }

  return set(ref(db, `${uid}/users`), reqData).then(() =>
    localStorageSetting(reqData.custom.category)
  )
}

//로그인
export async function LoginGoogle() {
  try {
    const res = await signInWithPopup(auth, provider)
    console.log(res)

    if (res.user) {
      const isUser = await getUser(res.user)

      if (!isUser) {
        const settingUser = await setUser(res.user)
      }
    }
    return { success: true, message: '로그인 되었습니다.', data: res.user }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '로그인에 실패했습니다. 다시 시도해주세요.'
    return {
      success: false,
      message: message,
    }
  }
}

//로그아웃
export async function LogoutGoogle() {
  try {
    signOut(auth)
    return { success: true, message: '로그아웃이 완료되었습니다.' }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '로그아웃에 실패했습니다. 다시 시도해주세요.'
    return {
      success: false,
      message: message,
    }
  }
}

// async function getIdToken(user: UserCredential['user'] | null) {
//   //idtoken get
//   if (user) {
//     return user
//       .getIdTokenResult(true) //token param1 -> true : force refresh token
//       .then((res) => {
//         return { isSuccess: true, res: res }
//       })
//       .catch((error) => {
//         if (error instanceof Error) {
//           console.log('getidToken err', error.message)
//         }
//         return { isSuccess: false, res: error.message }
//       })
//   }
// }

//회원탈퇴
// export async function revokeAccessUser() {
//   const user = auth.currentUser

//   const getToken = await getIdToken(user)

//   if (user && getToken?.isSuccess) {
//     const credential = GoogleAuthProvider.credential(getToken?.res)

//     // const a = await signInWithCredential(auth, credential)
//     // console.log('a', a)

//     return reauthenticateWithCredential(user, credential) //재인증
//       .then((res) => {
//         console.log('res', res)

//         // User re-authenticated.
//         deleteUser(res.user).then(() =>
//           set(ref(db, `${userId}`), null).then(() => true)
//         )
//       })
//       .catch((error) => {
//         if (error instanceof Error) {
//           console.log('revoke err', error.message)
//         }
//         return false
//       })
//   }

//   // if (user) {
//   //   const credential = GoogleAuthProvider.credential()

//   //   return reauthenticateWithCredential(user, credential) //재인증
//   //     .then((res) => {
//   //       // User re-authenticated.
//   //       deleteUser(res.user).then(() =>
//   //         set(ref(db, `${userId}`), null).then(() => true)
//   //       )
//   //     })
//   //     .catch((error) => {
//   //       if (error instanceof Error) {
//   //         console.log(error.message)
//   //       }
//   //       return false
//   //     })
//   // }

//   // if (user) {
//   //   return user
//   //     .getIdToken(true) //token
//   //     .then(
//   //       (res) => console.log(res)

//   //       // deleteUser(user).then(() =>
//   //       //   set(ref(db, `${userId}`), null).then(() => true)
//   //       // )
//   //     )
//   //     .catch((error) => {
//   //       if (error instanceof Error) {
//   //         console.log(error.message)
//   //       }
//   //       return false
//   //     })
//   // }

//   // if (user) {
//   //   return deleteUser(user)
//   //     .then(() => set(ref(db, `${userId}`), null).then(() => true))
//   //     .catch((error) => {
//   //       if (error instanceof Error) {
//   //         console.log(error.message)
//   //       }
//   //       return false
//   //     })
//   // }
// }

// 캘린더 데이터 가져오기
export async function getBooks(year: string, month: string) {
  const uid = localStorage.getItem('user')

  try {
    const snapshot = await get(child(ref(db), `${uid}/books/${year}/${month}`))

    if (snapshot.exists()) {
      return snapshot.val()
    } else {
      return {}
    }
  } catch (error) {
    console.error(error)
  }
}

// 커스텀 가져오기
export async function getCustom(): Promise<Custom> {
  const uid = localStorage.getItem('user')

  try {
    const snapshot = await get(child(ref(db), `${uid}/users/custom`))
    if (snapshot.exists()) {
      return snapshot.val() as Custom
    } else {
      return initialCustom
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

//커스텀 수정하기
export async function setCustom(reqData: Custom) {
  const uid = localStorage.getItem('user')
  const databaseRef = ref(db, `${uid}/users/custom`)

  try {
    await set(databaseRef, reqData)
    return { success: true, message: '설정이 저장되었습니다.' }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '설정을 저장하는 동안 오류가 발생했습니다.'
    return {
      success: false,
      message: message,
    }
  }
}

// 고정 지출 저장
export async function setFixedExpense(
  reqData: IFixedExpense,
  deleteList?: string[]
) {
  const uid = localStorage.getItem('user')

  const databaseRef = ref(db, `${uid}/users/custom/fixed_expense`)

  try {
    // newData를 사용하여 데이터 업데이트
    await update(databaseRef, reqData)

    if (deleteList) {
      // deleteList에 있는 각 키에 null 값을 설정하여 삭제
      const deletes: { [key: string]: null } = {}
      deleteList.forEach((key) => {
        deletes[key] = null
      })
      await update(databaseRef, deletes)
    }
    return { success: true, message: '고정 지출이 저장되었습니다.' }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '고정 지출을 저장하는 동안 오류가 발생했습니다.'
    return {
      success: false,
      message: message,
    }
  }
}

//가계부 total 값 업데이트
export async function setTotalPrice(date: string[], reqData: TotalPrice) {
  const uid = localStorage.getItem('user')
  return set(ref(db, `${uid}/books/${date[0]}/${date[1]}/total`), reqData).then(
    () => true
  )
}

//가계부, 다이어리 저장 메소드
export async function setBook(
  date: string,
  reqData: MonthDetail | null,
  totalPrice: TotalPrice,
  isDelete?: boolean
) {
  const uid = localStorage.getItem('user')

  return set(ref(db, `${uid}/books/${date}/`), reqData)
    .then(() => {
      if (isDelete) {
        //삭제
        return { success: true, message: '가계부가 삭제되었습니다.' }
      } else {
        //수정,작성
        return { success: true, message: '가계부가 저장되었습니다.' }
      }
    })
    .catch((error) => {
      const message =
        error instanceof Error
          ? error.message
          : '오류가 발생했습니다. 다시 시도해주세요.'
      return {
        success: false,
        message: message,
      }

      setTotalPrice(date.split('-'), totalPrice)
    })
}
