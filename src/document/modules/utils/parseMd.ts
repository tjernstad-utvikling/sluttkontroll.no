export function parseMd(md: string): Array<{ t: string; v: string }> {
    //h
    md = md.replace(/[#]{6}(.+)/g, '{"t": "h6", "v": "$1"},');
    md = md.replace(/[#]{5}(.+)/g, '{"t": "h5", "v": "$1"},');
    md = md.replace(/[#]{4}(.+)/g, '{"t": "h4", "v": "$1"},');
    md = md.replace(/[#]{3}(.+)/g, '{"t": "h3", "v": "$1"},');
    md = md.replace(/[#]{2}(.+)/g, '{"t": "h2", "v": "$1"},');
    md = md.replace(/[#]{1}(.+)/g, '{"t": "h1", "v": "$1"},');
    //p
    md = md.replace(/^\s*(\n)?(.+)/gm, function (m) {
        return /\{(\/)?("t":)/.test(m) ? m : `{"t": "p", "v": "${m}"},`;
    });

    md = `[${md}]`;
    md = md.replace(/,]$/gm, ']');

    md = md.replace(/\r?\n|\r/g, ''); // remove line breaks that causes invalid json

    return JSON.parse(`${md}`);
}
