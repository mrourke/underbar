(function () {
  'use strict';

  window._ = {};

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function (val) {
    return val;
  };

  // Return an array of the first n elements of an array. If n is undefined,
  // returns just the first element.
  _.first = function (array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, returns just the
  // last element.
  _.last = function (array, n) {
    if (n === 0) { return []; }
    return n === undefined ? array[array.length - 1] : array.slice(-n);
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function (collection, iterator) {
    if (typeof collection !== 'object' || typeof iterator !== 'function') {
      return null;
    }
    if (Array.isArray(collection)) {
      for (var i = 0; i < collection.length; i++) {
        iterator(collection[i], i, collection);
      }
    } else if (typeof collection === "object" && collection !== null) {
      for (var p in collection) {
        iterator(collection[p], p, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function (array, target) {
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function (item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function (collection, test) {
    var filtered = [];
    _.each(collection, function (element) {
      if (test(element)) {
        filtered.push(element);
      }
    });
    return filtered;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function (collection, test) {
    return _.filter(collection, function (element) {
      return !test(element);
    });
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function (array) {
    var hash = {};
    var result = [];
    _.each(array, function (element) {
      hash[element] = element;
    });
    _.each(hash, function (value) {
      result.push(value);
    });
    return result;
  };


  // Return the results of applying an iterator to each element.
  _.map = function (collection, iterator) {
    var mapped = [];
    _.each(collection, function (e, i, c) {
      mapped.push(iterator(e, i, c));
    });
    return mapped;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function (collection, key) {
    return _.map(collection, function (item) {
      return item[key];
    });
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(accumulator, item) for each item. accumulator should be
  // the return value of the previous iterator call.
  //
  // You can pass in a starting value for the accumulator as the third argument
  // to reduce. If no starting value is passed, the first element is used as
  // the accumulator, and is never passed to the iterator. In other words, in
  // the case where a starting value is not passed, the iterator is not invoked
  // until the second element, with the first element as it's second argument.
  //
  _.reduce = function (collection, iterator, accumulator) {
    var skip = arguments.length < 3;
    _.each(collection, function (e, i, c) {
      if (skip) {
        accumulator = e;
        skip = false;
      } else {
        accumulator = iterator(accumulator, e, i, c);
      }
    });
    return accumulator;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function (collection, target) {
    return _.reduce(collection, function (wasFound, item) {
      return wasFound || item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function (collection, iterator) {
    if (iterator === undefined) { iterator = _.identity; }
    return _.reduce(collection, function (all, element) {
      return all && Boolean(iterator(element));
    }, true);
  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function (collection, iterator) {
    if (iterator === undefined) { iterator = _.identity; }
    return _.reduce(collection, function (sum, element) {
      return (sum || Boolean(iterator(element)));
    }, false);
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  _.extend = function (obj) {
    _.each(arguments, function (value) {
      _.each(value, function (value, key) {
        obj[key] = value;
      })
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function (obj) {
    delete arguments[0];
    _.each(arguments, function (value) {
      _.each(value, function (value, key) {
        if (!obj.hasOwnProperty(key)) obj[key] = value;
      });
    });
    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function (func) {
    var alreadyCalled = false;
    var result;

    return function () {
      if (!alreadyCalled) {
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      return result;
    };
  };

  // Memorize an expensive function's results by storing them. You may assume
  // that the function takes only one argument and that it is a primitive.
  // memoize could be renamed to oncePerUniqueArgumentList; memoize does the
  // same thing as once, but based on many sets of unique arguments.
  //
  // _.memoize should return a function that, when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function (func) {
    var computed = {};
    return function (arg) {
      if (arg in computed) {
        return computed[arg];
      } else {
        computed[arg] = func.apply(this, arguments);
        return computed[arg];
      }
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function (func, wait) {
    var args = Array.prototype.slice.call(arguments, 2, arguments.length);
    setTimeout(function () {
      func.apply(this, args);
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function (array) {
    var duplicate = array.slice();
    var result = [];
    for (var i = 0, rand; i < array.length; i++) {
      rand = Math.floor(Math.random() * duplicate.length);
      result.push(duplicate.splice(rand, 1)[0])
    }
    return result;
  };


  /**
   * EXTRA CREDIT
   * =================
   *
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */

  // Calls the method named by functionOrKey on each value in the list.
  // Note: You will need to learn a bit about .apply to complete this.
  _.invoke = function (collection, functionOrKey, args) {
    var results = [];
    if (typeof functionOrKey === 'function') {
      _.each(collection, function (item, key, c) {
        results.push(functionOrKey.apply(item));
      });
    } else if (typeof functionOrKey === 'string') {
      _.each(collection, function (item, key, c) {
        results.push(collection[key][functionOrKey].apply(item));
      });
    }
    return results;
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function (collection, iterator) {
    if (typeof iterator === 'function') {
      collection.sort(function (a, b) {
        if (iterator(a) < iterator(b)) {
          return -1;
        } else if (iterator(a) > iterator(b)) {
          return 1;
        }
        return 0;
      });
    } else if (typeof iterator === 'string') {
      collection.sort(function (a, b) {
        if (a[iterator] < b[iterator]) {
          return -1;
        } else if (a[iterator] > b[iterator]) {
          return 1;
        }
        return 0;
      });
    }
    return collection;
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function () {
    var arrays = Array.prototype.slice.call(arguments);
    var longestArray = _.reduce(arrays, function (longest, array, index) {
      return longest[1] > array.length ? longest : [index, array.length];
    }, [0, 0]);
    return _.map(arrays[longestArray[0]], function (element, index) {
      var set = [];
      _.each(arrays, function (array) {
        set.push(array[index]);
      });
      return set;
    });
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function (nestedArray, result) {
    result = result || [];
    _.each(nestedArray, function (element, i, c) {
      if (Array.isArray(element)) {
        _.flatten(element, result);
      } else {
        result.push(element);
      }
    });
    return result;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function () {
    var arrays = Array.prototype.slice.call(arguments);
    function objectify(array) {
      return _.reduce(array, function (object, element) {
        object[element] = element;
        return object;
      }, {});
    }
    function intersection(obj1, obj2) {
      return _.reduce(obj1, function (intersection, value, key) {
        if (obj2.hasOwnProperty(key)) {
          intersection[key] = value;
        }
        return intersection;
      }, {});
    }
    var result = _.reduce(arrays.slice(1), function (common, set) {
      return intersection(common, objectify(set));
    }, objectify(arrays[0]));
    return _.map(result, function (value, key) {
      return value;
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function (array) {
    var arrays = Array.prototype.slice.call(arguments);
    var hash = _.reduce(arrays[0], function (obj, value) {
      obj[value] = value;
      return obj;
    }, {})
    _.each(arrays.slice(1), function (array) {
      _.each(array, function (element) {
        if (element in hash) {
          delete hash[element];
        }
      });
    });
    return _.map(hash, function (value, key) {
      return value;
    });
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.  See the Underbar readme for extra details
  // on this function.
  //
  // Note: This is difficult! It may take a while to implement.
  _.throttle = function (func, wait) {
    var initial = true;
    var lastCalled = Date.now();
    return function () {
      if (initial || Date.now() - lastCalled >= wait) {
        initial = false;
        lastCalled = Date.now();
        func.apply(null, Array.prototype.slice.call(arguments));
      }
    }
  };
} ());
