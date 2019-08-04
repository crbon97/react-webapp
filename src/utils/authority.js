import {USER_MANV,USER_TOKEN,USER_REMEMBER,USER_MACH} from '../utils/constants'

export function setAuthority(maNV, token, remember, maCH) {
    localStorage.setItem(USER_MANV, maNV)
    localStorage.setItem(USER_TOKEN, token)
    localStorage.setItem(USER_REMEMBER, remember)
    localStorage.setItem(USER_MACH, maCH)
}

export function getAuthority() {
    return {
        maNV: localStorage.getItem(USER_MANV),
        token: localStorage.getItem(USER_TOKEN),
        remember: localStorage.getItem(USER_REMEMBER) === 'true' ? true : false,
        maCH: localStorage.getItem(USER_MACH)
    }
}

export function getAuthorityWithKey(key) {
    if(key === USER_REMEMBER) {
        return localStorage.getItem(key) === 'true' ? true : false
    }
    return localStorage.getItem(key)
}

export function removeAuthority() {
    localStorage.removeItem(USER_MANV)
    localStorage.removeItem(USER_TOKEN)
    localStorage.removeItem(USER_REMEMBER)
    localStorage.removeItem(USER_MACH)
}