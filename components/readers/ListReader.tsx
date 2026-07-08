import {
    Pressable,
    Text,
    ScrollView,
} from "react-native";

import { useTheme } from "../../hooks/use-theme-provider";
import ListViewer from "../wrappers/ListViewer";

export type ListReaderProps = {
    type: string,
    count?: number,
    onPress: () => void,
};

export default function ListReader({ type, count = Infinity, onPress }: ListReaderProps) {
    const theme = useTheme();

    return (
        <ScrollView
            contentContainerStyle={{
                ...theme.sizes.default.container,
                backgroundColor: theme.colors.background,
            }}
        >
            <Pressable
                onPress={onPress}
                style={{
                    ...theme.sizes.default.alignCenter,
                    ...theme.sizes.default.button,
                    backgroundColor: theme.colors.card,
                }}
            >
                <Text style={{ color: theme.colors.text }} onPress={onPress}>
                    {`Create new ${type}`}
                </Text>
            </Pressable>
            <ListViewer
                type={type}
            />
        </ScrollView >
    );
}