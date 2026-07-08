import { useEffect, useMemo, useRef, useState } from "react";
import { Button, View, Text } from "react-native";
import { useTheme } from "../../hooks/use-theme-provider";
import { useSettings } from "../../utils/SettingsProvider";
import { deleteEntry, deleteTemplate, getData, getEntries, getTemplates, saveData, } from '../../utils/StorageUtil';
import { Template, Templates, Entries, Entry, FieldValue, SectionNode, TextField, SelectionField, FieldNode, Node } from "../../constants/nodeTypes"
import valueOf from "../../lib/valueOf";
import { useRouter } from "expo-router";
import { onHandleChange } from "../../utils/nodeUtils";
import TemplateEditorManager from "../managers/TemplateEditorManager";

type ListViewerProps = {
    type: string,
}; // TODO make listItems list of entries or templates

//TODO: test this entire setup after refactoring into generic type

// A strict, pure-web debounce callback hook that requires no Node types
// TODO: test this function
function useDebounceCallback<T extends (...args: any[]) => void>(callback: T, delay: number) {
    // Using ReturnType<typeof setTimeout> dynamically resolves to whatever your environment uses
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useMemo(() => {
        return (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        };
    }, [delay]);
}

export default function ListViewer({
    type,
}: ListViewerProps) {

    const theme = useTheme();
    const router = useRouter();
    const { settings } = useSettings();
    const [data, setData] = useState<Templates | Entries>();
    const [_isLoading, setLoading] = useState(false);

    // 1. Always declare hooks unconditionally at the very top of your component
    const [entryCountState] = useState(() =>
        valueOf(settings?.settings?.[`**listEntryCount` as keyof typeof settings.settings]) ?? Infinity
    );

    const [showCountState] = useState(() =>
        valueOf(settings?.settings?.[`**showCount` as keyof typeof settings.settings]) ?? 2
    );

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            try {
                let data;
                if (type == "entry") {
                    data = await getEntries();
                } else {
                    data = await getTemplates();
                }
                if (cancelled) return;
                setData(data);
            } catch (err) {
                console.error("Failed to load items:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    // 1. Compute ONLY the raw data array using useMemo
    const sortedTemplateData = useMemo(() => {
        if (!data) return [];

        // entries usedTime is creation time
        return Object.values(data)
            .sort((a, b) => {
                const bTime = b?.metadata?.lastModified ?? 0;
                const aTime = a?.metadata?.lastModified ?? 0;
                return bTime - aTime;
            })

    }, [data]);

    // Compute counts
    let listCount: number;

    if (type === "entry") {
        listCount = entryCountState;
    } else {
        // Falls back to Infinity if type is "template" or anything else
        listCount = Infinity;
    }

    let count = showCountState;

    // 2. Separate renaming into two actions: immediate text update vs. debounced sort update
    async function renameTemplateTextOnly(id: string, name: string) {
        if (!data) return;

        // Keep the old lastModified so the list row order stays pinned while typing
        const updatedData: Templates = {
            ...data,
            [id]: {
                ...data[id],
                metadata: {
                    ...data[id].metadata,
                    name: name,
                },
            },
        };

        setData(updatedData);

        // Optional: Save to local storage/API immediately or debounce this too
        try {
            const appData = await getData();
            if (type == "entry") {
                await saveData({ ...appData, entries: updatedData });
            } else {
                await saveData({ ...appData, templates: updatedData });
            }
        } catch (err) {
            console.error("Failed to save renamed item name text:", err);
        }
    }

    // 3. This function handles the timestamp bump that triggers the re-sort
    const triggerSortUpdate = useDebounceCallback(async (id: string) => {
        setData(prev => {
            if (!prev || !prev[id]) return prev;
            return {
                ...prev,
                [id]: {
                    ...prev[id],
                    metadata: {
                        ...prev[id].metadata,
                        lastModified: Date.now()
                    }
                }
            };
        });

        // Persist the updated timestamp structure
        try {
            const appData = await getData();
            if (type == "entry") {
                if (appData.entries && appData.entries[id]) {
                    appData.entries[id].metadata.lastModified = Date.now();
                    setData(appData.entries);
                }
            } else {
                if (appData.templates && appData.templates[id]) {
                    appData.templates[id].metadata.lastModified = Date.now();
                    setData(appData.templates);
                }
            }
        } catch (err) {
            console.error("Failed to save item sort timestamp:", err);
        }
    }, 1200); // 1.2 seconds after the user stops typing

    async function deleteId(id: string) {
        if (type === "entry") {
            await deleteEntry(id);
        } else {
            await deleteTemplate(id);
        }

        const fresh = await getData();
        setData(type === "entry" ? fresh.entries : fresh.templates);
    }

    function openEditor(id: string, template: string) {
        if (type == "entry") {
            router.push({
                pathname: "/entry",
                params: {
                    entryId: id,
                    templateId: template,
                },
            });
        } else {
            router.push({
                pathname: "/templates/edit",
                params: {
                    templateId: template ?? '9834fa2e-4392-407f-9672-95b82d2868a7',
                },
            });
        }
    }

    // 2. Keep the sub-component completely isolated
    function TemplateRow({ item }: { item: Template }) {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <View style={theme.sizes.default.entryEditButton}>
                    <Button title="Edit" onPress={() => { openEditor(item.metadata.templateId, item.metadata.templateId) }} />
                    <Button title="Delete" onPress={() => { deleteId(item.metadata.templateId) }} />
                </View>

                <View style={[theme.sizes.default.entryViewer, theme.sizes.default.listMinItem, { backgroundColor: theme.colors.primary }]}>
                    {item &&
                        Object.entries(item.fields).map(([nodeKey, node]) => {

                            function onChange(template: Template | null, defaultShown: boolean, newValue: FieldNode) {
                                onHandleChange(template, defaultShown, newValue);
                            }

                            return <TemplateEditorManager key={node.id} template={item} locked={true} edit={false} onChange={onChange} />
                        })
                    }
                </View>
            </View>
        );
    }

    // 2. Keep the sub-component completely isolated
    function EntryRow({ item }: { item: Entry }) {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <View style={theme.sizes.default.entryEditButton}>
                    <Button title="Edit" onPress={() => { openEditor(item.metadata.entryId, item.metadata.templateId) }} />
                    <Button title="Delete" onPress={() => { deleteId(item.metadata.entryId) }} />
                </View>

                <View style={[theme.sizes.default.entryViewer, theme.sizes.default.listMinItem, { backgroundColor: theme.colors.primary }]}>
                    {item &&
                        Object.entries(item.fields).splice(listCount).map(([nodeKey, node]) => {

                            function onChange(template: Template | null, defaultShown: boolean, newValue: FieldNode) {
                                onHandleChange(template, defaultShown, newValue);
                            }

                            return <TemplateEditorManager template={item} locked={true} edit={false} onChange={onChange} />
                        })
                    }
                </View>
            </View>
        );
    }
    // check if listItems is empty, return default script if it is

    if ((!sortedTemplateData || sortedTemplateData.length) === 0 && type == "entry") {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <Text style={[theme.sizes.default.text, { color: theme.colors.text }]}>
                    No entries found.
                </Text>
            </View>
        );
    }

    if ((!sortedTemplateData || sortedTemplateData.length) === 0 && type == "template") {
        return (
            <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
                <Text style={[theme.sizes.default.text, { color: theme.colors.text }]}>
                    No Templates Found, create a new one?
                </Text>
            </View>
        );
    }

    return (
        <View style={[theme.sizes.default.row, theme.sizes.default.fillContainer, theme.sizes.default.alignCenter]}>
            {sortedTemplateData.map((value) => {
                if (!value?.metadata) return null;
                if (type === "entry") {
                    return (
                        <EntryRow
                            key={(value as Entry).metadata.name}
                            item={value as Entry}
                        />
                    );
                } else {
                    return (
                        <TemplateRow
                            key={(value as Template).metadata.templateId}
                            item={value as Template}
                        />
                    );
                }
            })}
        </View>
    );
} // TODO count in map pulled only if type is entry else infinity