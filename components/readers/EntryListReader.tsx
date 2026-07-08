import ListReader from "./ListReader";

type EntryListReaderProps = {
    count?: number,
    onPress: () => void
};

export default function EntryListReader({
    count = Infinity,
    onPress
}: EntryListReaderProps) {
    return <ListReader type="entry" count={count} onPress={onPress} />;
}