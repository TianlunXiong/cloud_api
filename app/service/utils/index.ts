import { Injectable } from "@vikit/xnestjs";
import config from 'config';
import * as TJS from "typescript-json-schema";
import { Schema, Validator } from 'jsonschema';
import { ResponseBody } from "../../interface/api/response";

const validator = new Validator();
const API_TYPE: string = config.get('apiType');

const settings: TJS.PartialArgs = {
    required: true,
};

const compilerOptions: TJS.CompilerOptions = {
    strictNullChecks: true,
};

const program = TJS.getProgramFromFiles(
  [API_TYPE],
  compilerOptions,
);

const generator = TJS.buildGenerator(program, settings);

@Injectable
export default class Utils {
  static Response = {
    Success<T>(data: T): ResponseBody {
      return {
        success: true,
        data,
      };
    },
    NotSuccess(message: string): ResponseBody {
      return {
        success: false,
        error: {
          message: message,
          code: 1,
        },
      };
    },
    Error(message: any): ResponseBody {
      return {
        success: false,
        error: {
          message: message,
          code: 2,
        },
      };
    },
  };

  public typeValidator(value: any, name: string) {
    try {
      const scheme = generator?.getSchemaForSymbol(name);
      if (scheme) return validator.validate(value, scheme as Schema);
    } catch (err) {
      console.error(err);
    }
  }
}
