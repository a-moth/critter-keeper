import { FieldNode, Template } from '../../../constants/nodeTypes';
import BooleanInputField from '../inputs/BooleanInputField';
import DateInputField from '../inputs/DateInputField';
import DurationInputField from '../inputs/DurationInputField';
import ScaleInputField from '../inputs/ScaleInputField';
import SelectionInputField from '../inputs/SelectionInputField';
import TextInputField from '../inputs/TextInputField';

export default function TypedNode({ field, template, id, locked, onChange }: {
    template: Template,
    id: string,
    field: FieldNode,
    locked: boolean,
    onChange: (
        template: Template,
        defaultShown: boolean,
        value: FieldNode
    ) => void
}) {
    switch (field.field?.type) {
        case "text": // add Labels for each based on field
            return (
                <TextInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.label}
                    field={field.field}
                    defaultShown={field.field.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "date":
            return (
                <DateInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.label}
                    field={field.field}
                    defaultShown={field.field.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "duration":
            return (
                <DurationInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.label}
                    field={field.field}
                    defaultShown={field.field.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "selection":
            return (
                <SelectionInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.label}
                    field={field.field}
                    defaultShown={field.field.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "scale":
            return (
                <ScaleInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.label}
                    field={field.field}
                    defaultShown={field.field.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "boolean":
            return (
                <BooleanInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.label}
                    field={field.field}
                    defaultShown={field.field.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        default:
            return null;
    }
}