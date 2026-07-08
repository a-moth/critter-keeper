import React, { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { findKeyOfValue, JSONReader } from "../assets/scripts/ts/json_methods";
'use client';

console.log("client file loaded");

/**
* is required
** is required but editable manually
*** is optional but not in data currently
*/

function WelcomeScreen() {
    /**
     * 
     * construct welcome settings setup
     * import old settings and skip? // call import default to preferred if no old settings and continue
     * new day time start
     * symptom focus
     * date format
     * LATER: opportunity to purchase colourschemes/everything access
     * LATER: "wired" discount code for half off any purchase
     * 
     */

    // once preferred structure exists, show DataKeeper editor

    return <h2>hello react WelcomeScreen</h2>;
}

function Settings() {
    // roll over *settings, send to settings handler
}

function DateInput(props: { name: string | null; id?: string; }) {
    const [data, setData] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loadedData = await JSONReader();  // Await the promise
                setData(loadedData);  // Set the data in the state
            } catch (error) {
                setError('Error loading data');  // Handle error if the promise is rejected
            }
        };

        fetchData();
    }, []);

    // fix date traversal
    // check date format in settings to know how to read and write date inputs
    // create date input with separate fields for day, month, year for accessibility and ease of use
    // also allow for writing in date in one field if preferred (e.g., 12-31-2024 or 31-12-2024 depending on date format settings)
    const [month, setMonth] = React.useState('');
    const [day, setDay] = React.useState('');
    const [year, setYear] = React.useState('');

    const dayFormatObj: Record<string, any> = findKeyOfValue(data, '**dayFormat') || { "": false };
    const dayFormat = dayFormatObj ? dayFormatObj : { 'DD-MM-YYYY': 'DD-MM-YYYY' };

    const dateFields = {
        'MM': { label: 'Month', value: month, setter: setMonth, id: 'month', max: 12, placeholder: 'MM' },
        'DD': { label: 'Day', value: day, setter: setDay, id: 'day', max: 31, placeholder: 'DD' },
        'YYYY': { label: 'Year', value: year, setter: setYear, id: 'year', max: 9999, placeholder: 'YYYY' }
    };

    const parts = dayFormat.toUpperCase().match(/MM|DD|YYYY/g) || ['MM', 'DD', 'YYYY'];
    const orderedFields = parts.map((part: string) => dateFields[part as keyof typeof dateFields]).filter(Boolean);

    return (
        <>
            <label>{props.name} Date</label>
            {orderedFields.map((field: { id: string; placeholder: string | undefined; value: string | number | readonly string[] | undefined; setter: (arg0: string) => void; max: string | number | undefined; }) => (
                <input
                    key={field.id}
                    type="number"
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    max={field.max}
                    min="0"
                />
            ))}
        </>
    );
}

function DurationInput(props: { name: string | null; id?: string; type?: string; multiple?: boolean; }) {
    // create duration input with separate small text fields for hours and minutes that can be clicked up and down
    // allow for > 60 minutes without needing to convert to hours (e.g., 0 hours and 90 minutes would convert to 1 hour and 30 minutes, but allow for writing in 0 hours and 90 minutes without needing to convert)
    // also allow for writing in hours with 1.5 or 1:30 for 1 hour and 30 minutes, etc, depending on user preference in settings TODO
    return (
        <>
            <label>{props.name} Length</label>
            <input
                type="number"
                id={`${props.name}-hours`}
                name={`${props.name}-hours`}
                min="0"
                placeholder="hrs"
            /> // change type to text and handle conversion if up down arrows are used
            <span>hours</span>
            <input
                type="number"
                id={`${props.name}-mins`}
                name={`${props.name}-mins`}
                min="0"
                placeholder="mins"
            /> // change type to text and handle conversion if up down arrows are used
            <span>minutes</span>
        </>
    ); // TODO: add functionality for > 60 minutes and writing in hours with decimals or colons being converted to hours and minutes when saving
}

