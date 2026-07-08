import data from '../data_structure.json';

// this will handle reading the data_structure.json file and translating it to the preferred structure for journal entries
export function JSONReader(): Record<string, any> {
    return data;
}

// export function findKeyOfValue(data: Record<string, any>, key: string): Record<string, any> {
//     // this will find the key in a nested data structure
//     // it will return the key holder of the first instance of the key it finds
//     // it will return null if the key is not found

//     // loop through each piece of the data
//     for (let piece in data) {
//         if (piece === key) {
//             return data[piece];  // return the value associated with the key
//         } else if (typeof data[piece] === 'object' && data[piece] !== null) {
//             const result = findKeyOfValue(data[piece], key);  // recursive call
//             if (typeof result === 'object') return result;  // return the result if found
//         }
//     }
//     return { "": "" };  // return null if key is not found
// }

export function findKeyOfValue(data: Record<string, any>, key: string): Record<string, any> | null {

    for (const piece in data) {
        if (piece === key) {
            return data[piece];
        }

        if (typeof data[piece] === "object" && data[piece] !== null) {
            const result = findKeyOfValue(data[piece], key);
            if (result !== null) return result;
        }
    }

    return null;
}

// function to add a new category
// fix to request path and category value array in addition to category name
export function addObject(data: Record<string, any>, path: Array<string>, objectName: string, objectValue: object) {
    // categoryName is the name of the new category to add (e.g., 'custom_drains')
    // this will add a new empty category to subcategories

    // check if object already exists before adding it
    if ( findKeyOfValue(data, objectName) != null ) {
        console.log('Object already exists:', objectName);
        return;
    } else {
        let currentLevel: Record<string, any> = data;
        for (let i in path) {
            if (Array.isArray(currentLevel[i]) && currentLevel[i] !== undefined) {
                currentLevel = currentLevel[i];
            } else {
                console.error('Path not found:', path);
                return;
            }
        }
        if (currentLevel.indexOf(objectName) == -1) {
            currentLevel.push(objectName);
            currentLevel[currentLevel.indexOf(objectName) || 0] = objectValue;
            console.log('Added new category:', objectName);
        } else {
            console.log('Object already exists:', objectName);
        }
    }
}   

// function to hide subcategories
// fix to request path and category value array in addition to category name
export function hideObject(data: Record<string, any>, path: string[], keyToHide: string) {
    // this will add *** to the start of the key to hide it
    let currentLevel: Record<string, any> = data;
    for (let i in path) {
        if (Array.isArray(currentLevel[i]) && currentLevel[i] !== undefined) {
            currentLevel = currentLevel[i];
        } else {
            console.error('Path not found:', path);
            return;
        }
    }
    const value = currentLevel[currentLevel.indexOf(keyToHide) || 0];
    currentLevel.splice(currentLevel.indexOf(keyToHide), 1);
    currentLevel.push(('***' + keyToHide));
    currentLevel[currentLevel.indexOf('***' + keyToHide) || 0] = value;
    console.log('Hid', keyToHide, 'in', path.join(' > '));
}

// function to unhide subcategories
// fix to request path and category value array in addition to category name
export function unhideObject(data: Record<string, any>, path: string[], keyToUnhide: string) {
    // this will remove *** from the start of the key to unhide it
    let currentLevel: Record<string, any> = data;
    for (let i in path) {
        if (Array.isArray(currentLevel[i]) && currentLevel[i] !== undefined) {
            currentLevel = currentLevel[i];
        } else {
            console.error('Path not found:', path);
            return;
        }
    }
    const value = currentLevel[currentLevel.indexOf(keyToUnhide) || 0];
    currentLevel.splice(currentLevel.indexOf(keyToUnhide), 1);
    currentLevel.push(keyToUnhide.split('***')[1]);
    currentLevel[currentLevel.indexOf(keyToUnhide.split('***')[1]) || 0] = value;
    console.log('Unhid', keyToUnhide.split('***')[1], 'in', path.join(' > '));
}

// function to remove subcategories
// fix to request path and category value array in addition to category name
export function removeObject(data: Record<string, any>, path: string[], keyToRemove: string) {
    // this will remove the key from the specified category under subcategories
    let currentLevel: Record<string, any> = data;
    for (let i in path) {
        if (Array.isArray(currentLevel[i]) && currentLevel[i] !== undefined) {
            currentLevel = currentLevel[i];
        } else {
            console.error('Path not found:', path);
            continue;
        }
    }
    currentLevel.splice(currentLevel.indexOf(keyToRemove), 1);
    console.log('Removed', keyToRemove, 'in', path.join(' > '));
}

function JournalReader() {
    
}

function JournalWriter() {
    
}

function JSON_Structure( data: Record<string, any> ) {
    // structs for comparing entries
    
    // current entry settings / preferred structure updates

    // updating old entries to match current entry settings without losing data

    // entry variables hidden given *** at the start of their name value

    // entry variables unhidden have *** removed from the start of their name

    // function to initialise preferred structure from default

    // function to update given property of preferred structure

    // function to iterate over old entries with preferred structure and update them

    /**
     * making this change:
     * entry variables hidden given *** at the start of their name value
     * entry variables unhidden have *** removed from the start of their name
     */
    
    // import old settings to preferred structure function
}

// writes the data structure back overwriting the old data_structure.json file with the updated data structure
export function JSONWriter(data: Array<string>) {
    fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(result => console.log('File saved:', result))
        .catch(error => console.error('Save error:', error));
}