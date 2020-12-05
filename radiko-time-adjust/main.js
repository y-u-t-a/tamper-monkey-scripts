// ==UserScript==
// @name         radiko time skip
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        https://radiko.jp/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.onkeydown = function(event) {
        let time = 5 // 秒送り・戻しするデフォルト時間
        if (event.shiftKey && event.altKey) {
            time = 30
        } else if (event.shiftKey) {
            time = 60
        } else if (event.altKey) {
            time = 15
        }
        switch (event.key) {
            case "ArrowLeft":
                timeAdjust(time * -1)
                break
            case "ArrowRight":
                timeAdjust(time)
                break
            default:
                break
        }
    }
})();

/**
 * 時間を sec 秒足す
 * @param sec {Number}
 */
function timeAdjust(sec) {
    document.getElementById("pause").click() // 一時停止
    const url = document.getElementById("url")
    const value = url.value
    const nowValue = value.split("&seek=")[1] // 現在の再生位置 yyyyMMddHHmmss 形式の日時（String）
    // 現在の再生位置を Date オブジェクトに変換し、UNIXエポックから経過したミリ秒に変換し、sec 秒加算する
    const addedUnixEpoch = stringToDate(nowValue).getTime() + (sec * 1000)
    const addedValue = dateToString(new Date(addedUnixEpoch))
    url.setAttribute("value", value.replace(/&seek=.*/, "&seek=" + addedValue))
    document.getElementById("play").click() // 再生
}

/**
 * yyyyMMddHHmmss な文字列を Date オブジェクトに変換
 * @param {string} strDate
 */
function stringToDate(strDate) {
    const year = parseInt(strDate.substring(0, 4))
    const month = parseInt(strDate.substring(4, 6))
    const date = parseInt(strDate.substring(6, 8))
    const hour = parseInt(strDate.substring(8, 10))
    const min = parseInt(strDate.substring(10, 12))
    const sec = parseInt(strDate.substring(12, 14))
    return new Date(year, month, date, hour, min, sec)
}

/**
 * Date オブジェクトを yyyyMMddHHmmss 形式の文字列に変換
 * @param {Date} date 変換対象の Date オブジェクト
 */
function dateToString(date) {
    const strYear = String(date.getFullYear()).padStart(4, '0')
    const strMonth = String(date.getMonth()).padStart(2, '0')
    const strDate = String(date.getDate()).padStart(2, '0')
    const strHour = String(date.getHours()).padStart(2, '0')
    const strMin = String(date.getMinutes()).padStart(2, '0')
    const strSec = String(date.getSeconds()).padStart(2, '0')
    return strYear + strMonth + strDate + strHour + strMin + strSec
}
