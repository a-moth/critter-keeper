import { ScrollView } from "react-native";
import EntryListReader from "../../components/readers/EntryListReader";

import { v4 as uuidv4 } from "uuid";

import { useSettings } from "../../utils/SettingsProvider";

import { useRouter } from 'expo-router';
import { getTemplates } from "../../utils/StorageUtil";

export default function HomeScreen() {
    const { updateSetting, loading } = useSettings();

    const router = useRouter();

    // TODO rename this dumb name to something useful
    async function NewEntry1(templateId?: string) {
        let currentId = "entry" + uuidv4();

        updateSetting({ "**currentEntry": currentId });

        if (templateId == null) {
            let templates = await getTemplates();

            templateId = templates?.[0]?.templateId ?? null;
        }

        router.push({
            pathname: "/entry",
            params: {
                entryId: currentId,
                templateId: templateId ?? '9834fa2e-4392-407f-9672-95b82d2868a7',
            },
        });
    }


    // greeting is automatic
    // new entry input button/selector
    // analytics preview - add later
    // TODO: analytics AFTER MVP
    // todo: set up loading analytics preview component

    if (loading) return null;

    return (
        <ScrollView>
            <EntryListReader
                onPress={() => NewEntry1()}
            />
        </ScrollView>
    );
}