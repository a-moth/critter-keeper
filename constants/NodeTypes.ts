import { Image } from 'react-native';
import { field_node, TextField } from './DataTypes';

/**
 * Default Template Definitions
 * [private to this types config]
 */

const TextInput1: TextField = new TextField({
  type: 'text',
  value: 'something has gone wrong',
  label: 'Text Input 1',
  visible: true,
});

// TODO: convert to instances
const DurationInput1: DurationField = {
  type: 'duration',
  label: 'Duration Input 1',
  valueA: 0,
  valueB: 5,
  unitA: 'hrs',
  unitB: 'mins',
  visible: true,
};

const ScaleInput1: ScaleField = {
  type: 'scale',
  value: 0,
  label: 'Scale Input 1',
  imageBased: true,
  min: 0,
  max: 5,
  visible: true,
};

const SelectionInput1: SelectionField = {
  type: 'selection',
  label: 'Selection Input 1',
  multiple: false,
  selected: [],
  options: [
    { id: '1', name: '1st' },
    { id: '2', name: '2nd' },
    { id: '3', name: '3rd' },
  ],
  visible: true,
};

const SelectionInput2: SelectionField = {
  type: 'selection',
  label: 'Selection Input 2',
  multiple: false,
  selected: [],
  options: [
    { name: '1st', id: '1' },
    { name: '2nd', id: '2' },
    { name: '3rd', id: '3' },
    { name: '4th', id: '4' },
    { name: '5th', id: '5' },
    { name: '6th', id: '6' },
  ],
  visible: true,
};

const SelectionInput3: SelectionField = {
  type: 'selection',
  label: 'Selection Input 3',
  multiple: true,
  selected: [],
  options: [
    { id: '1', name: '1st' },
    { id: '2', name: '2nd' },
    { id: '3', name: '3rd' },
  ],
  visible: true,
};

const SelectionInput4: SelectionField = {
  type: 'selection',
  label: 'Selection Input 4',
  multiple: true,
  selected: [],
  options: [
    { name: '1st', id: '1' },
    { name: '2nd', id: '2' },
    { name: '3rd', id: '3' },
    { name: '4th', id: '4' },
    { name: '5th', id: '5' },
    { name: '6th', id: '6' },
  ],
  visible: true,
};

const DateInput1: DateField = {
  type: 'date',
  value: '01-05-2001',
  label: 'Date Input 1',
  format: 'dd-MM-YYYY',
  visible: true,
};

const BooleanInput1: ToggleButtonField = {
  type: 'boolean',
  value: false,
  label: 'Boolean Input 1',
  labelSelected: 'testy tested',
  labelUnselected: 'testy testing',
  visible: true,
};

const TestText1: TextField = {
  type: 'text',
  value: 'testing :3',
  label: "I'm a test text node!",
  visible: true,
};

/**
 * Creates a new UUID for any object
 * @returns New UUID for anything
 */
function createId() {
  return crypto.randomUUID();
}

/**
 * Public helper function to convert FieldValues to FieldNodes
 * @param field the field value to convert to a node
 * @returns the field node of the field value
 */
function createFieldNode(field: FieldValue): FieldNode {
  return {
    id: createId(),
    type: 'field',
    field,
  };
}

function createSectionNode(
  title: string,
  orientation: string,
  children?: Record<string, Node>,
) {
  return {
    id: createId(),
    type: 'section',
    title,
    orientation,
    childNodes: children || {},
  } as SectionNode;
}

const Section1: SectionNode = createSectionNode('Testing Section', 'row', {
  TestText1: createFieldNode(TestText1),
});

/**
 * Public constant containing the initialisation of the core Journal Template
 */
export const tempTemplate: Template = {
  metadata: {
    templateId: '9834fa2e-4392-407f-9672-95b82d2868a7',
    entryId: null,
    name: 'defaultTemplate',
    lastModified: 0,
    usedTime: null,
    order: [],
  },

  fields: {
    TextInput1: createFieldNode(TextInput1),
    DurationInput1: createFieldNode(DurationInput1),
    ScaleInput1: createFieldNode(ScaleInput1),
    SelectionInput1: createFieldNode(SelectionInput1),
    SelectionInput2: createFieldNode(SelectionInput2),
    SelectionInput3: createFieldNode(SelectionInput3),
    SelectionInput4: createFieldNode(SelectionInput4),
    DateInput1: createFieldNode(DateInput1),
    BooleanInput1: createFieldNode(BooleanInput1),
    Section1,
  },
} as const;

export const defaultTemplate = {
  metadata: {
    templateId: tempTemplate.metadata.templateId,
    entryId: tempTemplate.metadata.entryId,
    name: tempTemplate.metadata.name,
    lastModified: tempTemplate.metadata.lastModified,
    usedTime: tempTemplate.metadata.usedTime,
    order: [
      tempTemplate.fields.TextInput1.id,
      tempTemplate.fields.DurationInput1.id,
      tempTemplate.fields.ScaleInput1.id,
      tempTemplate.fields.SelectionInput1.id,
      tempTemplate.fields.SelectionInput2.id,
      tempTemplate.fields.SelectionInput3.id,
      tempTemplate.fields.SelectionInput4.id,
      tempTemplate.fields.DateInput1.id,
      tempTemplate.fields.BooleanInput1.id,
      tempTemplate.fields.Section1.id,
    ],
  },
  fields: {
    TextInput1: tempTemplate.fields.TextInput1,
    DurationInput1: tempTemplate.fields.DurationInput1,
    ScaleInput1: tempTemplate.fields.ScaleInput1,
    SelectionInput1: tempTemplate.fields.SelectionInput1,
    SelectionInput2: tempTemplate.fields.SelectionInput2,
    SelectionInput3: tempTemplate.fields.SelectionInput3,
    SelectionInput4: tempTemplate.fields.SelectionInput4,
    DateInput1: tempTemplate.fields.DateInput1,
    BooleanInput1: tempTemplate.fields.BooleanInput1,
    Section1: tempTemplate.fields.Section1,
  },
} as const;

// default SelectionField

export const selectionField: SelectionField = {
  type: 'selection',
  label: 'Add Field',
  multiple: false,
  selected: [
    'text',
    'number',
    'time',
    'date',
    'duration',
    'selection',
    'scale',
    'boolean',
    'image-boolean',
  ], // the actual value
  options: [], // the choices
  visible: true,
};
