import { ScrollView } from "react-native";
import SettingsReader from "../../components/wrappers/SettingsReader";

export default function SettingsScreen() {
    return (
        <ScrollView>
            <SettingsReader />
        </ScrollView>
    );
}