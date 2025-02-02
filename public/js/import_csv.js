const t = window.TrelloPowerUp.iframe();

document.getElementById("uploadButton").addEventListener("click", function () {
  alert("button clicked");
  const fileInput = document.getElementById("csvFileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a CSV file.");
    return;
  }

  // Read the CSV file
  const reader = new FileReader();
  reader.onload = function (e) {
    parseCSV(reader.result);
  };
  reader.readAsText(file);
});
                                                         
function parseCSV(csvContent) {
  alert("parsing CSV");
  const rows = csvContent.split("\n").map((row) => row.split(","));
  const headers = rows[0]; // Assuming the first row contains headers
  const data = rows.slice(1); // Data from subsequent rows

  // Log to see the parsed content
  console.log("Headers:", headers);
  console.log("Data:", data);

  // Now handle the CSV data, e.g., create Trello cards
  createCardsFromCSVData(data);
}

function createCardsFromCSVData(data) {
  alert(`parsed data: ${data}`);
  data.forEach((row) => {
    const title = row[0];
    const description = row[1];

    t.set("card", "shared", "key", title).then((card) => {
      console.log("Created card:", card);
    }).catch((err) => {
      console.error("Error creating card:", err);
    });
  });
}
