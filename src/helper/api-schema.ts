/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/users": {
    get: operations["users.list_all"];
    post: operations["users.add"];
  };
  "/users/{userid}": {
    get: operations["users.get"];
    put: operations["users.update"];
    /** Remove a user with specified ID */
    delete: operations["users.remove"];
  };
  "/users/{userid}/clockings": {
    get: operations["clockings.list_users_all_clockings"];
    post: operations["clockings.add"];
  };
  "/users/{userid}/clockings/{clockingid}": {
    /** Removes a clocking */
    delete: operations["clockings.remove_clocking"];
  };
  "/users/{userid}/password": {
    put: operations["users.update_password"];
  };
  "/auth/check": {
    get: operations["auth.check"];
  };
  "/auth/login": {
    post: operations["auth.login"];
  };
  "/auth/logout": {
    post: operations["auth.logout"];
  };
}

export interface components {
  schemas: {
    User: {
      id: number;
      name: string;
      email: string;
    };
    NewUserInput: {
      name: string;
      email: string;
      password: string;
    };
    UserInput: {
      name?: string;
      email?: string;
    };
    Error: {
      message: string;
    };
    DefaultError: {
      detail: string;
      status: 400 | 401 | 404;
      title: string;
      type?: string;
    };
    Clocking: {
      id: number;
      direction: "in" | "out";
      userid: number;
      datetime: string;
    };
    ClockingInput: {
      direction: "in" | "out";
      datetime?: string;
    };
  };
  responses: {
    /** Resource not found */
    NotFound: {
      content: {
        "application/json": components["schemas"]["DefaultError"];
      };
    };
    /** Request failed due to input error */
    InputError: {
      content: {
        "application/json": components["schemas"]["DefaultError"];
      };
    };
    /** Request failed on the server */
    ServerError: {
      content: {
        "application/json": components["schemas"]["DefaultError"];
      };
    };
    /** Requester is not authorized */
    NotAuthorized: {
      content: {
        "application/json": components["schemas"]["DefaultError"];
      };
    };
    /** Response with just a 200-status code */
    EmptyOk: {
      content: {
        "application/json": {
          status: 200;
        };
      };
    };
  };
  parameters: {
    /** Userid */
    UserId: number;
    /** ID of clocking */
    ClockingId: number;
  };
}

export interface operations {
  "users.list_all": {
    responses: {
      /** List all users */
      200: {
        content: {
          "application/json": {
            status: 200;
            data: components["schemas"]["User"][];
          };
        };
      };
    };
  };
  "users.add": {
    responses: {
      /** The new user was successfully created */
      201: {
        content: {
          "application/json": {
            status: 201;
            data: components["schemas"]["User"];
          };
        };
      };
      400: components["responses"]["InputError"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["NewUserInput"];
      };
    };
  };
  "users.get": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
      };
    };
    responses: {
      /** User that was found */
      200: {
        content: {
          "application/json": {
            status: 200;
            data: components["schemas"]["User"];
          };
        };
      };
      404: components["responses"]["NotFound"];
    };
  };
  "users.update": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
      };
    };
    responses: {
      /** The user that was updated */
      200: {
        content: {
          "application/json": {
            status: 200;
            data: components["schemas"]["User"];
          };
        };
      };
      404: components["responses"]["NotFound"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserInput"];
      };
    };
  };
  /** Remove a user with specified ID */
  "users.remove": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
      };
    };
    responses: {
      /** User was removed */
      200: {
        content: {
          "application/json": {
            status: 200;
          };
        };
      };
      404: components["responses"]["NotFound"];
      500: components["responses"]["ServerError"];
    };
  };
  "clockings.list_users_all_clockings": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
      };
      query: {
        /** Optional parameter to limit number of returns */
        limit?: number;
        /** Optional parameter to limit since what datetime clockings should be included */
        since?: string;
        /** Optional parameter to limit to what datetime clockings should be included */
        to?: string;
      };
    };
    responses: {
      /** Clockings */
      200: {
        content: {
          "application/json": {
            status: 200;
            data: components["schemas"]["Clocking"][];
          };
        };
      };
      404: components["responses"]["NotFound"];
    };
  };
  "clockings.add": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
      };
    };
    responses: {
      /** Clocking was created */
      201: {
        content: {
          "application/json": {
            status: 201;
            data: components["schemas"]["Clocking"];
          };
        };
      };
      400: components["responses"]["InputError"];
      404: components["responses"]["NotFound"];
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["ClockingInput"];
      };
    };
  };
  /** Removes a clocking */
  "clockings.remove_clocking": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
        /** ID of clocking */
        clockingid: components["parameters"]["ClockingId"];
      };
    };
    responses: {
      /** Clocking was removed */
      200: {
        content: {
          "application/json": {
            status: 200;
          };
        };
      };
      404: components["responses"]["NotFound"];
      500: components["responses"]["ServerError"];
    };
  };
  "users.update_password": {
    parameters: {
      path: {
        /** Userid */
        userid: components["parameters"]["UserId"];
      };
    };
    responses: {
      200: components["responses"]["EmptyOk"];
      401: components["responses"]["NotAuthorized"];
      404: components["responses"]["NotFound"];
    };
    requestBody: {
      content: {
        "application/json": {
          password?: string;
          newPassword?: string;
        };
      };
    };
  };
  "auth.check": {
    responses: {
      200: components["responses"]["EmptyOk"];
      401: components["responses"]["NotAuthorized"];
    };
  };
  "auth.login": {
    responses: {
      /** Response with token */
      200: {
        headers: {
          "Set-Cookie"?: string;
        };
        content: {
          "application/json": {
            status: 200;
            data: {
              session?: string;
              userid?: number;
            };
          };
        };
      };
      401: components["responses"]["NotAuthorized"];
      /** Response to request 2fa authentication if useraccount requires it */
      403: {
        content: {
          "application/json": {
            status: 403;
            detail?: "2fa";
          };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          password: string;
          "e-mail": string;
          mfacode?: number;
        };
      };
    };
  };
  "auth.logout": {
    responses: {
      /** User is logged out */
      200: {
        headers: {
          "Set-Cookie"?: string;
        };
        content: {
          "application/json": {
            status: 200;
            data: { [key: string]: any };
          };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          session?: string;
        };
      };
    };
  };
}
