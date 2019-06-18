function debounce(fn, wait, immediate) {
    let timer = null;
    let callNow = immediate;
    return function () {
        if (callNow) {
            fn.apply(this, arguments);
            callNow = false;
        }
        let that = this;
        let arg = Array.prototype.slice.apply(arguments);
        if (timer) {
            clearTimeout(timer);
            setTimeout(() => {
                fn.apply(that, arg);
                callNow = !immediate ? true : false;
            }, wait);
        }
    }
}

export { debounce };