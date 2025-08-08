/**
 * Polyfills for better browser compatibility
 * Supports Edge, Chrome, Safari, Mozilla Firefox
 */

// Intersection Observer polyfill for older browsers
if (!window.IntersectionObserver) {
  // Fallback for IntersectionObserver
  window.IntersectionObserver = class {
    constructor(callback, options = {}) {
      this.callback = callback;
      this.options = options;
      this.entries = new Map();
    }
    
    observe(element) {
      // Simple visibility check fallback
      const checkVisibility = () => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !this.entries.has(element)) {
          this.entries.set(element, true);
          this.callback([{
            target: element,
            isIntersecting: true,
            intersectionRatio: 1
          }]);
        } else if (!isVisible && this.entries.has(element)) {
          this.entries.delete(element);
          this.callback([{
            target: element,
            isIntersecting: false,
            intersectionRatio: 0
          }]);
        }
      };
      
      // Check on scroll and resize
      window.addEventListener('scroll', checkVisibility);
      window.addEventListener('resize', checkVisibility);
      checkVisibility(); // Initial check
    }
    
    unobserve(element) {
      this.entries.delete(element);
    }
    
    disconnect() {
      this.entries.clear();
    }
  };
}

// ResizeObserver polyfill
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.observedElements = new Set();
      this.rafId = null;
    }
    
    observe(element) {
      this.observedElements.add(element);
      element._lastWidth = element.offsetWidth;
      element._lastHeight = element.offsetHeight;
      
      if (!this.rafId) {
        this.startObserving();
      }
    }
    
    unobserve(element) {
      this.observedElements.delete(element);
      if (this.observedElements.size === 0) {
        this.stopObserving();
      }
    }
    
    disconnect() {
      this.observedElements.clear();
      this.stopObserving();
    }
    
    startObserving() {
      const check = () => {
        const entries = [];
        this.observedElements.forEach(element => {
          const newWidth = element.offsetWidth;
          const newHeight = element.offsetHeight;
          
          if (newWidth !== element._lastWidth || newHeight !== element._lastHeight) {
            entries.push({
              target: element,
              contentRect: {
                width: newWidth,
                height: newHeight,
                left: 0,
                top: 0,
                right: newWidth,
                bottom: newHeight
              }
            });
            element._lastWidth = newWidth;
            element._lastHeight = newHeight;
          }
        });
        
        if (entries.length > 0) {
          this.callback(entries);
        }
        
        this.rafId = requestAnimationFrame(check);
      };
      
      this.rafId = requestAnimationFrame(check);
    }
    
    stopObserving() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  };
}

// Fetch polyfill for IE11
if (!window.fetch) {
  window.fetch = async function(url, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const method = options.method || 'GET';
      
      xhr.open(method, url);
      
      // Set headers
      if (options.headers) {
        Object.keys(options.headers).forEach(key => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }
      
      xhr.onload = function() {
        const response = {
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          text: () => Promise.resolve(xhr.responseText),
          json: () => Promise.resolve(JSON.parse(xhr.responseText))
        };
        resolve(response);
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error'));
      };
      
      xhr.send(options.body || null);
    });
  };
}

// Promise polyfill for very old browsers
if (!window.Promise) {
  window.Promise = class {
    constructor(executor) {
      this.state = 'pending';
      this.value = undefined;
      this.handlers = [];
      
      const resolve = (value) => {
        if (this.state === 'pending') {
          this.state = 'fulfilled';
          this.value = value;
          this.handlers.forEach(handler => handler.onFulfilled(value));
        }
      };
      
      const reject = (reason) => {
        if (this.state === 'pending') {
          this.state = 'rejected';
          this.value = reason;
          this.handlers.forEach(handler => handler.onRejected(reason));
        }
      };
      
      try {
        executor(resolve, reject);
      } catch (error) {
        reject(error);
      }
    }
    
    then(onFulfilled, onRejected) {
      return new Promise((resolve, reject) => {
        if (this.state === 'fulfilled') {
          try {
            const result = onFulfilled ? onFulfilled(this.value) : this.value;
            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else if (this.state === 'rejected') {
          try {
            if (onRejected) {
              const result = onRejected(this.value);
              resolve(result);
            } else {
              reject(this.value);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          this.handlers.push({ onFulfilled, onRejected, resolve, reject });
        }
      });
    }
    
    catch(onRejected) {
      return this.then(null, onRejected);
    }
    
    static resolve(value) {
      return new Promise(resolve => resolve(value));
    }
    
    static reject(reason) {
      return new Promise((resolve, reject) => reject(reason));
    }
  };
}

// Array.from polyfill for IE11
if (!Array.from) {
  Array.from = function(arrayLike, mapFn, thisArg) {
    const items = Object(arrayLike);
    const len = parseInt(items.length) || 0;
    const result = new Array(len);
    
    for (let i = 0; i < len; i++) {
      const value = items[i];
      result[i] = mapFn ? mapFn.call(thisArg, value, i) : value;
    }
    
    return result;
  };
}

// Object.assign polyfill for IE11
if (!Object.assign) {
  Object.assign = function(target) {
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    
    const to = Object(target);
    
    for (let index = 1; index < arguments.length; index++) {
      const nextSource = arguments[index];
      
      if (nextSource != null) {
        for (const nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    
    return to;
  };
}

// Element.matches polyfill for IE11
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || 
                              Element.prototype.webkitMatchesSelector;
}

// Element.closest polyfill for IE11
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// NodeList.forEach polyfill for IE11
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Check for modern JS features and provide fallbacks
export const browserSupport = {
  intersectionObserver: !!window.IntersectionObserver,
  resizeObserver: !!window.ResizeObserver,
  fetch: !!window.fetch,
  promise: !!window.Promise,
  webGL: (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
      return false;
    }
  })(),
  serviceWorker: 'serviceWorker' in navigator,
  localStorage: (() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  })()
};

console.log('Browser support detected:', browserSupport);

export default browserSupport;