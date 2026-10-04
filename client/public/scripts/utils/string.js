export function capitalize(value) {
    if (value == null) return null;

    return value.charAt(0).toUpperCase()
        + value.slice(1).toLowerCase();
}

export function formatNumber(value) {
    return formatNumberShort(value);
}

export function formatNumberShort(value) {
    if (value == null) return null;

    value = Math.abs(Number(value));
    if (value >= 1.0e+9) return (value / 1.0e+9).toFixed(2) + 'B';
    if (value >= 1.0e+6) return (value / 1.0e+6).toFixed(2) + 'M';
    if (value >= 1.0e+3) return (value / 1.0e+3).toFixed(2) + 'K';

    return value.toFixed(2);
}

export function formatNumberLong(value) {
    if (value == null) return null;

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatPercent(value) {
    if (value == null) return null;

    return (value * 100).toFixed(2) + '%';
}

export function formatDate(value, options) {
    if (value == null) return null;
    
    options = options || { month: 'short', day: 'numeric', year: 'numeric' };
    let date = Array.isArray(value) ? new Date(value[0], value[1] - 1, value[2]) : new Date(value);

    return date.toLocaleDateString('en-US', options);
}

export function formatMoney(value, currency) {
    if (value == null) return null;
    
    return currency + formatNumber(value);
}