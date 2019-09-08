import escapeStringRegExp from "escape-string-regexp";
import { keyby, uniq, uniqBy } from "lodash";

const RE_FIELD_EXTRACTOR = /({{.*}})/gm;
const RE_FIELD_VALUE_EXTRACTOR = /{{(.*)}}/;
const RE_PROPS_EXTRACTOR = /\[(.*?)\]/gi;
const RE_PROPS_VALUE_EXTRACTOR = /\[.*\]/;
const PROP_VALUE_SEPARATOR = "=";

class Skriplate {
  constructor(template = "") {
    if (!template) throw new Error("[SCRIPLATE]: No input templates provided.");

    this.template = template;
  }

  getFieldListFromTemplate(template) {
    const templateFields = template.match(RE_FIELD_EXTRACTOR);
    const uniqTemplateFields = uniq(templateFields);

    return uniqTemplateFields.map(field => {
      const [_, extractedField] = RE_FIELD_VALUE_EXTRACTOR.exec(field); // eslint-disable-line no-unused-vars
      return extractedField;
    });
  }

  getPropsFromField(field) {
    return field.match(RE_PROPS_EXTRACTOR);
  }

  getFieldName(field) {
    return field.replace(RE_PROPS_VALUE_EXTRACTOR.exec(field), "");
  }

  mapPropsToObject(props) {
    const result = {};
    props &&
      Array.isArray(props) &&
      props.forEach(prop => {
        const [_, propValue] = new RegExp(RE_PROPS_EXTRACTOR).exec(prop); // eslint-disable-line no-unused-vars
        const [key, value] = propValue && propValue.split(PROP_VALUE_SEPARATOR);

        result[key] = value;
      });

    return result;
  }

  compile = (view = {}) => {
    let result = this.template;
    this.getFieldListFromTemplate(this.template).forEach(field => {
      const fieldName = this.getFieldName(field);
      const viewValue = view[fieldName];
      const RE_FIELD_KEY = new RegExp(
        `{{${escapeStringRegExp(fieldName)}.*}}`,
        "gm"
      );
      result = result.replace(RE_FIELD_KEY, viewValue || "");
    });

    return result;
  };

  get fields() {
    const fieldsFromTemplate = this.getFieldListFromTemplate(this.template).map(
      field => {
        const fieldName = this.getFieldName(field);
        const props = this.getPropsFromField(field);
        const mappedProps = this.mapPropsToObject(props);
        return {
          name: fieldName,
          props: mappedProps
        };
      }
    );

    return uniqBy(fieldsFromTemplate, field => field.name);
  }

  get initialValues() {
    const result = {};
    this.getFieldListFromTemplate(this.template).forEach(field => {
      const fieldName = this.getFieldName(field);
      result[fieldName] = "";
    });
    return result;
  }

  get fieldsAsObject() {
    return keyby(this.fields, "name");
  }
}

export default Skriplate;
