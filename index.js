var Bucket = require('./lib/bucket')
  , BucketSize = require('./lib/bucket-size')
  , microtime = require('microtime')

module.exports = function timebucket () {
  var args = [].slice.call(arguments);
  var size = 'ms';
  var value;
  var bucketStr;
  args.forEach(function (arg) {
    if (typeof arg === 'string') {
      if (arg.match(Bucket.regex)) {
        bucketStr = arg;
      }
      else if (arg.match(BucketSize.regex)) {
        size = arg;
      }
      else {
        if (Number.isNaN && !Number.isNaN(Number(arg))) {
          value = Number(arg);
        }
        // node 0.6
        else if (!Number.isNaN && arg.match(/^[0-9]+$/)) {
          value = Number(arg);
        }
      }
    }
    else if (typeof arg === 'number') {
      value = arg;
    }
    else if (arg instanceof Date) {
      value = arg.getTime();
    }
  });
  if (bucketStr) return Bucket.fromString(bucketStr);
  if (typeof value === 'undefined') {
    if (size === 'µs') return new Bucket('µs', microtime.now());
    return new Bucket('ms', (new Date()).getTime()).resize(size);
  }
  return new Bucket(size, value);
};

module.exports.fromNumber = function (num) {
  return Bucket.fromNumber(num);
};
