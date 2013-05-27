var BucketSize = require('./bucket-size');

function Bucket (spec, value) {
  this.size = new BucketSize(spec);
  this.value = Number(value);
}
module.exports = Bucket;

Bucket.regex = /^((?:\d+)?(?:[a-zA-Zµ]{1,2}))?(\d+)$/;

Bucket.fromString = function (bucketStr) {
  var match = bucketStr.match(Bucket.regex);
  if (!match) return new Error('invalid bucket string: ' + bucketStr);
  return new Bucket(match[1], match[2]);
};

Bucket.prototype.toString = function () {
  return this.size + this.value;
};

Bucket.prototype.toMilliseconds = function () {
  return this.size.toMilliseconds() * this.value;
};

Bucket.prototype.resize = function (spec) {
  var size = new BucketSize(spec);
  if (size.granularity === this.size.granularity && size.value === this.size.value) return this;
  var value = Math.floor(this.toMilliseconds() / size.toMilliseconds());
  return new Bucket(size.spec, value);
};

Bucket.prototype.add = function (value) {
  this.value += Math.floor(value);
  return this;
};

Bucket.prototype.subtract = function (value) {
  this.value -= Math.floor(value);
  return this;
};

Bucket.prototype.multiply = function (value) {
  this.value = Math.floor(this.value * value);
  return this;
};

Bucket.prototype.divide = function (value) {
  this.value = Math.floor(this.value / value);
  return this;
};