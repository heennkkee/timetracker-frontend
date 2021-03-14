// Generate with:
// npx openapi-typescript ../timetracker-backend/swagger.yml --output src/component/api-schema.ts

/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/users": {
    /** Get all users */
    get: operations["users.list_all"];
    /** Add a user */
    post: operations["users.add"];
  };
  "/users/{id}": {
    /** Get one user with specified ID */
    get: operations["users.get"];
    /** Update user with specified ID */
    put: operations["users.update"];
    /** Remove a user with specified ID */
    delete: operations["users.remove"];
  };
}

export interface operations {
  /** Get all users */
  "users.list_all": {
    responses: {
      /** Lists all users */
      200: {
        schema: {
          success: true;
          data: {
            id: number;
            name: string;
          }[];
        };
      };
    };
  };
  /** Add a user */
  "users.add": {
    parameters: {
      body: {
        user: {
          email: string;
          name: string;
        };
      };
    };
    responses: {
      /** The new user was successfully created */
      201: {
        schema: {
          success: true;
          data: {
            id: number;
            name: string;
            email: string;
          };
        };
      };
      /** Failed to add new user due to input error */
      400: {
        schema: {
          success: false;
          data: {
            message: string;
          };
        };
      };
    };
  };
  /** Get one user with specified ID */
  "users.get": {
    parameters: {
      path: {
        /** ID of user to get */
        id: string;
      };
    };
    responses: {
      /** User that was found */
      200: {
        schema: {
          success: true;
          data: {
            id: number;
            name: string;
            email: string;
          };
        };
      };
      /** User was not found */
      404: {
        schema: {
          success: false;
          data: {
            message: string;
          };
        };
      };
    };
  };
  /** Update user with specified ID */
  "users.update": {
    parameters: {
      path: {
        /** ID of user to update */
        id: string;
      };
      body: {
        user: {
          name: string;
          email: string;
        };
      };
    };
    responses: {
      /** The user that was updated */
      200: {
        schema: {
          success: true;
          data: {
            id: number;
            name: string;
            email: string;
          };
        };
      };
      /** Failed to find user */
      404: {
        schema: {
          success: false;
          data: {
            message: string;
          };
        };
      };
    };
  };
  /** Remove a user with specified ID */
  "users.remove": {
    parameters: {
      path: {
        /** ID of user */
        id: string;
      };
    };
    responses: {
      /** User was removed */
      200: {
        schema: {
          success: true;
        };
      };
    };
  };
}
