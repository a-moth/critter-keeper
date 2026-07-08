import { useLocalSearchParams } from 'expo-router';

import TemplateWriter from "../../components/wrappers/TemplateWriter";

export default function TemplateEditScreen() {

    const { templateId } = useLocalSearchParams();

    const currentTemplateId = Array.isArray(templateId)
        ? templateId[0]
        : templateId;

    return (
        <TemplateWriter
            key={currentTemplateId}
            templateId={currentTemplateId}
        />
    );
}