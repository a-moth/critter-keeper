// Works as intended for now... Main body is copy pasted from
// https://www.npmjs.com/package/react-native-multiple-select

import { Component } from "react";
import { TextStyle, View, Text } from 'react-native';
import MultiSelect from "react-native-multiple-select";
import { FieldNode, SelectionField, Template } from "../../../constants/NodeTypes";

export interface Item {
  id: string;
  name: string;
}

interface Props {
  style?: TextStyle;
  textStyle?: TextStyle;
  template: Template;
  id: string;
  selected: SelectionField["selected"];
  newItems: SelectionField["options"];
  locked: boolean;
  multi: SelectionField["multiple"];

  onChange?: (
    template: Template,
    defaultShown: boolean,
    newValue: FieldNode
  ) => void;

  fieldKey: SelectionField["label"];
  defaultShown: boolean;
}

export default class SelectionInput extends Component<Props> {
  multiSelect: any = null;

  private lastSentSelected: string[] = [];

  onSelectedItemsChange = (newItemsList: string[]) => {
    if (!this.props.onChange) return;

    const same =
      newItemsList.length === this.lastSentSelected.length &&
      newItemsList.every((v, i) => v === this.lastSentSelected[i]);

    if (same) return;

    this.lastSentSelected = [...newItemsList];

    this.props.onChange(
      this.props.template,
      this.props.defaultShown,
      {
        id: this.props.id,
        type: "field",
        field: {
          type: "selection",
          label: this.props.fieldKey,
          selected: [...newItemsList],
          multiple: this.props.multi,
          options: this.props.newItems,
        } as SelectionField,
      } as FieldNode

    );
  };

  render() {
    let baseStyle = {
      ...(this.props.style?.backgroundColor ? { backgroundColor: this.props.style.backgroundColor } : undefined),
      ...(this.props.textStyle?.color ? { color: this.props.textStyle.color } : {}),
      ...(this.props.style?.borderColor ? { borderColor: this.props.style.borderColor } : undefined),
    }

    const containerStyle = {
      backgroundColor: this.props.style?.backgroundColor,
      borderColor: this.props.style?.borderColor,
    };

    const textStyle = {
      color: this.props.textStyle?.color,
      fontFamily: this.props.textStyle?.fontFamily,
    };

    const isLocked = this.props.locked;

    return (
      <>
        <MultiSelect
          hideTags
          items={this.props.newItems}
          uniqueKey="id"
          ref={(component) => {
            this.multiSelect = component;
          }}
          single={!this.props.multi}
          onSelectedItemsChange={(items: string[]) => {
            if (isLocked) return;
            this.onSelectedItemsChange(items);
          }}
          selectedItems={this.props.selected}
          selectText={isLocked ? "Pick items disabled" : "Pick Items"}
          searchInputPlaceholderText="Search Items..."
          displayKey="name"
          submitButtonText="Submit"
          tagRemoveIconColor={baseStyle.backgroundColor ? baseStyle.backgroundColor.toString() : "#CCC"}
          tagBorderColor={baseStyle.borderColor ? baseStyle.borderColor.toString() : "#CCC"}
          tagTextColor={baseStyle.color ? baseStyle.color.toString() : "#CCC"}
          selectedItemTextColor={baseStyle.color ? baseStyle.color.toString() : "#CCC"}
          selectedItemIconColor={baseStyle.backgroundColor ? baseStyle.backgroundColor.toString() : "#CCC"}
          itemTextColor={baseStyle.color ? baseStyle.color.toString() : "#000"}
          submitButtonColor={baseStyle.backgroundColor ? baseStyle.backgroundColor.toString() : "#CCC"}
          styleDropdownMenuSubsection={containerStyle}
          styleDropdownMenu={containerStyle}
          styleInputGroup={containerStyle}
          styleItemsContainer={containerStyle}
          styleSelectorContainer={containerStyle}
          styleListContainer={containerStyle}
          styleTextDropdown={textStyle}
          styleTextDropdownSelected={textStyle}
          searchInputStyle={textStyle}
        >
        </MultiSelect>
        <View style={baseStyle}>
          {this.props.newItems
            .filter(item => this.props.selected.includes(item.id))
            .map(item => (
              <Text key={item.id} style={textStyle}>
                {item.name}
              </Text>
            ))}
        </View>
      </>
    );
  }
}
