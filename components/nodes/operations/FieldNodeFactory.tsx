import { FieldNode, Template } from "../../../constants/nodeTypes";
import TypedNode from "./TypedNode";
import EditorControls from "./EditorControls";
import ValidationPreview from "./ValidationPreview";
import AddControls from "./AddControls";

export default function FieldNodeFactory({ template, id, edit, nodeKey, locked, field, onChange, addField, addSection, moveUp, moveDown, deleteNode }: {
    template: Template,
    id: string,
    edit: boolean,
    nodeKey: string,
    locked: boolean,
    field: FieldNode,
    onChange: (
        template: Template,
        defaultShown: boolean,
        value: FieldNode
    ) => void;
    addField: () => void;
    addSection: () => void;
    moveUp: () => void;
    moveDown: () => void;
    deleteNode: () => void;
}) {

    if (!edit) {
        return (
            <TypedNode
                template={template}
                id={id}
                key={nodeKey}
                field={field}
                locked={locked}
                onChange={onChange}
            />
        )
    }
    return (
        <>
            <TypedNode
                template={template}
                id={id}
                key={nodeKey}
                field={field}
                locked={locked}
                onChange={onChange}
            />
            <ValidationPreview field={field} />
            <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
            <AddControls addField={addField} addSection={addSection} />
        </>
    );
}