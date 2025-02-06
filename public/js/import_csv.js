const t = window.TrelloPowerUp.iframe();

// Operations after upload button is clicked
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
  const data = rows.slice(1); // get subset of data from index1. Data from subsequent rows

  // Log to see the parsed content
  console.log("csvContent:", csvContent);
  console.log("Headers:", headers);
  console.log("Data:", data);

  // Now handle the CSV data, e.g., create Trello cards
  createCardsFromCSVData(data);
}

// function createCardsFromCSVData(data) {
//   alert(`parsed data: ${data}`);
//   data.forEach((row) => {
//     const title = row[0];
//     const description = row[1];

//     t.set("card", "shared", "key", title).then((card) => {
//       console.log("Created card:", card);
//     }).catch((err) => {
//       console.error("Error creating card:", err);
//     });
//   });
// }




// updated function for rendering cards
function createCardsFromCSVData(data) {
  alert(`parsed data: ${data}`);
  // t.board() function take filed name as input, it takes time to get back result
  // so use .then, which wait until result is filled and then execute
  // .then is also a "callback function": A function passed into another function to run later.
  t.board("id").then((board) => {
    alert(`Got boardID: ${board.id}`);
    console.log("board", board)
    console.log("boardID", board.id)
    const boardId = board.id;
    // each row of data looks like: Card1, description for card 1 
    data.forEach((row) => {
      alert(`parsed data: ${data}`);
      const title = row[0]?.trim();
      const description = row[1]?.trim();

      if (!title) return; // Skip empty rows

      // Replace with your Trello API credentials (store them securely)
      const apiKey = "";
      const apiToken = "";

      // Example: Get first list in the board to add the card to
      alert(`Creating new card for: ${title}`);
      fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${apiToken}`) //This makes a request to Trello's API.
        .then(response => response.json()) //Converts the API response (which is JSON) into a JavaScript object.
        .then(lists => {
          if (lists.length === 0) {
            alert("No lists found on the board!");
            return;
          }

          const listId = lists[0].id; // Got the first list to add to

          // The values of title and description are used in the URL when making the request
          const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${apiToken}&idList=${listId}&name=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}`;

          fetch(url, { method: "POST" }) // send POST request to create something (card)
            .then(response => response.json())
            .then(card => {
              console.log("Created card:", card);
            })
            .catch(err => console.error("Error creating card:", err));
        })
        .catch(err => console.error("Error fetching lists:", err));
    });
  });
}
