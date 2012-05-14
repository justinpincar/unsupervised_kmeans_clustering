var MAX_CLUSTERS = 10
var clusters = [];
var centroids = [];

eval(require('fs').readFileSync('./TRFQKKE12078BB11F9.js', 'utf8'));

console.log("Starting analysis (MAX_CLUSTERS: " + MAX_CLUSTERS + ")");

var segments = trackAnalysis.segments;
var segments_length = segments.length;
var segment_length = segments[0].timbre.length;

console.log("There are " + segments_length + " segments of length " + segment_length);

makeInitialAssignments();

var adjustments = 1;
while (adjustments > 0) {
  adjustments = 0;
  calculateCentroids();

  var clusters_next = [];

  for (var i=0; i<MAX_CLUSTERS; i++) {
    clusters_next.push([]);
  }

  for (var i=0; i<MAX_CLUSTERS; i++) {
    var cluster = clusters[i];

    for (var j=0; j<cluster.length; j++) {
      var element = cluster[j];
      var vector = element.timbre;

      bestCentroid = calculateBestCentroid(vector);
      if (bestCentroid != i) {
        adjustments += 1;
      }

      clusters_next[bestCentroid].push(element);
    }
  }

  clusters = clusters_next;
  console.log("Made " + adjustments + " adjustments");
}
printClusters();

function vectorDiff(a, b) {
  var diff = 0;
  for (var i=0; i<a.length; i++) {
    diff += Math.pow((a[i] - b[i]), 2);
  }
  return diff;
}

function makeInitialAssignments() {
  clusters = [];

  var chosen_segments = [];
  for (var i=0; i<MAX_CLUSTERS; i++) {
    var random_segment_id = Math.floor(Math.random() * segments_length);
    clusters.push([segments[random_segment_id]])
    chosen_segments.push(random_segment_id);
  }

  calculateCentroids();

  for (var i=0; i<segments_length; i++) {
    if (chosen_segments.indexOf(i) != -1) {
      continue;
    }

    var element = segments[i];
    var bestCentroid = calculateBestCentroid(element.timbre);

    clusters[bestCentroid].push(element);
  }

  printClusters();
  calculateCentroids();
}

function calculateCentroids() {
  centroids = [];
  for (var i=0; i<clusters.length; i++) {
    var cluster = clusters[i];
    var centroid = [];
    for (var j=0; j<segment_length; j++) {
      centroid.push(0.0);
    }

    for (var j=0; j<cluster.length; j++) {
      var vector = cluster[j].timbre;
      for (var k=0; k<segment_length; k++) {
        centroid[k] += vector[k];
      }
    }

    for (var j=0; j<segment_length; j++) {
      centroid[j] = centroid[j] / cluster.length
    }

    centroids.push(centroid);
  }
}

function calculateBestCentroid(vector) {
  var bestCentroid = -1;
  var bestCentroidDiff = Number.MAX_VALUE;
  for (var i=0; i<MAX_CLUSTERS; i++) {
    var centroid = centroids[i];
    var diff = vectorDiff(centroid, vector);
    if (diff < bestCentroidDiff) {
      bestCentroid = i;
      bestCentroidDiff = diff;
    }
  }

  return bestCentroid;
}

function printClusters() {
  console.log("===Clusters===");
  for (var i=0; i<clusters.length; i++) {
    console.log("Cluster " + i + " has " + clusters[i].length + " elements");
  }
  console.log("==============");
}

function printCentroids() {
  console.log("===Centriods===");
  for (var i=0; i<centroids.length; i++) {
    console.log("Centroid " + i + ": " + centroids[i]);
  }
  console.log("==============");
}

