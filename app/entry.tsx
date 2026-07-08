import EntryWriter from "../components/wrappers/EntryWriter";
import { useLocalSearchParams } from 'expo-router';

export default function EntryScreen() {

    const { entryId, templateId } = useLocalSearchParams();

    const currentEntryId = Array.isArray(entryId)
        ? entryId[0]
        : entryId;

    const currentTemplateId = Array.isArray(templateId)
        ? templateId[0]
        : templateId;

    return (
        <EntryWriter
            key={currentEntryId}
            base={currentEntryId}
            template={currentTemplateId}
        />
    );
}