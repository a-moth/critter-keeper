import { Pressable, Text, ScrollView } from "react-native";

export default function EditorControls({ moveUp, moveDown, deleteField }: { moveUp: () => void; moveDown: () => void; deleteField: () => void; }) {
    return (
        <ScrollView style={{ flexDirection: "row", flexWrap: "nowrap" }}>
            <Pressable onPress={moveUp}>
                <Text>Move Up</Text>
            </Pressable>
            <Pressable onPress={moveDown}>
                <Text>Move Down</Text>
            </Pressable>
            <Pressable onPress={deleteField}>
                <Text>Delete</Text>
            </Pressable>
        </ScrollView>
    );
}