/**
 * SelectionInput takes a name= prop for the title,
 * a max= prop for the number of options (default 5),
 * and an options= prop for the option labels in an array (e.g., ["none", "mild", "moderate", "severe", "worst ever"] for scale of options
 * and an optional multiple= boolean prop for allowing multiple options to be selected (default false for only allowing one option to be selected)
 */
function SelectionInput(props: { options: string[]; max: number; multiple: boolean; name: string | null; id?: string; type?: string; }) {
    // if content contains <selectioninput> it is a selection input with the options given in the content
    // ex. selectioninput({fatigue: { "headache": "boolean", "nausea": "boolean" }}) would create a selection input with the options of headache and nausea under the category of fatigue

    const optionLabels = props.options || [];
    const maxValue = props.max || 5;

    if (props.multiple === true) {
        return (
            <>
                <label>{props.name}</label>
                <select id={props.name || ''} name={props.name || ''} multiple>
                    {Array.from({ length: maxValue }, (key, i) => i + 1).map((value) => (
                        <option key={value} value={value}>
                            {optionLabels[value - 1] || value}
                        </option>
                    ))}
                </select>
            </>
        );
    } else {
        return (
            <>
                <label>{props.name}</label>
                <select id={props.name || ''} name={props.name || ''}>
                    {Array.from({ length: maxValue }, (key, i) => i + 1).map((value) => (
                        <option key={value} value={value}>
                            {optionLabels[value - 1] || value}
                        </option>
                    ))}
                </select>
            </>
        );
    }
}

function ScaleInput(props: { name: string | null; id?: string; type?: string; multiple?: boolean; complex: boolean; }) {
    // by default, scales are a unique form of boolean complex input where 0 is the checkbox and 1-5 are the scale
    if (!props.complex) {
        <div className="symptom-container" style={{ display: 'none' }}>
            <label>
                <input type="radio" name="extra-option" value="1" />
            </label>

            <label>
                <input type="radio" name="extra-option" value="2" />
            </label>

            <label>
                <input type="radio" name="extra-option" value="3" />
            </label>

            <label>
                <input type="radio" name="extra-option" value="4" />
            </label>

            <label>
                <input type="radio" name="extra-option" value="5" />
            </label>
        </div>
    } else {
        return (
            <>
                <label htmlFor={props.name || ''} className="options">{props.name}
                    <input type="checkbox" id={props.name || ''} className="show-options" value="0" name={props.name || ''} />
                </label>
                <div id={`${props.name}-container`} className="symptom-container" style={{ display: 'none' }}>
                    <label>
                        <input type="radio" name="extra-option" value="1" />
                    </label>

                    <label>
                        <input type="radio" name="extra-option" value="2" />
                    </label>

                    <label>
                        <input type="radio" name="extra-option" value="3" />
                    </label>

                    <label>
                        <input type="radio" name="extra-option" value="4" />
                    </label>

                    <label>
                        <input type="radio" name="extra-option" value="5" />
                    </label>
                </div>
            </>
        );
    }
}

function CheckboxInput(props: { name: string | null; }) {
    return (
        <label htmlFor={props.name || ''} className="options">{props.name}
            <input type="checkbox" id={props.name || ''} className="show-options" value="0" name={props.name || ''} onChange={(e) => {
                const container = document.getElementById(`${props.name}-container`);
                if (e.target.checked && container) {
                    container.style.display = 'block';
                } else if (container) {
                    container.style.display = 'none';
                }
            }} />
        </label>
    );
}

/**
 * BooleanInput takes a name= prop for the title and an optional type= prop for the type of boolean input (default simple), 
 * which can be: 
 *  "simple" for a simple checkbox, 
 *  "scale" for a scale of 1-5 that appears when the checkbox is checked, 
 *  "selection" for a selection of options that appears when the checkbox is checked, 
 *  "text" for a text input that appears when the checkbox is checked,
 *  "duration" for a duration input that appears when the checkbox is checked, or
 *  "date" for a date input that appears when the checkbox is checked
 * as well as an optional multiple= boolean prop for allowing multiple options to be selected in the selection type (default false for only allowing one option to be selected)
 * the optional multiple boolean prop is only for the selection type and will be ignored for other types
 */
