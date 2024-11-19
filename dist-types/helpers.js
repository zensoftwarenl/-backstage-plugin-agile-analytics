import moment from 'moment';
// encoding
export function encodeApiKey(key) {
    const encoded = Buffer.from(`${key}`).toString('base64');
    return encoded;
}
// timeperiod
export function getStartDate(amount, period) {
    return moment()
        .set({ hours: 0, minutes: 0, seconds: 0 })
        .subtract(amount, period)
        .unix();
}
export function getEndDate() {
    return moment().set({ hours: 23, minutes: 59, seconds: 59 }).unix();
}
// si page
export function getUniqueListByParent(arr) {
    const uniqueListOfLatest = arr.reduce((acc, item) => {
        const isInList = acc.find(ticket => ticket.parent.key === item.parent.key);
        if (isInList) {
            const isLater = item.timestamp >= isInList.timestamp;
            if (isLater) {
                return acc.map(task => {
                    if (task.parent.key === item.parent.key) {
                        return item;
                    }
                    return task;
                });
            }
            return acc;
        }
        return [...acc, item];
    }, []);
    return uniqueListOfLatest;
}
