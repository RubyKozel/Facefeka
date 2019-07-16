const getFormattedDate = (date) => {
    if (date) {
        const parts = date.split('T');
        if (parts[1]) {
            const timeparts = parts[1].split('.')[0].split(':');
            if (timeparts[0]) {
                timeparts[0] = parseInt(timeparts[0]) + 3;
                return `${timeparts[0]}:${timeparts[1]}      ${parts[0]}`;
            }
        }
    }
};

export default getFormattedDate;