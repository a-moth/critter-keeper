import { Node } from "../../../constants/NodeTypes";
import { Text } from "react-native";

export default function ValidationPreview({ field }: { field: Node }) {
    switch (field.type) {
        case "field":
            switch (field.field.type) {
                case "boolean":
                    return <Text>Boolean Text</Text>
                case "date":
                    return <Text>Date</Text>
                case "duration":
                    return <Text>Duration</Text>
                case "scale":
                    return <Text>Scale</Text>
                case "selection":
                    return <Text>Selection</Text>
                case "text":
                    return <Text>Text</Text>
                case "image-boolean":
                    return <Text>Boolean Image</Text>
                case "number":
                    return <Text>Number</Text>
                case "time":
                    return <Text>Time</Text>
                default:
                    return <Text>Error, incorrect field type.</Text>;
            }
        case "section":
            return <Text>Section</Text>;
        default:
            return <></>;
    }
    return <></>;
}