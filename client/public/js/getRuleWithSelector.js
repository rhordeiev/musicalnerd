export default function getRuleWithSelector(selector) {
  const numSheets = document.styleSheets.length;
  let numRules;
  let sheetIndex;
  let ruleIndex;
  for (sheetIndex = 0; sheetIndex < numSheets; sheetIndex += 1) {
    numRules = document.styleSheets[sheetIndex].cssRules.length;
    for (ruleIndex = 0; ruleIndex < numRules; ruleIndex += 1) {
      if (
        document.styleSheets[sheetIndex].cssRules[ruleIndex].selectorText ===
        selector
      ) {
        return document.styleSheets[sheetIndex].cssRules[ruleIndex];
      }
    }
  }
  return null;
}
