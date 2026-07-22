import {
  useEffect,
  useState,
} from "react";

import {
  Button,
  ScrollView,
  View,
} from "react-native";

import {
  getData,
  getEntry,
  getTemplate,
  saveData,
} from "../../utils/StorageUtil";

import {
  Entry,
  FieldNode,
  Template,
  defaultTemplate
} from "../../constants/NodeTypes"

import { useTheme }
  from "../../hooks/use-theme-provider";

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "expo-router";
import TemplateEditorManager from "../managers/TemplateEditorManager";
import { onHandleChange } from "../../utils/NodeUtils";

type Props = {
  base?: string;
  template: string;
};

export default function EntryWriter({
  base,
  template,
}: Props) {

  const [entryData, setEntryData] =
    useState<Entry | Template | null>(null);

  const [saving, setSaving] =
    useState(false);

  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {

    async function load() {

      const entry =
        base
          ? await getEntry(base)
          : null;

      if (entry) {

        setEntryData(entry);

        return;
      }

      const templateData =
        await getTemplate(
          template
        );

      setEntryData({
        metadata: {
          templateId: templateData?.metadata?.templateId ?? defaultTemplate.metadata.templateId,
          entryId: base ?? "entry" + uuidv4(),
          name: base ?? "entry" + uuidv4(),
          lastModified: Date.now(),
          usedTime: Date.now(),
          order: templateData?.metadata?.order ?? defaultTemplate.metadata.order
        },

        fields: structuredClone(
          templateData?.fields ?? defaultTemplate.fields
        )
      });
    }

    load();

  }, [base, template]);

  function updateField(
    template: Template | null,
    defaultShown: boolean,
    newValue: FieldNode
  ) {

    setEntryData((prev) => {

      if (!prev) {
        return prev;
      }

      return onHandleChange(
        template,
        defaultShown,
        newValue
      );
    });
  }

  async function handleSave() {

    if (!entryData) {
      return;
    }

    setSaving(true);

    const appData =
      await getData();

    await saveData({
      ...appData,

      entries: {
        ...appData.entries,

        [entryData.metadata.name]: {
          ...entryData,
          metadata: {
            ...entryData.metadata,
            time: Date.now(),
          }
        },
      },
    });

    setSaving(false);

    router.push("/");
  }

  if (!entryData) {
    return null;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        ...theme.sizes.default.container,
        backgroundColor:
          theme.colors.background,
      }}
    >

      <TemplateEditorManager
        isList={false}
        template={entryData}
        locked={false}
        edit={false}
        onChange={
          updateField
        }
      />

      <View
        style={
          theme.sizes.default.container
        }
      >
        <Button
          title={
            saving
              ? "Saving..."
              : "Save Entry"
          }
          onPress={
            handleSave
          }
        />
      </View>

    </ScrollView>
  );
}