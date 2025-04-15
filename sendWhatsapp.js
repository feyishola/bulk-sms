const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

const API_URL = "https://my.kudisms.net/api/whatsapp";
const TOKEN = "BZtVPJU1frA6i8sbyScXx3LqHD92OkwRljaNQ0WFg7ue5Md4GTKoEhzpYnmCvI";
const TEMPLATE_CODE = "56549481";

const promises = [];

fs.createReadStream("recipients.csv")
  .pipe(csv())
  .on("data", (row) => {
    const phoneNumber = row.recipient;
    const name = row.parameters;

    console.log(`Processing: ${phoneNumber} - ${name}`);

    // Create form data using URLSearchParams
    const formData = new URLSearchParams();
    formData.append("token", TOKEN);
    formData.append("recipient", phoneNumber);
    formData.append("template_code", TEMPLATE_CODE);
    formData.append("parameters", name.trim());

    // Store the promise instead of executing it immediately
    const promise = axios({
      method: "post",
      url: API_URL,
      data: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        // Check if the API returned an error in its response body
        if (response.data && response.data.status === "error") {
          console.error(
            `API error for ${phoneNumber}: ${response.data.msg} (Error code: ${response.data.error_code})`
          );
          return Promise.reject(new Error(response.data.msg)); // Convert API errors to actual Promise rejections
        }

        console.log(`Message sent successfully to ${phoneNumber}`);
        return response;
      })
      .catch((error) => {
        if (error.response) {
          console.error(
            `Error for ${phoneNumber}: Status ${error.response.status}`
          );
          console.error(`Error details:`, error.response.data);
        } else {
          console.error(
            `Error sending message to ${phoneNumber}: ${error.message}`
          );
        }
      });

    promises.push(promise);
  })
  .on("end", () => {
    // Wait for all API calls to complete
    Promise.all(promises.map((p) => p.catch((e) => e))) // This ensures Promise.all completes even if some promises fail
      .then((results) => {
        const successCount = results.filter(
          (result) => !(result instanceof Error)
        ).length;
        const errorCount = results.length - successCount;

        console.log(
          `Processing complete. ${successCount} successful, ${errorCount} failed.`
        );
      })
      .catch((error) => {
        console.error("Error in final processing:", error.message);
      });
  });
