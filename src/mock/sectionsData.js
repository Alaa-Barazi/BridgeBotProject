// sectionsData.js
// Static data used to generate accordion sections and checkbox options
// This data is imported into App.jsx and passed to reusable components

// Each object in this array represents a separate category/section in the UI
const sectionsData = [
  {
    id: "sensors", // unique key used for state tracking
    title: "Selection of Sensors", // section title shown to the user
    options: [
      // multiple options that user can select (with checkboxes)
      "Temperature Sensor",
      "Pressure Sensor",
      "Humidity Sensor",
      "Motion Sensor",
      "Light Sensor",
    ],
  },
  {
    id: "controllerType",
    title: "Controller Type",
    options: [
      "PID Controller",
      "On/Off Controller",
      "Fuzzy Controller",
      "Adaptive Controller",
      "Manual Controller",
    ],
  },
  {
    id: "protocolType",
    title: "Protocol Type",
    options: [
      "HTTP", // commonly used web protocol
      "MQTT", // lightweight messaging protocol for IoT
      "WebSocket", // for real-time two-way communication
      "LoRaWAN", // long range wireless protocol
      "CoAP", // lightweight web protocol for constrained devices
    ],
  },
  {
    id: "serverSelection",
    title: "Server Selection",
    options: [
      "AWS Cloud", // Amazon cloud server
      "Azure Cloud", // Microsoft cloud server
      "Google Cloud", // Google’s cloud service
      "On-Premise Server", // Server hosted locally in-house
      "Localhost Server", // Developer’s own machine/server
    ],
  },
];

// Export the data to be used in components
export default sectionsData;
