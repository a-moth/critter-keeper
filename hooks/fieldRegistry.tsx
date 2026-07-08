/**
 * a registry of default node data for adding
const nodeRegistry = {
  text: TextInputField,
  boolean: BooleanInputField,
  number: NumberInputField,
};
 */

// the default values for defaultTemplate

// the default values for every node and input
type FieldDefinition = {
  component: React.ComponentType<any>;
  defaultConfig: Record<string, string>;
  validate: (config: Record<string, string>) => string[];
};

const fieldDefinitions: Record<string, FieldDefinition> = {

};