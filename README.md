# WhatsApp Bulk Messaging Script

This Node.js script allows you to send bulk WhatsApp messages using the [KudiSMS WhatsApp API](https://my.kudisms.net/api/whatsapp) and a CSV file of recipients.

## 📦 Requirements

- Node.js installed
- Internet connection
- Valid API token and template code from KudiSMS

## 🔧 Setup

1. **Clone or Download the Project**

2. **Install Dependencies**

```bash
npm install axios csv-parser

    Create Your CSV File

Create a file named recipients.csv with the following format:

recipient,parameters
2348012345678,John Doe
2348023456789,Mary Jane
2348034567890,Ahmed Teslim

Each row represents a WhatsApp message, with:

    recipient being the phone number (in international format)

    parameters being the dynamic values to fill your WhatsApp template (comma-separated)

    Note: Your parameters must match the required number of placeholders in your WhatsApp template.

    Configure the Script

Open sendWhatsapp.js and update these constants:

const TOKEN = 'your_api_token_here';
const TEMPLATE_CODE = 'your_template_code_here';

    Run the Script

node sendWhatsapp.js
```
