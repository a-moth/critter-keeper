
/**
 flexDirection:
  orientation === "horizontal"
    ? "row"
    : "column";
 */

import { ScrollView, Text } from "react-native";
import { FieldNode, Node, SectionNode, Template } from '../../../constants/NodeTypes';
import ValidationPreview from "./ValidationPreview";
import EditorControls from "./EditorControls";
import { ReactNode } from "react";
import FieldNodeFactory from "./FieldNodeFactory";
import AddControls from "./AddControls";

export default function SectionNodeFactory({ template, id, edit, locked, nodeKey, section, onChange, addField, addSection, moveUp, moveDown, deleteNode }: {
    template: Template,
    id: string,
    edit: boolean
    nodeKey: string;
    section: SectionNode;
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
    locked: boolean;
}) {
    function renderFieldNodes(childNodes: Record<string, Node>,): ReactNode {
        return (
            <>
                {Object.entries(childNodes).map(([title, node]) => {
                    switch (node.type) {
                        case "field":
                            return <FieldNodeFactory template={template} id={node.id} edit={edit} key={title} nodeKey={title} field={node} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} locked={locked} />;
                        case "section":
                            return <SectionNodeFactory template={template} id={node.id} key={title} locked={locked} edit={edit} nodeKey={title} section={node} onChange={onChange} addField={addField} addSection={addSection} moveUp={moveUp} moveDown={moveDown} deleteNode={deleteNode} />;
                        default: return null;
                    }
                })}
            </>
        );
    }
    if (!edit) {
        return (
            <ScrollView style={{ flexDirection: section.orientation, flexWrap: "nowrap" }}>
                <Text>
                    {section.title}
                </Text>
                {renderFieldNodes(section.childNodes)}
            </ScrollView>
        )
    }
    return (
        <ScrollView style={{ flexDirection: section.orientation, flexWrap: "nowrap" }}>
            <Text>
                {section.title}
            </Text>
            {renderFieldNodes(section.childNodes)}
            <ValidationPreview field={section} />
            <EditorControls moveUp={moveUp} moveDown={moveDown} deleteField={deleteNode} />
            <AddControls addField={addField} addSection={addSection} />
        </ScrollView>
    );
}