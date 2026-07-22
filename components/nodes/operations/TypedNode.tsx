import { FieldData, FieldNode, template } from '../../../constants/DataTypes';
import BooleanInputField from '../inputs/BooleanInputField';
import DateInputField from '../inputs/DateInputField';
import DurationInputField from '../inputs/DurationInputField';
import ScaleInputField from '../inputs/ScaleInputField';
import SelectionInputField from '../inputs/SelectionInputField';
import TextInputField from '../inputs/TextInputField';

export default function TypedNode({ field, template, id, locked, onChange }: {
    template: template,
    id: string,
    field: FieldNode<FieldData>,
    locked: boolean,
    onChange: (
        template: template,
        defaultShown: boolean,
        value: FieldNode<FieldData>
    ) => void
}) {
    switch (field?.field.data.type) {
        case "text": // add Labels for each based on field
            return (
                <TextInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field.field}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "date":
            return (
                <DateInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field.field}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "duration":
            return (
                <DurationInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field.field}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "selection":
            return (
                <SelectionInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field.field}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "scale":
            return (
                <ScaleInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field.field}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        case "boolean":
            return (
                <BooleanInputField
                    template={template}
                    id={field.id}
                    fieldKey={field.field.data.label}
                    field={field.field}
                    defaultShown={field.field.data.visible}
                    locked={locked}
                    onChange={onChange}
                />
            );

        default:
            return null;
    }
}