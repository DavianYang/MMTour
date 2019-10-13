const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const shuffleSeed = require("shuffle-seed");
const { Parser } = require("json2csv");
const catchAsync = require("../utils/catchAsync");

const filepath = path.join(__dirname, "tours.csv");

// Define AppError
// Do some refactoring

const extractColumns = (data, colNames) => {
  const headers = _.first(data);

  const idxes = _.map(colNames, col => headers.indexOf(col));
  const extracted = _.map(data, row => _.pullAt(row, idxes));

  return extracted;
};

exports.jsontocsv = jsonObj => {
  let csv;

  const fields = ["name", "price", "startLocation.coordinates"];

  try {
    const parser = new Parser({ fields, quote: "" });
    csv = parser.parse(jsonObj);
  } catch (err) {
    console.error(err);
  }

  fs.writeFile(filepath, csv, err => {
    if (err) {
      console.error(err);
    }
    console.log("It is saved!!");
  });
};

exports.loadCSV = (
  filename,
  {
    converters = {},
    dataColumns = [],
    labelColumns = [],
    shuffle = true,
    splitTest = false
  }
) => {
  let data = fs.readFileSync(filename, { encoding: "utf-8" });
  data = data
    .split("\n")
    .map(row => row.split(",").map(el => el.replace(/\[|\]/g, "")));

  data = data.map(row => _.dropRightWhile(row, val => val === ""));

  const headers = _.first(data);

  data = data.map((row, idx) => {
    // Not Convert First Column
    if (idx === 0) {
      return row;
    }

    return row.map((el, idx) => {
      if (converters[headers[idx]]) {
        const converted = converters[headers[idx]](el); // loop over elements to perform passed function
        return _.isNaN(converted) ? el : converted;
      }

      const result = parseFloat(el);
      return _.isNaN(result) ? el : result;
    });
  });

  // Extract Columns
  let labels = extractColumns(data, labelColumns);
  data = extractColumns(data, dataColumns);

  // Dump first column
  data.shift();
  labels.shift();

  if (shuffle) {
    data = shuffleSeed.shuffle(data, "phrase1");
    labels = shuffleSeed.shuffle(labels, "phrase1");
  }

  if (splitTest) {
    const trainSize = _.isNumber(splitTest)
      ? splitTest
      : Math.floor(data.length / 2);

    return {
      features: data.slice(0, trainSize),
      labels: labels.slice(0, trainSize),
      testFeatures: data.slice(trainSize),
      testLabels: labels.slice(trainSize)
    };
  } else {
    return { features: data, labels };
  }
};

// const { features, labels, testFeatures, testLabels } = loadCSV(
//   "./../tours.csv",
//   {
//     dataColumns: ["name", "startLocation.coordinates"],
//     labelColumns: ["price"],
//     shuffle: true
//   }
// );
// const { features, labels, testFeatures, testLabels } = loadCSV("./data.csv", {
//   dataColumns: ["height", "value"],
//   labelColumns: ["passed"],
//   shuffle: true,
//   splitTest: false,
//   converters: {
//     passed: val => (val === "TRUE" ? 1 : 0)
//   }
// });

// console.log("Features: ", features);
// console.log("Lables: ", labels);
// console.log("Test Features: ", testFeatures);
// console.log("Test Labels: ", testLabels);
