const getFormattedDate = (date) => {
    if (date) {
        const parts = date.split('T');
        if (parts[1]) {
            let time = parts[1].split('.')[0];
            const timeparts = time.split(':');
            if (timeparts[0]) {
                timeparts[0] = parseInt(timeparts[0]) + 3;
                time = timeparts.join(':');
                return `${timeparts[0]}:${timeparts[1]}      ${parts[0]}`;
            }
        }
    }
};

export default getFormattedDate;