export function toStringUpper(str) {
    return str.toUpperCase();
}

export function trim(str) {
    return str.trim();
}

export function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function applyPattern(pattern, firstname, lastname) {
    firstname = capitalizeFirstLetter(firstname);
    lastname = capitalizeFirstLetter(lastname);

    return pattern.replace(/%[fFilL]/g, match => {
        switch (match) {
            case '%f':
                return firstname;
            case '%F':
                return toStringUpper(firstname);
            case '%i':
                return firstname[0].toUpperCase() + '.';
            case '%l':
                return lastname;
            case '%L':
                return toStringUpper(lastname);
            case '%I':
                return lastname[0].toUpperCase() + '.';
            default:
                return match;
        }
    }).trim();
}
