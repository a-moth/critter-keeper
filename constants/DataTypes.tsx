/**
 * This is the default structure of the data, which can be extended for the purpose of Entries or Templates
 * as necessary.
 */
export type container_data = {
    metadata: {
        templateId: string;
        name: string;
        lastModified: number;
        usedTime: number | null;
        order: string[];
    };

    fields: Record<string, FieldNode<FieldData>>;
}

export type template = container_data & {
    metadata: container_data["metadata"] & {
        type: "template";
    }
}

export type entry = container_data & {
    metadata: container_data["metadata"] & {
        type: "entry";
        createdAt: number;
    }
}

export type data_container_types = entry | template;

/**
 * DataContainer Abstract Type
 */

export abstract class DataContainer<T extends data_container_types> {
    private data: T;

    initialiseOrder() {
        let index = 0;
        let orderedFields: typeof this.data.metadata.order = [];
        for (const key in this.data.fields) {
            const node = this.data.fields[key];

            orderedFields[index] = node.id;
            index++;
        }

        this.data.metadata.order = orderedFields;
    }

    constructor(data: T) {
        this.data = data;

        // Order nodes initially properly
        this.initialiseOrder();
    }

    setData(newData: T) {
        this.data = newData;
    }

    getData(): T {
        return this.data;
    }

    public getOrderedNodes(tree: DataContainer<data_container_types>): FieldNode<FieldData>[] {
        return tree.data.metadata.order.map(id => tree.data.fields[id]).filter(Boolean);
    }

    public insertNodeAfter(
        tree: DataContainer<data_container_types> | null,
        targetId: string,
        newNode: FieldNode<FieldData>,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const newNodes = {
                ...tree.data.fields,
                [newNode.id]: newNode,
            };

            const index = tree.data.metadata.order.indexOf(targetId);

            if (index === -1) {
                if (tree.data.metadata.type == "template") {
                    return new TemplateContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: [...tree.data.metadata.order, newNode.id],
                        },
                    });
                } else if (tree.data.metadata.type == "entry") {
                    return new EntryContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: [...tree.data.metadata.order, newNode.id],
                        }
                    });
                } else {
                    return null;
                }
            } else {
                const newOrder = [
                    ...tree.data.metadata.order.slice(0, index + 1),
                    newNode.id,
                    ...tree.data.metadata.order.slice(index + 1),
                ];

                if (tree.data.metadata.type == "template") {
                    return new TemplateContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                } else if (tree.data.metadata.type == "entry") {
                    return new EntryContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                } else {
                    return null;
                }
            }
        }
    }

    public removeNode(
        tree: DataContainer<data_container_types> | null,
        nodeId: string,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const { [nodeId]: _, ...restNodes } = tree.data.fields;

            switch (tree.data.metadata.type) {
                case "template":
                    return new TemplateContainer({
                        fields: restNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: tree.data.metadata.order.filter(id => id !== nodeId),
                        },
                    });
                case "entry":
                    return new EntryContainer({
                        fields: restNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: tree.data.metadata.order.filter(id => id !== nodeId),
                        },
                    });
                default:
                    return null;
            }
        }
    }

    public moveNodeUp(
        tree: DataContainer<data_container_types> | null,
        nodeId: string,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const index = tree.data.metadata.order.indexOf(nodeId);
            if (index <= 0) return tree;

            const newOrder = [...tree.data.metadata.order];

            [newOrder[index - 1], newOrder[index]] = [
                newOrder[index],
                newOrder[index - 1],
            ];
            switch (tree.data.metadata.type) {
                case "template":
                    return new TemplateContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                case "entry":
                    return new EntryContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
            }
        }
        return null;
    }

    public moveNodeDown(
        tree: DataContainer<data_container_types> | null,
        nodeId: string,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const index = tree.data.metadata.order.indexOf(nodeId);
            if (index === -1 || index >= tree.data.metadata.order.length - 1) return tree;

            const newOrder = [...tree.data.metadata.order];
            [newOrder[index], newOrder[index + 1]] = [
                newOrder[index + 1],
                newOrder[index],
            ];

            switch (tree.data.metadata.type) {
                case "template":
                    return new TemplateContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                case "entry":
                    return new EntryContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
            }
        }
    }

    public updateFieldByPath(
        fields: Record<string, FieldNode<FieldData>>,
        newValue: FieldNode<FieldData>,
    ): boolean {
        for (const key in fields) {
            const node = fields[key];

            // Found the node
            if (node.id === newValue.id) {
                fields[key] = newValue;
                return true;
            }

            // Search children
            if (node.field.data.type === 'section') {
                const found = this.updateFieldByPath(node.field.data.childNodes, newValue);

                if (found) {
                    return true;
                }
            }
        }

        return false;
    }

    public onHandleChange(
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>,
    ) {
        if (!template) return template;

        const updated = {
            ...template,
            [value.id]: {
                ...template.data.fields,
                fields: this.updateFieldByPath(template.data.fields, value),
                metadata: {
                    ...template.data.metadata,
                },
            },
        };

        return updated;
    }

    public validateTree(nodes: container_data["fields"]) {
        if (!Array.isArray(nodes)) return false;

        const seenIds = new Set();

        for (const node of nodes) {
            if (!this.validateNode(node)) return false;

            if (seenIds.has(node.id)) return false;
            seenIds.add(node.id);
        }

        return true;
    }

    public validateNode(node: FieldNode<FieldData>) {
        return false; // TODO implement validation based on types
    }
}

