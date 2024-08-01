// import { DoorDashClient } from "@doordash/sdk";
// import "dotenv/config";

console.log("fetchDataAndUpdateDOM");

// function fetchDataAndUpdateDOM() {
//   const client = new DoorDashClient({
//     developer_id: process.env.DEVELOPER_ID,
//     key_id: process.env.KEY_ID,
//     signing_secret: process.env.SIGNING_SECRET,
//   });
  
//   const response = client
//     .getDelivery("a3bc68b1-d38c-4286-8eba-50e0ef050738")
//     .then((response) => {
//       console.log(response.data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
  
//   console.log(response);
// }

// // Call the function immediately and then every 30 seconds
// fetchDataAndUpdateDOM();
// setInterval(fetchDataAndUpdateDOM, 30000);