import ListReader from "./ListReader";

export default function TemplateListReader({ onPress }: { onPress: () => void }) {
    return <ListReader type="template" onPress={onPress} />;
}