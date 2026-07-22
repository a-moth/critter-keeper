import { SETTING } from "../../constants/setting-enums";
import { useSettings } from "../../utils/SettingsProvider";
import SettingInputField from "../nodes/inputs/SettingInputField";
import NumberInputField from "../nodes/inputs/NumberInputField";
import TimeInputField from "../nodes/inputs/TimeInputField";
import { Template, Node, FieldNode } from "../../constants/NodeTypes";

export type CommonProps = { // put this in a constants file?
    template: Template | null;
    id: string;
    field: FieldNode | null;
    fieldKey: string;
    defaultShown: boolean;
    onChange?: (template: Template, defaultShown: boolean, newValue: Node) => void;
};

export default function SettingManager({
    template,
    id,
    field,
    fieldKey,
    defaultShown,
    onChange,
}: CommonProps) {
    if (!defaultShown) return null;

    const commonProps = {
        template,
        id,
        field,
        fieldKey,
        defaultShown,
        onChange: (template: Template, defaultShown: boolean, newValue: Node) => onChange?.(template, defaultShown, newValue),
    };
    switch (SETTING[fieldKey]) {
        case "text":
            return <SettingInputField {...commonProps} />;
        case "time":
            return <TimeInputField {...commonProps} />;
        case "number":
            return <NumberInputField {...commonProps} />;
        default:
            return <SettingInputField {...commonProps} />;
    }
}
//TODO: decide whether to send this through typednode/fieldnodefactory/sectionnodefactory/etc setup or no