
/**
 * Anti-jitter function (can be used to prevent duplicate submissions)
 * When an event is continuously triggered, no more events are triggered for a certain period of time before the event handler function is executed once.
 * If the event is triggered again before the set time arrives, the delay starts again. This means that when a user keeps triggering the function
 * and the interval between each trigger function is less than the established time, then the anti-shake case will be executed only once.
 *
 * @param func Execute function
 * @param wait time duration
 * @param immediate Immediate implementation
 */
export const _debounce = (fn, wait, immediate) => {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      // If it has already been executed, it will not be executed again
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait)
      if (callNow) {
        fn.apply(this, arguments)
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, wait);
    }
  }
}


/**
 * Throttling function
 * When the event is continuously triggered, it is guaranteed that the event handler is called only once within a certain period of time, meaning that
 * Assuming a user keeps triggering this function and each trigger is less than a given value, the function throttle will be called every this time
 * Summarize the difference between anti-shake and throttling in one sentence: anti-shake is changing multiple executions to the last execution, and throttling is changing multiple executions to every other execution
 * Implementing function throttling: timestamps and timers
 *
 * @param func Execute function
 * @param wait time duration
 * @param options Execute Immediately
 * In options  leading：false indicates that the first execution of 
 * trailing: false indicates that the stop trigger callback is disabled
 */
export const _throttle = (fn, wait, options = {}) => {
  let timer;
  let previous = 0;
  let throttled = function () {
    let now = +new Date();
    // Remaining time without triggering the next function
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    if (remaining < 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = now;
      fn.apply(this, arguments)
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(() => {
        previous = options.leading === false ? 0 : new Date().getTime();
        timer = null;
        fn.apply(this, arguments);
      }, remaining);
    }
  }
  return throttled;
}

/**
 * Unique an array object based on one of its fields
 * item.name  [{name:1}] De-duplicate each data name according to its "value"
 * */
export const unique = (arr, val) => {
  const res = new Map();
  return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
}


/**
 * filter NA
 * @param obj
 * @returns {*}
 */
export function filterObjTrim(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for (var key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] == undefined || obj[key] == 'undefined' || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}
