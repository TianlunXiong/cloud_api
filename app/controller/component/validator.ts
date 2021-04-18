import { Validator } from 'jsonschema';

Validator.prototype.customFormats.addComponentName = function(input) {
  return /^[A-Za-z0-9\-_]+$/.test(input)
};

const validator = new Validator();

const schema = {
  "addComponent": {
    "id": "/api/component/add",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "format": "addComponentName"
      },
    },
    "required": ["name"]
  },
  "deleteComponent": {
    "id": "/api/component/delete",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "format": "addComponentName"
      },
    },
    "required": ["name"]
  },
  "queryComponent": {
    "id": "/api/component/query",
    "type": "object",
    "properties": {
      "component_name": {
        "type": "string",
      },
      "creator": {
        "type": "string",
      },
      "component_id": {
        "type": "string",
      },
    },
  },
  "queryCommitComponent": {
    "id": "/api/component/querycommit",
    "type": "object",
    "properties": {
      "component_id": {
        "type": "string",
      },
      "creator": {
        "type": "string",
      },
    },
  },
  "commitComponent": {
    "id": "/api/component/uploadFile",
    "type": "object",
    "properties": {
      "component_id": {
        "type": "string",
      },
      "package_name": {
        "type": "string",
      },
      "package_version": {
        "type": "string",
      },
    },
    "required": ["component_id", "package_name", "package_version"]
  },

  "releaseComponent": {
    "id": "/api/component/querycommit",
    "type": "object",
    "properties": {
      "component_commit_id": {
        "type": "string",
      },
    },
    "required": ["component_commit_id"]
  }
}

type Schema = typeof schema;

export type AddComponentRequest = {
  name: string
}

export type DeleteComponentRequest = {
  name: string
}

export type QueryComponentRequest = {
  component_name?: string,
  creator?: string,
  component_id?: string,
}

export type DB_ComponentCommitRequest = {
  component_id: string,
  component_commit_id: string,
  component_name: string,
  package_name: string,
  package_version: string,
  creator: string,
  src_url: string,
  comment?: string,
}

export type QueryComponentCommitRequest = {
  component_id?: string,
  component_name?: string,
  creator?: string,
  component_commit_id?: string,
}

export type ComponentCommitRequest = {
  component_id: string,
  package_name: string,
  package_version: string,
}

export type ComponentReleaseRequest = {
  component_commit_id: string,
}

export default function validate<T extends keyof Schema>(name: T, value: any) {
  return validator.validate(value, schema[name])
}