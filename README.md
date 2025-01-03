# AfterResponse

`AfterResponse` is a middleware utility for Express.js that lets you run callbacks after a response has been sent, based on conditions like HTTP methods, status codes, and more.

## Installation

```bash
npm install after-response
```

## Usage

### Basic Example

```JavaScript
const express = require('express');
const afterResponse = require('after-response');
const app = express();

// Success response callback
app.use(afterResponse.onSuccess(() => console.log("Success response!")));

// Error response callback
app.use(afterResponse.onError(() => {
    // do something here
    console.log("Error response!")
}));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Success!' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Key Methods

- `onSuccess(cb)`: Callback for successful responses (status < 400).
- `onError(cb)`: Callback for error responses (status >= 400).
- `custom(cb)`: Callback for all responses, regardless of status.
- `onGet(cb)`: Callback for GET requests.
- `onPost(cb)`: Callback for POST requests.
- `onPut(cb)`: Callback for PUT requests.
- `onDelete(cb)`: Callback for DELETE requests.
- `onPatch(cb)`: Callback for PATCH requests.
- `onHead(cb)`: Callback for HEAD requests.
- `onMethod(methods, cb)`: Callback for multiple HTTP methods.
- `onStatus(status, cb)`: Callback for specific status codes.
- `onStatusRange(range, cb)`: Callback for status codes within a range.
- `onAborted(cb)`: Callback if the request was aborted.

**Example: Handling Multiple Methods**

```javascript
const multiMethodCallback = () =>
  console.log("Request processed for GET or POST.");
app.use(afterResponse.onMethod(["GET", "POST"], multiMethodCallback));
```

**Example: Handling Status Codes**

```javascript
const statusCallback = () => console.log("Response status handled.");
app.use(afterResponse.onStatus([200, 404], statusCallback));
```

**Example: custom handler**

```javascript
const customCallback = (req, res) => {
  if (req.method === "GET" && res.statusCode < 400) {
    console.log("Successful GET request. Logging data...");
    // Perform custom logic here, e.g., log request data to a file
    // or send a notification to a messaging service
  }
};

app.use(afterResponse.custom(customCallback));
```

## Why Use AfterResponse?

`AfterResponse` offers powerful capabilities for Express.js applications:

- **Centralized Logic**: Simplify response-based operations like logging, analytics, or notifications.
- **Versatile Callbacks**: Handle specific methods, status codes, or implement custom logic effortlessly.
- **Efficient Hooks**: Run actions post-response without disrupting the request flow.
- **Integration-Ready**: Perform tasks like hitting external APIs, generating/removing files, or triggering workflows.
- **Lightweight and Focused**: Minimal overhead, designed exclusively for Express.js.
- **Open Source and Extendable**: Tailor it to your application's unique requirements.

## Author

This library is maintained by [Aman Pareek](https://amanpareek.in).

- **GitHub:** [https://github.com/amanp30](https://github.com/amanp30)
- **LinkedIn:** [https://www.linkedin.com/in/aman-pareek](https://www.linkedin.com/in/aman-pareek)

Feel free to connect, contribute, or reach out for collaborations!

## License

[MIT](./LICENSE)
