export function formatCountSSML(start: number, end: number, break_time: number) {
    const openingTag = '<say-as interpret-as="cardinal">';
    const closingTag = `</say-as>\n`;
    let breakTag = break_time ? `<break time="${break_time}ms" />\n` : '\n';
      let inc = +(start < end) * 2 - 1; 
    let total = Math.abs(start - end) + 1;
    return `<speak>\n${(new Array(total)).fill('')
      .map((s,i) =>`${openingTag} ${(start + i*inc)} ${closingTag}`)
      // add prosody maps here...
      .join(breakTag)}\n</speak>`;
}

