const GF = require('gf-js')

function isFloat(x) { return !!(x % 1); }

function cv(v) {
    if (v === undefined)
        return 'N/A'
    if (typeof v === 'boolean')
        return v ? 'T' : 'F';
    if (isFloat(v)) return v.toFixed(2);
    return v
}

/**
 * 
 * @param {Object<String,String>} table the object 
 * @param {Array<String> | Object<string,string>} names list of properties
 */
function printTable(table, names) {
    let headers = Object.keys(table[0])

    if (names) {
        headers = Array.isArray(names) ? names : headers.map(h => names[h])
    }
    headers = headers.map(k => ' ' + (k.length > 5 ? k : k.padStart(5)))
    console.log(...headers);

    table.map(
        row => Object.entries(row)
            .map(([k, v]) => ' ' + cv(v)
                .toString()
                .padStart(Math.max(k.length, 5))
            )
    ).forEach(row => console.log(...row))
}

/**
 * 
 * @param {Object<String, String>} table the object 
 * @param {Array<String> | Object<String, String>} names list of properties
 */
function printLR(table, names) {
    let headers = Object.keys(table[0]);
    if (names) {
        headers = Array.isArray(names) ? names : headers.map(h => names[h])
    }
    let items = table.mapBy(headers, toArray = true);
    let maxItemLength = Array
        .chain(...items)
        .map(v => cv(v).toString().length)
        .max();

    let maxHeaderLength = Math.max(...headers.map(k => k.length));
    headers = headers.map(header => header.padEnd(maxHeaderLength));


    let rows = Array.zip(...items);
    Array.zip(headers, rows)
        .forEach(([header, values]) => {
            values = values
                .map(v => cv(v).toString().padStart(maxItemLength));

            console.log(header, ...values)
        })

}

/**
 * 
 * @param {Object<String, String>} table the object 
 * @param {Array<String> | Object<String, String>} names list of properties
 */
function printTableLR(table, maxCount, names) {
    if (!maxCount) return printLR(table, names);
    table.chunk(maxCount)
        .forEach(t => { printLR(t, names); console.log('') });
}

module.exports = {
    printTable,
    printTableLR
}