export class EntryContainer extends DataContainer<entry> {
    constructor(data: entry) {
        super(data);
    }
}

export class TemplateContainer extends DataContainer<template> {
    constructor(data: template) {
        super(data);
    }
}

/**
 * Field Types
 */

export type BaseData = {
    type: string;
    label: string;
    visible: boolean;
}

export type TextData = BaseData & {
    type: 'text',
    value: string,
};

export type NumberData = BaseData & {
    type: 'number';
    value: number;
};

export type TimeData = BaseData & {
    type: 'time';
    value: string;
    format?: string; // REGEX? from settings, just to validate
};

export type DateData = BaseData & {
    type: 'date';
    value: string;
    format?: string; // REGEX? from settings, just to validate
};

export type DurationData = BaseData & {
    type: 'duration';
    valueA: number; // allowed to be 0, must be an unsigned int
    valueB: number; // allowed to be 0, must be an unsigned int
    unitA: string;
    unitB: string;
};

export type SelectionData = BaseData & {
    type: 'selection';
    multiple: boolean;
    selected: string[]; // the actual value
    options: any[]; // the choices
};

export type ScaleData = BaseData & {
    type: 'scale';
    imageBased: boolean; // create more varied range for 1-10 instead of just 1-5
    min: number; // unsigned int, allowed to be 0
    max: number; // unsigned int, allowed to be 0
    label: string;
};

export type ToggleButtonData = BaseData & {
    type: 'boolean';
    label: string;
    labelSelected: string;
    labelUnselected: string;
};

export type ToggleImageButtonData = BaseData & {
    type: 'image-boolean';
    imageSelected: typeof Image;
    imageUnselected: typeof Image;
};

export type SettingsData = TextData;

export type SectionData = BaseData & {
    id: string;
    type: 'section';
    orientation: 'column' | 'row';
    childNodes: Record<string, FieldNode<FieldData>>;
};

export type FieldData =
    | TextData
    | DateData
    | DurationData
    | SelectionData
    | ScaleData
    | ToggleButtonData
    | ToggleImageButtonData
    | TimeData
    | NumberData
    | SettingsData
    | SectionData;

export abstract class field_data<T extends FieldData> {
    constructor(
        public readonly data: T
    ) { }

    abstract setData(newData: any): void;
    abstract getData(): any;
    abstract moveUp: () => void;
    abstract moveDown: () => void;
    abstract deleteNode: () => void;
}

export type FieldNode<T extends FieldData> = {
    id: string;
    type: 'field';
    field: field_data<T>;
};

export class TextField extends field_data<TextData> {
    constructor(data: TextData) {
        super({
            type: "text",
            label: data.label,
            visible: data.visible,
            value: data.value,
        });
    }


    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }
    moveUp: () => void;
    moveDown: () => void;
    deleteNode: () => void;
}

export class SectionField extends field_data<SectionData> {
    constructor(data: SectionData) {
        super({
            type: "section",
            label: data.label,
            visible: data.visible,
            id: data.id,
            orientation: data.orientation,
            childNodes: data.childNodes,
        });
    }


    setData(newData: any) {
        this.data.childNodes = newData;
    }

    getData() {
        return this.data.childNodes;
    }
    moveUp: () => void;
    moveDown: () => void;
    deleteNode: () => void;
}

export class SelectionField extends field_data<SelectionData> {
    constructor(data: SelectionData) {
        super({
            type: "selection",
            label: data.label,
            visible: data.visible,
            multiple: data.multiple,
            selected: data.selected,
            options: data.options
        });
    }


    setData(newData: any) {
        this.data.selected = newData;
    }

    getData() {
        return this.data.selected;
    }
    moveUp: () => void;
    moveDown: () => void;
    deleteNode: () => void;
}

/**
 * Create:
    | DateData
    | DurationData
    | SelectionData
    | ScaleData
    | ToggleButtonData
    | ToggleImageButtonData
    | TimeData
    | NumberData
    | SettingsData
 */

/**
 * Base Props
 */

export type BaseFieldProps = {
    id: string;
    template: template;
    fieldKey: string;
    defaultShown: boolean;
    locked: boolean;

    onChange?: (
        template: template,
        defaultShown: boolean,
        newValue: FieldNode<FieldData>,
    ) => void;
};

/**
 * Generic Typed Props
 */

export type StandardFieldProps =
    BaseFieldProps & {
        field: FieldNode<FieldData>;
    };