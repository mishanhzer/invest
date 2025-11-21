export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
export function getCommonPart(s1, s2) {
    if (typeof s1 !== 'string' || typeof s2 !== 'string')
        return '';
    const l = Math.min(s1.length, s2.length);
    let i = 0;
    while (i < l && s1.charAt(i) === s2.charAt(i))
        i++;
    return s1.substring(0, i);
}
//# sourceMappingURL=string.js.map