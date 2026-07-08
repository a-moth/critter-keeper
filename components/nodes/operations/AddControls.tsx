import { Pressable, Text, ScrollView } from "react-native";

// add field
//add section
// horizontal

export default function AddControls({ addField, addSection }: { addField: () => void; addSection: () => void; }) {
    return (
        <ScrollView style={{ flexDirection: "row", flexWrap: "nowrap" }}>
            <Pressable onPress={addField}>
                <Text>Add Field</Text>
            </Pressable>
            <Pressable onPress={addSection}>
                <Text>Add Section</Text>
            </Pressable>
        </ScrollView>
    );
}