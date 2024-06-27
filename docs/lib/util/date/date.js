Date.toIso = function(v) {
//Date.prototype.toIso = function(v) {
    v = v || new Date()
    const s = [v.getFullYear(), (v.getMonth() + 1), v.getDate(), v.getHours(), v.getMinutes(), v.getSeconds()].map(s=>`${s}`.padStart(2, '0'))
    const offset = v.getTimezoneOffset()
    if (0===offset) { return `${s.slice(0,2).join('-')}T${s.slice(3,5).join(':')}Z` }
    const tz = {
        sign: offset < 0 ? '+' : '-',
        h: `${Math.abs(offset) / 60}`,
        m: `${Math.abs(offset) % 60}`,
    }
    return `${s.slice(0,3).join('-')}T${s.slice(3,6).join(':')}${tz.sign}${tz.h.padStart(2,'0')}:${tz.m.padStart(2,'0')}`
}

