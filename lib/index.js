class AfterResponse {
  /**
   * Generalized method to handle response interception (Private).
   * This method is used internally to create middleware functions based on a condition.
   * The middleware intercepts the response and runs the provided callback (`cb`) after the response is sent.
   *
   * @param {Function} cb - The callback to execute after the response is sent. The callback receives `req` and `res` as arguments.
   * @param {Function} [condition] - A condition function that takes `req` and `res` as arguments. If the condition is met, the callback is executed. If no condition is provided, the callback runs unconditionally.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers in Express.
   * @private
   */
  #createHandler(cb, condition) {
    if (typeof cb !== "function") {
      throw new Error("Callback must be a function.");
    }

    return (req, res, next) => {
      const originalEnd = res.end;

      res.end = function (chunk, encoding) {
        originalEnd.call(this, chunk, encoding);

        if (condition) {
          if (condition(req, res)) {
            cb(req, res);
          }
        } else {
          cb(req, res);
        }
      };

      next();
    };
  }

  #isValidStatusCode(statusCode) {
    return (
      Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599
    );
  }

  /**
   * Middleware for successful responses (status < 400).
   * Executes the provided callback for successful responses (e.g., 200 OK).
   *
   * @param {Function} cb - The callback to execute after a successful response.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * const successCallback = (req, res) => { console.log("Success response detected!"); };
   * const successMiddleware = AfterResponse.onSuccess(successCallback);
   * app.use(successMiddleware);
   */
  onSuccess(cb) {
    return this.#createHandler(cb, (req, res) => res.statusCode < 400);
  }

  /**
   * Middleware for error responses (status >= 400).
   * Executes the provided callback for error responses (e.g., 404 Not Found, 500 Internal Server Error).
   *
   * @param {Function} cb - The callback to execute after an error response.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * const errorCallback = (req, res) => { console.log("Error response detected!"); };
   * const errorMiddleware = AfterResponse.onError(errorCallback);
   * app.use(errorMiddleware);
   */
  onError(cb) {
    return this.#createHandler(cb, (req, res) => res.statusCode >= 400);
  }

  /**
   * Custom middleware that runs the callback unconditionally.
   * The provided callback is executed regardless of the response status or request type.
   *
   * @param {Function} cb - The callback to execute unconditionally after the response.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * const customCallback = (req, res) => { console.log("Custom middleware triggered."); };
   * const customMiddleware = AfterResponse.custom(customCallback);
   * app.use(customMiddleware);
   */
  custom(cb) {
    return this.#createHandler(cb);
  }

  /**
   * Handle only GET requests.
   * Executes the provided callback after the response for GET requests.
   *
   * @param {Function} cb - The callback to execute after the response for GET requests.
   * @returns {Function} Middleware function that can be used with `app.get()` for GET requests.
   * @example
   * const getCallback = (req, res) => { console.log("GET request response."); };
   * const getMiddleware = AfterResponse.onGet(getCallback);
   * app.get('/path', getMiddleware, (req, res) => { res.status(200).json({ message: "GET request success!" }); });
   */
  onGet(cb) {
    return this.#createHandler(cb, (req, res) => req.method === "GET");
  }

  /**
   * Handle only POST requests.
   * Executes the provided callback after the response for POST requests.
   *
   * @param {Function} cb - The callback to execute after the response for POST requests.
   * @returns {Function} Middleware function that can be used with `app.post()` for POST requests.
   * @example
   * const postCallback = (req, res) => { console.log("POST request response."); };
   * const postMiddleware = AfterResponse.onPost(postCallback);
   * app.post('/path', postMiddleware, (req, res) => { res.status(200).json({ message: "POST request success!" }); });
   */
  onPost(cb) {
    return this.#createHandler(cb, (req, res) => req.method === "POST");
  }

  /**
   * Handle only PUT requests.
   * Executes the provided callback after the response for PUT requests.
   *
   * @param {Function} cb - The callback to execute after the response for PUT requests.
   * @returns {Function} Middleware function that can be used with `app.put()` for PUT requests.
   * @example
   * const putCallback = (req, res) => { console.log("PUT request response."); };
   * const putMiddleware = AfterResponse.onPut(putCallback);
   * app.put('/path', putMiddleware, (req, res) => { res.status(200).json({ message: "PUT request success!" }); });
   */
  onPut(cb) {
    return this.#createHandler(cb, (req, res) => req.method === "PUT");
  }

  /**
   * Handle only DELETE requests.
   * Executes the provided callback after the response for DELETE requests.
   *
   * @param {Function} cb - The callback to execute after the response for DELETE requests.
   * @returns {Function} Middleware function that can be used with `app.delete()` for DELETE requests.
   * @example
   * const deleteCallback = (req, res) => { console.log("DELETE request response."); };
   * const deleteMiddleware = AfterResponse.onDelete(deleteCallback);
   * app.delete('/path', deleteMiddleware, (req, res) => { res.status(200).json({ message: "DELETE request success!" }); });
   */

  onDelete(cb) {
    return this.#createHandler(cb, (req, res) => req.method === "DELETE");
  }

  /**
   * Handle only PATCH requests.
   * Executes the provided callback after the response for PATCH requests.
   *
   * @param {Function} cb - The callback to execute after the response for PATCH requests.
   * @returns {Function} Middleware function that can be used with `app.patch()` for PATCH requests.
   * @example
   * const patchCallback = (req, res) => { console.log("PATCH request response."); };
   * const patchMiddleware = AfterResponse.onPatch(patchCallback);
   * app.patch('/path', patchMiddleware, (req, res) => { res.status(200).json({ message: "PATCH request success!" }); });
   */
  onPatch(cb) {
    return this.#createHandler(cb, (req, res) => req.method === "PATCH");
  }

  /**
   * Handle only HEAD requests.
   * Executes the provided callback after the response for HEAD requests.
   *
   * @param {Function} cb - The callback to execute after the response for HEAD requests.
   * @returns {Function} Middleware function that can be used with `app.head()` for HEAD requests.
   * @example
   * const headCallback = (req, res) => { console.log("HEAD request response."); };
   * const headMiddleware = AfterResponse.onHead(headCallback);
   * app.head('/path', headMiddleware, (req, res) => { res.status(200).json({ message: "HEAD request success!" }); });
   */
  onHead(cb) {
    return this.#createHandler(cb, (req, res) => req.method === "HEAD");
  }

  /**
   * Middleware to handle multiple HTTP methods after the response is sent.
   * This method allows you to create middleware that runs the provided callback for multiple HTTP methods.
   *
   * @param {string[]} methods - An array of HTTP method strings (e.g., ["GET", "POST"]). Only these methods will trigger the callback.
   * @param {Function} cb - The callback function to execute after the response for matching requests. The callback receives `req` and `res` as arguments.
   * @throws {Error} If `methods` is not an array of valid HTTP method strings.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * // Handle multiple methods (GET and POST)
   * const callback = (req, res) => { console.log("Request processed."); };
   * const middleware = afterResponse.onMethod(["GET", "POST"], callback);
   * app.use(middleware);
   */
  onMethod(methods, cb) {
    const acceptedMethodTypes = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
      "HEAD",
    ];

    // Validate methods input
    if (!Array.isArray(methods)) {
      throw new Error("Methods must be an array of strings.");
    }

    if (!methods.every((method) => acceptedMethodTypes.includes(method))) {
      throw new Error(
        `Invalid method type(s): ${methods.join(
          ", "
        )}. Accepted methods: ${acceptedMethodTypes.join(", ")}`
      );
    }

    // Handle multiple methods
    return this.#createHandler(cb, (req, res) =>
      methods.includes(req.method.toUpperCase())
    );
  }
  /**
   * Middleware to handle specific HTTP status codes.
   * Executes the provided callback after the response if the status code matches one or more provided codes.
   *
   * @param {number|number[]} status - A single status code or an array of status codes to match.
   * @param {Function} cb - The callback to execute after the response.
   * @throws {Error} If the status code(s) are invalid or not in the range of 100 to 599.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * // Single status code
   * const singleStatusCallback = (req, res) => { console.log("404 detected."); };
   * const singleStatusMiddleware = afterResponse.onStatus(404, singleStatusCallback);
   * app.use(singleStatusMiddleware);
   *
   * // Multiple status codes
   * const multiStatusCallback = (req, res) => { console.log("Handled specific statuses."); };
   * const multiStatusMiddleware = afterResponse.onStatus([200, 404, 500], multiStatusCallback);
   * app.use(multiStatusMiddleware);
   */
  onStatus(status, cb) {
    const statuses = Array.isArray(status) ? status : [status];

    if (!statuses.every((code) => this.#isValidStatusCode(code))) {
      throw new Error(
        `Invalid status code(s): ${statuses.join(
          ", "
        )}. Status codes must be numbers between 100 and 599.`
      );
    }

    return this.#createHandler(cb, (req, res) =>
      statuses.includes(res.statusCode)
    );
  }

  /**
   * Middleware to handle HTTP responses with status codes within a specified range.
   * Executes the provided callback after the response is sent, if the response's status code
   * falls within the specified range (inclusive).
   *
   * @param {string} range - A string representing the status code range, in the format "min-max".
   * @param {Function} cb - The callback function to execute after the response.
   * @throws {Error} If the `range` is not formatted correctly or contains invalid values.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * const callback = (req, res) => { console.log("Response within range detected!"); };
   *
   * // Middleware for 200 to 299 range
   * const successRangeMiddleware = afterResponse.onStatusRange("200-299", callback);
   * app.use(successRangeMiddleware);
   */
  onStatusRange(range, cb) {
    if (typeof range !== "string") {
      throw new Error(
        "Status code range must be a string in the format 'min-max'."
      );
    }
    const [min, max] = range.split("-").map(Number);

    if (
      isNaN(min) ||
      isNaN(max) ||
      min < 100 ||
      max > 599 ||
      min > max ||
      min === max
    ) {
      throw new Error(
        "Invalid status code range. Ensure min < max and values are between 100 and 599."
      );
    }

    return this.#createHandler(
      cb,
      (req, res) => res.statusCode >= min && res.statusCode <= max
    );
  }

  /**
   * Middleware for aborted requests.
   * Executes the provided callback if the request was aborted.
   *
   * @param {Function} cb - The callback to execute if the request is aborted.
   * @returns {Function} Middleware function that can be used with `app.use()` or route handlers.
   * @example
   * const abortedCallback = (req, res) => { console.log("Request was aborted!"); };
   * const abortedMiddleware = afterResponse.onAborted(abortedCallback);
   * app.use(abortedMiddleware);
   */
  onAborted(cb) {
    return this.#createHandler(cb, (req, res) => req.aborted);
  }
}

const afterResponse = new AfterResponse();
module.exports = afterResponse;
