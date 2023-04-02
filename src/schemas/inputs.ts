import { Inputs } from '@interfaces/inputs'
import { JSONSchemaType } from 'ajv'

export const inputSchema: JSONSchemaType<Inputs> = {
  type: 'object',
  required: ['token'],
  additionalProperties: false,
  oneOf: [
    {
      if: {
        properties: {
          autoDiscoverRepos: {
            $ref: '#/properties/autoDiscoverRepos'
          }
        }
      },
      then: {
        propertyNames: {
          enum: ['token', 'configFile', 'cleanLabels', 'autoDiscoverRepos']
        }
      }
    },
    {
      if: {
        properties: {
          repositories: {
            $ref: '#string-or-array-not-empty'
          }
        }
      },
      then: {
        propertyNames: {
          enum: ['token', 'configFile', 'cleanLabels', 'repositories']
        }
      }
    }
  ],
  errorMessage: {
    oneOf: "Must specify either 'auto-discover-repos' or 'repositories'. Both are not allowed."
  },
  properties: {
    token: {
      $ref: '#string-not-empty'
    },
    configFile: {
      $ref: '#string-or-array-not-empty'
    },
    cleanLabels: {
      $ref: '#boolean-default-false-nullable'
    },
    repositories: {
      $ref: '#string-or-array-not-empty'
    },
    autoDiscoverRepos: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      required: [],
      if: {
        properties: {
          autoDiscoverRepos: {
            const: true
          }
        }
      },
      then: {
        required: ['accountType', 'owner']
      },
      properties: {
        autoDiscoverRepos: {
          $ref: '#boolean-default-false-nullable'
        },
        accountType: {
          type: 'string',
          enum: ['org', 'user']
        },
        owner: {
          $ref: '#string-not-empty'
        },
        excludeRepos: {
          $ref: '#string-or-array'
        },
        excludeForkedRepos: {
          $ref: '#boolean-default-true-nullable'
        },
        excludeArchivedRepos: {
          $ref: '#boolean-default-true-nullable'
        },
        excludeDisabledRepos: {
          $ref: '#boolean-default-true-nullable'
        },
        excludePrivateRepos: {
          $ref: '#boolean-default-true-nullable'
        }
      }
    }
  }
}