function BooleanInput(props: { type?: string; name: string; multiple?: boolean; options?: string[]; complex?: boolean; }) {
    // if content contains the word 'true' or 'false' only, it is boolean
    // allow for sub inputs of scale, selection, text, etc for more complex boolean inputs (e.g., "true" with scale input for intensity, "false" with text input for notes on why not)
    // this gets rid of needing subcategories as a module as boolean inputs can be used for more complex needs and can be hidden with *** if not needed without needing to hide the whole category
    // subcategories by default are complex booleans
    switch (props.type) {
        case "date":
            return (
                <>
                    <CheckboxInput name={props.name} />
                    <DateInput id={`${props.name}-container`} {...props} />
                </>
            );
        case "duration":
            return (
                <>
                    <CheckboxInput name={props.name} />
                    <div id={`${props.name}-container`} style={{ display: 'none' }}>
                        <DurationInput {...props} />
                    </div>
                </>
            );
        case "scale":
            return (
                <>
                    <CheckboxInput name={props.name} />
                    <ScaleInput id={`${props.name}-container`} {...props} complex={props.complex ?? false} />
                </>
            );
        case "selection":
            return (
                <>
                    <CheckboxInput name={props.name} />
                    <SelectionInput id={`${props.name}-container`}{...props} multiple={props.multiple ?? false} options={props.options ?? ['']} max={props.options?.length ?? 0} />
                </>
            );
        case "text":
            return (
                <>
                    <CheckboxInput name={props.name} />
                    <div id={`${props.name}-container`} style={{ display: 'none' }}>
                        <TextInput {...props} />
                    </div>
                </>
            );
        default:
            return (
                <>
                    <CheckboxInput name={props.name} />
                </>
            );
    }
}

function TextInput(props: { name: string | null; id?: string; type?: string; multiple?: boolean; }) {
    // any other content is text
    return (
        <>
            <label htmlFor={props.name || ''}>{props.name}</label>
            <textarea id={props.name || ''} name={props.name || ''} rows={4} cols={30}></textarea>
        </>
    );
}

function InputManager(props: { data: Record<string, any> | null }): ReactElement<any, string | JSXElementConstructor<any>> {
    return <pre>{JSON.stringify(props.data, null, 2)}</pre>;
    function isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === "object" && value !== null;
    }

    function traverse(data: Record<string, any>, path: string[] = []): string {
        let values = " ";
        for (let piece in data) {
            values += piece;
            if (isObject(data[piece])) {
                values += traverse(data[piece], [...path, piece]);
            } else {
                values += data[piece];
            }
        }
        return values;
    }
    //let output = "<>";
    //for (let pieces in data) {
    //    console.log(pieces, data[pieces]);
    //    output += pieces + ": ";
    //    if (typeof data[pieces] === 'object' && data[pieces] !== null) {
    //        output += InputManager(data[pieces]);
    //    } else {
    //        output += data[pieces];
    //    }
    //    output += " ";
    //}
    //return output + "</>";
}

////////////////////////////////////////////////////////////////////////////////// NOT CODED YET ////////////////////////
function EntryEditor() {
    // for editor:
    /**
     * left side shows option to select one of any of the options, or none.
     * right side shows a plus icon
     * if plus icon is clicked and nothing is selected on left side, it stays empty
     * if left side is filled in, plus sign appears above middle as option
     * -> if middle plus is selected, first left stays left, right pops up selection of other options
     * -> middle plus turns to minus
     * entry options disappear from all menus as they are assigned to sections
     * they reappear if sections are unassigned
     * 
     * Symptoms: Allow entry of new symptoms in popup bubbles
     * Drains, Supports, Activities, etc ^
     * // prevent duplicate names
     * 
     * Allow adding default text-entry buttons for note area: (new line + ) Time ( + new line), custom phrase, etc
     */
}

export function Journal() {
    /**
     * set up journal based on preferred structure on load
     */

    // handle formatting classes based on certain labelling
    // check for preferred structure existing
    // if not, select default

    // this will handle calling JSONReader, translation, and call JSONWriter for journal entries.

    return <h1>hello react Journal</h1>;
}