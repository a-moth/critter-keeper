import { FieldNode, Node, SectionNode, selectionField, SelectionField, Template } from '../../constants/NodeTypes';
import FieldNodeFactory from '../nodes/operations/FieldNodeFactory';
import SectionNodeFactory from '../nodes/operations/SectionNodeFactory';
import { createId, insertNodeAfter, isSectionNode, moveNodeDown, moveNodeUp, removeNode } from '../../utils/NodeUtils';

//You need:

//insertNode(parentId, node)
//removeNode(nodeId)
//moveNode(nodeId, direction)
//updateNodeConfig(nodeId)

// in this overarching file to pass to nodes

/**
│ TEMPLATE EDITOR                              │
<TextLabel value={"Template Editor"} />

│ Template Name(text input)                  │
<TextInput value={templateName} />
<ValidationPreview />

│[Field Node]                                │
<FieldNode type={type} name={name} config={config} />
│   - name(input)                             │
│   - type                                      │
│   - config panel(conditional)               │
  <TextInput value={name} />
  <TypedNode value={defaultValue from config} rest={...config} />

  |[TypedNode]                                       |
  |   - type
  |   - type implementation content (ex. mins, maxes, default value, etc)
  <TextInput value={default} /> ...
  <ImageFileInput value={null || loaded} />
│  - Remove/Move Field / + Add Section                │
<EditorNode />

│[Section Node - Vertical]                   │
<SectionNode type={"vertical"} />
│   - section name(input)                     │
│   ├── child field nodes                      │
    <TextInput value={sectionName} />
    <FieldNode type={type} name={name} config={config} />
    ....
│  - Remove/Move Field / + Add Section                │
<EditorNode />

│[Section Node - Horizontal]                 │
<SectionNode type={"horizontal"} />
│   - section name(input)                     │
│   ├── child field nodes                      │
    <TextInput value={sectionName} />
    <FieldNode type={type} name={name} config={config} />
    ....
│  - Remove/Move Field / + Add Section                │
<EditorNode />

│  + Add Field / + Add Section                │
<AdderNode />
│                                              │
├──────────────────────────────────────────────┤
│ Preview                          Save        │
<ValidateRequestNodes content={pageContent} />
│ (validates current state) (persist)          │
└──────────────────────────────────────────────┘
 */

export default function TemplateEditorManager({
  template,
  edit,
  locked,
  onChange,
}: {
  template: Template | null;
  edit: boolean;
  locked: boolean;
  onChange: (
    template: Template | null,
    defaultShown: boolean,
    value: FieldNode
  ) => void;
}) {
  return (
    <>
      {template &&
        Object.entries(template.fields).map(([nodeKey, node]) => {

          // Future autosave?

          function moveUp() {
            moveNodeUp(template, node.id);
          }

          function moveDown() {
            moveNodeDown(template, node.id);
          }

          function deleteNode() {
            removeNode(template, node.id);
          }

          function addField() {
            // insert this after fieldnode of field
            let nodeValue: SelectionField = {
              type: "selection",
              label: "Add Field to " + createId(),
              multiple: selectionField.multiple,
              selected: selectionField.selected,
              options: selectionField.options,
              visible: selectionField.visible,
            }

            let fieldValue: FieldNode = {
              id: nodeValue.label,
              type: "field",
              field: nodeValue,
            }

            insertNodeAfter(template, nodeKey, fieldValue as Node);
          };

          function addSection() {
            let sectionValue: SectionNode = {
              id: createId(),
              type: "section",
              title: "Section",
              orientation: "row",
              childNodes: {}
            }

            insertNodeAfter(template, nodeKey, sectionValue as Node);
          }

          if (isSectionNode(node)) {
            return (
              <SectionNodeFactory template={template} id={node.id} locked={locked} edit={edit} key={nodeKey} nodeKey={nodeKey} section={node} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />
            );
          }

          return (
            <FieldNodeFactory template={template} id={node.id} locked={locked} edit={edit} key={nodeKey} nodeKey={nodeKey} field={node} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />
          );
        })
      }
    </>
  );
}
