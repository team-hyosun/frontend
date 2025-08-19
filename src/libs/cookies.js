import Cookies from 'js-cookie'

export const getCookie = (name) => Cookies.get(name)
export const setCookie = (name, value, options) => Cookies.set(name, value, options)
export const removeCookie = (name) => Cookies.remove(name)