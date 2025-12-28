export const formatHours = (minutes) => (minutes / 60).toFixed(1);

export const formatNumber = (num) => new Intl.NumberFormat().format(num);

export const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};
