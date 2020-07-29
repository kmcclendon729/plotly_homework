function init(chartData) {
  showBarChart(chartData);
  showBubbleChart(chartData);
};

// Initializes the page with a default plot containing the top ten samples values and otu ids for the first sample id 
function showBarChart(chartData) {
  console.log(chartData[0].sample_values.slice(0, 10));
  console.log(chartData[0].otu_ids.slice(0, 10));
  data = [{
    y: chartData[0].otu_ids.slice(0, 10).map(otu_ids => `OTU ${otu_ids}`).reverse(),
    x: chartData[0].sample_values.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  }];

  var layout = {
    title: "Top 10 OTU IDs",
  }

  Plotly.newPlot("bar", data, layout);
}

function showBubbleChart(chartData) {
  var otuLabels = chartData.otu_labels;
  var otuIDs = chartData.otu_ids;
  var sampleValues = chartData.sample_values;

  console.log(chartData[0].sample_values.slice(0, 10));
  console.log(chartData[0].otu_ids.slice(0, 10));
  data = [{
    x: chartData[0].otu_ids.slice(0, 10),
    y: chartData[0].sample_values.slice(0, 10),
    mode: "markers",
    type: "bubble",
    marker: {
      size: sampleValues,
      color: otuIDs,
      textValues: otuLabels
    }
  }];

  var layout = {
    title: "Top 10 OTU IDs",

  }

  Plotly.newPlot("bubble", data, layout);
}

//bring in data from the samples.json file using the python web server
d3.json("samples.json").then((data) => {
  console.log(data);

  // assign variables to the data we need for our plots

  var names = data.names;
  var samples = data.samples;
  var filteredData = samples.filter(samples => samples.id === names[0]);
  var metadata = data.metadata;
  var filteredMetadata = metadata.filter(metadata => metadata.id === +names[0]);

  // check to make sure the data is coming in correctly

  console.log(names);
  console.log(samples);
  console.log(filteredData);
  console.log(metadata);
  console.log(filteredMetadata);

  // add the name list from above to the dropdown filter for Test Subject ID Number
  var selSubjectID = d3.select('#subjectID');
  names.forEach(function (subject) {
    selSubjectID.append("option").text(subject)
  });

  // add the metadata from the subject ID to the demographic data form
  var subjectDemo = d3.select('#sample-metadata');
  subjectDemo.append("div").text(filteredMetadata[0].age);
  subjectDemo.append("div").text(filteredMetadata[0].bbtype);
  subjectDemo.append("div").text(filteredMetadata[0].ethnicity);
  subjectDemo.append("div").text(filteredMetadata[0].gender);
  subjectDemo.append("div").text(filteredMetadata[0].id);
  subjectDemo.append("div").text(filteredMetadata[0].location);
  subjectDemo.append("div").text(filteredMetadata[0].wfreq);  
  
  console.log(filteredMetadata[0].age);

  // Call updatePlotly() when a change takes place to the DOM
  d3.selectAll("body").on("change", datasetChanged);

  init(filteredData);

});

// This function is called when a dropdown menu item is selected
function datasetChanged() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#subjectID");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  console.log(dataset);
  update(dataset);
};

function update(selectedID) {
  
  var filteredData = samples.filter(samples => samples.id === selectedID);
  var filteredMetadata = metadata.filter(metadata => metadata.id === +selectedID);

  Plotly.restyle("bar", filteredData, [selectedID]);
  updatePlotly();
};