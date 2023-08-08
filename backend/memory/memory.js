const v8= require('v8');
const totalHeapSize=v8.getHeapStatistics().total_available_size
let totalHeapSizeInGB=(totalHeapSize / 1024 / 1024 / 1024).toFixed(2)
console.log( totalHeapSizeInGB);