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

const MAX_LENGTH = 40;
const MIN_LENGTH = 5;

/**
 * 
 * @param {Object<String,String>} table the object 
 * @param {Array<String> | Object<string,string>} names list of properties
 */
function printTable(table, options) {
    let { names, maxLength = MAX_LENGTH } = options || {};
    if (names) {
        table = table.mapBy(names)
    }
    let headers = Object.keys(table[0]);

    if (typeof maxLength === 'number') {
        maxLength = Object.packObject(headers, [maxLength].repeat())
    } else {
        maxLength = {
            ...maxLength,
            ...Object.packObject(
                headers.filter(header => !Object.keys(maxLength).includes(header)),
                [MAX_LENGTH].repeat()
            )
        }
    }

    let colLengths = headers.map(header => Math.min(
        Math.max(
            MIN_LENGTH,
            header.length,
            ...table.mapBy(header).map(v => v.toString().length)
        ),
        maxLength[header]
    ))
    colLengths = Object.packObject(headers, colLengths);

    let lefts = headers.map(header => table
        .mapBy(header)
        .some(v => (typeof v === 'string' || v instanceof String))
    )
    lefts = Object.packObject(headers, lefts);

    headers = headers.map(k => {
        if (k.length >= colLengths[k])
            return ' ' + k;

        let nk = k;

        if (lefts[k]) {
            nk = nk.padStart(Math.floor((colLengths[k] - k.length) / 2))
            nk = nk.padEnd(colLengths[k])
        } else {
            nk = nk.padStart(colLengths[k])
        }
        return ' ' + nk;
    })
    console.log(...headers);


    table.map(
        row => Object.entries(row)
            .map(([k, v]) => {
                // console.log(v, `typeof ${v}`, typeof(v))
                let nv = cv(v).toString();
                if (nv.length > colLengths[k]) {
                    nv = nv.substring(0, colLengths[k] - 3) + '...'
                    return nv;
                }
                return ' ' + ((typeof v === 'string' || v instanceof String) ?
                    nv.padEnd(colLengths[k]) : nv.padStart(colLengths[k]))

            })
    ).forEach(row => console.log(...row))
}

/**
 * 
 * @param {Object<String, String>} table the object 
 * @param {Array<String> | Object<String, String>} names list of properties
 */
function printLR(table, names) {
    if (names) {
        table = table.mapBy(names);
    }
    let headers = Object.keys(table[0]);
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
function printTableLR(table, options) {
    let { names, maxCount } = options || {}
    if (!maxCount) return printLR(table, names);
    table.chunk(maxCount)
        .forEach(t => { printLR(t, names); console.log('') });
}

module.exports = {
    printTable,
    printTableLR
}